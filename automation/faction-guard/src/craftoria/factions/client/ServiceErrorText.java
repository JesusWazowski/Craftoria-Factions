package craftoria.factions.client;

import java.util.Locale;

/** Classifies upstream HTML error pages without depending on Minecraft classes. */
public final class ServiceErrorText {
    private ServiceErrorText() {}

    public static String replacement(String message) {
        String lower = message.toLowerCase(Locale.ROOT);
        boolean html = lower.contains("<html") || lower.contains("<!doctype html");
        if (!html) return null;
        if (lower.contains("service unavailable") || lower.contains("temporarily unavailable")
                || lower.contains("503 service") || lower.contains("bad gateway")
                || lower.contains("gateway timeout")) {
            return "A service needed to connect returned a temporary error.\n"
                    + "Wait a minute, then return to the server list and try joining again.\n"
                    + "You can keep Minecraft open.";
        }
        if (lower.contains("the request is blocked") || lower.contains("access denied")
                || lower.contains("too many requests")) {
            return "A service needed to connect blocked or limited this request.\n"
                    + "Wait a few minutes, then return to the server list and try again.\n"
                    + "If this continues, share the client log with the pack maintainer.";
        }
        return null;
    }
}
