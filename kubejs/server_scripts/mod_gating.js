// priority: 10

Object.keys(factionDefinitions.restrictions).forEach(stageName => {
  factionDefinitions.restrictions[stageName].forEach(modId => {
    AStages.addRestrictionForModRecipe('recipe_gate/' + modId, stageName, modId);
  });
});
