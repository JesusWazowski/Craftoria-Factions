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
    const quests = text.split('\n\t\t{').slice(1);
    const charter = quests.find(quest => quest.includes('invisible: true'));
    assert.ok(charter && !charter.includes('dependencies'));
    quests.filter(quest => quest !== charter).forEach(quest => assert.match(quest, /dependencies: \[/));
    quests.filter(quest => quest.includes('hide_until_deps_complete: true')).forEach(root => assert.ok(root.includes('dependencies: ["' + charter.match(/id: "([0-9A-F]{16})"/)[1] + '"]')));
  });
});

function setup({ managed = true, completed = new Set(), mapping = {}, stages = [] } = {}) {
  const tasks = {}; const rewards = {}; const messages = []; const normalized = [];
  const quest = id => ({ getCodeString: () => id });
  const chapters = Object.values(runtime.factions).map(faction => ({
    getCodeString: () => faction.chapter,
    getQuests: () => [faction.charterQuest].concat(Object.keys(faction.quests)).map(quest),
  }));
  chapters.push({ getCodeString: () => '0000000000000001', getQuests: () => [quest('0000000000000002')] });
  const teamData = { isCompleted: object => completed.has(object.getCodeString()) };
  const file = { getAllChapters: () => chapters, getNullableTeamData: () => teamData };
  const party = id => ({ getId: () => id, isPartyTeam: () => true, getName: () => ({ getString: () => id }),
    getOnlineMembers: () => [{ tell: text => messages.push(text) }] });
  const teams = { party: party('party'), loner: { isPartyTeam: () => false } };
  const membership = new Map([['member', teams.party], ['loner', teams.loner]]);
  const classes = {
    ServerQuestFile: { INSTANCE: file },
    FTBTeamsAPI: { api: () => ({ getManager: () => ({
      getTeamForPlayer: player => ({ orElse: () => membership.get(player.id) || null }),
      getTeamForPlayerID: id => ({ orElse: () => membership.get(id) || null }),
    }) }) },
    FTBChunksAPI: { api: () => ({ getManager: () => ({ getOrCreateData: () => ({ getClaimedChunks: () => ({ size: () => 3 }) }) }) }) },
  };
  const context = vm.createContext({
    Java: { loadClass: name => classes[name.split('.').pop()] },
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
    ServerEvents: { commandRegistry: () => {} },
  });
  vm.runInContext(source + '\nglobalThis.subject = factionMilestones;', context);
  return { subject: context.subject, tasks, rewards, messages, normalized, teams, completed };
}

const sg = runtime.factions.stargazers;
const mc = runtime.factions.mechanists;
const value = (faction, n) => Object.keys(faction.quests).slice(0, n);

test('earned chunks count only completed quests in the party\'s own faction chapter', () => {
  const completed = new Set(value(sg, 3).concat(value(mc, 5), ['0000000000000002']));
  const s = setup({ completed, mapping: { party: 'stargazers' } });
  const expected = value(sg, 3).reduce((sum, id) => sum + sg.quests[id], 0);
  assert.equal(s.subject.earned(s.teams.party), expected);
  assert.equal(s.subject.bonusFor({ getOwner: () => 'member' }, new Map()), expected);
  assert.equal(s.subject.bonusFor({ getOwner: () => 'loner' }, new Map()), 0);
  assert.equal(s.subject.bonusFor({ getOwner: () => 'nobody' }, new Map()), 0);
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
