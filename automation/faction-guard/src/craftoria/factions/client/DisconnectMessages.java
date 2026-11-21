package craftoria.factions.client;

import net.minecraft.network.DisconnectionDetails;
import net.minecraft.network.chat.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Runs before vanilla measures the message and places its disconnect buttons. */
public final class DisconnectMessages {
    private static final Logger LOGGER = LoggerFactory.getLogger("Craftoria Connection");

    private DisconnectMessages() {}

    public static DisconnectionDetails readable(DisconnectionDetails details) {
        String original = details.reason().getString();
        String replacement = ServiceErrorText.replacement(original);
        if (replacement == null) return details;
        // Keep the upstream error available for diagnosis, bounded to limit log growth.
        LOGGER.warn("Upstream HTML connection error (up to 16384 characters): {}",
                original.substring(0, Math.min(original.length(), 16384)));
        return new DisconnectionDetails(Component.literal(replacement),
                details.report(), details.bugReportLink());
    }
}
