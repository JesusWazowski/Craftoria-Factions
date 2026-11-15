// Deployment-only script for DH 3.3.3 / NeoForge 1.21.1. Not part of packwiz.
// All queue transitions run on the server thread; no credentials or RCON needed.
const CFP = (() => {
  const Shared = Java.loadClass('com.seibel.distanthorizons.core.api.internal.SharedApi');
  const WG = Java.loadClass('com.seibel.distanthorizons.core.config.Config$Common$WorldGenerator');
  const Mode = Java.loadClass('com.seibel.distanthorizons.api.enums.worldGeneration.EDhApiDistantGeneratorMode');
  const Plan = Java.loadClass('com.seibel.distanthorizons.api.enums.worldGeneration.EDhApiGeneratorPlan');
  const radiusChunks = 150;
  const stateKey = 'craftoriaPregenQueueV1';
  let worldServer;
  const order = ['minecraft:overworld', 'minecraft:the_nether',
    'the_bumblezone:the_bumblezone', 'twilightforest:twilight_forest',
    'eternal_starlight:starlight', 'crystal_chronicles:alpha',
    'spectrum:deeper_down', 'spectrum:the_conservatory', 'minecraft:the_end'];
  const excluded = ['jamd:mining', 'jamd:nether', 'jamd:end', 'javd:void',
    'compactmachines:compact_world', 'irons_spellbooks:pocket_dimension', 'neovitae:dungeon', 'ae2:spatial_storage'];
  let state = null, future = null, ticks = 0, ready = false, fatal = false;
  function log(s) { console.info('[CFPregen] ' + s); }
  function manager() { return Shared.getAbstractDhWorld().getPregenManager(); }
  function save() {
    state.updated = new Date().toISOString();
    worldServer.persistentData.putString(stateKey, JSON.stringify(state));
    worldServer.runCommandSilent('save-all flush');
  }
  function load(server) {
    worldServer = server;
    const ids = [];
    server.getAllLevels().forEach(level => ids.push(String(level.dimension)));
    log('Registered dimensions: ' + ids.join(', '));
    const unknown = ids.filter(id => order.indexOf(id) < 0 && excluded.indexOf(id) < 0);
    if (unknown.length) throw new Error('Review unclassified dimensions: ' + unknown.join(', '));
    if (server.persistentData.contains(stateKey)) {
      state = JSON.parse(String(server.persistentData.getString(stateKey)));
      if (state.schema !== 1 || state.seed !== '-2396434326660347612' ||
          ![radiusChunks, 377].includes(state.radiusChunks) || !Array.isArray(state.tasks) ||
          !Number.isInteger(state.next) || state.next < 0 || state.next > state.tasks.length ||
          state.tasks.some(id => order.indexOf(id) < 0 || ids.indexOf(id) < 0))
        throw new Error('Queue state invalid or dimensions changed; review saved queue state');
    } else {
      state = {schema: 1, seed: '-2396434326660347612', radiusChunks: radiusChunks,
        center: [0, 0], tasks: order.filter(id => ids.indexOf(id) >= 0),
        next: 0, enabled: false, active: null, error: null};
      save();
    }
    if (Number(server.overworld().getSeed()) !== Number(state.seed))
      throw new Error('World seed does not match the authorized seed');
    // Completed jobs at the old radius also cover the smaller target.
    // Keep the queue paused and verify any unfinished job at the new radius.
    if (state.radiusChunks === 377) {
      state.radiusChunks = radiusChunks;
      state.enabled = false;
      state.active = null;
      state.error = null;
      save();
    }
    // The operator verified that the manual 150-chunk Overworld job finished.
    // Apply that completion and resume once, so later pauses survive reloads.
    if (!state.resumedAfterManualOverworld150 ||
        (state.next === 1 && /redeclaration of var (command|dhCommand)\b/.test(String(state.error)))) {
      if (state.tasks[0] !== 'minecraft:overworld' || manager().getRunningPregen() !== null)
        throw new Error('Cannot apply the manual Overworld completion while DH is busy or the queue order has changed');
      if (state.next === 0) state.next = 1;
      state.active = null;
      state.error = null;
      state.enabled = state.next < state.tasks.length;
      state.resumedAfterManualOverworld150 = true;
      save();
      log('Recorded manual Overworld completion at 150 chunks.');
    }
    log('Queue loaded: ' + state.tasks.join(' -> '));
    ready = true;
  }
  function fail(error) {
    fatal = true;
    if (state) { state.enabled = false; state.error = String(error); try { save(); } catch (_) {} }
    log('HALTED: ' + error);
  }
  function tick(server) {
    if (++ticks % 100 !== 0 || fatal) return;
    try {
      if (!ready) load(server);
      if (future) {
        if (!future.isDone()) return;
        if (future.isCancelled() || future.isCompletedExceptionally()) {
          future = null;
          throw new Error('DH task cancelled or failed; unfinished dimension retained. Use resume after review.');
        }
        future.join();
        future = null;
        log('Completed ' + state.tasks[state.next]);
        state.next++;
        state.active = null;
        save();
      }
      if (!state.enabled) return;
      if (state.next === state.tasks.length) {
        state.enabled = false;
        save();
        log('All queued dimensions complete.');
        return;
      }
      if (manager().getRunningPregen() !== null)
        throw new Error('Another DH task is running; queue will not take ownership of it');
      // Reassert exact mode for each task, including after a process restart.
      WG.generatorPlan.set(Plan.CHUNKS_ONLY);
      WG.chunkGeneratorMode.set(Mode.INTERNAL_SERVER);
      if (String(WG.generatorPlan.get()) !== 'CHUNKS_ONLY' ||
          String(WG.chunkGeneratorMode.get()) !== 'INTERNAL_SERVER')
        throw new Error('Could not enable Full generation');
      state.active = state.tasks[state.next];
      save();
      log('Starting Full generation: dh pregen start ' + state.active + ' 0 0 ' + radiusChunks);
      server.runCommandSilent('dh pregen start ' + state.active + ' 0 0 ' + radiusChunks);
      future = manager().getRunningPregen();
      if (future === null) throw new Error('DH did not provide a running task; completion not assumed');
    } catch (error) { fail(error); }
  }
  function command(source, action) {
    try {
      if (!ready) load(source.server);
      if (action === 'pause') {
        state.enabled = false;
        save();
        if (future && !future.isDone()) future.cancel(true);
        future = null;
        log('Paused; current dimension remains unfinished.');
      } else if (action === 'resume') {
        if (manager().getRunningPregen() !== null && future === null)
          throw new Error('Unowned DH task is running; stop it before resuming');
        fatal = false;
        state.error = null;
        state.enabled = true;
        save();
      }
      log(JSON.stringify(state));
      log('DH: ' + manager().getStatusString());
      return 1;
    } catch (error) { log('Command failed: ' + error); return 0; }
  }
  return {tick: tick, command: command};
})();
ServerEvents.tick(event => CFP.tick(event.server));
ServerEvents.commandRegistry(event => {
  const c = event.commands;
  let root = c.literal('cfpregen').requires(source => source.hasPermission(4) && source.getEntity() === null);
  ['status', 'resume', 'pause'].forEach(action => {
    root = root.then(c.literal(action).executes(ctx => CFP.command(ctx.source, action)));
  });
  event.register(root);
});
