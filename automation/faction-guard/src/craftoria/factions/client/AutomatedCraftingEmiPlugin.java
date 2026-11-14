package craftoria.factions.client;

import com.alessandro.astages.api.constant.AStageType;
import com.alessandro.astages.api.holder.AClientHolder;
import com.alessandro.astages.api.util.AStagesClientUtils;
import com.alessandro.astages.engine.AClientRestrictionManager;
import dev.emi.emi.api.EmiEntrypoint;
import dev.emi.emi.api.EmiInitRegistry;
import dev.emi.emi.api.EmiPlugin;
import dev.emi.emi.api.EmiRegistry;
import dev.emi.emi.runtime.EmiReloadManager;
import net.minecraft.client.Minecraft;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.neoforge.client.event.ClientTickEvent;
import net.neoforged.neoforge.common.NeoForge;

@EmiEntrypoint
public final class AutomatedCraftingEmiPlugin implements EmiPlugin {
    private static final ResourceLocation CATEGORY = ResourceLocation.fromNamespaceAndPath("create", "automatic_shaped");
    private static final String RESTRICTION_ID = "recipe_gate/" + CATEGORY.getNamespace();

    private static boolean listening;
    // EMI bakes on a worker thread; read AStages state only on the client thread.
    private static volatile boolean hidden;

    @Override
    public void initialize(EmiInitRegistry registry) {
        listenForAccessChanges();
    }

    private static synchronized void listenForAccessChanges() {
        if (!listening) {
            NeoForge.EVENT_BUS.addListener(AutomatedCraftingEmiPlugin::updateVisibility);
            listening = true;
        }
    }

    @Override
    public void register(EmiRegistry registry) {
        if (hidden) {
            registry.removeRecipes(recipe -> CATEGORY.equals(recipe.getCategory().getId()));
        }
    }

    private static void updateVisibility(ClientTickEvent.Post event) {
        if (Minecraft.getInstance().player == null) {
            hidden = false;
            return;
        }

        // mod_gating.js derives this synced rule from the server's faction definitions.
        boolean shouldHide = AClientRestrictionManager.RECIPE_INSTANCE.getRegistry().getModRestrictions()
            .stream()
            .filter(rule -> RESTRICTION_ID.equals(rule.getId()))
            .anyMatch(rule -> !AStagesClientUtils.hasStage(AClientHolder.player(), AStageType.PLAYER, rule.getStage()));
        if (hidden != shouldHide) {
            hidden = shouldHide;
            if (EmiReloadManager.getStatus() != 0) {
                EmiReloadManager.reload();
            }
        }
    }
}
