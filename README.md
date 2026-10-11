# Craftoria - 1.21

# Setup
Follow the instructions below to get your workspace setup:

## CurseForge App (Windows / Mac)
1. Download the [CurseForge App](https://curseforge.overwolf.com/) and [Git](https://git-scm.com/downloads) if you haven't already.

2. Fork and clone the repository to the Instances folder of the CurseForge App, the default path is `C:\Users\{UserName}\Documents\Curseforge\Minecraft\Instances`.

* Note: If you've previously used the Twitch App the path will most likely be `C:\Users\{UserName}\Documents\Twitch\Minecraft\Instances`.
3. Double click the script InstanceSyncSetup.bat to setup InstanceSync. It is found in the automation folder.

4. Open the CurseForge App and you should see the modpack. If you already had CurseForge App open, restart it.

You're done!

# Discord server

Official discord server (Team AOF): https://discord.gg/6rkdm48

## Faction sessions

This feature uses the pack's existing KubeJS, FTB Teams, FTB Chunks, FTB Ranks,
and FTB XMod Compat. No additional mod is required. FTB Chunks owns all claim
data, map display, and protection. Faction identities, progression stages, and
`FACTION_MAP` are unchanged.

Verified against Minecraft 1.21.1 / NeoForge 21.1.249, KubeJS
2101.7.2-build.377, FTB Chunks 2101.1.22, FTB Teams 2101.1.11,
FTB Ranks 2101.1.5, and FTB XMod Compat 21.1.12.

| Command | Who can use it | Effect |
| --- | --- | --- |
| `/session unlock` | Permission level 2 or console | Allows exploration and FTB claim/unclaim operations. |
| `/session lock` | Permission level 2 or console | Freezes claims and confines players to chunks claimed by anyone. |
| `/session info` | Permission level 2 or console | Shows the persistent session state. |
| `/factionhome set` | Current FTB party owner/officers | Sets the party's shared home while unlocked, on safe ground in its own claim. |
| `/factionhome info` | Party members | Shows the validated home or explains missing setup. |

Before locking, every nonempty FTB player party, including offline parties, must
have a safe home, and every online player must belong to a configured party.
Setup failures reject the lock and list what needs fixing. Homes follow the
current FTB party UUID, not scoreboard teams or progression-stage names.
This script does not create or merge parties. Keep the existing faction setup.

While locked, players in wilderness immediately return home; players already in
any claim stay there. Own, allied, enemy, and server claims all count. Adjacent
claims connect; unclaimed holes and gaps remain wilderness. Teleports to
disconnected claimed areas are allowed. Operators obey these rules too.
Leaving or disbanding a party, being kicked, or losing a valid home disconnects
affected players and alerts operators. New players without a configured party
must wait for an unlocked session. Joining another party uses that party's home.

Homes save dimension, position, and facing in server persistent NBT alongside the
existing `sessionLocked` flag. Restarting or reloading scripts preserves both.
An unset lock flag defaults to unlocked. Return teleports dismount players,
stop elytra flight, and clear velocity and fall distance. Every return checks
ownership and safe standing space, with at most 125 nearby candidates within
the saved home chunk. Keep faction homes on solid, dry ground away from hazards.

### Existing world migration

Back up the world and stop the server. Apply the following values under
`claiming` in the existing world's `serverconfig/ftbchunks-world.snbt` override.
The pack defaults are in `config/ftbchunks-world.snbt`:

```snbt
max_claimed_chunks: 2147483647
hard_team_claim_limit: 0
party_limit_mode: "largest"
max_idle_days_before_unclaim: 0
```

Keep all force-loading values unchanged. The script enforces these claim values
at runtime too, normalizes `ftbchunks.max_claimed` on existing FTB ranks, and
zeros extra-claim bonuses. Positive bonuses would overflow the maximum integer;
the admin bonus `set`/`add` commands are disabled. Do not add conflicting rank
overrides or change claim settings while the server is running. No claim expiry
or team allowance reduction should remove existing territory.

### Verification and release checks

Run `node --test automation/tests/session-lock.test.cjs` from the repository root
and `npx eslint .` from `kubejs`. CI runs both. Policy tests cover permissions,
claim cancellation, persistence, home preflight, rank/bonus normalization,
negative coordinates, dimensions, shared claims, gaps, invalid homes, and riders.

The pinned NeoForge/FTB/KubeJS staging server has also been exercised with
connected protocol clients: 626 claims, console and player permissions, frozen
bulk/admin operations, closure in wilderness, disconnected claimed teleports,
new-player rejection, unsafe-home disconnection, and reload/restart persistence
passed. The force-loading allowance remained 25. Before deploying to the full pack, use a disposable
multiplayer world and complete these checks with normal modded clients:

- Set each existing faction's home, lock from console and an operator, and check
  nonoperators cannot lock/unlock. Test missing homes and offline parties.
- Claim more than 500 chunks while unlocked; confirm force-loading limits stay
  unchanged. While locked, try map clicks/dragging, command radius claims,
  unclaim-all, admin claim-as/unclaim-as, and admin bulk removal. Inspect the
  authoritative claims afterward; bulk command summaries may count attempts.
- Walk/fly/ride across adjacent own, allied, enemy, and server claims. Test holes,
  diagonal corners, negative chunk edges, elytra, and fast modded vehicles.
- Test closure in wilderness, reconnect, death/respawn, portals, pearls, chorus,
  cross-dimension `/tp`, FTB Essentials, Waystones, and other modded travel.
  A claimed destination in a disconnected zone must remain accessible.
- Remove/block a home and change party membership: affected players must be
  disconnected, operators alerted, and existing claims retained. Unlock to repair
  setup, then confirm homes and lock state survive script reload and restart.
- Refresh the packwiz index after pack-file changes and before distribution.

Containment is server-enforced return teleportation, without border graphics or
collision. Native teleport events reject wilderness destinations beforehand when
the event supplies enough information; all travel paths receive a tick check.
Path checks use accepted client movement to detect skipped wilderness chunks.
Unhooked mod teleports and unusual server-driven vehicle motion cannot always
be distinguished by scripts; validate those mods on staging. The full pack's
GUI, vehicles, and Waystones still need normal-client acceptance testing.
Existing FTB building, interaction, and PvP permissions continue to apply;
enemy players can still meet or fight inside claimed territory.
