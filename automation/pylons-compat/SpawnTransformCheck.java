import java.nio.file.*;
import java.util.zip.ZipFile;
import javax.script.*;
import org.objectweb.asm.*;
import org.objectweb.asm.tree.*;
import org.objectweb.asm.tree.analysis.*;

/** Check the production transformer against the pinned upstream bytecode. */
public class SpawnTransformCheck {
    public static void main(String[] args) throws Exception {
        ScriptEngine engine = new org.openjdk.nashorn.api.scripting.NashornScriptEngineFactory().getScriptEngine();
        engine.eval(Files.readString(Path.of(args[0])));
        engine.eval("var spec = initializeCoreMod().expulsionNearSpawn;");
        ClassNode original = new ClassNode();
        try (ZipFile jar = new ZipFile(args[1])) {
            new ClassReader(jar.getInputStream(jar.getEntry(
                "net/permutated/pylons/machines/expulsion/ExpulsionPylonTile.class"))).accept(original, 0);
        }
        check(engine.eval("spec.target.class").equals(original.name.replace('/', '.')));
        MethodNode location = original.methods.stream().filter(m -> m.name.equals("isAllowedLocation")
                && m.desc.equals("()Z")).findFirst().orElseThrow();
        int before = location.instructions.size();
        check(calls(location, "intersects") == 1);
        check(calls(location, "getGameRules") == 1);
        MethodNode tick = original.methods.stream().filter(m -> m.name.equals("tick")).findFirst().orElseThrow();
        int tickSize = tick.instructions.size();
        check(calls(tick, "isAllowedDimension") == 1 && calls(tick, "canAccess") == 1);
        engine.put("method", location);
        engine.eval("spec.transformer(method)");
        check(location.instructions.size() == before + 1);
        check(calls(location, "intersects") == 0);
        check(calls(location, "getGameRules") == 1);
        check(tick.instructions.size() == tickSize);
        check(calls(tick, "isAllowedDimension") == 1 && calls(tick, "canAccess") == 1);
        int replacements = 0;
        for (AbstractInsnNode n : location.instructions) {
            if (n.getOpcode() == Opcodes.POP2 && n.getNext().getOpcode() == Opcodes.ICONST_0) replacements++;
        }
        check(replacements == 1);
        // The non-server branch remains false; server branch still negates intersection.
        AbstractInsnNode last = location.instructions.getLast();
        while (last.getOpcode() < 0) last = last.getPrevious();
        check(last.getOpcode() == Opcodes.IRETURN);
        new Analyzer<>(new BasicVerifier()).analyze(original.name, location);
        ClassWriter writer = new ClassWriter(0);
        original.accept(writer);
        new ClassReader(writer.toByteArray());
        // Unexpected bytecode and duplicate application must fail rather than silently mispatch.
        boolean rejected = false;
        try { engine.eval("spec.transformer(method)"); }
        catch (ScriptException expected) { rejected = true; }
        check(rejected);
        System.out.println("Pinned Pylons spawn veto bypass, stack validity, retained dimension/access checks and mismatch rejection passed.");
    }

    static int calls(MethodNode method, String name) {
        int count = 0;
        for (AbstractInsnNode instruction : method.instructions)
            if (instruction instanceof MethodInsnNode call && call.name.equals(name)) count++;
        return count;
    }

    static void check(boolean condition) {
        if (!condition) throw new AssertionError();
    }
}
