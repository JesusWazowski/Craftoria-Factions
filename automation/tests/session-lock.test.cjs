// Run from the repository root: node --test automation/tests/session-lock.test.cjs
// Policy tests supplement the pinned NeoForge staging server; they do not emulate mods.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = readFileSync(path.join(__dirname, '../../kubejs/server_scripts/session_lock.js'), 'utf8');

class Tag {
  constructor() { this.data = new Map(); }
  contains(key) { return this.data.has(key); }
  put(key, value) { this.data.set(key, value); }
  getCompound(key) { return this.data.get(key) || new Tag(); }
}
for (const type of ['Boolean', 'String', 'Double', 'Int', 'Float']) {
  Tag.prototype['put' + type] = Tag.prototype.put;
  Tag.prototype['get' + type] = function (key) { return this.data.get(key) || (type === 'String' ? '' : 0); };
}
class Player {}
class FakePlayer extends Player {}
class TeleportCommand {}
class BlockPos {
  constructor(x, y, z) { Object.assign(this, { x, y, z }); }
  below() { return new BlockPos(this.x, this.y - 1, this.z); }
  above() { return new BlockPos(this.x, this.y + 1, this.z); }
}
class ChunkPos {
  constructor(dimension, x, z) { Object.assign(this, { dimension, x, z }); }
}
class Box { constructor(...values) { this.values = values; } }
class Command {
  constructor(name) { this.name = name; this.children = []; }
  requires(predicate) { this.predicate = predicate; return this; }
  then(child) { this.children.push(child); return this; }
  executes(handler) { this.handler = handler; return this; }
}

function setup(data = new Tag(), globals = {}) {
  const handlers = { before: {}, native: {}, player: {} };
  const claims = new Map();
  const teams = [];
  const players = [];
  const ranks = [];
  const configs = {};
  const updates = [];
  const level = {
    dimension: 'minecraft:overworld', dimensionKey: 'minecraft:overworld',
    getMinBuildHeight: () => -64, getMaxBuildHeight: () => 320,
    getBlockState: () => ({ isFaceSturdy: () => true }),
    getBlock: () => ({ id: 'minecraft:air' }),
    getFluidState: () => ({ isEmpty: () => true }), noCollision: () => true,
  };
  const server = { persistentData: data, getPlayerList: () => ({ getPlayers: () => players }),
    getAllLevels: () => [level], tell() {} };
  const manager = { getChunk: pos => claims.get(`${pos.dimension}:${pos.x}:${pos.z}`) || null,
    getOrCreateData: team => ({
      getExtraClaimChunks: () => team.bonus || 0,
      setExtraClaimChunks: value => { team.bonus = value; }, markDirty() {},
      getMaxClaimChunks: () => team.limit || 0,
      deleteMemberData: id => { (team.deleted = team.deleted || []).push(id); },
      updateLimits: () => {
        updates.push(teams.map(t => t.bonus || 0));
        if (team.deleted) team.limit = team.rebuilt;
      },
    }) };
  const teamManager = { getTeams: () => teams, getTeamForPlayer: p => ({ orElse: () => p.party || null }) };
  const api = manager => ({ api: () => ({ getManager: () => manager }) });
  const classes = {
    FTBChunksAPI: api(manager), FTBTeamsAPI: api(teamManager),
    FTBRanksAPI: { getInstance: () => ({ parsePermissionValue: value => value }),
      manager: () => ({ getAllRanks: () => ranks }) },
    FTBChunksWorldConfig: Object.fromEntries(['MAX_CLAIMED_CHUNKS', 'HARD_TEAM_CLAIM_LIMIT', 'PARTY_LIMIT_MODE', 'MAX_IDLE_DAYS_BEFORE_UNCLAIM']
      .map(key => [key, { set: value => { configs[key] = value; } }])),
    PartyLimitMode: { LARGEST: 'largest' }, TeamRank: { OFFICER: 'officer' },
    TeamArgument: { create: type => type, get: context => context.target }, TeamType: { PARTY: 'party' },
    ChunkDimPos: ChunkPos, BlockPos, AABB: Box, Direction: { UP: 'up' },
    ResourceKey: { create: (_, dimension) => dimension }, ResourceLocation: { parse: value => value },
    Registries: { DIMENSION: 'dimension' }, ServerPlayer: Player, FakePlayer,
    'EntityTeleportEvent$TeleportCommand': TeleportCommand,
  };
  const context = vm.createContext({ Java: { loadClass: name => classes[name.split('.').pop()] },
    NBT: { compoundTag: () => new Tag() }, Text: { of: text => text }, console: { error() {}, info() {} }, ...globals,
    ServerEvents: { commandRegistry: handler => { handlers.registry = handler; }, tick: handler => { handlers.tick = handler; } },
    PlayerEvents: Object.fromEntries(['loggedIn', 'loggedOut', 'respawned'].map(key => [key, handler => { handlers.player[key] = handler; }])),
    FTBChunksEvents: { before: (operation, handler) => { handlers.before[operation] = handler; } },
    NativeEvents: { onEvent: (name, handler) => { handlers.native[name] = handler; } },
  });
  vm.runInContext(source + '\nglobalThis.subject = factionSession;', context);
  const subject = context.subject;
  function team(id = 'party', party = true) {
    const value = { getId: () => id, isPartyTeam: () => party, isPlayerTeam: () => !party, getOwner: () => id,
      getMembers: () => Object.assign(['member', 'system'], { isEmpty: () => false }), getName: () => ({ getString: () => id }),
      getRankForPlayer: () => ({ isAtLeast: () => true }) };
    teams.push(value); return value;
  }
  function claim(x, z, owner, dimension = level.dimensionKey) {
    claims.set(`${dimension}:${x}:${z}`, { getTeamData: () => ({ getTeam: () => owner }) });
  }
  function player(owner) {
    const value = Object.assign(new Player(), { server, level, party: owner, uuid: 'player', username: 'Player',
      x: 8.5, y: 64, z: 8.5, yaw: 30, pitch: 10, fallDistance: 20,
      isAlive: () => true, hasPermissions: () => true, tell() {},
      getKnownMovement: () => ({ x: 0, z: 0 }),
      kick: reason => { value.disconnected = reason; },
      stopRiding: () => { value.dismounted = true; }, stopFallFlying: () => { value.stoppedFlight = true; },
      setMotion: (...motion) => { value.motion = motion; },
      teleportTo: (dimension, x, y, z) => { Object.assign(value, { x, y, z }); value.returned = dimension; return true; },
    });
    players.push(value); return value;
  }
  function command(player) {
    return { server, hasPermission: () => false, getPlayerOrException: () => player,
      sendSuccess: value => { command.success = value; },
      sendFailure: value => { command.failure = value; } };
  }
  return { subject, handlers, claims, teams, players, ranks, configs, updates, level, server, team, claim, player, command, context };
}

test('only lock/unlock/info exist and require operator level 2', () => {
  const s = setup(); const commands = [];
  s.handlers.registry({ commands: { literal: name => new Command(name), argument: name => new Command(name) }, register: node => commands.push(node) });
  assert.deepEqual(commands[0].children.map(node => node.name), ['lock', 'unlock', 'info']);
  assert.equal(commands[0].predicate({ hasPermission: level => level <= 1 }), false);
  assert.equal(commands[0].predicate({ hasPermission: level => level <= 2 }), true);
});

test('unset state is active and stored state survives script reload', () => {
  const data = new Tag(); const s = setup(data);
  assert.equal(Boolean(s.subject.locked(s.server)), false);
  s.subject.setLocked(s.command(), true);
  const reloaded = setup(data);
  assert.equal(reloaded.subject.locked(reloaded.server), true);
  reloaded.subject.setLocked(reloaded.command(), false);
  assert.equal(Boolean(s.subject.locked(s.server)), false);
});

test('both inactive claim hooks set a failure and cancel, without operator bypass', () => {
  const s = setup(); s.subject.initialized = true;
  for (const locked of [false, true]) {
    s.server.persistentData.putBoolean('sessionLocked', locked);
    for (const operation of ['claim', 'unclaim']) {
      const event = { source: { server: s.server }, operator: true, setCustomResult: text => { event.result = text; }, cancel: () => { event.canceled = true; } };
      Object.defineProperty(event, 'server', { get() { throw new Error('console event has no entity'); } });
      s.handlers.before[operation](event);
      assert.equal(Boolean(event.canceled), locked);
      assert.equal(Boolean(event.result), locked);
    }
  }
});

test('normalization clears all bonuses before limits update and leaves force loading alone', () => {
  const s = setup(); s.team().bonus = 100; s.team('other').bonus = 200; s.team('solo', false).bonus = 50;
  s.ranks.push({ getPermission: () => ({ asInteger: () => ({ orElse: () => 500 }) }),
    setPermission: (key, value) => { assert.equal(key, 'ftbchunks.max_claimed'); assert.equal(value, '4'); } });
  s.subject.normalizeLimits();
  assert.deepEqual(s.updates, [[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  assert.equal(s.configs.MAX_CLAIMED_CHUNKS, 4);
  assert.equal(s.configs.HARD_TEAM_CLAIM_LIMIT, 64);
  assert.equal(s.configs.PARTY_LIMIT_MODE, 'largest');
  assert.equal(s.configs.MAX_IDLE_DAYS_BEFORE_UNCLAIM, 0);
  assert.equal(Object.keys(s.configs).some(key => key.includes('FORCE')), false);
});

test('milestone bonuses go to every member personally; stale offline caches are rebuilt once', () => {
  const party = { isPartyTeam: () => true };
  const factionMilestones = { config: { baseClaims: 4, maxClaims: 64 },
    bonusFor: (team, cache) => team.getOwner() === 'loading' ? null : team.getOwner() === 'member' ? factionMilestones.partyBonus(party, cache) : 0,
    partyBonus: (team, cache) => { cache.set('calls', (cache.get('calls') || 0) + 1); return 10; } };
  const s = setup(new Tag(), { factionMilestones });
  const faction = s.team('faction'); faction.bonus = 7; faction.limit = 64; faction.rebuilt = 14;
  const member = s.team('member', false); const loner = s.team('loner', false); loner.bonus = 3;
  const loading = s.team('loading', false); loading.bonus = 9;
  s.subject.normalizeLimits();
  assert.equal(faction.bonus, 0);
  assert.equal(member.bonus, 10);
  assert.equal(loner.bonus, 0);
  assert.equal(loading.bonus, 9, 'unknown quest progress leaves the saved bonus alone');
  assert.deepEqual(faction.deleted, ['member', 'system']);
  assert.equal(faction.limit, 14);
  faction.limit = 64; delete faction.deleted;
  s.subject.normalizeLimits();
  assert.equal(faction.deleted, undefined, 'a rebuild is not repeated within a minute');
  const fresh = setup(new Tag(), { factionMilestones }); const fit = fresh.team('fit'); fit.limit = 14;
  fresh.subject.normalizeLimits();
  assert.equal(fit.deleted, undefined, 'a party within its allowance keeps its member cache');
});

test('adjacent claims of any owner connect, negative coordinates and dimensions stay distinct', () => {
  const s = setup(); s.claim(-1, 0, s.team('own')); s.claim(0, 0, s.team('enemy')); s.claim(1, 0, s.team('server'));
  assert.equal(s.subject.claimedPath(s.level, { x: -8, z: 8 }, { x: 24, z: 8 }), true);
  assert.equal(s.subject.claim({ dimensionKey: 'minecraft:the_nether' }, 8, 8), null);
  assert.ok(s.subject.claim(s.level, -0.1, 8));
});

test('high speed paths cannot cross gaps, holes or diagonal wilderness corners', () => {
  const s = setup(); const owner = s.team(); s.claim(0, 0, owner); s.claim(2, 0, owner);
  assert.equal(s.subject.claimedPath(s.level, { x: 8, z: 8 }, { x: 40, z: 8 }), false);
  s.claim(1, 1, owner);
  assert.equal(s.subject.claimedPath(s.level, { x: 8, z: 8 }, { x: 24, z: 24 }), false);
  s.claim(1, 0, owner); s.claim(0, 1, owner);
  assert.equal(s.subject.claimedPath(s.level, { x: 8, z: 8 }, { x: 24, z: 24 }), true);
});

test('homes require officer rank, own claims and valid bounds; bounded recovery never leaves the chunk', () => {
  const s = setup(); const owner = s.team(); const p = s.player(owner); const command = s.command(p);
  s.claim(0, 0, s.team('enemy'));
  assert.equal(s.subject.setHome(command), 0);
  s.claim(0, 0, owner); owner.getRankForPlayer = () => ({ isAtLeast: () => false });
  assert.equal(s.subject.setHome(command), 0);
  owner.getRankForPlayer = () => ({ isAtLeast: () => true });
  assert.equal(s.subject.setHome(command), 1);
  const home = s.subject.home(s.server, owner);
  assert.equal(home.yaw, 30); assert.equal(home.dimension, 'minecraft:overworld');
  s.subject.homeCache.clear(); let attempts = 0;
  s.subject.safe = (_, x, y, z) => { attempts++; assert.equal(Math.floor(x / 16), 0); assert.equal(Math.floor(z / 16), 0); return false; };
  assert.equal(s.subject.home(s.server, owner), null); assert.equal(attempts, 125);
});

test('lock preflight includes offline factions and leaves state active when incomplete', () => {
  const s = setup(); s.team('Offline faction'); const command = s.command();
  assert.equal(s.subject.setLocked(command, true), 0);
  assert.equal(Boolean(s.subject.locked(s.server)), false);
  assert.match(s.command.failure, /Offline faction.*sethome/);
});

function ready() {
  const s = setup(); const owner = s.team(); const p = s.player(owner);
  s.claim(0, 0, owner); assert.equal(s.subject.setHome(s.command(p)), 1);
  s.subject.setLocked(s.command(), true); return { ...s, p, owner };
}

test('operators entering wilderness return home, dismount and lose fall/movement velocity', () => {
  const s = ready(); s.p.x = 17; s.subject.enforce(s.p);
  assert.equal(s.p.x, 8.5); assert.equal(s.p.dismounted, true); assert.equal(s.p.stoppedFlight, true);
  assert.equal(s.p.fallDistance, 0); assert.deepEqual(s.p.motion, [0, 0, 0]);
});

test('enemy claims and disconnected claimed teleport destinations are allowed', () => {
  const s = ready(); s.claim(3, 0, s.team('enemy')); s.p.x = 56;
  s.subject.teleportUntil.set(String(s.p.uuid), s.subject.tick + 2); s.subject.enforce(s.p);
  assert.equal(s.p.returned, undefined); assert.equal(s.p.x, 56);
});

test('actual fast client movement across a gap returns to the previous claim even at a claimed endpoint', () => {
  const s = ready(); s.claim(3, 0, s.owner); s.p.x = 56;
  s.p.getKnownMovement = () => ({ x: 47.5, z: 0 }); s.subject.enforce(s.p);
  assert.equal(s.p.returned, 'minecraft:overworld');
});

test('leaving/disbanding a faction or losing its home disconnects instead of guessing a destination', () => {
  const s = ready(); s.p.party = null; s.subject.enforce(s.p);
  assert.match(s.p.disconnected, /join an FTB Teams faction/);
  s.p.party = s.owner; s.claims.clear(); s.subject.homeCache.clear(); s.subject.enforce(s.p);
  assert.match(s.p.disconnected, /no valid home/); assert.equal(s.p.returned, undefined);
});

test('native pearls reject wilderness while cross-dimension command teleports defer to the tick check', () => {
  const s = ready();
  const handler = s.handlers.native['net.neoforged.neoforge.event.entity.EntityTeleportEvent'];
  const event = { getEntity: () => s.p, getTargetX: () => 32, getTargetZ: () => 8,
    setCanceled: value => { event.canceled = value; } };
  handler(event); assert.equal(event.canceled, true);
  const command = Object.assign(new TeleportCommand(), event); delete command.canceled;
  command.setCanceled = value => { command.canceled = value; };
  handler(command); assert.equal(command.canceled, undefined);
});

test('extra claim bonus mutations are blocked through aliases and nested execute contexts', () => {
  const s = setup(); const handler = s.handlers.native['net.neoforged.neoforge.event.CommandEvent'];
  const node = name => ({ getNode: () => ({ getName: () => name }) });
  const child = { getNodes: () => ['chunks', 'admin', 'extra_claim_chunks', 'player', 'set'].map(node), getChild: () => null };
  const context = { getSource: () => s.command(), getNodes: () => [node('execute')], getChild: () => child };
  const event = { getParseResults: () => ({ getContext: () => context }), setCanceled: value => { event.canceled = value; } };
  handler(event); assert.equal(event.canceled, true);
  child.getNodes = () => ['ftbchunks', 'admin', 'extra_claim_chunks', 'player', 'get'].map(node);
  delete event.canceled; handler(event); assert.equal(event.canceled, undefined);
});

test('home validation keeps height and chunk bounds without inspecting terrain', () => {
  const s = setup();
  for (const method of ['getBlockState', 'getBlock', 'getFluidState', 'noCollision']) {
    s.level[method] = () => { throw new Error('Home validation must not inspect ' + method); };
  }
  assert.equal(s.subject.safe(s.level, 15.9, 64, 8.5), false);
  assert.equal(s.subject.safe(s.level, -0.1, 64, 8.5), false);
  assert.equal(s.subject.safe(s.level, 8.5, -64, 8.5), false);
  assert.equal(s.subject.safe(s.level, 8.5, 318, 8.5), false);
  assert.equal(s.subject.safe(s.level, 8.5, 64, 8.5), true);
  const owner = s.team(); const player = s.player(owner); s.claim(0, 0, owner);
  assert.equal(s.subject.setHome(s.command(player)), 1);
  s.subject.homeCache.clear();
  assert.equal(s.subject.home(s.server, owner).y, 64);
});

test('managed worlds hold unaffiliated locked arrivals without disconnecting them', () => {
  const s = setup(); const p = s.player(null);
  s.server.persistentData.putBoolean('sessionLocked', true);
  s.context.factionParties = { active: () => true, hold: player => { player.pending = true; } };
  s.subject.enforce(p);
  assert.equal(p.pending, true); assert.equal(p.disconnected, undefined);
});
test('reserved-only parties do not require homes before locking a managed world', () => {
  const s = setup(); s.team('reserved-only');
  s.context.factionParties = { active: () => true, humanMembers: () => 0 };
  s.subject.setLocked(s.command(), true);
  assert.equal(s.subject.locked(s.server), true);
});

test('boundary crossings return quietly to the last claimed position instead of home', () => {
  const s = ready(); s.p.x = 14; s.p.y = 70; s.p.yaw = 90; s.subject.enforce(s.p);
  let messages = 0; s.p.tell = () => messages++; s.p.x = 17; s.subject.enforce(s.p);
  assert.equal(s.p.x, 14); assert.equal(s.p.y, 70); assert.equal(messages, 0);
  assert.equal(s.p.dismounted, true); assert.equal(s.p.fallDistance, 0);
});
test('negative chunk edges are clamped within the previous claimed chunk', () => {
  const s = ready(); s.claim(-1, 0, s.owner); s.p.x = -0.01; s.subject.enforce(s.p);
  s.p.x = 32; s.subject.enforce(s.p); assert.ok(Math.abs(s.p.x + 0.32) < 1e-9);
});
test('unsafe, unclaimed or missing snapshots fall back to the faction home', () => {
  for (const mode of ['collision', 'hazard', 'missing', 'unclaimed']) {
    const s = ready(); s.p.x = 14; s.subject.enforce(s.p);
    if (mode === 'collision') s.level.noCollision = box => box.values[0] < 10;
    if (mode === 'hazard') s.level.getBlock = pos => ({ id: pos.x > 10 ? 'minecraft:lava' : 'minecraft:air' });
    if (mode === 'missing') s.subject.previous.clear();
    if (mode === 'unclaimed') s.subject.previous.set(s.p.uuid, { dimension: s.level.dimension, x: 40, y: 64, z: 8.5, yaw: 0, pitch: 0 });
    s.p.x = 33; s.subject.enforce(s.p); assert.equal(s.p.x, 8.5, mode);
  }
});
test('closure and login outside claims use home while subsequent exits use the local snapshot', () => {
  const s = ready(); s.p.x = 40; s.subject.previous.clear(); s.subject.enforce(s.p); assert.equal(s.p.x, 8.5);
  s.p.x = 14; s.subject.enforce(s.p); s.p.x = 17; s.subject.enforce(s.p); assert.equal(s.p.x, 14);
  s.p.x = 40; s.p.server.scheduleInTicks = (_, fn) => fn();
  s.handlers.player.loggedIn({ player: s.p }); assert.equal(s.p.x, 8.5);
});

test('operator can set a different party home without membership, preserving other homes', () => {
  const s = setup(); const own = s.team('own'); const target = s.team('target'); const player = s.player(own);
  const source = s.command(player); source.hasPermission = level => level === 2;
  s.claim(0, 0, own); s.subject.setHome(source); const old = s.subject.homes(s.server).getCompound('own');
  s.claim(0, 0, target); assert.equal(s.subject.setHome(source, target), 1);
  assert.equal(s.subject.homes(s.server).getCompound('target').getDouble('x'), 8.5);
  s.claim(1, 0, target); player.x = 24;
  assert.equal(s.subject.setHome(source, target), 1);
  assert.equal(s.subject.homes(s.server).getCompound('target').getDouble('x'), 24.5);
  assert.equal(s.subject.homes(s.server).getCompound('own'), old);
  assert.equal(player.party, own);
});
test('optional party target requires operators in the command tree and runtime policy', () => {
  const s = setup(); const commands = [];
  s.handlers.registry({ commands: { literal: name => new Command(name), argument: name => new Command(name) }, register: node => commands.push(node) });
  const set = commands.find(c => c.name === 'sethome');
  assert.equal(typeof set.handler, 'function'); const party = set.children[0]; assert.equal(party.name, 'party');
  assert.equal(party.predicate({ hasPermission: () => false }), false);
  assert.equal(party.predicate({ hasPermission: n => n === 2 }), true);
  const target = s.team('target'); const p = s.player(null); s.claim(0, 0, target);
  assert.equal(s.subject.setHome(s.command(p), target), 0); assert.match(s.command.failure, /Only operators/);
  assert.equal(s.subject.homes(s.server).contains('target'), false);
});
test('operator target still requires unlocked session, target territory and valid bounds', () => {
  const s = setup(); const target = s.team('target'); const other = s.team('other'); const p = s.player(null);
  const source = s.command(p); source.hasPermission = () => true;
  s.claim(0, 0, other); assert.equal(s.subject.setHome(source, target), 0);
  s.claim(0, 0, target); s.subject.safe = () => false; assert.equal(s.subject.setHome(source, target), 0);
  s.subject.safe = () => true; s.server.persistentData.putBoolean('sessionLocked', true);
  assert.equal(s.subject.setHome(source, target), 0);
  assert.equal(s.subject.homes(s.server).contains('target'), false);
  s.server.persistentData.putBoolean('sessionLocked', false);
  assert.equal(s.subject.setHome(source, s.team('personal', false)), 0);
  assert.equal(s.subject.setHome(source, target), 1);
});

test('home reports information without teleporting; legacy roots are removed', () => {
  const s = setup(); const commands = [];
  s.handlers.registry({ commands: { literal: name => new Command(name), argument: name => new Command(name) }, register: node => commands.push(node) });
  assert.deepEqual(commands.map(c => c.name), ['session', 'sethome', 'home']);
  const home = commands.find(c => c.name === 'home');
  assert.deepEqual(home.children.map(c => c.name), []);
  assert.equal(typeof home.handler, 'function');
  const player = s.player(null); home.handler({ source: s.command(player) });
  assert.match(s.command.success, /No valid faction home/);
  assert.match(s.command.success, /\/sethome/);
  assert.equal(player.returned, undefined);
});


test('locking a managed world holds unaffiliated online players and resends selection', () => {
  const s = setup(); const p = s.player(null); let prompts = 0;
  s.context.factionParties = { active: () => true, hold: (player, reset) => {
    assert.equal(s.subject.locked(s.server), true);
    assert.equal(reset, true); player.pending = true; prompts++;
  } };
  assert.equal(s.subject.setLocked(s.command(), true), 1);
  assert.equal(p.pending, true); assert.equal(p.disconnected, undefined); assert.equal(prompts, 1);
  s.subject.setLocked(s.command(), false); s.subject.setLocked(s.command(), true);
  assert.equal(prompts, 2);
});

test('unaffiliated players still block locking unmanaged worlds', () => {
  const s = setup(); s.player(null);
  assert.equal(s.subject.setLocked(s.command(), true), 0);
  assert.equal(Boolean(s.subject.locked(s.server)), false);
  assert.match(s.command.failure, /must join/);
});
