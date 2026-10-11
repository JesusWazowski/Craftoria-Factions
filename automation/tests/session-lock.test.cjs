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

function setup(data = new Tag()) {
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
      updateLimits: () => { updates.push(teams.map(t => t.bonus || 0)); },
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
    ChunkDimPos: ChunkPos, BlockPos, AABB: Box, Direction: { UP: 'up' },
    ResourceKey: { create: (_, dimension) => dimension }, ResourceLocation: { parse: value => value },
    Registries: { DIMENSION: 'dimension' }, ServerPlayer: Player, FakePlayer,
    'EntityTeleportEvent$TeleportCommand': TeleportCommand,
  };
  const context = vm.createContext({ Java: { loadClass: name => classes[name.split('.').pop()] },
    NBT: { compoundTag: () => new Tag() }, Text: { of: text => text }, console: { error() {} },
    ServerEvents: { commandRegistry: handler => { handlers.registry = handler; }, tick: handler => { handlers.tick = handler; } },
    PlayerEvents: Object.fromEntries(['loggedIn', 'loggedOut', 'respawned'].map(key => [key, handler => { handlers.player[key] = handler; }])),
    FTBChunksEvents: { before: (operation, handler) => { handlers.before[operation] = handler; } },
    NativeEvents: { onEvent: (name, handler) => { handlers.native[name] = handler; } },
  });
  vm.runInContext(source + '\nglobalThis.subject = factionSession;', context);
  const subject = context.subject;
  function team(id = 'party', party = true) {
    const value = { getId: () => id, isPartyTeam: () => party,
      getMembers: () => ({ isEmpty: () => false }), getName: () => ({ getString: () => id }),
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
    return { server, getPlayerOrException: () => player,
      sendSuccess: value => { command.success = value; },
      sendFailure: value => { command.failure = value; } };
  }
  return { subject, handlers, claims, teams, players, ranks, configs, updates, level, server, team, claim, player, command };
}

test('only lock/unlock/info exist and require operator level 2', () => {
  const s = setup(); const commands = [];
  s.handlers.registry({ commands: { literal: name => new Command(name) }, register: node => commands.push(node) });
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
  const s = setup(); s.team().bonus = 100; s.team('other').bonus = 200;
  s.ranks.push({ getPermission: () => ({ asInteger: () => ({ orElse: () => 500 }) }),
    setPermission: (key, value) => { assert.equal(key, 'ftbchunks.max_claimed'); assert.equal(value, '2147483647'); } });
  s.subject.normalizeLimits();
  assert.deepEqual(s.updates, [[0, 0], [0, 0]]);
  assert.equal(s.configs.MAX_CLAIMED_CHUNKS, 2147483647);
  assert.equal(s.configs.HARD_TEAM_CLAIM_LIMIT, 0);
  assert.equal(s.configs.PARTY_LIMIT_MODE, 'largest');
  assert.equal(s.configs.MAX_IDLE_DAYS_BEFORE_UNCLAIM, 0);
  assert.equal(Object.keys(s.configs).some(key => key.includes('FORCE')), false);
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

test('homes require officer rank, own claims and safe ground; bounded recovery never leaves the chunk', () => {
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
  assert.match(s.command.failure, /Offline faction.*factionhome set/);
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

test('actual fast client movement across a gap returns home even at a claimed endpoint', () => {
  const s = ready(); s.claim(3, 0, s.owner); s.p.x = 56;
  s.p.getKnownMovement = () => ({ x: 47.5, z: 0 }); s.subject.enforce(s.p);
  assert.equal(s.p.returned, 'minecraft:overworld');
});

test('leaving/disbanding a faction or losing its home disconnects instead of guessing a destination', () => {
  const s = ready(); s.p.party = null; s.subject.enforce(s.p);
  assert.match(s.p.disconnected, /join an FTB Teams faction/);
  s.p.party = s.owner; s.claims.clear(); s.subject.homeCache.clear(); s.subject.enforce(s.p);
  assert.match(s.p.disconnected, /no safe home/); assert.equal(s.p.returned, undefined);
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

test('unsafe floors, fluids, collision and body overlap at chunk edges reject home positions', () => {
  const s = setup();
  assert.equal(s.subject.safe(s.level, 15.9, 64, 8.5), false);
  s.level.getFluidState = () => ({ isEmpty: () => false });
  assert.equal(s.subject.safe(s.level, 8.5, 64, 8.5), false);
  s.level.getFluidState = () => ({ isEmpty: () => true });
  s.level.getBlock = () => ({ id: 'minecraft:magma_block' });
  assert.equal(s.subject.safe(s.level, 8.5, 64, 8.5), false);
  s.level.getBlock = () => ({ id: 'minecraft:air' }); s.level.noCollision = () => false;
  assert.equal(s.subject.safe(s.level, 8.5, 64, 8.5), false);
});
