// priority: 5
// FTB Chunks remains the only claim store. See README.md#faction-sessions.
const SessionChunks = Java.loadClass('dev.ftb.mods.ftbchunks.api.FTBChunksAPI');
const SessionTeams = Java.loadClass('dev.ftb.mods.ftbteams.api.FTBTeamsAPI');
const SessionRanks = Java.loadClass('dev.ftb.mods.ftbranks.api.FTBRanksAPI');
const SessionConfig = Java.loadClass('dev.ftb.mods.ftbchunks.FTBChunksWorldConfig');
const SessionPartyLimit = Java.loadClass('dev.ftb.mods.ftbchunks.data.PartyLimitMode');
const SessionTeamRank = Java.loadClass('dev.ftb.mods.ftbteams.api.TeamRank');
const SessionTeamArgument = Java.loadClass('dev.ftb.mods.ftbteams.data.TeamArgument');
const SessionTeamType = Java.loadClass('dev.ftb.mods.ftbteams.data.TeamType');
const SessionChunkPos = Java.loadClass('dev.ftb.mods.ftblibrary.math.ChunkDimPos');
const SessionBlockPos = Java.loadClass('net.minecraft.core.BlockPos');
const SessionAABB = Java.loadClass('net.minecraft.world.phys.AABB');
const SessionServerPlayer = Java.loadClass('net.minecraft.server.level.ServerPlayer');
const SessionFakePlayer = Java.loadClass('net.neoforged.neoforge.common.util.FakePlayer');
const SessionTeleportCommand = Java.loadClass('net.neoforged.neoforge.event.entity.EntityTeleportEvent$TeleportCommand');

const factionSession = {
  maxClaims: 2147483647,
  initialized: false,
  tick: 0,
  previous: new Map(),
  teleportUntil: new Map(),
  homeCache: new Map(),
  alerts: new Map(),

  locked(server) {
    return server.persistentData.getBoolean('sessionLocked');
  },

  players(server) {
    return server.getPlayerList().getPlayers();
  },

  party(player) {
    let team = SessionTeams.api().getManager().getTeamForPlayer(player).orElse(null);
    return team && team.isPartyTeam() ? team : null;
  },

  homes(server) {
    let data = server.persistentData;
    if (!data.contains('sessionFactionHomes')) data.put('sessionFactionHomes', NBT.compoundTag());
    return data.getCompound('sessionFactionHomes');
  },

  claim(level, x, z) {
    return SessionChunks.api().getManager().getChunk(new SessionChunkPos(level.dimensionKey, Math.floor(x / 16), Math.floor(z / 16)));
  },

  // Only this node and extra-claim bonuses are normalized. Force loading is untouched.
  normalizeLimits() {
    let value = SessionRanks.getInstance().parsePermissionValue(String(this.maxClaims));
    SessionRanks.manager().getAllRanks().forEach(rank => {
      if (rank.getPermission('ftbchunks.max_claimed').asInteger().orElse(-1) !== this.maxClaims) {
        rank.setPermission('ftbchunks.max_claimed', value);
      }
    });
    SessionConfig.MAX_CLAIMED_CHUNKS.set(this.maxClaims);
    SessionConfig.HARD_TEAM_CLAIM_LIMIT.set(0);
    SessionConfig.PARTY_LIMIT_MODE.set(SessionPartyLimit.LARGEST);
    SessionConfig.MAX_IDLE_DAYS_BEFORE_UNCLAIM.set(0);
    let manager = SessionChunks.api().getManager();
    let teams = SessionTeams.api().getManager().getTeams();
    // Clear every bonus before updating any party: FTB transfers party bonuses to owners.
    teams.forEach(team => {
      let data = manager.getOrCreateData(team);
      // Do not read getExtraClaimChunks(): on a party it transfers bonuses to its owner.
      data.setExtraClaimChunks(0);
      data.markDirty();
    });
    teams.forEach(team => manager.getOrCreateData(team).updateLimits());
    this.initialized = true;
  },

  safe(level, x, y, z) {
    if (y <= level.getMinBuildHeight() || y + 2 >= level.getMaxBuildHeight()) return false;
    // Keep the whole standing body in this chunk, including homes near chunk edges.
    if (Math.floor((x - 0.31) / 16) !== Math.floor((x + 0.31) / 16)
      || Math.floor((z - 0.31) / 16) !== Math.floor((z + 0.31) / 16)) return false;
    return true;
  },

  home(server, team) {
    let id = String(team.getId());
    if (this.homeCache.has(id)) return this.homeCache.get(id);
    let saved = this.homes(server).getCompound(id);
    let result = null;
    if (saved.contains('dimension')) {
      let dimension = String(saved.getString('dimension'));
      let level = null;
      server.getAllLevels().forEach(candidate => {
        if (String(candidate.dimension) === dimension) level = candidate;
      });
      let x = saved.getDouble('x');
      let y = saved.getInt('y');
      let z = saved.getDouble('z');
      let chunkX = Math.floor(x / 16);
      let chunkZ = Math.floor(z / 16);
      let claim = level ? this.claim(level, x, z) : null;
      if (claim && String(claim.getTeamData().getTeam().getId()) === id) {
        // At most 125 candidates, within two blocks of the saved home, in its own chunk.
        for (let dy of [0, 1, -1, 2, -2]) {
          for (let dx of [0, 1, -1, 2, -2]) {
            for (let dz of [0, 1, -1, 2, -2]) {
              if (!result && Math.floor((x + dx) / 16) === chunkX && Math.floor((z + dz) / 16) === chunkZ
                && this.safe(level, x + dx, y + dy, z + dz)) {
                result = { dimension, x: x + dx, y: y + dy, z: z + dz,
                  yaw: saved.getFloat('yaw'), pitch: saved.getFloat('pitch') };
              }
            }
          }
        }
      }
    }
    this.homeCache.set(id, result);
    return result;
  },

  alert(server, text) {
    // Log once per reason per minute, even if several members disconnect together.
    if (this.tick - (this.alerts.has(text) ? this.alerts.get(text) : -1200) < 1200) return;
    this.alerts.set(text, this.tick);
    console.error('[Faction session] ' + text);
    this.players(server).forEach(player => {
      if (player.hasPermissions(2)) player.tell('[Faction session] ' + text);
    });
  },

  rejectPlayer(player, reason) {
    let text = 'Session is locked: ' + reason + '. Wait for an operator to unlock the session.';
    this.alert(player.server, String(player.username) + ': ' + reason);
    player.kick(Text.of(text));
    this.previous.delete(String(player.uuid));
  },

  returnHome(player, home, silent) {
    player.stopRiding();
    player.stopFallFlying();
    player.setMotion(0, 0, 0);
    player.fallDistance = 0;
    if (!player.teleportTo(home.dimension, home.x, home.y, home.z, home.yaw, home.pitch)) {
      this.rejectPlayer(player, 'the faction home teleport failed');
      return;
    }
    player.setMotion(0, 0, 0);
    player.fallDistance = 0;
    if (!silent) player.tell('Session is locked. Wilderness travel is disabled; you have been returned to your faction home.');
    this.previous.set(String(player.uuid), this.position(player));
  },

  position(player) {
    return { dimension: String(player.level.dimension), x: player.x, y: player.y, z: player.z, yaw: player.yaw, pitch: player.pitch };
  },

  returnPrevious(player, before) {
    if (!before || before.dimension !== String(player.level.dimension)
      || ![before.x, before.y, before.z, before.yaw, before.pitch].every(Number.isFinite)) return false;
    let level = player.level;
    let chunkX = Math.floor(before.x / 16);
    let chunkZ = Math.floor(before.z / 16);
    let x = Math.max(chunkX * 16 + 0.32, Math.min(chunkX * 16 + 15.68, before.x));
    let z = Math.max(chunkZ * 16 + 0.32, Math.min(chunkZ * 16 + 15.68, before.z));
    let y = before.y;
    if (!this.claim(level, x, z) || y <= level.getMinBuildHeight() || y + 2 >= level.getMaxBuildHeight()) return false;
    let feet = new SessionBlockPos(Math.floor(x), Math.floor(y), Math.floor(z));
    let hazards = /(?:lava|fire|magma|cactus|campfire|berry_bush|powder_snow|wither_rose)/;
    for (let pos of [feet.below(), feet, feet.above()]) {
      if (!level.getFluidState(pos).isEmpty() || hazards.test(String(level.getBlock(pos).id))) return false;
    }
    // Airborne snapshots are valid; no supporting floor is required.
    if (!level.noCollision(new SessionAABB(x - 0.31, y, z - 0.31, x + 0.31, y + 1.9, z + 0.31))) return false;
    player.stopRiding();
    player.stopFallFlying();
    player.setMotion(0, 0, 0);
    player.fallDistance = 0;
    if (!player.teleportTo(before.dimension, x, y, z, before.yaw, before.pitch)) return false;
    player.setMotion(0, 0, 0);
    player.fallDistance = 0;
    this.previous.set(String(player.uuid), this.position(player));
    return true;
  },

  // Grid traversal catches motion that crosses a wilderness gap within one tick.
  claimedPath(level, from, to) {
    let cx = Math.floor(from.x / 16);
    let cz = Math.floor(from.z / 16);
    let endX = Math.floor(to.x / 16);
    let endZ = Math.floor(to.z / 16);
    let dx = to.x - from.x;
    let dz = to.z - from.z;
    let stepX = Math.sign(dx);
    let stepZ = Math.sign(dz);
    let tx = dx === 0 ? Infinity : ((cx + (stepX > 0 ? 1 : 0)) * 16 - from.x) / dx;
    let tz = dz === 0 ? Infinity : ((cz + (stepZ > 0 ? 1 : 0)) * 16 - from.z) / dz;
    for (let n = 0; n < 1024; n++) {
      if (!this.claim(level, cx * 16 + 8, cz * 16 + 8)) return false;
      if (cx === endX && cz === endZ) return true;
      if (tx < tz) {
        cx += stepX;
        tx += 16 / Math.abs(dx);
      } else if (tz < tx) {
        cz += stepZ;
        tz += 16 / Math.abs(dz);
      } else {
        // Exact corner crossing must not tunnel diagonally between two wilderness chunks.
        if (!this.claim(level, (cx + stepX) * 16 + 8, cz * 16 + 8)
          || !this.claim(level, cx * 16 + 8, (cz + stepZ) * 16 + 8)) return false;
        cx += stepX;
        cz += stepZ;
        tx += 16 / Math.abs(dx);
        tz += 16 / Math.abs(dz);
      }
    }
    return false;
  },

  enforce(player) {
    if (!this.locked(player.server) || player instanceof SessionFakePlayer) return;
    let team = this.party(player);
    if (!team) {
      if (typeof factionParties !== 'undefined' && factionParties.active()) return factionParties.hold(player);
      return this.rejectPlayer(player, 'join an FTB Teams faction and configure its home first');
    }
    let home = this.home(player.server, team);
    if (!home) return this.rejectPlayer(player, 'your faction has no valid home inside its own claim');
    if (!player.isAlive()) return;
    let id = String(player.uuid);
    let now = this.position(player);
    let before = this.previous.get(id);
    let outside = !this.claim(player.level, now.x, now.z);
    // Client packet movement (including vehicles) carries its actual displacement.
    // Direct mod teleports do not; only their destination should be restricted.
    if (!outside && before && before.dimension === now.dimension && (this.teleportUntil.get(id) || -1) < this.tick) {
      let motion = player.getKnownMovement();
      let distance = Math.hypot(now.x - before.x, now.z - before.z);
      let physicalRange = 0.01 + 5 * Math.hypot(motion.x, motion.z);
      if (distance <= physicalRange) outside = !this.claimedPath(player.level, before, now);
    }
    if (outside) {
      if (!this.returnPrevious(player, before)) this.returnHome(player, home);
    }
    else this.previous.set(id, now);
  },

  setLocked(source, locked) {
    let server = source.server;
    this.homeCache.clear();
    if (locked && !this.locked(server)) {
      this.normalizeLimits();
      let problems = [];
      SessionTeams.api().getManager().getTeams().forEach(team => {
        let nonempty = typeof factionParties !== 'undefined' && factionParties.active()
          ? factionParties.humanMembers(team) > 0 : !team.getMembers().isEmpty();
        if (team.isPartyTeam() && nonempty && !this.home(server, team)) {
          problems.push(String(team.getName().getString()) + 'Do not have a valid home! use /sethome within world bounds in an owned claim');
        }
      });
      this.players(server).forEach(player => {
        if (!(player instanceof SessionFakePlayer) && !this.party(player)
          && !(typeof factionParties !== 'undefined' && factionParties.active())) {
          problems.push(String(player.username) + ': must join an FTB Teams faction');
        }
      });
      if (problems.length) {
        source.sendFailure(Text.of('Cannot lock the session:\n' + problems.join('\n')));
        return 0;
      }
    }
    server.persistentData.putBoolean('sessionLocked', locked);
    this.previous.clear();
    this.teleportUntil.clear();
    if (locked) this.players(server).forEach(player => {
      if (!(player instanceof SessionFakePlayer) && !this.party(player)
        && typeof factionParties !== 'undefined' && factionParties.active()) factionParties.hold(player, true);
      else this.enforce(player);
    });
    server.tell(locked ? 'Session locked: claims are frozen and wilderness travel is disabled.' : 'Session unlocked: exploration and claim changes are enabled.');
    return 1;
  },

  command(source, action) {
    try {
      return action();
    } catch (error) {
      this.alert(source.server, 'Session command failed: ' + error);
      source.sendFailure(Text.of('Session command failed. Check the server log: ' + error));
      return 0;
    }
  },

  setHome(source, target) {
    if (target && !source.hasPermission(2)) {
      source.sendFailure(Text.of('Only operators can set a home for a specified party.'));
      return 0;
    }
    let player = source.getPlayerOrException();
    if (this.locked(source.server)) {
      source.sendFailure(Text.of('Unlock the session before changing faction homes.'));
      return 0;
    }
    let team = target || this.party(player);
    if (!team || !team.isPartyTeam() || (!target && !team.getRankForPlayer(player.uuid).isAtLeast(SessionTeamRank.OFFICER))) {
      source.sendFailure(Text.of('Only an FTB Teams party owner or officer can set its faction home.'));
      return 0;
    }
    let x = Math.floor(player.x) + 0.5;
    let y = Math.floor(player.y);
    let z = Math.floor(player.z) + 0.5;
    let claim = this.claim(player.level, x, z);
    if (!claim || String(claim.getTeamData().getTeam().getId()) !== String(team.getId())
      || !this.safe(player.level, x, y, z)) {
      source.sendFailure(Text.of('Stand within world height bounds and fully inside a chunk claimed by the selected FTB Teams party.'));
      return 0;
    }
    let saved = NBT.compoundTag();
    saved.putString('dimension', String(player.level.dimension));
    saved.putDouble('x', x);
    saved.putInt('y', y);
    saved.putDouble('z', z);
    saved.putFloat('yaw', player.yaw);
    saved.putFloat('pitch', player.pitch);
    this.homes(source.server).put(String(team.getId()), saved);
    this.homeCache.clear();
    source.sendSuccess(Text.of('Faction home set for ' + team.getName().getString() + '.'), false);
    return 1;
  },

  homeInfo(source) {
    let team = this.party(source.getPlayerOrException());
    this.homeCache.clear();
    let home = team ? this.home(source.server, team) : null;
    source.sendSuccess(Text.of(home ? `Faction home: ${home.dimension} ${home.x}, ${home.y}, ${home.z}` : 'No valid faction home. Your party owner/officers must use /sethome while the session is unlocked.'), false);
    return 1;
  },
};

ServerEvents.commandRegistry(event => {
  let commands = event.commands;
  let info = context => {
    context.source.sendSuccess(Text.of('Session is ' + (factionSession.locked(context.source.server) ? 'locked' : 'unlocked') + '.'), false);
    return 1;
  };
  event.register(commands.literal('session').requires(source => source.hasPermission(2))
    .then(commands.literal('lock').executes(context => factionSession.command(context.source, () => factionSession.setLocked(context.source, true))))
    .then(commands.literal('unlock').executes(context => factionSession.command(context.source, () => factionSession.setLocked(context.source, false))))
    .then(commands.literal('info').executes(info)).executes(info));
  event.register(commands.literal('sethome')
    .executes(context => factionSession.command(context.source, () => factionSession.setHome(context.source)))
    .then(commands.argument('party', SessionTeamArgument.create(SessionTeamType.PARTY)).requires(source => source.hasPermission(2))
      .executes(context => factionSession.command(context.source,
        () => factionSession.setHome(context.source, SessionTeamArgument.get(context, 'party'))))));
  event.register(commands.literal('home').executes(context => factionSession.command(context.source, () => factionSession.homeInfo(context.source))));
});

for (let operation of ['claim', 'unclaim']) {
  FTBChunksEvents.before(operation, event => {
    if (!factionSession.initialized) factionSession.normalizeLimits();
    // Console/admin sources have no entity; event.server would dereference null.
    if (factionSession.locked(event.source.server)) {
      event.setCustomResult('Session is locked. Claiming and unclaiming are disabled.');
      event.cancel();
    }
  });
}

ServerEvents.tick(event => {
  factionSession.tick++;
  factionSession.homeCache.clear();
  try {
    if (!factionSession.initialized || factionSession.tick % 20 === 0) factionSession.normalizeLimits();
    factionSession.players(event.server).forEach(player => factionSession.enforce(player));
  } catch (error) {
    factionSession.alert(event.server, 'Session enforcement failed: ' + error);
    if (factionSession.locked(event.server)) {
      factionSession.players(event.server).forEach(player => player.kick(Text.of('Session enforcement failed. Contact an operator.')));
    }
  }
});

// Delay until FTB's login/respawn handlers have finished restoring team membership.
for (let lifecycle of ['loggedIn', 'respawned']) {
  PlayerEvents[lifecycle](event => {
    let player = event.player;
    player.server.scheduleInTicks(1, () => {
      factionSession.previous.delete(String(player.uuid));
      factionSession.homeCache.clear();
      factionSession.enforce(player);
    });
  });
}

PlayerEvents.loggedOut(event => {
  let id = String(event.player.uuid);
  factionSession.previous.delete(id);
  factionSession.teleportUntil.delete(id);
});

// A positive extra allowance overflows MAX_VALUE before the next normalization tick.
// Inspect Brigadier nodes so aliases and /execute cannot bypass this guard.
NativeEvents.onEvent('net.neoforged.neoforge.event.CommandEvent', event => {
  let context = event.getParseResults().getContext();
  let bonus = false;
  let mutation = false;
  let ftb = false;
  let source = context.getSource();
  while (context) {
    context.getNodes().forEach(parsed => {
      let name = String(parsed.getNode().getName());
      if (name === 'ftbchunks' || name === 'chunks') ftb = true;
      if (name === 'extra_claim_chunks') bonus = true;
      if (name === 'set' || name === 'add') mutation = true;
    });
    context = context.getChild();
  }
  if (ftb && bonus && mutation) {
    event.setCanceled(true);
    source.sendFailure(Text.of('Claim allowance is already unlimited. Extra claim bonuses are disabled to prevent integer overflow.'));
  }
});

NativeEvents.onEvent('net.neoforged.neoforge.event.entity.EntityTeleportEvent', event => {
  let player = event.getEntity();
  if (!(player instanceof SessionServerPlayer) || !factionSession.locked(player.server)) return;
  factionSession.teleportUntil.set(String(player.uuid), factionSession.tick + 2);
  // TeleportCommand lacks a destination dimension: validate it on the following tick
  // rather than incorrectly rejecting a valid cross-dimension /tp.
  if (!(event instanceof SessionTeleportCommand)
    && !factionSession.claim(player.level, event.getTargetX(), event.getTargetZ())) {
    event.setCanceled(true);
    player.tell('Session is locked. Teleport destinations must be claimed.');
  }
});

NativeEvents.onEvent('net.neoforged.neoforge.event.entity.player.PlayerEvent$PlayerChangedDimensionEvent', event => {
  let player = event.getEntity();
  factionSession.previous.delete(String(player.uuid));
  factionSession.homeCache.clear();
  factionSession.enforce(player);
});
