import java.nio.file.*;
import java.util.zip.ZipFile;
import javax.script.*;
import org.objectweb.asm.*;
import org.objectweb.asm.tree.*;
import org.objectweb.asm.tree.analysis.*;

/** Offline verification against the pinned native packet class; does not start Minecraft. */
public class WarningTransformCheck {
    public static void main(String[] args) throws Exception {
        ScriptEngine engine = new org.openjdk.nashorn.api.scripting.NashornScriptEngineFactory().getScriptEngine();
        engine.eval(Files.readString(Path.of(args[0])));
        engine.eval("var warningSpec = initializeCoreMod().claimSettingsWarning;");
        String name = (String) engine.eval("warningSpec.target.methodName");
        String desc = (String) engine.eval("warningSpec.target.methodDesc");
        ClassNode node = new ClassNode();
        try (ZipFile jar = new ZipFile(args[1])) {
            new ClassReader(jar.getInputStream(jar.getEntry(
                "dev/ftb/mods/ftbteams/net/UpdatePropertiesRequestMessage.class"))).accept(node, 0);
        }
        MethodNode method = node.methods.stream().filter(m -> m.name.equals(name) && m.desc.equals(desc)).findFirst().orElseThrow();
        engine.put("nativeMethod", method);
        engine.eval("warningSpec.transformer(nativeMethod)");
        int warnings = 0, saves = 0;
        AbstractInsnNode save = null, warning = null;
        for (AbstractInsnNode instruction : method.instructions) {
            if (instruction instanceof MethodInsnNode call) {
                if (call.name.equals("updatePropertiesFrom")) { saves++; save = instruction; }
                if (call.name.equals("claimSettingsSaved")) { warnings++; warning = instruction; }
            }
        }
        if (warnings != 1 || saves != 1 || save.getNext().getNext().getNext() != warning)
            throw new AssertionError("Warning must follow the single accepted native update");
        // Both native rejection branches jump beyond the inserted warning.
        int bypasses = 0;
        for (AbstractInsnNode instruction : method.instructions) {
            if (instruction instanceof JumpInsnNode jump && jump.getOpcode() == Opcodes.IFEQ
                && method.instructions.indexOf(instruction) < method.instructions.indexOf(save)
                && method.instructions.indexOf(jump.label) > method.instructions.indexOf(warning)) bypasses++;
        }
        if (bypasses != 2) throw new AssertionError("Native team/rank checks must bypass notification");
        new Analyzer<>(new BasicVerifier()).analyze(node.name, method);
        // Fail visibly if an upstream handler no longer has the expected update call.
        MethodNode empty = new MethodNode();
        engine.put("emptyMethod", empty);
        boolean rejected = false;
        try { engine.eval("warningSpec.transformer(emptyMethod)"); }
        catch (ScriptException expected) { rejected = true; }
        if (!rejected) throw new AssertionError("Missing native save was not rejected");
        System.out.println("Native packet transformer: accepted-save placement, authorization bypass, stack verification, version-drift rejection passed");
    }
}
