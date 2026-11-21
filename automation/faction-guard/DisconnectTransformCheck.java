import java.nio.file.*;
import java.util.zip.ZipFile;
import javax.script.*;
import org.objectweb.asm.*;
import org.objectweb.asm.tree.*;
import org.objectweb.asm.tree.analysis.*;
import craftoria.factions.client.ServiceErrorText;

/** Exercises the production classifier and transformer without starting Minecraft. */
public class DisconnectTransformCheck {
    public static void main(String[] args) throws Exception {
        String html = "<!DOCTYPE html><html><head><style>#errorref { font-size:11px; }</style>"
                + "<title>Service unavailable</title></head><body>Try later</body></html>";
        check(ServiceErrorText.replacement(html).contains("keep Minecraft open"));
        check(ServiceErrorText.replacement("<HTML><BODY>503 Service Unavailable</BODY></HTML>") != null);
        check(ServiceErrorText.replacement("<html>The request is blocked.</html>") != null);
        check(ServiceErrorText.replacement("<html>Too many requests</html>") != null);
        for (String original : new String[] {"Invalid session", "You are banned", "Mod mismatch",
                "Service unavailable", "<html>Unknown server notice</html>", ""}) {
            check(ServiceErrorText.replacement(original) == null);
        }
        ScriptEngine engine = new org.openjdk.nashorn.api.scripting.NashornScriptEngineFactory().getScriptEngine();
        engine.eval(Files.readString(Path.of(args[0])));
        engine.eval("var spec = initializeCoreMod().readableServiceDisconnect;");
        String desc = (String) engine.eval("spec.target.methodDesc");
        ClassNode screen = new ClassNode();
        try (ZipFile jar = new ZipFile(args[1])) {
            new ClassReader(jar.getInputStream(jar.getEntry(
                    "net/minecraft/client/gui/screens/DisconnectedScreen.class"))).accept(screen, 0);
        }
        MethodNode constructor = screen.methods.stream()
                .filter(m -> m.name.equals("<init>") && m.desc.equals(desc)).findFirst().orElseThrow();
        engine.put("constructor", constructor);
        engine.eval("spec.transformer(constructor)");
        AbstractInsnNode first = constructor.instructions.getFirst();
        check(first instanceof VarInsnNode load && load.getOpcode() == Opcodes.ALOAD && load.var == 3);
        check(first.getNext() instanceof MethodInsnNode call && call.name.equals("readable"));
        check(first.getNext().getNext() instanceof VarInsnNode store
                && store.getOpcode() == Opcodes.ASTORE && store.var == 3);
        new Analyzer<>(new BasicVerifier()).analyze(screen.name, constructor);
        // Check the other vanilla overloads delegate, so all native paths reach this hook.
        int delegating = 0;
        for (MethodNode method : screen.methods) {
            if (!method.name.equals("<init>") || method == constructor) continue;
            boolean delegates = false;
            for (AbstractInsnNode instruction : method.instructions) {
                if (instruction instanceof MethodInsnNode call
                        && call.owner.equals(screen.name) && call.name.equals("<init>")) delegates = true;
            }
            check(delegates);
            delegating++;
        }
        check(delegating == 3);
        System.out.println("Service classifier, unchanged unrelated errors, all four constructor paths and ASM stack checks passed.");
    }

    private static void check(boolean condition) {
        if (!condition) throw new AssertionError();
    }
}
