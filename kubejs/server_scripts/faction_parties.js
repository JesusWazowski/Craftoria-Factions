// priority: 6
// Persistent identities are FTB UUIDs. Names are presentation, not identifiers.
const FactionTeams = Java.loadClass('dev.ftb.mods.ftbteams.api.FTBTeamsAPI');
const FactionProperties = Java.loadClass('dev.ftb.mods.ftbteams.api.property.TeamProperties');
const FactionRank = Java.loadClass('dev.ftb.mods.ftbteams.api.TeamRank');
const FactionRanks = Java.loadClass('dev.ftb.mods.ftbranks.api.FTBRanksAPI');
const FactionAlways = Java.loadClass('dev.ftb.mods.ftbranks.impl.condition.AlwaysActiveCondition');
const FactionOP = Java.loadClass('dev.ftb.mods.ftbranks.impl.condition.OPCondition');
const FactionGuard = Java.loadClass('craftoria.factions.FactionGuard');
const FactionUUID = Java.loadClass('java.util.UUID');
const FactionProfile = Java.loadClass('com.mojang.authlib.GameProfile');
const FactionPlayerArgument = Java.loadClass('net.minecraft.commands.arguments.EntityArgument');
const FactionWord = Java.loadClass('com.mojang.brigadier.arguments.StringArgumentType');
const FactionFakePlayer = Java.loadClass('net.neoforged.neoforge.common.util.FakePlayer');
const FactionCancelable = Java.loadClass('net.neoforged.bus.api.ICancellableEvent');

const factionParties = {
  initialized: false,
  pending: new Map(),
  joining: new Set(),
  lastTeams: new Map(),
  rankTick: 0,

  manager() { return FactionTeams.api().getManager(); },
  state() { return this.manager().getExtraData(); },
  active() { return FactionTeams.api().isManagerLoaded() && this.state().getBoolean('craftoriaFactionsManaged'); },
  definition(id) { return factionDefinitions.factions.find(faction => faction.id === id); },
  mapping() { return this.state().getCompound('craftoriaFactionParties'); },
  team(id) {
    let value = this.mapping().getString(id);
    return value ? this.manager().getTeamByID(FactionUUID.fromString(value)).orElse(null) : null;
  },
  party(player) {
    let team = this.manager().getTeamForPlayer(player).orElse(null);
    return team && team.isPartyTeam() ? team : null;
  },
  faction(team) {
    if (!team) return null;
    return factionDefinitions.factions.find(entry => this.mapping().getString(entry.id) === String(team.getId()));
  },
  system(team) { return team.getExtraData().getString('craftoriaFactionSystem'); },
  humanMembers(team) {
    let count = 0;
    let system = this.system(team);
    team.getMembers().forEach(id => { if (String(id) !== system) count++; });
    return count;
  },

  initialize(server) {
    if (!FactionTeams.api().isManagerLoaded()) return false;
    let manager = this.manager();
    let state = this.state();
    if (!state.contains('craftoriaFactionsEligible')) {
      // A genuinely unused world has no played ticks, known players, or teams.
      // Existing worlds are deliberately not adopted by name or changed.
      let fresh = FactionGuard.gameTime(server) === 0
        && manager.getKnownPlayerTeams().isEmpty() && manager.getTeams().isEmpty();
      state.putBoolean('craftoriaFactionsEligible', fresh);
      state.put('craftoriaFactionParties', NBT.compoundTag());
      manager.markDirty();
      manager.saveNow();
    }
    if (!state.getBoolean('craftoriaFactionsEligible')) {
      this.initialized = true;
      server.scheduleInTicks(1, () => this.permissions());
      return true;
    }
    let complete = state.getBoolean('craftoriaFactionsManaged');
    let mapping = this.mapping();
    factionDefinitions.factions.forEach(faction => {
      if (mapping.contains(faction.id)) {
        if (!this.team(faction.id)) throw new Error('Missing faction party ' + faction.id + '; restore a world backup');
        return;
      }
      if (complete) throw new Error('Faction IDs changed in an existing managed world: ' + faction.id);
      let system = FactionGuard.systemId('craftoria:faction:' + manager.getId() + ':' + faction.id);
      // Resume safely if creation completed but the mapping was not saved yet.
      manager.playerLoggedIn(null, system, 'Faction System');
      let team = manager.getTeamForPlayerID(system).orElse(null);
      if (!team.isPartyTeam()) team = manager.createParty(system, null, faction.name, '', null);
      team.getExtraData().putString('craftoriaFactionSystem', String(system));
      team.getExtraData().putString('craftoriaFactionId', faction.id);
      team.setProperty(FactionProperties.FREE_TO_JOIN, true);
      team.markDirty();
      mapping.putString(faction.id, String(team.getId()));
      manager.markDirty();
      manager.saveNow();
    });
    // Removing an ID is also a new-world-only customization.
    if (mapping.getAllKeys().size() !== factionDefinitions.factions.length) throw new Error('Faction IDs changed; use a new world');
    state.putBoolean('craftoriaFactionsManaged', true);
    manager.markDirty();
    manager.saveNow();
    this.initialized = true;
    server.scheduleInTicks(1, () => this.permissions());
    return true;
  },

  permissions() {
    let manager = FactionRanks.manager();
    let travel = manager.getRank('infrastructure_members').orElse(null)
      || manager.createRank('infrastructure_members', 'Infrastructure Members', 1000002);
    let travelOP = manager.getRank('infrastructure_operators').orElse(null)
      || manager.createRank('infrastructure_operators', 'Infrastructure Operators', 1000003);
    if (!(travel.getCondition() instanceof FactionAlways)) travel.setCondition(FactionAlways.INSTANCE);
    if (!(travelOP.getCondition() instanceof FactionOP)) travelOP.setCondition(new FactionOP());
    for (let node of ['command.spawn', 'command.back']) {
      if (travel.getPermission(node).asBoolean().orElse(true)) travel.setPermission(node, FactionRanks.getInstance().parsePermissionValue('false'));
      if (!travelOP.getPermission(node).asBoolean().orElse(false)) travelOP.setPermission(node, FactionRanks.getInstance().parsePermissionValue('true'));
    }
    if (!this.active()) return;
    let base = manager.getRank('faction_members').orElse(null)
      || manager.createRank('faction_members', 'Faction Members', 1000000);
    let operators = manager.getRank('faction_operators').orElse(null)
      || manager.createRank('faction_operators', 'Faction Operators', 1000001);
    if (!(base.getCondition() instanceof FactionAlways)) base.setCondition(FactionAlways.INSTANCE);
    if (!(operators.getCondition() instanceof FactionOP)) operators.setCondition(new FactionOP());
    for (let node of ['command.ftbteams.party.create', 'command.ftbteams.party.leave',
      'command.ftbteams.party.transfer_ownership', 'command.ftbteams.party.transfer_ownership_for',
      'command.ftbteams.force-disband']) {
      if (base.getPermission(node).asBoolean().orElse(true)) base.setPermission(node, FactionRanks.getInstance().parsePermissionValue('false'));
      if (!operators.getPermission(node).asBoolean().orElse(false)) operators.setPermission(node, FactionRanks.getInstance().parsePermissionValue('true'));
    }
  },

  manualStages(player) {
    return this.state().getCompound('craftoriaManualStagePlayers').getBoolean(String(player.uuid));
  },

  stageMode(source, player, manual) {
    if (!source.hasPermission(2)) throw new Error('Only operators can change stage synchronization mode');
    if (!this.active()) throw new Error('Faction stage synchronization is not enabled in this world; AStages commands already persist normally');
    let state = this.state();
    if (!state.contains('craftoriaManualStagePlayers')) state.put('craftoriaManualStagePlayers', NBT.compoundTag());
    state.getCompound('craftoriaManualStagePlayers').putBoolean(String(player.uuid), manual);
    this.manager().markDirty();
    this.manager().saveNow();
    this.stages(player);
    source.sendSuccess(Text.of('Faction stage synchronization for ' + player.username + ': '
      + (manual ? 'manual testing mode. AStages commands now control your stages.' : 'automatic party mode.')), false);
    return 1;
  },

  stages(player) {
    if (!this.active() || player instanceof FactionFakePlayer) return;
    if (this.manualStages(player)) {
      this.lastTeams.set(String(player.uuid), String(this.party(player) ? this.party(player).getId() : ''));
      return;
    }
    let faction = this.faction(this.party(player));
    let expected = faction ? [faction.id].concat(faction.sharedGroups) : [];
    factionDefinitions.stages.forEach(stage => {
      let has = AStages.playerHasStage(player, stage);
      if (expected.includes(stage) && !has) AStages.addStageToPlayer(player, stage, false, false, false);
      else if (!expected.includes(stage) && has) AStages.removeStageFromPlayer(player, stage, false, false, false);
    });
    this.lastTeams.set(String(player.uuid), String(this.party(player) ? this.party(player).getId() : ''));
  },

  choose(player) {
    if (!this.active() || this.party(player)) return 0;
    player.tell(Text.of('Click to join a faction:'));
    factionDefinitions.factions.forEach(faction => {
      player.tell(Text.of({ text: '[' + faction.name + ']', color: 'blue', underlined: true }).clickRunCommand('/faction join ' + faction.id));
    });
    return 1;
  },

  hold(player, reset) {
    let id = String(player.uuid);
    if (reset) this.pending.delete(id);
    if (!this.pending.has(id)) {
      this.pending.set(id, { dimension: String(player.level.dimension), x: player.x, y: player.y, z: player.z,
        yaw: player.yaw, pitch: player.pitch });
      this.choose(player);
    }
    let anchor = this.pending.get(id);
    player.stopRiding();
    player.stopFallFlying();
    player.setMotion(0, 0, 0);
    player.fallDistance = 0;
    if (String(player.level.dimension) !== anchor.dimension || Math.abs(player.x - anchor.x) > 0.01
      || Math.abs(player.y - anchor.y) > 0.01 || Math.abs(player.z - anchor.z) > 0.01) {
      player.teleportTo(anchor.dimension, anchor.x, anchor.y, anchor.z, anchor.yaw, anchor.pitch);
    }
  },

  waiting(player) {
    return this.active() && this.pending.has(String(player.uuid)) && factionSession.locked(player.server) && !this.party(player);
  },

  join(player, id, transfer) {
    if (!this.active()) throw new Error('Faction selection is only enabled in newly created faction worlds');
    let definition = this.definition(id);
    let target = this.team(id);
    if (!definition || !target) throw new Error('Unknown faction: ' + id);
    let previous = this.party(player);
    if (previous && String(previous.getId()) === String(target.getId())) return 1;
    if (previous && !transfer) throw new Error('Ask an operator to change your faction');
    factionSession.homeCache.clear();
    let home = factionSession.locked(player.server) ? factionSession.home(player.server, target) : null;
    if (factionSession.locked(player.server) && !home) throw new Error('This faction needs a valid home before joining during a locked session');
    FactionGuard.checkJoinable(target);
    if (previous) {
      // Assignment briefly removes membership; do not prompt during that transition.
      this.joining.add(String(player.uuid));
      try { this.remove(player); }
      finally { this.joining.delete(String(player.uuid)); }
    }
    // Choice is open even if the owner uses the normal invite-only setting.
    target.addMember(player.uuid, FactionRank.INVITED);
    this.joining.add(String(player.uuid));
    try { target.join(player); }
    catch (error) { target.removeMember(player.uuid); target.markDirty(); throw error; }
    finally { this.joining.delete(String(player.uuid)); }
    this.stages(player);
    if (home) {
      factionSession.returnHome(player, home, true);
      this.pending.delete(String(player.uuid));
    } else this.pending.delete(String(player.uuid));
    this.manager().saveNow();
    return 1;
  },

  remove(player) {
    let team = this.party(player);
    if (!team) return 0;
    if (team.isOwner(player.uuid)) {
      let system = this.system(team);
      if (!system) throw new Error('Appoint a replacement owner before removing the owner of this non-faction party');
      FactionGuard.appointOwner(team, player.server.createCommandSourceStack(), new FactionProfile(FactionUUID.fromString(system), 'Faction System'));
    }
    FactionGuard.leaveAuthorized(team, player.uuid);
    this.stages(player);
    this.manager().saveNow();
    return 1;
  },

  command(source, action) {
    try { return action(); }
    catch (error) { source.sendFailure(Text.of(String(error))); return 0; }
  },
};

// FTB events run for GUI kicks, joins, and operator commands as well as our commands.
const factionMembershipChanged = event => {
  let player = event.player;
  if (!player || player instanceof FactionFakePlayer) return;
  if (!factionParties.active()) return;
  factionParties.stages(player);
  let team = factionParties.party(player);
  if (factionParties.joining.has(String(player.uuid))) return;
  if (!team && factionSession.locked(player.server)) {
    factionParties.hold(player);
    return;
  }
  if (team && factionSession.locked(player.server)) {
    factionSession.homeCache.clear();
    let home = factionSession.home(player.server, team);
    if (home) {
      factionSession.returnHome(player, home, true);
      factionParties.pending.delete(String(player.uuid));
    }
  }
};
FTBTeamsEvents.playerJoinedParty(factionMembershipChanged);
FTBTeamsEvents.playerLeftParty(factionMembershipChanged);
FactionGuard.setJoinValidator((team, player) => {
  if (!factionParties.active() || !factionSession.locked(player.server)) return true;
  factionSession.homeCache.clear();
  return !!factionSession.home(player.server, team);
});

ServerEvents.loaded(event => { factionParties.initialize(event.server); });
ServerEvents.tick(event => {
  if (!factionParties.initialized) factionParties.initialize(event.server);
  if (++factionParties.rankTick % 20 === 0) factionParties.permissions();
  if (!factionParties.active()) return;
  event.server.getPlayerList().getPlayers().forEach(player => {
    if (player instanceof FactionFakePlayer) return;
    let party = factionParties.party(player);
    if (factionParties.lastTeams.get(String(player.uuid)) !== String(party ? party.getId() : '')) factionParties.stages(player);
    if (!party && factionSession.locked(event.server)) factionParties.hold(player);
    else factionParties.pending.delete(String(player.uuid));
  });
});

PlayerEvents.loggedIn(event => {
  event.server.scheduleInTicks(1, () => {
    factionParties.stages(event.player);
    if (!factionSession.locked(event.server)) factionParties.choose(event.player);
  });
});
PlayerEvents.loggedOut(event => {
  factionParties.pending.delete(String(event.player.uuid));
  factionParties.lastTeams.delete(String(event.player.uuid));
});

ServerEvents.commandRegistry(event => {
  let commands = event.commands;
  let argument = () => commands.argument('id', FactionWord.word()).suggests((context, builder) => {
    let prefix = String(builder.getRemaining()).toLowerCase();
    factionDefinitions.factions.filter(faction => faction.id.startsWith(prefix)).forEach(faction => builder.suggest(faction.id));
    return builder.buildFuture();
  });
  let id = context => String(FactionWord.getString(context, 'id'));
  let player = context => FactionPlayerArgument.getPlayer(context, 'player');
  let stageMode = (name, manual) => commands.literal(name)
    .executes(context => factionParties.command(context.source,
      () => factionParties.stageMode(context.source, context.source.getPlayerOrException(), manual)))
    .then(commands.argument('player', FactionPlayerArgument.player())
      .executes(context => factionParties.command(context.source,
        () => factionParties.stageMode(context.source, player(context), manual))));
  event.register(commands.literal('faction')
    .then(commands.literal('stages').requires(source => source.hasPermission(2))
      .then(stageMode('manual', true)).then(stageMode('auto', false)))
    .then(commands.literal('choose').executes(context => factionParties.command(context.source, () => factionParties.choose(context.source.getPlayerOrException()))))
    .then(commands.literal('join').then(argument().executes(context => factionParties.command(context.source,
      () => factionParties.join(context.source.getPlayerOrException(), id(context), false)))))
    .then(commands.literal('assign').requires(source => source.hasPermission(2))
      .then(argument().then(commands.argument('player', FactionPlayerArgument.player())
        .executes(context => factionParties.command(context.source, () => factionParties.join(player(context), id(context), true))))))
    .then(commands.literal('remove').requires(source => source.hasPermission(2))
      .then(commands.argument('player', FactionPlayerArgument.player())
        .executes(context => factionParties.command(context.source, () => factionParties.remove(player(context)))))));
});

// Pending players can use chat to choose, but cannot play or teleport before selection.
for (let name of ['net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickBlock',
  'net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickItem',
  'net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$LeftClickBlock',
  'net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteract',
  'net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteractSpecific',
  'net.neoforged.neoforge.event.entity.player.AttackEntityEvent',
  'net.neoforged.neoforge.event.level.BlockEvent$BreakEvent',
  'net.neoforged.neoforge.event.level.BlockEvent$EntityPlaceEvent',
  'net.neoforged.neoforge.event.entity.EntityTeleportEvent',
  'net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent',
  'net.neoforged.neoforge.event.entity.item.ItemTossEvent']) {
  NativeEvents.onEvent(name, event => {
    let player = typeof event.getPlayer === 'function' ? event.getPlayer() : event.getEntity();
    if (player && factionParties.waiting(player) && event instanceof FactionCancelable) {
      if (name === 'net.neoforged.neoforge.event.entity.item.ItemTossEvent') player.give(event.getEntity().getItem());
      event.setCanceled(true);
    }
  });
}

NativeEvents.onEvent('net.neoforged.neoforge.event.entity.player.ItemEntityPickupEvent$Pre', event => {
  if (factionParties.waiting(event.getPlayer())) event.setCanPickup(Java.loadClass('net.neoforged.neoforge.common.util.TriState').FALSE);
});
