const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const overrides = JSON.parse(read('kubejs/config/faction_recipe_overrides.json'));
const config = JSON.parse(read('kubejs/config/factions.json'));
const audit = JSON.parse(read('automation/faction-recipe-override-audit.json'));

const crafting = Symbol('crafting');
const ordinaryRecipes = [
  'ae2:network/blocks/interfaces_interface',
  'ae2:network/blocks/pattern_providers_interface',
  'ars_nouveau:arcane_pedestal',
  'musketmod:musket_upgrade_smithing_template',
  'musketmod:cartridge',
  'xycraft:crafting_example',
];
const machineRecipes = [
  'musketmod:musket_with_bayonet_smithing',
  'musketmod:musket_with_scope_smithing',
  'musketmod:sequenced_assembly/musket',
  'musketmod:sequenced_assembly/cartridge',
  'musketmod:iron_nugget_from_smelting',
];

function setup(data = overrides) {
  const gates = new Map([['recipe_gate/crafting/mechanists', {}], ['other_mod_rule', { mod: true }]]);
  const registry = {
    getRecipeRestrictions: () => [...gates].filter(([, entry]) => !entry.mod).map(([id]) => ({ getId: () => id })),
    getModRestrictions: () => [...gates].filter(([, entry]) => entry.mod).map(([id]) => ({ getId: () => id })),
  };
  const classes = {
    RecipeType: { CRAFTING: { equals: type => type === crafting } },
    ARestrictionManager: { RECIPE_INSTANCE: { getRegistry: () => registry, removeRestriction: id => gates.delete(id) } },
  };
  let load, sync;
  const context = vm.createContext({
    JsonIO: { readString: () => JSON.stringify(data) },
    Java: { loadClass: name => classes[name.split('.').pop()] },
    AStages: { addRestrictionForModRecipe(id, stage, namespace) {
      const ignored = new Set();
      const rule = { mod: true, stage, namespace, ignored, ignoreItems: recipe => ignored.add(recipe), markAsDirty() {} };
      gates.set(id, rule);
      return rule;
    } },
    factionDefinitions: {
      restrictions: Object.fromEntries(config.factions.concat(config.sharedGroups).map(g => [g.id, g.mods])),
      recipeNamespaceAliases: config.recipeNamespaceAliases,
    },
    ServerEvents: { loaded: fn => { load = fn; } },
    NativeEvents: { onEvent: (_, fn) => { sync = fn; } },
  });
  vm.runInContext(read('kubejs/server_scripts/faction_recipe_overrides.js'), context);
  vm.runInContext(read('kubejs/server_scripts/mod_gating.js'), context);
  let recipes = [...overrides.recipeIds, ...ordinaryRecipes];
  const server = {
    getRecipeManager: () => ({
      getRecipes: () => [...recipes, ...machineRecipes].map(id => ({
        id: () => ({ getNamespace: () => id.split(':')[0], toString: () => id }),
        value: () => ({ getType: () => machineRecipes.includes(id) ? Symbol('machine') : crafting }),
      })),
    }),
  };
  load({ server });
  return {
    gates,
    gatedRecipes: () => new Map([...recipes, ...machineRecipes].flatMap(id => {
      const gate = gates.get('recipe_gate/' + id.split(':')[0]);
      return gate && !gate.ignored.has(id) ? [[id, gate.stage]] : [];
    })),
    reload: ids => {
      recipes = ids;
      sync({ getPlayer: () => null, getPlayerList: () => ({ getServer: () => server }) });
    },
  };
}

test('only crafting recipes are gated, with exact exceptions and namespace aliases', () => {
  const state = setup();
  const gated = state.gatedRecipes();
  for (const id of [...overrides.recipeIds, ...machineRecipes]) assert.equal(gated.has(id), false, id);
  for (const id of ordinaryRecipes) assert.equal(gated.has(id), true, id);
  assert.equal(gated.get('musketmod:cartridge'), 'mechanists');
  assert.equal(gated.get('xycraft:crafting_example'), 'science_shared');
  assert.equal(state.gates.has('recipe_gate/crafting/mechanists'), false);
  assert.equal(state.gates.has('other_mod_rule'), true);
  state.reload(['musketmod:new_crafting_recipe']);
  assert.deepEqual([...state.gatedRecipes()], [['musketmod:new_crafting_recipe', 'mechanists']]);
});

test('the conversion expansion matches the approved audit without adding compression exceptions', () => {
  assert.equal(audit.singleItemConversions.length, 168);
  assert.equal(audit.stateResetAndDisassembly.length, 189);
  const expected = new Set(audit.previousRecipeIds.concat(audit.singleItemConversions, audit.stateResetAndDisassembly));
  assert.equal(expected.size, 369);
  assert.deepEqual([...overrides.recipeIds].sort(), [...expected].sort());
  for (const id of ['ae2:decorative/fluix_block', 'ae2:misc/deconstruction_fluix_block',
    'ae2:decorative/quartz_block', 'ae2:misc/deconstruction_certus_quartz_block']) {
    assert.equal(expected.has(id), false, 'ordinary material compression remains gated: ' + id);
  }
  // Existing XP-gem compression exceptions remain; new recipe exceptions do not widen quest access.
  assert.deepEqual(overrides.publicQuestItems, ['ars_nouveau:experience_gem', 'ars_nouveau:greater_experience_gem',
    'ars_technica:giant_experience_gem', 'ars_technica:gargantuan_experience_gem']);
});

test('malformed, duplicate and unsupported override documents fail before gating', () => {
  for (const data of [null, { ...overrides, version: 2 }, { ...overrides, recipeIds: ['bad'] },
    { ...overrides, publicQuestItems: ['ars_nouveau:experience_gem', 'ars_nouveau:experience_gem'] },
    { ...overrides, recipeIds: 'ae2:network/parts/energy_acceptor' }]) {
    assert.throws(() => setup(data), /Invalid/);
  }
});

test('assignment exceptions retain stable factions and explicit everyone access', () => {
  const stages = new Map(config.factions.concat(config.sharedGroups).flatMap(g => g.mods.map(m => [m, g.id])));
  assert.deepEqual(config.factions.map(g => g.id), ['stargazers', 'mechanists', 'spellcasters', 'ritualists']);
  for (const mod of ['computercraft', 'advancedperipherals', 'peripheralworks', 'logisticsnetworks', 'fluxnetworks',
    'pipez', 'arsdelight', 'farmersdelight', 'rechiseledae', 'compactmachines', 'laserio', 'sfm', 'irons_lib']) {
    assert.equal(stages.has(mod), false, mod);
    assert.equal(config.unrestrictedMods.includes(mod), true, mod);
  }
  for (const [mod, group] of Object.entries({ appliedpneumatics: 'stargazers', createstockbridge: 'stargazers',
    arseng: 'stargazers', ars_creo: 'mechanists', exposure: 'mechanists', exposure_polaroid: 'mechanists',
    schematicenergistics: 'science_shared', modularrouters: 'science_shared', mekanisticrouters: 'science_shared',
    modernindustrialrouters: 'science_shared', integrateddynamics: 'magic_shared', integratedscripting: 'magic_shared',
    integratedtunnels: 'magic_shared', integrateddynamicscompat: 'magic_shared', integratedtunnelscompat: 'magic_shared',
    modern_industrialization: 'mechanists', moderndynamics: 'mechanists', replication: 'science_shared',
    theurgy: 'magic_shared', reliquary: 'magic_shared',
    reliquified_artifacts: 'ritualists', twilightdelight: 'ritualists', naturescompass: 'ritualists', spectrum: 'spellcasters' })) {
    assert.equal(stages.get(mod), group, mod);
  }
  const all = [...stages.keys(), ...config.unrestrictedMods];
  assert.equal(new Set(all).size, all.length, 'unrestricted mods cannot also be gated');
});

test('definitions reject contradictory or duplicate Everyone assignments', () => {
  const source = read('kubejs/server_scripts/faction_definitions.js');
  for (const list of [['ae2'], ['laserio', 'laserio'], ['bad:id'], 'laserio']) {
    const data = { ...config, unrestrictedMods: list };
    assert.throws(() => vm.runInNewContext(source, { JsonIO: { readString: () => JSON.stringify(data) } }), /Invalid|conflicting/);
  }
  assert.doesNotThrow(() => vm.runInNewContext(source, { JsonIO: { readString: () => JSON.stringify(config) } }));
  for (const aliases of [{ xycraft: 'missing_mod' }, { ae2: 'mekanism' }, []]) {
    const data = { ...config, recipeNamespaceAliases: aliases };
    assert.throws(() => vm.runInNewContext(source, { JsonIO: { readString: () => JSON.stringify(data) } }), /Invalid|conflicting/);
  }
});
