// priority: 10

Object.keys(factionDefinitions.restrictions).forEach(stageName => {
  factionDefinitions.restrictions[stageName].forEach(modId => {
    let namespaces = [modId];
    Object.keys(factionDefinitions.recipeNamespaceAliases).forEach(namespace => {
      if (factionDefinitions.recipeNamespaceAliases[namespace] === modId) namespaces.push(namespace);
    });
    namespaces.forEach(namespace => {
      let restriction = AStages.addRestrictionForModRecipe('recipe_gate/' + namespace, stageName, namespace);
      factionRecipeOverrides.recipeIds.forEach(id => {
        if (id.split(':')[0] === namespace) restriction.ignoreItems(id);
      });
    });
  });
});
