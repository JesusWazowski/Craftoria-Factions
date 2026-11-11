// priority: 10

const GateRecipeType = Java.loadClass('net.minecraft.world.item.crafting.RecipeType');
const GateRestrictionManager = Java.loadClass('com.alessandro.astages.engine.ARestrictionManager');

function rebuildCraftingGate(server) {
  const stagesByNamespace = new Map();
  Object.keys(factionDefinitions.restrictions).forEach(stage => {
    factionDefinitions.restrictions[stage].forEach(namespace => stagesByNamespace.set(namespace, stage));
  });
  Object.entries(factionDefinitions.recipeNamespaceAliases).forEach(([alias, mod]) => {
    if (stagesByNamespace.has(mod)) stagesByNamespace.set(alias, stagesByNamespace.get(mod));
  });

  // AStages 2.5.3's EMI evaluator skips exact-recipe rules without a matching
  // namespace rule. Exempt non-crafting recipes from the rule EMI does honor.
  const exceptions = new Map();
  stagesByNamespace.forEach((_, namespace) => exceptions.set(namespace, new Set()));
  factionRecipeOverrides.recipeIds.forEach(id => {
    const ignored = exceptions.get(id.split(':')[0]);
    if (ignored) ignored.add(id);
  });
  server.getRecipeManager().getRecipes().forEach(holder => {
    const id = holder.id();
    const ignored = exceptions.get(String(id.getNamespace()));
    if (ignored && !GateRecipeType.CRAFTING.equals(holder.value().getType())) ignored.add(String(id));
  });

  const manager = GateRestrictionManager.RECIPE_INSTANCE;
  const registry = manager.getRegistry();
  const previousIds = [];
  [registry.getRecipeRestrictions(), registry.getModRestrictions()].forEach(restrictions => {
    restrictions.forEach(restriction => {
      const id = String(restriction.getId());
      if (id.startsWith('recipe_gate/')) previousIds.push(id);
    });
  });
  previousIds.forEach(id => manager.removeRestriction(id));
  stagesByNamespace.forEach((stage, namespace) => {
    const rule = AStages.addRestrictionForModRecipe('recipe_gate/' + namespace, stage, namespace);
    exceptions.get(namespace).forEach(id => rule.ignoreItems(id));
    rule.markAsDirty();
  });
}

ServerEvents.loaded(event => rebuildCraftingGate(event.server));
// A sync for the whole player list follows a datapack reload, once recipes are final.
NativeEvents.onEvent('net.neoforged.neoforge.event.OnDatapackSyncEvent', event => {
  if (event.getPlayer() == null) rebuildCraftingGate(event.getPlayerList().getServer());
});
