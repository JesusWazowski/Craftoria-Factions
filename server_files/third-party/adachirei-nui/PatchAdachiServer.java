import java.nio.file.*;
import java.util.jar.*;
import org.objectweb.asm.*;
import org.objectweb.asm.tree.*;

// Builds a server-only variant of the audited v1.1.5 JAR. Client installs use upstream.
public class PatchAdachiServer implements Opcodes {
    private static final String ENTRY = "dev/_0yh/adachireiNui/AdachireiNui.class";
    private static final String WORLD = "net/minecraft/world/";
    private static final String BLOCK = WORLD + "level/block/Block";
    private static final String ITEM = WORLD + "item/BlockItem";
    private static final String PROPS = WORLD + "item/Item$Properties";

    public static void main(String[] args) throws Exception {
        try (var input = new JarFile(args[0]);
             var output = new JarOutputStream(Files.newOutputStream(Path.of(args[1]), StandardOpenOption.CREATE_NEW))) {
            if (input.getJarEntry(ENTRY) == null) throw new IllegalArgumentException("Missing mod entry point");
            var entries = input.entries();
            while (entries.hasMoreElements()) {
                var entry = entries.nextElement();
                output.putNextEntry(new JarEntry(entry.getName()));
                try (var bytes = input.getInputStream(entry)) {
                    if (entry.getName().equals(ENTRY)) output.write(patch(bytes.readAllBytes()));
                    else bytes.transferTo(output);
                }
                output.closeEntry();
            }
        }
    }

    private static byte[] patch(byte[] original) {
        var type = new ClassNode();
        new ClassReader(original).accept(type, 0);
        var constructor = method(type, "<init>");
        var clientGate = java.util.Arrays.stream(constructor.instructions.toArray())
            .filter(node -> node instanceof FieldInsnNode field && field.getOpcode() == GETSTATIC
                && field.owner.equals("net/neoforged/fml/loading/FMLEnvironment") && field.name.equals("dist"))
            .findFirst().orElseThrow();
        for (var node = clientGate; node != null; ) {
            var next = node.getNext();
            constructor.instructions.remove(node);
            node = next;
        }
        constructor.instructions.add(new InsnNode(RETURN));
        constructor.localVariables = null;
        type.methods.remove(method(type, "lambda$new$4"));
        type.methods.remove(method(type, "clientSetup"));

        // The custom item's subclass only supplies a model and client renderer. Keep its
        // registry ID and use the vanilla block item implementation on the dedicated server.
        var factory = method(type, "lambda$registerCustomItemBlock$8");
        var originalDescriptor = factory.desc;
        factory.desc = originalDescriptor.substring(0, originalDescriptor.indexOf(')') + 1) + "L" + ITEM + ";";
        for (var enclosing : type.methods) {
            for (var node : enclosing.instructions.toArray()) {
                if (node instanceof InvokeDynamicInsnNode dynamic) {
                    for (int i = 0; i < dynamic.bsmArgs.length; i++) {
                        if (dynamic.bsmArgs[i] instanceof Handle handle && handle.getOwner().equals(type.name)
                            && handle.getName().equals(factory.name) && handle.getDesc().equals(originalDescriptor)) {
                            dynamic.bsmArgs[i] = new Handle(handle.getTag(), type.name, factory.name, factory.desc, false);
                            dynamic.bsmArgs[2] = Type.getMethodType("()L" + ITEM + ";");
                        }
                    }
                }
            }
        }
        factory.instructions.clear();
        factory.localVariables = null;
        var code = factory.instructions;
        code.add(new TypeInsnNode(NEW, ITEM));
        code.add(new InsnNode(DUP));
        code.add(new VarInsnNode(ALOAD, 0));
        code.add(new MethodInsnNode(INVOKEINTERFACE, "java/util/function/Supplier", "get", "()Ljava/lang/Object;", true));
        code.add(new TypeInsnNode(CHECKCAST, BLOCK));
        code.add(new TypeInsnNode(NEW, PROPS));
        code.add(new InsnNode(DUP));
        code.add(new MethodInsnNode(INVOKESPECIAL, PROPS, "<init>", "()V", false));
        code.add(new MethodInsnNode(INVOKESPECIAL, ITEM, "<init>", "(L" + BLOCK + ";L" + PROPS + ";)V", false));
        code.add(new InsnNode(ARETURN));
        var writer = new ClassWriter(ClassWriter.COMPUTE_MAXS);
        type.accept(writer);
        return writer.toByteArray();
    }

    private static MethodNode method(ClassNode owner, String name) {
        return owner.methods.stream().filter(method -> method.name.equals(name)).findFirst().orElseThrow();
    }
}
