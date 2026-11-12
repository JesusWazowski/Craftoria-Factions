"""Offline native transformer and notification behavior checks, using installed Java 21 libraries."""
import argparse
import os
from pathlib import Path
import subprocess

p = argparse.ArgumentParser()
p.add_argument('prism_root', type=Path)
p.add_argument('instance', type=Path)
p.add_argument('--java-bin', required=True, type=Path)
a = p.parse_args()
root = Path(__file__).resolve().parent
build = root / '.build' / 'warning-tests'
build.mkdir(parents=True, exist_ok=True)
libraries = a.prism_root / 'libraries'
jars = [next(libraries.rglob('nashorn-core-15.4.jar'))]
for artifact in ['asm', 'asm-tree', 'asm-analysis', 'asm-commons', 'asm-util']:
    jars.append(next(libraries.rglob(artifact + '-9.10.1.jar')))
classpath = os.pathsep.join(str(j.resolve()) for j in jars)

# Exercise the production method bodies against small API fixtures. No Minecraft startup,
# synthetic server, or copied policy implementation is used.
source = (root / 'src/craftoria/factions/FactionGuard.java').read_text(encoding='utf-8')
methods = source[source.index('    public static void claimSettingsSaved('):source.index('    public static long gameTime(')]
methods = methods.replace('dev.ftb.mods.ftbteams.net.UpdatePropertiesRequestMessage', 'Message')
methods = methods.replace('dev.ftb.mods.ftbchunks.FTBChunksWorldConfig', 'Config')
methods = methods.replace('net.minecraft.ChatFormatting.RED', '"red"')
fixture = r'''
import java.util.*;
import java.util.function.*;
public class WarningBehavior {
    static class Switch { boolean enabled; boolean get() { return enabled; } }
    static class Config { static final Switch DISABLE_PROTECTION = new Switch(); }
    record Component(String text, String color) {
        static Component literal(String text) { return new Component(text, null); }
        Component withStyle(String color) { return new Component(text, color); }
    }
    static class ServerPlayer {
        List<Component> messages = new ArrayList<>();
        void sendSystemMessage(Component message) { messages.add(message); }
    }
    record Key(String id, boolean editable, boolean hidden) {
        String getId() { return id; }
        boolean isPlayerEditable() { return editable; }
        boolean isHidden() { return hidden; }
    }
    record Properties(List<Key> keys) {
        void forEach(BiConsumer<Key, Object> action) { keys.forEach(k -> action.accept(k, false)); }
    }
    record Message(Properties properties) {}
    static Message payload(String... ids) {
        return new Message(new Properties(Arrays.stream(ids).map(id -> new Key(id, true, false)).toList()));
    }
    static void check(boolean ok) { if (!ok) throw new AssertionError(); }
    public static void main(String[] args) {
        ServerPlayer player = new ServerPlayer(), other = new ServerPlayer();
        Config.DISABLE_PROTECTION.enabled = true;
        claimSettingsSaved(player, payload("ftbteams:display_name", "ftbchunks:claim_visibility", "ftbchunks:location_mode"));
        claimSettingsSaved(player, payload());
        claimSettingsSaved(player, new Message(new Properties(List.of(
            new Key("ftbchunks:allow_pvp", false, false), new Key("ftbchunks:allow_explosions", true, true)))));
        check(player.messages.isEmpty());
        claimSettingsSaved(player, payload("ftbchunks:block_edit_mode", "ftbchunks:allow_pvp"));
        check(player.messages.size() == 1 && other.messages.isEmpty());
        Component first = player.messages.getFirst();
        check(first.text().equals("Claim protections are disabled on this server!") && first.color().equals("red"));
        claimSettingsSaved(player, payload("ftbchunks:allow_pvp"));
        check(player.messages.size() == 2);
        Config.DISABLE_PROTECTION.enabled = false;
        claimSettingsSaved(player, payload("ftbchunks:block_edit_mode"));
        check(player.messages.size() == 2);
        Config.DISABLE_PROTECTION.enabled = true;
        for (String id : List.of("allow_explosions", "allow_mob_griefing", "allow_pvp", "block_edit_mode",
            "block_interact_mode", "block_edit_and_interact_mode", "entity_interact_mode",
            "nonliving_entity_attack_mode", "allow_fake_players", "allow_fake_players_by_id", "allow_named_fake_players")) {
            int before = player.messages.size();
            claimSettingsSaved(player, payload("ftbchunks:" + id));
            check(player.messages.size() == before + 1);
        }
        System.out.println("Notification behavior: exact red text, private recipient, repeated saves, policy toggle, protection keys, unrelated/hidden/noneditable payloads passed");
    }
'''
(build / 'WarningBehavior.java').write_text(fixture + methods + '\n}\n', encoding='utf-8')
subprocess.run([str(a.java_bin / 'javac.exe'), '-cp', classpath, '-d', str(build),
                str(root / 'WarningTransformCheck.java'), str(build / 'WarningBehavior.java')], check=True)
runtime = str(build) + os.pathsep + classpath
subprocess.run([str(a.java_bin / 'java.exe'), '-cp', runtime, 'WarningTransformCheck',
                str(root / 'resources/coremods/factions.js'), str(a.instance / 'mods/ftb-teams-neoforge-2101.1.11.jar')], check=True)
subprocess.run([str(a.java_bin / 'java.exe'), '-cp', runtime, 'WarningBehavior'], check=True)
