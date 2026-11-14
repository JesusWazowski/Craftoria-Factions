// Run from the repository root: node --test automation/tests/faction-milestones.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const generator = require('../faction-milestones/generate.cjs');
const spec = require('../faction-milestones/spec.cjs');
const source = readFileSync(path.join(__dirname, '../../kubejs/server_scripts/faction_milestones.js'), 'utf8');
const runtime = JSON.parse(readFileSync(path.join(__dirname, '../../kubejs/config/faction_milestones.json'), 'utf8'));

test('generated chapters, lang, group and runtime config are up to date', () => {
  const { written } = generator.outputs();
  written.forEach((text, file) => {
    assert.equal(readFileSync(file, 'utf8').replace(/\r\n/g, '\n'), text, path.relative(process.cwd(), file) + ' is stale; run the generator');
  });
});

test('every faction earns exactly 60 chunks with the same budget in every tier', () => {
  const budgets = spec.factions.map(faction => {
    const budget = {};
    const quests = faction.starters.concat(...faction.pillars.map(pillar => pillar.quests), [faction.capstone]);
    quests.forEach(quest => {
      const tier = quest.starter ? 'starter' : quest.tier || 'capstone';
      budget[tier] = (budget[tier] || 0) + quest.chunks;
    });
    assert.deepEqual(faction.starters.map(quest => [quest.key, quest.chunks]), [['home', 1], ['backpack', 1]]);
    assert.equal(faction.cooperation.chunks, undefined, 'cooperation quests award nothing');
    assert.equal(runtime.factions[faction.id].total, spec.maxClaims - spec.baseClaims);
    return budget;
  });
  budgets.forEach(budget => assert.deepEqual(budget, budgets[0]));
  assert.equal(spec.baseClaims, 4);
  assert.equal(spec.maxClaims, 64);
});

test('runtime rewards and quest values agree, and IDs are unique uppercase hex', () => {
  const seen = new Set();
  runtime.generatedIds.forEach(id => { assert.match(id, /^[0-7][0-9A-F]{15}$/); assert.equal(seen.has(id), false); seen.add(id); });
  Object.entries(runtime.rewards).forEach(([reward, entry]) => {
    assert.equal(runtime.factions[entry.faction].quests[entry.quest], entry.chunks, reward);
  });
  Object.values(runtime.factions).forEach(faction => {
    const chapter = readFileSync(path.join(__dirname, '../../config/ftbquests/quests/chapters/milestones_' + faction.name.toLowerCase() + '.snbt'), 'utf8');
    Object.keys(faction.quests).concat([faction.charterQuest, faction.charterTask, faction.homeTask]).forEach(id => assert.ok(chapter.includes(`id: "${id}"`), id));
  });
});

test('quests outside the charter chain stay hidden from other factions', () => {
  const { result } = generator.outputs();
  result.chapters.forEach(text => {
    const questList = text.split('\n\tquests: [')[1];
    const quests = questList.split('\n\t\t{').slice(1);
    const byId = new Map(quests.map(quest => [quest.match(/^	{3}id: "([0-9A-F]{16})"/m)[1], quest]));
    const charter = quests.find(quest => quest.includes('invisible: true'));
    assert.ok(charter && !charter.includes('dependencies:'));
    const leadsToCharter = (quest, visited = new Set()) => {
      if (quest === charter) return true;
      assert.ok(quest && !visited.has(quest), 'quest dependency must exist and be acyclic');
      const deps = quest.match(/dependencies: \[([^\]]+)\]/);
      assert.ok(deps, 'every player quest must have a dependency');
      const ids = [...deps[1].matchAll(/"([0-9A-F]{16})"/g)].map(match => match[1]);
      return ids.length > 0 && ids.every(id => leadsToCharter(byId.get(id), new Set([...visited, quest])));
    };
    quests.forEach(quest => assert.ok(leadsToCharter(quest)));
  });
});

class Tag {
  constructor() { this.values = new Map(); }
  contains(key) { return this.values.has(key); }
  put(key, value) { this.values.set(key, value); }
  getCompound(key) { return this.values.get(key) || new Tag(); }
  getString(key) { return this.values.get(key) || ''; }
  putString(key, value) { this.put(key, value); }
  remove(key) { this.values.delete(key); }
}
class Command {
  constructor(name) { this.name = name; this.children = []; }
  then(child) { this.children.push(child); return this; }
  requires(fn) { this.permission = fn; return this; }
  executes(fn) { this.execute = fn; return this; }
}

function setup({ managed = true, completed = new Set(), mapping = {}, stages = [], persisted = new Tag(), sharedData } = {}) {
  const tasks = {}; const rewards = {}; const messages = []; const normalized = [];
  const commands = []; const objects = new Map(); let saves = 0;
  const quest = id => {
    if (!objects.has(id)) objects.set(id, { getCodeString: () => id, getId: () => id });
    return objects.get(id);
  };
  const chapters = Object.values(runtime.factions).map(faction => ({
    getCodeString: () => faction.chapter,
    getQuests: () => [faction.charterQuest].concat(Object.keys(faction.quests)).map(quest),
  }));
  chapters.push({ getCodeString: () => '0000000000000001', getQuests: () => [quest('0000000000000002')] });
  const progress = new Map(); const started = new Map(); const dates = new Map();
  completed.forEach(id => dates.set(id, new Date(1000)));
  Object.values(runtime.factions).forEach(f => {
    quest(f.charterQuest);
    quest(f.charterTask);
    if (completed.has(f.charterQuest)) { completed.add(f.charterTask); progress.set(f.charterTask, 1); dates.set(f.charterTask, new Date(1000)); }
  });
  const optional = value => ({ orElse: fallback => value ?? fallback, isPresent: () => value != null, get: () => value });
  const teamData = sharedData || {
    getTeamId: () => 'party', isLocked: () => false,
    isCompleted: object => completed.has(object.getCodeString()),
    getProgress: object => progress.get(object.getId()) || 0,
    getStartedTime: id => optional(started.get(id)), getCompletedTime: id => optional(dates.get(id)),
    setStarted: (id, date) => { if (date) started.set(id, date); else started.delete(id); },
    setCompleted: (id, date) => { if (date) { dates.set(id, date); completed.add(id); } else { dates.delete(id); completed.delete(id); } },
    setProgress: (object, value) => {
      const id = object.getId(); progress.set(id, value);
      if (value) { completed.add(id); dates.set(id, new Date(2000)); }
      else { completed.delete(id); dates.delete(id); started.delete(id); }
    },
    saveIfChanged() {},
  };
  const file = { getAllChapters: () => chapters, getNullableTeamData: () => teamData,
    getTeamData: player => optional(player.id === 'missing' ? null : teamData),
    getID: id => id, getTask: id => objects.get(id), getQuest: id => objects.get(id) };
  const party = id => ({ getId: () => id, isPartyTeam: () => true, getName: () => ({ getString: () => id }),
    getOnlineMembers: () => [{ tell: text => messages.push(text) }] });
  const teams = { party: party('party'), loner: { isPartyTeam: () => false } };
  const membership = new Map([['member', teams.party], ['loner', teams.loner]]);
  const classes = {
    ServerQuestFile: { INSTANCE: file },
    FTBTeamsAPI: { api: () => ({ getManager: () => ({
      getTeamForPlayer: player => ({ orElse: () => membership.get(player.id) || null }),
      getTeamForPlayerID: id => ({ orElse: () => membership.get(id) || null }),
      getExtraData: () => persisted, markDirty() {}, saveNow: () => { saves++; },
    }) }) },
    FTBChunksAPI: { api: () => ({ getManager: () => ({ getOrCreateData: () => ({ getClaimedChunks: () => ({ size: () => 3 }) }) }) }) },
    Date, EntityArgument: { player() {}, getPlayer: context => context.player },
  };
  const context = vm.createContext({
    Java: { loadClass: name => classes[name.split('.').pop()] },
    NBT: { compoundTag: () => new Tag() },
    JsonIO: { readString: () => JSON.stringify(runtime) },
    Text: { of: text => text, green: text => text },
    factionDefinitions: { factions: spec.factions.map(faction => ({ id: faction.id })) },
    factionParties: { active: () => managed, faction: team => team && mapping[team.getId()] ? { id: mapping[team.getId()] } : null },
    factionSession: { party: player => membership.get(player.id) || null, home: (server, team) => team.home || null,
      normalizeLimits: () => normalized.push(true), command: (source, action) => action() },
    AStages: { playerHasStage: (player, stage) => stages.includes(stage) },
    FTBQuestsEvents: {
      customTask: (id, handler) => { const event = { setCheckTimer() {}, setCheck: check => { event.check = check; } }; handler(event); tasks[id] = event.check; },
      customReward: (id, handler) => { rewards[id] = handler; },
    },
    ServerEvents: { commandRegistry: fn => fn({ commands: {
      literal: name => new Command(name), argument: name => new Command(name),
    }, register: command => commands.push(command) }) },
  });
  vm.runInContext(source + '\nglobalThis.subject = factionMilestones;', context);
  return { subject: context.subject, tasks, rewards, messages, normalized, teams, completed,
    persisted, teamData, file, commands, mapping, objects, context, started, dates, saves: () => saves };
}

const sg = runtime.factions.stargazers;
const mc = runtime.factions.mechanists;
const value = (faction, n) => Object.keys(faction.quests).slice(0, n);

test('earned chunks count only completed quests in the party\'s own faction chapter', () => {
  const completed = new Set(value(sg, 3).concat(value(mc, 5), ['0000000000000002']));
  const s = setup({ completed, mapping: { party: 'stargazers' } });
  const expected = value(sg, 3).reduce((sum, id) => sum + sg.quests[id], 0);
  assert.equal(s.subject.earned(s.teams.party), expected);
  assert.equal(s.subject.bonusFor({ getId: () => 'member', getOwner: () => 'nil-uuid' }, new Map()), expected);
  assert.equal(s.subject.bonusFor({ getId: () => 'loner', getOwner: () => 'nil-uuid' }, new Map()), 0);
  assert.equal(s.subject.bonusFor({ getId: () => 'nobody', getOwner: () => 'nil-uuid' }, new Map()), 0);
});

test('all milestones together reach the cap, and unmapped parties earn nothing', () => {
  const all = setup({ completed: new Set(Object.keys(sg.quests)), mapping: { party: 'stargazers' } });
  assert.equal(all.subject.earned(all.teams.party) + runtime.baseClaims, runtime.maxClaims);
  const none = setup({ completed: new Set(Object.keys(sg.quests)) });
  assert.equal(none.subject.earned(none.teams.party), 0);
});

test('unmanaged worlds identify a party by the charter it holds', () => {
  const s = setup({ managed: false, completed: new Set([mc.charterQuest].concat(value(mc, 2))) });
  assert.equal(s.subject.factionOf(s.teams.party), 'mechanists');
  assert.equal(s.subject.earned(s.teams.party), value(mc, 2).reduce((sum, id) => sum + mc.quests[id], 0));
});

test('charters complete only for the matching faction; home tasks need a valid home', () => {
  const s = setup({ mapping: { party: 'mechanists' } });
  const progress = check => { const task = { value: 0, setProgress(n) { this.value = n; } }; check(task, { id: 'member', server: {} }); return task.value; };
  assert.equal(progress(s.tasks[mc.charterTask]), 1);
  assert.equal(progress(s.tasks[sg.charterTask]), 0);
  assert.equal(progress(s.tasks[mc.homeTask]), 0);
  s.teams.party.home = { x: 0 };
  assert.equal(progress(s.tasks[mc.homeTask]), 1);
  const legacy = setup({ managed: false, stages: ['stargazers'] });
  assert.equal(progress(legacy.tasks[sg.charterTask]), 1);
  assert.equal(progress(legacy.tasks[mc.charterTask]), 0);
});

test('chunk rewards re-apply limits and announce the new allowance to the party', () => {
  const [rewardId, reward] = Object.entries(runtime.rewards).find(([, entry]) => entry.faction === 'stargazers');
  const s = setup({ completed: new Set([reward.quest]), mapping: { party: 'stargazers' } });
  s.rewards[rewardId]({ player: { id: 'member' } });
  assert.equal(s.normalized.length, 1);
  assert.match(s.messages[0], new RegExp(`\\+${reward.chunks} claimed chunk.* may now claim ${runtime.baseClaims + reward.chunks} chunks`));
});


const tester = { id: 'member', username: 'Developer' };
const operator = { hasPermission: level => level === 2, sendSuccess() {} };

test('manual quests snapshots once, grants all charters, and persists across script reloads', () => {
  const s = setup({ completed: new Set([mc.charterQuest]), mapping: { party: 'mechanists' } });
  s.subject.questMode(operator, tester, true);
  const baseline = s.persisted.getCompound('craftoriaManualQuestTeams').getString('party');
  assert.equal(JSON.parse(baseline).charters.stargazers.questCompleted, '');
  Object.values(runtime.factions).forEach(f => {
    assert.equal(s.completed.has(f.charterQuest), true);
    assert.equal(s.teamData.getProgress(s.objects.get(f.charterTask)), 1);
  });
  s.completed.delete(sg.charterQuest);
  s.subject.questMode(operator, tester, true);
  assert.equal(s.completed.has(sg.charterQuest), true);
  assert.equal(s.persisted.getCompound('craftoriaManualQuestTeams').getString('party'), baseline);
  const reload = setup({ persisted: s.persisted, sharedData: s.teamData });
  assert.equal(reload.subject.manualQuests(tester), true);
  assert.equal(reload.subject.manualQuests({ id: 'teammate' }), true);
  assert.equal(reload.subject.manualSnapshot('another-team'), null);
  assert.equal(s.saves(), 1);
});

test('manual charter checks are skipped while home objectives continue checking', () => {
  const s = setup({ mapping: { party: 'mechanists' } });
  s.teams.party.home = { x: 0 };
  s.subject.questMode(operator, tester, true);
  let updates = 0;
  s.tasks[mc.charterTask]({ setProgress: () => { updates++; } }, tester);
  assert.equal(updates, 0);
  s.tasks[mc.homeTask]({ setProgress: () => { updates++; } }, tester);
  assert.equal(updates, 1);
  s.file.getTeamData = () => ({ orElse: () => ({ getTeamId: () => 'another-team' }) });
  s.tasks[mc.charterTask]({ setProgress: () => { updates++; } }, tester);
  assert.equal(updates, 2);
});

test('auto restores only charter gates, preserves timestamps and ordinary progress, and reconciles current membership', () => {
  const ordinary = value(sg, 1)[0];
  const s = setup({ completed: new Set([mc.charterQuest, ordinary]), mapping: { party: 'mechanists' } });
  s.started.set(mc.charterQuest, new Date(500));
  s.subject.questMode(operator, tester, true);
  // Ordinary progress earned during testing is retained too.
  const later = value(sg, 2)[1]; s.completed.add(later);
  s.mapping.party = 'spellcasters';
  s.subject.questMode(operator, tester, false);
  assert.equal(s.completed.has(mc.charterQuest), true);
  assert.equal(s.dates.get(mc.charterQuest).getTime(), 1000);
  assert.equal(s.started.get(mc.charterQuest).getTime(), 500);
  assert.equal(s.completed.has(runtime.factions.spellcasters.charterQuest), true);
  assert.equal(s.completed.has(sg.charterQuest), false);
  assert.equal(s.teamData.getProgress(s.objects.get(sg.charterTask)), 0);
  assert.equal(s.completed.has(ordinary), true); assert.equal(s.completed.has(later), true);
  assert.equal(s.subject.manualSnapshot('party'), null);
  assert.equal(s.saves(), 2);
  // Repeating auto performs reconciliation without any baseline reset.
  s.completed.delete(runtime.factions.spellcasters.charterQuest);
  s.subject.questMode(operator, tester, false);
  assert.equal(s.completed.has(runtime.factions.spellcasters.charterQuest), true);
  assert.equal(s.completed.has(mc.charterQuest), true);
});

test('manual quests preserves legacy charter-based faction and earned allowance', () => {
  const s = setup({ managed: false, completed: new Set([mc.charterQuest, ...value(mc, 2)]) });
  const before = s.subject.earned(s.teams.party);
  s.subject.questMode(operator, tester, true);
  assert.equal(s.subject.factionOf(s.teams.party), 'mechanists');
  assert.equal(s.subject.earned(s.teams.party), before);
});

test('quest mode validates permissions, quest data, locks and charter definitions before mutations', () => {
  const s = setup();
  assert.throws(() => s.subject.questMode({ hasPermission: () => false }, tester, true), /Only operators/);
  assert.throws(() => s.subject.questMode(operator, { id: 'missing' }, true), /No quest team/);
  s.teamData.isLocked = () => true;
  assert.throws(() => s.subject.questMode(operator, tester, true), /locked/);
  s.teamData.isLocked = () => false;
  s.objects.delete(sg.charterTask);
  assert.throws(() => s.subject.questMode(operator, tester, true), /Missing charter/);
  s.context.Java.loadClass('dev.ftb.mods.ftbquests.quest.ServerQuestFile').INSTANCE = null;
  assert.throws(() => s.subject.questMode(operator, tester, true), /not ready/);
  assert.equal(s.saves(), 0);
  assert.equal(s.persisted.contains('craftoriaManualQuestTeams'), false);
});

test('quest command supports operator-only self, explicit player and console targeting', () => {
  const s = setup();
  const root = s.commands.find(c => c.children.some(child => child.name === 'quests'));
  const command = root.children[0];
  assert.equal(command.permission({ hasPermission: () => false }), false);
  assert.equal(command.permission(operator), true);
  assert.deepEqual(command.children.map(c => c.name), ['manual', 'auto']);
  const calls = []; s.subject.questMode = (source, player, manual) => { calls.push([player, manual]); return 1; };
  const source = { getPlayerOrException: () => tester };
  command.children[0].execute({ source });
  command.children[1].children[0].execute({ source: operator, player: tester });
  assert.deepEqual(calls, [[tester, true], [tester, false]]);
  assert.throws(() => command.children[0].execute({ source: { getPlayerOrException() { throw new Error('console requires player'); } } }), /console requires player/);
});

test('generator reloads stage modules and helpers rather than retaining cached definitions', () => {
  const stage = require('../faction-milestones/stages/stargazers.cjs');
  const original = stage.title;
  stage.title = 'stale cached mutation';
  try {
    const fresh = generator.outputs();
    assert.ok([...fresh.result.lang.values()].includes(original));
    assert.equal([...fresh.result.lang.values()].includes('stale cached mutation'), false);
  } finally { stage.title = original; }
});
