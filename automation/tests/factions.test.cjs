const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const definitions = fs.readFileSync(path.join(root, 'kubejs/server_scripts/faction_definitions.js'), 'utf8');
const parties = fs.readFileSync(path.join(root, 'kubejs/server_scripts/faction_parties.js'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(root, 'kubejs/config/factions.json'), 'utf8'));

class Tag {
  constructor() { this.values = new Map(); }
  contains(key) { return this.values.has(key); }
  put(key, value) { this.values.set(key, value); }
  getCompound(key) { return this.values.get(key) || new Tag(); }
  getAllKeys() { return { size: () => this.values.size }; }
  getString(key) { return this.values.get(key) || ''; }
  putString(key, value) { this.put(key, value); }
  getBoolean(key) { return this.values.get(key) || false; }
  putBoolean(key, value) { this.put(key, value); }
}
const optional = value => ({ orElse: fallback => value ?? fallback });
const set = values => ({ forEach: fn => values.forEach(fn), size: () => values.length, isEmpty: () => values.length === 0 });
class Always {}
Always.INSTANCE = new Always();
class OP {}
class FakePlayer {}
class Cancelable { setCanceled(value) { this.canceled = value; } }
class JavaString extends String { getBytes() { return String(this); } }
class Profile { constructor(id, name) { this.id = id; this.name = name; } }
class Command {
  constructor(name) { this.name = name; this.children = []; }
  then(child) { this.children.push(child); return this; }
  requires(predicate) { this.permission = predicate; return this; }
  executes(fn) { this.execute = fn; return this; }
  suggests(fn) { this.suggestions = fn; return this; }
}

function setup({ age = 0, config = data, persisted = new Tag(), existing = false } = {}) {
  const teams = new Map(); const personal = new Map(); const effective = new Map();
  const ranks = new Map(); const handlers = { native: {}, players: {}, teams: {} }; const players = [];
  let validator, saves = 0;
  const guard = {
    gameTime: server => server.overworld().getGameTime(),
    systemId: value => value,
    appointOwner: (team, source, profile) => team.transferOwnership(source, profile),
    checkJoinable: team => { if (team.full) throw new Error('full'); },
    setJoinValidator: fn => { validator = fn; },
    leaveAuthorized: (team, id) => team.leave(id),
  };
  const manager = {
    getExtraData: () => persisted, getId: () => 'world-id', markDirty() {}, saveNow: () => { saves++; },
    getTeams: () => set([...teams.values()]), getKnownPlayerTeams: () => set([...personal.values()]),
    getTeamByID: id => optional(teams.get(id)), getTeamForPlayerID: id => optional(effective.get(id)),
    getTeamForPlayer: player => optional(effective.get(player.uuid)),
    playerLoggedIn: (_, id) => {
      if (!personal.has(id)) {
        const team = { isPartyTeam: () => false }; personal.set(id, team); effective.set(id, team);
      }
    },
    createParty: (owner, _, name) => {
      const id = 'party-' + teams.size; const extra = new Tag(); const members = new Map([[owner, 'owner']]);
      const properties = new Map();
      const team = {
        owner, name, members, extra, getId: () => id, isPartyTeam: () => true,
        getExtraData: () => extra, getMembers: () => set([...members.keys()]), markDirty() {},
        setProperty: (key, value) => properties.set(key, value), getProperty: key => properties.get(key),
        addMember: (id, rank) => members.set(id, rank), removeMember: id => members.delete(id),
        isOwner: id => team.owner === id,
        transferOwnership: (_, profile) => { members.set(team.owner, 'officer'); team.owner = profile.id; members.set(profile.id, 'owner'); },
        join: player => {
          if (validator && !validator(team, player)) throw new Error('No home');
          members.set(player.uuid, 'member'); effective.set(player.uuid, team); handlers.teams.join?.({ player });
        },
        leave: id => { members.delete(id); effective.set(id, personal.get(id)); const player = players.find(p => p.uuid === id); if (player) handlers.teams.leave?.({ player }); },
      };
      teams.set(id, team); effective.set(owner, team); return team;
    },
  };
  const rankManager = {
    getRank: id => optional(ranks.get(id)),
    createRank: (id, name, power) => {
      const values = new Map(); let condition;
      const rank = { name, power, getCondition: () => condition, setCondition: value => { condition = value; },
        getPermission: node => ({ asBoolean: () => optional(values.get(node)) }), setPermission: (node, value) => values.set(node, value), values };
      ranks.set(id, rank); return rank;
    },
  };
  const server = { overworld: () => ({ getGameTime: () => age }), createCommandSourceStack: () => ({}),
    getPlayerList: () => ({ getPlayers: () => set(players) }), scheduleInTicks: (_, fn) => fn() };
  const session = { isLocked: false, homeCache: new Map(), locked: () => session.isLocked,
    home: (_, team) => team.home || null, returnHome: (player, home) => { player.destination = home; } };
  const classes = {
    FTBTeamsAPI: { api: () => ({ isManagerLoaded: () => true, getManager: () => manager }) },
    TeamProperties: { FREE_TO_JOIN: 'free' }, TeamRank: { INVITED: 'invited' },
    FTBRanksAPI: { manager: () => rankManager, getInstance: () => ({ parsePermissionValue: value => value === 'true' }) },
    AlwaysActiveCondition: Always, OPCondition: OP, FactionGuard: guard,
    UUID: { fromString: id => id, nameUUIDFromBytes: bytes => bytes }, String: JavaString, GameProfile: Profile,
    EntityArgument: { player() {}, getPlayer() {} }, StringArgumentType: { word() {}, getString() {} },
    FakePlayer, ICancellableEvent: Cancelable,
  };
  const stageAPI = { playerHasStage: (player, stage) => player.astages.has(stage),
    addStageToPlayer: (player, stage) => player.astages.add(stage), removeStageFromPlayer: (player, stage) => player.astages.delete(stage) };
  const context = vm.createContext({ JsonIO: { readString: () => JSON.stringify(config) },
    Java: { loadClass: name => classes[name.split('.').pop()] }, NBT: { compoundTag: () => new Tag() },
    AStages: stageAPI, Text: { of: value => { const result = typeof value === 'string' ? { text: value } : { ...value }; return { ...result, clickRunCommand: command => ({ ...result, command }) }; } },
    factionSession: session, ServerEvents: { loaded: fn => { handlers.loaded = fn; }, tick: fn => { handlers.tick = fn; },
      commandRegistry: fn => fn({ commands: { literal: name => new Command(name), argument: name => new Command(name) }, register: command => { handlers.commands = command; } }) },
    FTBTeamsEvents: { playerJoinedParty: fn => { handlers.teams.join = fn; }, playerLeftParty: fn => { handlers.teams.leave = fn; } },
    PlayerEvents: { loggedIn: fn => { handlers.players.login = fn; }, loggedOut: fn => { handlers.players.logout = fn; } },
    NativeEvents: { onEvent: (name, fn) => { handlers.native[name] = fn; } },
  });
  vm.runInContext(definitions + '\n' + parties + '\nglobalThis.subject = factionParties;', context);
  const subject = context.subject;
  function player(id = 'player') {
    manager.playerLoggedIn(null, id);
    const p = { uuid: id, server, level: { dimension: 'minecraft:overworld' }, x: 0, y: 64, z: 0, yaw: 0, pitch: 0,
      astages: new Set(['unrelated_progression']), messages: [], tell: text => p.messages.push(text), getGameProfile: () => new Profile(id, id),
      stopRiding() {}, stopFallFlying() {}, setMotion() {}, teleportTo: (...args) => { p.anchor = args; return true; } };
    players.push(p); return p;
  }
  if (existing) player('existing-player');
  return { subject, server, session, manager, teams, ranks, handlers, player, persisted, context, validator: (...args) => validator(...args), saves: () => saves };
}

test('central definition rejects duplicate IDs, mod conflicts, unknown groups and bad format', () => {
  for (const mutate of [d => { d.version = 2; }, d => { d.factions[1].id = d.factions[0].id; },
    d => { d.factions[1].mods.push(d.factions[0].mods[0]); }, d => { d.factions[0].sharedGroups = ['missing']; }, d => { d.factions[0].sharedGroups = ['constructor']; },
    d => { d.factions[0].id = ['stargazers']; }]) {
    const config = structuredClone(data); mutate(config); assert.throws(() => setup({ config }));
  }
});
test('new-world initialization creates four ordinary parties, persists identities and is idempotent', () => {
  const s = setup(); s.subject.initialize(s.server); assert.equal(s.teams.size, 4);
  assert.equal(s.subject.active(), true);
  for (const faction of data.factions) {
    const team = s.subject.team(faction.id); assert.equal(team.name, faction.name);
    assert.equal(s.subject.humanMembers(team), 0); assert.equal(team.members.size, 1);
    assert.equal(team.getProperty('free'), true);
  }
  const before = [...s.teams.keys()]; s.subject.initialized = false; s.subject.initialize(s.server);
  assert.deepEqual([...s.teams.keys()], before);
});
test('played worlds and worlds with known players are not initialized or given faction ranks', () => {
  for (const options of [{ age: 1 }, { existing: true }]) {
    const s = setup(options); s.subject.initialize(s.server);
    assert.equal(s.teams.size, 0); assert.equal(s.ranks.size, 2); assert.equal(s.subject.active(), false);
  }
});
test('removed parties and changed faction IDs are rejected rather than recreated', () => {
  const s = setup(); s.subject.initialize(s.server); s.teams.delete(s.subject.team('mechanists').getId());
  assert.throws(() => s.subject.initialize(s.server), /Missing faction party/);
});
test('join choices contain only names and commands, and joining grants member rank plus exclusive/shared stages', () => {
  const s = setup(); s.subject.initialize(s.server); const p = s.player();
  s.handlers.players.login({ player: p, server: s.server });
  assert.equal(p.messages[0].text, 'Click to join a faction:');
  assert.deepEqual(p.messages.slice(1).map(m => m.text), data.factions.map(f => '[' + f.name + ']'));
  for (const message of p.messages.slice(1)) { assert.equal(message.color, 'blue'); assert.equal(message.underlined, true); assert.match(message.command, /^\/faction join /); }
  s.subject.join(p, 'stargazers', false); const team = s.subject.party(p);
  assert.equal(team.members.get(p.uuid), 'member'); assert.notEqual(team.owner, p.uuid);
  assert.deepEqual([...p.astages].sort(), ['science_shared', 'stargazers', 'unrelated_progression']);
  assert.equal(s.subject.choose(p), 0);
  assert.throws(() => s.subject.join(p, 'ritualists', false), /operator/);
});
test('operator transfers remove former stages, preserve party identities and homes, and restore system ownership on removal', () => {
  const s = setup(); s.subject.initialize(s.server); const p = s.player(); s.subject.join(p, 'stargazers', false);
  const old = s.subject.party(p); old.home = { x: 10 }; s.subject.team('stargazers').transferOwnership({}, p.getGameProfile());
  s.subject.join(p, 'ritualists', true);
  assert.equal(old.owner, s.subject.system(old)); assert.equal(old.members.size, 1); assert.deepEqual(old.home, { x: 10 });
  assert.deepEqual([...p.astages].sort(), ['magic_shared', 'ritualists', 'unrelated_progression']);
  s.subject.remove(p); assert.deepEqual([...p.astages], ['unrelated_progression']);
});
test('locked selection holds players, rejects missing homes through both join paths, then sends them to a valid home', () => {
  const s = setup(); s.subject.initialize(s.server); const p = s.player(); s.session.isLocked = true;
  s.subject.hold(p); p.x = 20; s.subject.hold(p); assert.equal(p.anchor[1], 0);
  assert.equal(s.subject.waiting(p), true); const team = s.subject.team('mechanists');
  assert.throws(() => s.subject.join(p, 'mechanists', false), /valid home/);
  assert.equal(s.validator(team, p), false); assert.equal(s.subject.party(p), null);
  team.home = { x: 100 }; s.subject.join(p, 'mechanists', false);
  assert.deepEqual(p.destination, team.home); assert.equal(s.subject.waiting(p), false);
});
test('native pending-player interactions are canceled and unrelated players are unaffected', () => {
  const s = setup(); s.subject.initialize(s.server); const p = s.player(); s.session.isLocked = true; s.subject.hold(p);
  const event = Object.assign(new Cancelable(), { getEntity: () => p });
  s.handlers.native['net.neoforged.neoforge.event.entity.player.AttackEntityEvent'](event); assert.equal(event.canceled, true);
  s.session.isLocked = false; event.canceled = false;
  s.handlers.native['net.neoforged.neoforge.event.entity.player.AttackEntityEvent'](event); assert.equal(event.canceled, false);
});
test('FTB ranks deny managed operations to normal players and allow operators; custom commands require level 2', () => {
  const s = setup(); s.subject.initialize(s.server);
  assert.equal(s.ranks.get('faction_members').values.get('command.ftbteams.party.leave'), false);
  assert.equal(s.ranks.get('faction_operators').values.get('command.ftbteams.party.transfer_ownership'), true);
  for (const name of ['assign', 'remove']) {
    const command = s.handlers.commands.children.find(c => c.name === name);
    assert.equal(command.permission({ hasPermission: () => false }), false);
    assert.equal(command.permission({ hasPermission: level => level === 2 }), true);
  }
});
test('reload reconciliation removes stale faction stages but preserves unrelated progress', () => {
  const s = setup(); s.subject.initialize(s.server); const p = s.player(); s.subject.join(p, 'spellcasters', false);
  p.astages.add('stargazers'); s.subject.lastTeams.clear(); s.handlers.tick({ server: s.server });
  assert.deepEqual([...p.astages].sort(), ['magic_shared', 'spellcasters', 'unrelated_progression']);
});

test('a full destination is rejected before removing an owner from their original faction', () => {
  const s = setup(); s.subject.initialize(s.server); const p = s.player();
  s.subject.join(p, 'stargazers', false); s.subject.team('stargazers').transferOwnership({}, p.getGameProfile());
  const old = s.subject.party(p); s.subject.team('mechanists').full = true;
  assert.throws(() => s.subject.join(p, 'mechanists', true), /full/);
  assert.equal(s.subject.party(p), old); assert.equal(old.owner, p.uuid);
});

test('join and assign complete partial faction IDs and use faction-first arguments', () => {
  const s = setup();
  for (const name of ['join', 'assign']) {
    const command = s.handlers.commands.children.find(c => c.name === name);
    const id = command.children[0]; assert.equal(id.name, 'id');
    if (name !== 'join') assert.equal(id.children[0].name, 'player');
    for (const prefix of ['', 'me', 'st', 'bad']) {
      const found = []; id.suggestions({}, { getRemaining: () => prefix, suggest: value => found.push(value), buildFuture: () => found });
      assert.deepEqual(found, data.factions.filter(f => f.id.startsWith(prefix)).map(f => f.id));
    }
  }
});


test('travel permissions apply in managed and existing worlds and preserve unrelated nodes', () => {
  for (const age of [0, 20]) {
    const s = setup({ age }); s.subject.initialize(s.server);
    const base = s.ranks.get('infrastructure_members'); const ops = s.ranks.get('infrastructure_operators');
    base.values.set('command.warp', true);
    base.values.set('command.spawn', true);
    s.subject.permissions();
    for (const node of ['command.spawn', 'command.back']) {
      assert.equal(base.values.get(node), false); assert.equal(ops.values.get(node), true);
    }
    assert.equal(base.values.get('command.warp'), true);
    assert.equal(base.getCondition() instanceof Always, true); assert.equal(ops.getCondition() instanceof OP, true);
  }
});

test('native join and leave events sync stages, skip fake players and use one handler per event', () => {
  const s = setup(); s.subject.initialize(s.server); const p = s.player();
  p.astages.add('first_join'); s.session.isLocked = true;
  const team = s.subject.team('mechanists'); team.home = { x: 77 };
  team.join(p); assert.deepEqual(p.destination, team.home);
  assert.deepEqual([...p.astages].sort(), ['first_join', 'mechanists', 'science_shared', 'unrelated_progression']);
  team.leave(p.uuid); assert.deepEqual([...p.astages].sort(), ['first_join', 'unrelated_progression']);
  assert.equal(s.subject.waiting(p), true);
  s.handlers.tick({ server: s.server }); assert.equal(s.subject.waiting(p), true);
  s.handlers.teams.join({ player: new FakePlayer() });
  assert.equal(s.handlers.teams.join, s.handlers.teams.leave);
  assert.equal(s.handlers.commands.children.some(c => c.name === 'owner' || c.name === 'home'), false);
});


test('lock holding refreshes the prompt and anchor; native joining clears pending after teleport', () => {
  const s = setup(); s.subject.initialize(s.server); const p = s.player(); s.session.isLocked = true;
  s.subject.hold(p); assert.equal(p.messages.length, 5);
  s.subject.hold(p); assert.equal(p.messages.length, 5);
  p.x = 25; s.subject.hold(p, true);
  assert.equal(p.messages.length, 10); assert.equal(s.subject.pending.get(p.uuid).x, 25);
  const team = s.subject.team('mechanists'); team.home = { x: 100 };
  s.session.returnHome = (player, home) => {
    assert.equal(s.subject.pending.has(player.uuid), true); player.destination = home;
  };
  team.join(p);
  assert.deepEqual(p.destination, team.home); assert.equal(s.subject.pending.has(p.uuid), false);
});

test('locked operator assignment teleports once without intermediate faction prompts', () => {
  const s = setup(); s.subject.initialize(s.server); const p = s.player();
  s.subject.join(p, 'stargazers', false); s.session.isLocked = true;
  s.subject.team('mechanists').home = { x: 100 }; let teleports = 0;
  s.session.returnHome = () => { teleports++; };
  s.subject.join(p, 'mechanists', true);
  assert.equal(p.messages.length, 0); assert.equal(teleports, 1);
  assert.equal(s.subject.pending.has(p.uuid), false);
});
