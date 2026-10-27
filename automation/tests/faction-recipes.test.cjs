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

function setup(data = overrides) {
  const gates = new Map();
  const context = vm.createContext({
    JsonIO: { readString: () => JSON.stringify(data) },
    factionDefinitions: {
      restrictions: Object.fromEntries(config.factions.concat(config.sharedGroups).map(g => [g.id, g.mods])),
      recipeNamespaceAliases: config.recipeNamespaceAliases,
    },
    AStages: { addRestrictionForModRecipe(id, stage, mod) {
      const gate = { stage, mod, ignored: new Set(), ignoreItems(recipe) { this.ignored.add(recipe); } };
      gates.set(mod, gate); return gate;
    } },
  });
  vm.runInContext(read('kubejs/server_scripts/faction_recipe_overrides.js'), context);
  vm.runInContext(read('kubejs/server_scripts/mod_gating.js'), context);
  return gates;
}

test('public recipe overrides exempt exact recipe IDs while ordinary crafting stays gated', () => {
  const gates = setup();
  for (const id of overrides.recipeIds) assert.equal(gates.get(id.split(':')[0]).ignored.has(id), true, id);
  assert.equal(gates.get('ae2').ignored.has('ae2:network/blocks/interfaces_interface'), false);
  assert.equal(gates.get('ae2').ignored.has('ae2:network/blocks/pattern_providers_interface'), false);
  assert.equal(gates.get('ae2').ignored.has('ae2:cable_interface'), false, 'item IDs are not recipe IDs');
  assert.equal(gates.get('ars_nouveau').ignored.has('ars_nouveau:arcane_pedestal'), false);
  assert.equal(gates.get('mekanism').ignored.has('mekanism:clear_configuration'), true);
  assert.equal(gates.get('xycraft').stage, 'science_shared');
  assert.equal(gates.get('xycraft').ignored.has('xycraft:shapeless/mekanical_condenser_shift'), true);
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
  const gates = setup();
  for (const id of audit.stateResetAndDisassembly) assert.equal(gates.get(id.split(':')[0]).ignored.has(id), true, id);
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
    'arsdelight', 'farmersdelight', 'rechiseledae', 'compactmachines', 'laserio', 'sfm', 'irons_lib']) {
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
