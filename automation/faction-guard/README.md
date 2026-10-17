# Faction permission guard

Original server-side guard for Minecraft 1.21.1 / NeoForge 21.1.249 and **FTB Teams
2101.1.11** and **FTB Quests 2101.1.36**. The lowcode mod injects small checks at the native party methods used
by FTB GUI packets. It includes no faction definitions or modified FTB classes.
The bundled jar is distributed directly by packwiz; install AStages from its
pinned `.pw.toml` entry separately.

Build with Python 3 and Java 21, against a fully installed Prism instance:

```powershell
python automation/faction-guard/build.py `
  "$env:APPDATA/PrismLauncher" `
  "$env:APPDATA/PrismLauncher/instances/Craftoria Factions Test/minecraft" `
  --java-bin "$env:APPDATA/PrismLauncher/java/java-runtime-delta/bin"
packwiz refresh
```

The script compiles against Prism's installed libraries and emits
`mods/craftoria-factions-guard-1.1.1.jar`. Build files go in ignored `.build/`.
Jar timestamps are fixed for reproducible output. Changing FTB Teams requires
reviewing every transformer descriptor, rebuilding, updating the exact dependency
in `resources/META-INF/neoforge.mods.toml`, and repeating runtime verification.

Run the policy suites from the repo root:

```powershell
node --test automation/tests/*.test.cjs
```

For native checks, use an isolated **disposable** NeoForge 21.1.249 server with
FTB Teams 2101.1.11, FTB Chunks 2101.1.22, FTB Ranks 2101.1.5, FTB Library
2101.1.36, FTB XMod Compat 21.1.12, Architectury, Rhino, KubeJS
2101.7.2-build.377, AStages 2.5.3, FTB Essentials 2101.1.10, and this guard. Copy the five faction/session/reward
server scripts, `kubejs/config/factions.json`, and pack FTB config defaults.
Copy `integration-probe.js` into that server's `kubejs/server_scripts/`, then run
`reload` and `factionprobe` from console. **Never copy this probe into a live world:**
it creates a synthetic test member, appoints it, then restores system ownership
and removes it. It also creates a test personal-team record. An interrupted probe
can temporarily leave that record in a faction; rerunning performs cleanup.

The probe checks actual transformed methods: nonoperator creation, owner transfer,
and disband rejection; protected system leave/kick/promote/demote; console owner
appointment through the native FTB command, nonmember rejection, home command
registration/completion, and operator-only spawn/back in managed and existing
worlds; and persistence after removing the last human/test member. The reward hook preserves native claim bookkeeping while suppressing delivery.
It checks
the permission error text so unrelated Java failures cannot pass a denial check.
Full client GUI clicks, connected player stage synchronization, and locked-session
interaction/teleport acceptance remain the normal-client checks in the root README.

During implementation, isolated fresh-world startup, reload, and restart were
checked without KubeJS errors, with four stable mapped party UUIDs. The native probe also checks actual reward forfeiture, later access, eligible
claims, and suppressed item delivery. The policy suites additionally cover the pending selection
state, stage transitions, home preflight, and restrictions on operator commands.
