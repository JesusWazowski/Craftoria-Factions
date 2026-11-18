// Deployment-only script for DH 3.3.3 / NeoForge 1.21.1. Not part of packwiz.
const CFP = (() => {
  const Shared = Java.loadClass('com.seibel.distanthorizons.core.api.internal.SharedApi');
  const WG = Java.loadClass('com.seibel.distanthorizons.core.config.Config$Common$WorldGenerator');
  const Mode = Java.loadClass('com.seibel.distanthorizons.api.enums.worldGeneration.EDhApiDistantGeneratorMode');
  const Plan = Java.loadClass('com.seibel.distanthorizons.api.enums.worldGeneration.EDhApiGeneratorPlan');
  const IdentityHashMap = Java.loadClass('java.util.IdentityHashMap');
  const radii = [250, 320];
  const stateKey = 'craftoriaPregenQueueV2';
  const seed = '-2396434326660347612';
  const order = ['minecraft:overworld', 'minecraft:the_nether',
    'the_bumblezone:the_bumblezone', 'twilightforest:twilight_forest',
    'eternal_starlight:starlight', 'crystal_chronicles:alpha',
    'spectrum:deeper_down', 'spectrum:the_conservatory', 'minecraft:the_end'];
  const excluded = ['jamd:mining', 'jamd:nether', 'jamd:end', 'javd:void',
    'compactmachines:compact_world', 'irons_spellbooks:pocket_dimension', 'neovitae:dungeon', 'ae2:spatial_storage'];

  let worldServer, state = null, job = null, idleTicks = 0, ready = false, fatal = false;
  let waitingForOtherJob = false;
  // Rhino can reject repeated block-scoped declarations in server callbacks.
  function log(message) { console.info('[CFPregen] ' + message); }
  function manager() { return Shared.getAbstractDhWorld().getPregenManager(); }
  function save() {
    worldServer.persistentData.putString(stateKey, JSON.stringify(state));
  }
  function load(server) {
    if (Number(server.overworld().getSeed()) !== Number(seed))
      throw new Error('World seed does not match the authorized seed');
    var ids = [];
    server.getAllLevels().forEach(level => ids.push(String(level.dimension)));
    var unknown = ids.filter(id => !order.includes(id) && !excluded.includes(id));
    if (unknown.length) throw new Error('Review unclassified dimensions: ' + unknown.join(', '));
    var tasks = order.filter(id => ids.includes(id));
    worldServer = server;
    if (server.persistentData.contains(stateKey)) {
      var saved = JSON.parse(String(server.persistentData.getString(stateKey)));
      if (saved.schema !== 2 || saved.seed !== seed ||
          JSON.stringify(saved.radii) !== JSON.stringify(radii) ||
          JSON.stringify(saved.tasks) !== JSON.stringify(tasks) ||
          !Number.isInteger(saved.pass) || saved.pass < 0 || saved.pass > radii.length ||
          !Number.isInteger(saved.next) || saved.next < 0 || saved.next > tasks.length ||
          (saved.pass === radii.length && saved.next !== 0) ||
          typeof saved.enabled !== 'boolean') {
        throw new Error('Saved queue state is invalid or the dimension list has changed');
      }
      state = saved;
    } else {
      // Older runs used different radii. Keep their world data and track both new passes separately.
      state = {schema: 2, seed: seed, radii: radii, tasks: tasks, pass: 0,
        next: 0, enabled: true, error: null};
      save();
    }
    ready = true;
    log('Queue loaded: ' + tasks.join(' -> '));
  }
  function fail(error) {
    fatal = true;
    if (state) {
      state.enabled = false;
      state.error = String(error);
      try { save(); } catch (_) {}
    }
    log('HALTED: ' + error);
  }
  function stopJob() {
    if (!job || job.stopRequested || job.future.isDone()) return;
    var running = manager().getRunningPregen();
    // Rhino hides Object.equals on the DH future. Compare the underlying Java objects by identity.
    var owned = new IdentityHashMap();
    owned.put(job.future, true);
    if (running === null || !owned.containsKey(running))
      throw new Error('DH no longer identifies the running task as queue-owned');
    worldServer.runCommandSilent('dh pregen stop');
    job.stopRequested = true;
    log('Stopping ' + job.dimension + ' at radius ' + job.radius +
      '; the queue will retry the same dimension when eligible.');
  }
  function updateJob() {
    if (!job) return;
    if (!job.future.isDone()) {
      if (job.stopRequested && ++job.stopWaitTicks >= 200)
        throw new Error('DH did not finish stopping. Check dh pregen status before resuming.');
      return;
    }
    var finished = job;
    job = null;
    if (finished.stopRequested) return;
    if (finished.future.isCancelled() || finished.future.isCompletedExceptionally())
      throw new Error('DH task cancelled or failed. Review before resuming.');
    finished.future.join();
    state.next++;
    save();
    log('Completed ' + finished.dimension + ' at radius ' + finished.radius);
  }
  function finishPass() {
    var size = 2 * radii[state.pass] * 16;
    // The vanilla border takes the full side length, and the queue generates around 0,0.
    var border = worldServer.overworld().getWorldBorder();
    if (border.getSize() > size) {
      log('Keeping the existing Overworld border width of ' + border.getSize() +
        ' blocks because the planned ' + size + '-block width would shrink it.');
    } else {
      border.setCenter(0, 0);
      border.setSize(size);
      if (border.getSize() !== size || border.getCenterX() !== 0 || border.getCenterZ() !== 0)
        throw new Error('Could not apply the Overworld border');
      log('Overworld border width is ' + size + ' blocks, centered at 0,0.');
    }
    state.pass++;
    state.next = 0;
    if (state.pass === radii.length) state.enabled = false;
    save();
    log('Finished all dimensions at radius ' + radii[state.pass - 1] + ' chunks.');
  }
  function startJob() {
    WG.generatorPlan.set(Plan.CHUNKS_ONLY);
    WG.chunkGeneratorMode.set(Mode.INTERNAL_SERVER);
    if (String(WG.generatorPlan.get()) !== 'CHUNKS_ONLY' ||
        String(WG.chunkGeneratorMode.get()) !== 'INTERNAL_SERVER')
      throw new Error('Could not enable Full generation');
    var dimension = state.tasks[state.next];
    var radius = radii[state.pass];
    var start = 'dh pregen start ' + dimension + ' 0 0 ' + radius;
    log('Starting Full generation: ' + start);
    worldServer.runCommandSilent(start);
    var running = manager().getRunningPregen();
    if (running === null) throw new Error('DH did not provide a running task; completion not assumed');
    job = {dimension: dimension, radius: radius, future: running,
      stopRequested: false, stopWaitTicks: 0};
  }
  function tick(server) {
    var occupied = server.getPlayerList().getPlayerCount() > 0;
    idleTicks = occupied ? 0 : Math.min(100, idleTicks + 1);
    try {
      // Check owned work every tick so a login requests a stop promptly.
      if (job) {
        if (fatal) {
          if (job.future.isDone()) job = null;
          return;
        }
        updateJob();
        if (job && (occupied || !state.enabled)) stopJob();
      }
      if (fatal || job || idleTicks < 100) return;
      if (!ready) load(server);
      if (!state.enabled || state.pass === radii.length) return;
      if (manager().getRunningPregen() !== null) {
        if (!waitingForOtherJob) log('Waiting for DH to become idle before starting a queued task.');
        waitingForOtherJob = true;
        return;
      }
      waitingForOtherJob = false;
      if (state.next === state.tasks.length) {
        finishPass();
        return;
      }
      startJob();
    } catch (error) {
      if (!fatal) fail(error);
    }
  }
  function command(source, action) {
    try {
      if (!ready) load(source.server);
      if (action === 'pause') {
        state.enabled = false;
        save();
        updateJob();
        stopJob();
      } else if (action === 'resume' && state.pass < radii.length) {
        if (fatal && job && !job.future.isDone())
          throw new Error('DH still has the previous task in flight');
        if (fatal) job = null;
        fatal = false;
        state.error = null;
        state.enabled = true;
        save();
      }
      log(JSON.stringify({queue: state, players: worldServer.getPlayerList().getPlayerCount(),
        active: job ? {dimension: job.dimension, radius: job.radius, stopping: job.stopRequested} : null}));
      log('DH: ' + manager().getStatusString());
      return 1;
    } catch (error) {
      log('Command failed: ' + error);
      return 0;
    }
  }
  return {tick: tick, command: command};
})();

ServerEvents.tick(event => CFP.tick(event.server));
ServerEvents.commandRegistry(event => {
  var c = event.commands;
  var root = c.literal('cfpregen').requires(source => source.hasPermission(4) && source.getEntity() === null);
  ['status', 'resume', 'pause'].forEach(action => {
    root = root.then(c.literal(action).executes(ctx => CFP.command(ctx.source, action)));
  });
  event.register(root);
});
