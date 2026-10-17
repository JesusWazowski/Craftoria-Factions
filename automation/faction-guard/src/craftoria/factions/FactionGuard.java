package craftoria.factions;

import com.mojang.authlib.GameProfile;
import com.mojang.brigadier.exceptions.CommandSyntaxException;
import com.mojang.brigadier.exceptions.SimpleCommandExceptionType;
import dev.ftb.mods.ftbteams.api.FTBTeamsAPI;
import dev.ftb.mods.ftbteams.data.FTBTUtils;
import dev.ftb.mods.ftbteams.data.PartyTeam;
import dev.ftb.mods.ftbteams.data.TeamManagerImpl;
import net.minecraft.commands.CommandSourceStack;
import net.minecraft.network.chat.Component;
import net.minecraft.server.level.ServerPlayer;
import java.util.Collection;
import java.util.UUID;
import java.util.function.BiPredicate;

/** Guards FTB's direct GUI calls. Faction content and policy live in KubeJS/Ranks. */
public final class FactionGuard {
    private static final ThreadLocal<Boolean> authorizedLeave = ThreadLocal.withInitial(() -> false);
    private static Runnable questCacheListener;
    private static BiPredicate<PartyTeam, ServerPlayer> joinValidator;
    private static BiPredicate<UUID, dev.ftb.mods.ftbquests.quest.reward.Reward> rewardValidator;
    static {
        dev.ftb.mods.ftbquests.events.ClearFileCacheEvent.EVENT.register(file -> {
            if (questCacheListener != null) questCacheListener.run();
        });
    }
    private FactionGuard() {}
    public static long gameTime(net.minecraft.server.MinecraftServer server) { return server.overworld().getGameTime(); }
    public static UUID systemId(String value) { return UUID.nameUUIDFromBytes(value.getBytes(java.nio.charset.StandardCharsets.UTF_8)); }
    public static int appointOwner(PartyTeam team, CommandSourceStack source, GameProfile profile) throws CommandSyntaxException {
        return team.transferOwnership(source, profile);
    }
    public static void checkJoinable(PartyTeam team) throws CommandSyntaxException {
        if (dev.ftb.mods.ftbteams.config.ServerConfig.isPartyFull(team.getMembers().size())) deny("This faction is full.");
        if (dev.ftb.mods.ftbteams.config.ServerConfig.limitedLives().isPresent()
            && team.getProperty(dev.ftb.mods.ftbteams.api.property.TeamProperties.LIVES_REMAINING) <= 0) deny("This faction has no lives remaining.");
    }

    public static void setJoinValidator(BiPredicate<PartyTeam, ServerPlayer> validator) { joinValidator = validator; }

    public static void setQuestCacheListener(Runnable listener) { questCacheListener = listener; }
    public static void setRewardValidator(BiPredicate<UUID, dev.ftb.mods.ftbquests.quest.reward.Reward> validator) { rewardValidator = validator; }
    /** Called after native bookkeeping: a denied reward stays claimed, but is never delivered. */
    public static boolean rewardResult(boolean marked, dev.ftb.mods.ftbquests.quest.TeamData data, UUID player, dev.ftb.mods.ftbquests.quest.reward.Reward reward) {
        return marked && (!data.getFile().isServerSide() || !managed() || (rewardValidator != null && rewardValidator.test(player, reward)));
    }

    public static void join(PartyTeam team, ServerPlayer actor, GameProfile profile) throws CommandSyntaxException {
        if (!managed() || joinValidator == null) return;
        ServerPlayer player = FTBTeamsAPI.api().getManager().getServer().getPlayerList().getPlayer(profile.getId());
        if (player != null && !joinValidator.test(team, player)) deny("This faction needs a valid home before joining during a locked session.");
    }

    public static boolean managed() {
        return FTBTeamsAPI.api().isManagerLoaded()
            && ((TeamManagerImpl) FTBTeamsAPI.api().getManager()).getExtraData().getBoolean("craftoriaFactionsManaged");
    }

    private static boolean system(PartyTeam team, UUID id) {
        return id.toString().equals(team.getExtraData().getString("craftoriaFactionSystem"));
    }

    private static void deny(String message) throws CommandSyntaxException {
        throw new SimpleCommandExceptionType(Component.literal(message)).create();
    }

    private static boolean operator(ServerPlayer player, String node) {
        return player.hasPermissions(2) && FTBTUtils.canPlayerUseCommand(player, node);
    }

    public static void create(ServerPlayer player) throws CommandSyntaxException {
        if (managed() && player != null && !operator(player, "ftbteams.party.create")) {
            deny("Only operators can create parties.");
        }
    }

    public static void transfer(PartyTeam team, CommandSourceStack source, GameProfile target) throws CommandSyntaxException {
        if (!managed()) return;
        ServerPlayer player = source.getPlayer();
        if (player != null && !operator(player, "ftbteams.party.transfer_ownership")) {
            deny("Only operators can appoint faction owners.");
        }
    }

    public static void disband(CommandSourceStack source) throws CommandSyntaxException {
        if (!managed()) return;
        ServerPlayer player = source.getPlayer();
        if (player != null && (!player.hasPermissions(2)
            || !FTBTUtils.canPlayerUseCommand(player, "ftbteams.force-disband"))) {
            deny("Only operators can disband factions.");
        }
    }

    private static boolean insideDisband() {
        // forceDisband calls kick and leave itself after the operator check above.
        return StackWalker.getInstance().walk(frames -> frames.anyMatch(frame ->
            frame.getClassName().equals("dev.ftb.mods.ftbteams.data.PartyTeam")
                && frame.getMethodName().equals("forceDisband")));
    }

    public static void leave(PartyTeam team, UUID id) throws CommandSyntaxException {
        if (!managed() || authorizedLeave.get() || insideDisband()) return;
        if (system(team, id)) deny("The reserved faction membership cannot be removed.");
        ServerPlayer player = FTBTeamsAPI.api().getManager().getServer().getPlayerList().getPlayer(id);
        if (player != null && !operator(player, "ftbteams.party.leave")) {
            deny("Ask an operator to change your faction.");
        }
    }

    public static void protect(PartyTeam team, Collection<GameProfile> profiles) throws CommandSyntaxException {
        if (!managed() || insideDisband()) return;
        for (GameProfile profile : profiles) {
            if (system(team, profile.getId())) deny("The reserved faction membership cannot be changed.");
        }
    }

    /** Server-script-only operation; callers check the command source before invoking. */
    public static int leaveAuthorized(PartyTeam team, UUID id) throws CommandSyntaxException {
        if (system(team, id)) {
            deny("The reserved faction membership cannot be removed.");
        }
        boolean previous = authorizedLeave.get();
        authorizedLeave.set(true);
        try { return team.leave(id); }
        finally { authorizedLeave.set(previous); }
    }
}
