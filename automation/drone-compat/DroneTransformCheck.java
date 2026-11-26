import java.nio.file.*;
import java.util.*;
import java.util.zip.ZipFile;
import javax.script.*;
import org.objectweb.asm.*;
import org.objectweb.asm.commons.*;
import org.objectweb.asm.tree.*;
import org.objectweb.asm.tree.analysis.*;

/** Execute actual transformed constructor/position bytecode with minimal API fixtures. */
public class DroneTransformCheck {
    public static class Vec {}
    public interface Drone { Vec getFakePlayerPos(); }
    public static class FakePlayer {
        public static final Vec BASE = new Vec();
        public final Vec duringConstruction;
        public FakePlayer(Object level, Object profile) { duringConstruction = position(); }
        public Vec position() { return BASE; }
    }
    static class Loader extends ClassLoader {
        Class<?> define(byte[] bytes) { return defineClass(null, bytes, 0, bytes.length); }
    }
    public static void main(String[] args) throws Exception {
        ScriptEngine engine = new org.openjdk.nashorn.api.scripting.NashornScriptEngineFactory().getScriptEngine();
        engine.eval(Files.readString(Path.of(args[0])));
        engine.eval("var spec = initializeCoreMod().safeDroneConstruction;");
        ClassNode original = new ClassNode();
        try (ZipFile jar = new ZipFile(args[1])) {
            new ClassReader(jar.getInputStream(jar.getEntry(
                "me/desht/pneumaticcraft/common/util/fakeplayer/DroneFakePlayer.class"))).accept(original, 0);
        }
        check(engine.eval("spec.target.class").equals(original.name.replace('/', '.')));
        MethodNode position = original.methods.stream().filter(m -> m.name.equals("position")).findFirst().orElseThrow();
        MethodNode constructor = original.methods.stream().filter(m -> m.name.equals("<init>")).findFirst().orElseThrow();
        Map<String, String> names = Map.of(
            original.name, "TestDronePlayer",
            original.superName, Type.getInternalName(FakePlayer.class),
            "net/minecraft/world/phys/Vec3", Type.getInternalName(Vec.class),
            "net/minecraft/server/level/ServerLevel", "java/lang/Object",
            "com/mojang/authlib/GameProfile", "java/lang/Object",
            "me/desht/pneumaticcraft/common/drone/IDroneBase", Type.getInternalName(Drone.class));
        // Show that the original native constructor reproduces the reported failure.
        Class<?> broken = fixture(original, constructor, position, names);
        try {
            broken.getConstructors()[0].newInstance(null, null, (Drone) Vec::new);
            throw new AssertionError("Original constructor should dereference an uninitialized drone");
        } catch (java.lang.reflect.InvocationTargetException expected) {
            check(expected.getCause() instanceof NullPointerException);
        }
        engine.put("method", position);
        engine.eval("spec.transformer(method)");
        new Analyzer<>(new BasicVerifier()).analyze(original.name, position);
        Class<?> patched = fixture(original, constructor, position, names);
        Vec dronePosition = new Vec();
        Object player = patched.getConstructors()[0].newInstance(null, null, (Drone) () -> dronePosition);
        check(((FakePlayer) player).duringConstruction == FakePlayer.BASE);
        check(patched.getMethod("position").invoke(player) == dronePosition);
        // A later real provider failure is not swallowed by this narrow null guard.
        Object failing = patched.getConstructors()[0].newInstance(null, null,
            (Drone) () -> { throw new IllegalStateException("provider failure"); });
        try { patched.getMethod("position").invoke(failing); throw new AssertionError(); }
        catch (java.lang.reflect.InvocationTargetException expected) {
            check(expected.getCause() instanceof IllegalStateException);
        }
        boolean rejected = false;
        try { engine.eval("spec.transformer(method)"); }
        catch (ScriptException expected) { rejected = true; }
        check(rejected);
        System.out.println("Original crash reproduced; patched superclass initialization and normal drone position passed; provider errors and bytecode mismatch still rejected.");
    }
    static Class<?> fixture(ClassNode original, MethodNode ctor, MethodNode position, Map<String,String> names) {
        ClassWriter writer = new ClassWriter(ClassWriter.COMPUTE_FRAMES | ClassWriter.COMPUTE_MAXS);
        Remapper remap = new SimpleRemapper(names);
        writer.visit(Opcodes.V21, Opcodes.ACC_PUBLIC, "TestDronePlayer", null,
            Type.getInternalName(FakePlayer.class), null);
        writer.visitField(Opcodes.ACC_PRIVATE | Opcodes.ACC_FINAL, "drone", Type.getDescriptor(Drone.class), null, null).visitEnd();
        for (MethodNode method : List.of(ctor, position)) {
            MethodNode copy = new MethodNode(method.access, method.name, method.desc, method.signature, null);
            method.accept(copy);
            // Recompute all frames after remapping Minecraft API types to the fixtures.
            for (AbstractInsnNode n : copy.instructions.toArray()) if (n instanceof FrameNode) copy.instructions.remove(n);
            MethodVisitor output = writer.visitMethod(copy.access, copy.name, remap.mapMethodDesc(copy.desc), null, null);
            copy.accept(new MethodRemapper(output, remap));
        }
        writer.visitEnd();
        return new Loader().define(writer.toByteArray());
    }
    static void check(boolean condition) { if (!condition) throw new AssertionError(); }
}
