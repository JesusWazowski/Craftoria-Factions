// priority: 20
// The only faction/mod definition lives in kubejs/config/factions.json.
const factionDefinitions = (() => {
  let data = JSON.parse(JsonIO.readString('kubejs/config/factions.json'));
  if (!data || data.version !== 1 || !Array.isArray(data.factions) || !data.factions.length
    || !Array.isArray(data.sharedGroups)) throw new Error('Invalid factions.json version or collections');
  let ids = new Set();
  let mods = new Set();
  let groups = Object.create(null);
  let restrictions = Object.create(null);
  function register(entry) {
    if (!entry || typeof entry.id !== 'string' || !/^[a-z][a-z0-9_]*$/.test(entry.id) || ids.has(entry.id)
      || !Array.isArray(entry.mods)) throw new Error('Invalid or duplicate faction/group ID');
    ids.add(entry.id);
    entry.mods.forEach(mod => {
      if (typeof mod !== 'string' || !/^[a-z][a-z0-9_]*$/.test(mod) || mods.has(mod)) {
        throw new Error('Invalid or conflicting faction mod: ' + mod);
      }
      mods.add(mod);
    });
    restrictions[entry.id] = entry.mods;
  }
  data.sharedGroups.forEach(group => { register(group); groups[group.id] = group; });
  // Everyone is represented by an explicit unrestricted list, never a new stage/group.
  if (data.unrestrictedMods !== undefined) {
    if (!Array.isArray(data.unrestrictedMods)) throw new Error('Invalid unrestricted mods');
    data.unrestrictedMods.forEach(mod => {
      if (typeof mod !== 'string' || !/^[a-z][a-z0-9_]*$/.test(mod) || mods.has(mod)) {
        throw new Error('Invalid or conflicting unrestricted mod: ' + mod);
      }
      mods.add(mod);
    });
  }
  data.factions.forEach(faction => {
    register(faction);
    if (typeof faction.name !== 'string' || !faction.name.trim() || !Array.isArray(faction.sharedGroups)
      || faction.sharedGroups.some(id => typeof id !== 'string' || !groups[id]) || new Set(faction.sharedGroups).size !== faction.sharedGroups.length) {
      throw new Error('Invalid faction name or shared groups: ' + faction.id);
    }
  });
  let recipeNamespaceAliases = data.recipeNamespaceAliases === undefined ? {} : data.recipeNamespaceAliases;
  if (!recipeNamespaceAliases || Array.isArray(recipeNamespaceAliases) || typeof recipeNamespaceAliases !== 'object') {
    throw new Error('Invalid recipe namespace aliases');
  }
  Object.keys(recipeNamespaceAliases).forEach(namespace => {
    if (!/^[a-z][a-z0-9_]*$/.test(namespace) || mods.has(namespace)
      || typeof recipeNamespaceAliases[namespace] !== 'string' || !mods.has(recipeNamespaceAliases[namespace])) {
      throw new Error('Invalid or conflicting recipe namespace alias: ' + namespace);
    }
  });
  return { factions: data.factions, restrictions, stages: Array.from(ids), recipeNamespaceAliases };
})();
