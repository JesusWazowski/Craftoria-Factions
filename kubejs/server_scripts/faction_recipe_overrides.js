// priority: 15
// AStages ignoreItems takes recipe IDs, despite its name (verified on pinned 2.5.3).
const factionRecipeOverrides = (() => {
  let data = JSON.parse(JsonIO.readString('kubejs/config/faction_recipe_overrides.json'));
  if (!data || data.version !== 1) throw new Error('Invalid faction recipe override version');
  ['recipeIds', 'publicQuestItems'].forEach(key => {
    if (!Array.isArray(data[key]) || new Set(data[key]).size !== data[key].length
      || data[key].some(id => typeof id !== 'string' || !/^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(id))) {
      throw new Error('Invalid or duplicate faction recipe override: ' + key);
    }
  });
  return data;
})();
