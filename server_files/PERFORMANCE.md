# Server performance

How to make the Craftoria Factions server run as well as possible without adding,
removing or updating any mod. Everything here is configuration.

## What the 14 Nov 2026 log showed

The log covers 17:19 to the crash at 17:56, with up to 11 players on a fresh world.

| Window | Players online | "Can't keep up" warnings | Worst lag |
| --- | --- | --- | --- |
| 17:20 | 8 | 7 | 5.7 s behind |
| 17:25 to 17:50 | 10 to 11 | 12 to 14 per 5 min | 9 to 13.6 s behind |
| 17:55 | 11 | 3 | 17.6 s behind |

The server ran at about half speed the whole session. There was no spark profile to rank
the causes exactly; these are the likely ones, biggest first:

1. **Chunk generation on a fresh world.** Every new area a player walks into runs the
   full modded world generator (90,000 recipes, dozens of worldgen mods).
2. **Distant Horizons generating LODs on the server.** DH 3.3.3 is installed on the
   server (it is not in this pack). Its defaults let every player request generated
   terrain 4096 blocks out at 20 requests per second, using the same world generator
   as item 1. Its world-gen threads were running all session. (The 26 DH "Unloaded
   chunk" errors at 17:56:47 came after the crash, during shutdown, and are harmless.)
3. **spark's background profiler** is on in the server's config (this repo ships it off).
   On Windows spark can't use async-profiler, so it falls back to its slower Java
   sampler, which keeps running all session.
4. **Anti-fly checks.** `allow-flight=false` made one player trip "kicked for floating
   too long" 519 times in 28 seconds (17:36:34 to 17:37:02).

Simple Voice Chat timeouts for every player at once (for example 17:36:09) are a side
effect of the lag, not a cause.

The crash itself was a separate bug: see the `fix: stop quest reward check from crashing
the dedicated server` commit.

## Apply these on the server

Do these in order and restart once at the end.

1. **server.properties.** Merge the keys from
   [`performance/server.properties.performance`](performance/server.properties.performance)
   into the server's `server.properties`. The two that matter most are
   `simulation-distance=6` and `view-distance=8`.
2. **JVM arguments.** Use [`performance/user_jvm_args.txt`](performance/user_jvm_args.txt).
   On Crafty, put the flags in the server's execution command. Set `-Xms` equal to
   `-Xmx`, sized to the host (see the comments in the file).
3. **Distant Horizons.** Edit the server's `config/DistantHorizons.toml` using
   [`performance/DistantHorizons.server-overrides.toml`](performance/DistantHorizons.server-overrides.toml).
   While the world is new, `generatorPlan = "DISABLED"` gives the biggest win. Switch
   to `SURFACE_ONLY` once the main areas have been explored.
4. **spark.** Make the server's `config/spark/config.json` match this repo's copy
   (`"backgroundProfiler": false`). Profile on demand instead, with
   `/spark profiler start --timeout 300` while the lag is happening, and keep the link it
   prints. That shows exactly which mod or block entity is expensive.
5. **Config sync.** The server's `config/` folder has drifted from this repo (spark is
   one example). Copy this repo's `config/` and `defaultconfigs/` over the server's,
   without deleting server-only files such as `DistantHorizons.toml`.

## Already in this pack

- `config/aiimprovements-common.toml`: `remove_look_random = true`. Mobs no longer run
  the idle look-around AI goal, so idle mobs stop turning their heads but otherwise
  behave the same. Set it back to `false` to undo.
- C2ME, ModernFix, FerriteCore, AllTheLeaks, Clumps, FastFurnace, FastWorkbench and
  AsyncLogger are already present with sensible configs. They were left as they are.

## Worth doing outside this repo

- **Pre-generate the world** before a session. Most of the lag came from generating new
  chunks while people played. That needs a pregeneration mod such as Chunky on the
  server, which this repo deliberately does not add.
- **Host CPU.** Minecraft's main thread is single-threaded. A host with fewer but faster
  cores beats one with many slow cores. If Crafty's "medium" tier can't hold 20 TPS with
  the settings above, upgrade the CPU tier before adding RAM.
- **Auto-restart.** Turn on Crafty's crash detection / auto-restart. After the crash the
  server hung for 60 seconds until the watchdog killed it.
