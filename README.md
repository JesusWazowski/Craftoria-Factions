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
and FTB XMod Compat, plus pinned AStages 2.5.3 and the bundled faction permission
guard. FTB Chunks owns all claim data, map display, and protection. The existing
faction IDs and mod assignments are preserved in the shared document below.

Verified against Minecraft 1.21.1 / NeoForge 21.1.249, KubeJS
2101.7.2-build.377, FTB Chunks 2101.1.22, FTB Teams 2101.1.11,
FTB Ranks 2101.1.5, and FTB XMod Compat 21.1.12.

| Command | Who can use it | Effect |
| --- | --- | --- |
| `/session unlock` | Permission level 2 or console | Allows exploration and FTB claim/unclaim operations. |
| `/session lock` | Permission level 2 or console | Freezes claims and confines players to chunks claimed by anyone. |
| `/session info` | Permission level 2 or console | Shows the persistent session state. |
| `/sethome [party]` | Own party: owner/officers; explicit party: operators | Sets the selected party's home at your position while unlocked, within world bounds in that party's claim. |
| `/home` | Party members | Shows the validated home or explains missing setup. |

`/home` only reports the shared faction checkpoint; it never teleports. Travel
relies on player-built infrastructure. `/sethome` replaces `/faction home set`;
`/faction home` and `/factionhome` are removed. Essentials personal-home commands
are disabled for everyone, including operators. Saved personal-home data is kept
without migration. Native `/spawn` and `/back` remain operator-only; other travel
commands retain their existing behavior. **Fully restart after this update** so
Essentials and KubeJS register the correct commands.

Operators can use `/sethome <party>` to move another party's home
without joining it or holding an officer rank. The optional argument uses FTB's
case-sensitive short party identifiers. Use Tab completion to select the exact
identifier, especially for renamed parties. Stand in the **target party's claimed chunk**.
Omitting the argument keeps the existing owner/officer rules. This requires an
in-game player position; console cannot set a home. The session must be unlocked.

Before locking, every nonempty FTB player party, including offline parties, must
have a valid home. In managed faction worlds, unaffiliated online players do not
block locking: they are immediately frozen at their current position and sent a
fresh faction selection prompt. Selecting a faction sends them to its valid home
before releasing the hold, including joins through native FTB controls. Existing
unmanaged worlds still require online players to belong to a party. Missing
party homes reject the lock and list what needs fixing. Homes follow the
current FTB party UUID, not scoreboard teams or progression-stage names.
New worlds create the four faction parties automatically; reserved system members
do not count toward the home-readiness check. Existing worlds retain their parties.

On session closure or login while locked, players in wilderness return home;
players already in any claim stay there. Later wilderness crossings quietly return
to the most recent accepted claimed position, usually one tick behind. This keeps
players near the border instead of sending them across the map. Unsafe, missing,
or cross-dimension snapshots fall back to home. Snapshots include height and
facing, allow collision-free airborne positions, and are not saved across restart. Own, allied, enemy, and server claims all count. Adjacent
claims connect; unclaimed holes and gaps remain wilderness. Teleports to
disconnected claimed areas are allowed. Operators obey these rules too.
Members who lose a valid home are disconnected and operators are alerted. In new
faction worlds, unaffiliated arrivals and removed members instead wait at their
login/current position with gameplay interactions disabled. Click a faction name
in chat, or use `/faction choose`; selection requires that faction's valid home
and sends the player directly there. Existing worlds retain the original
unaffiliated-player rejection. Joining another party uses that party's home.

Homes save dimension, position, and facing in server persistent NBT alongside the
existing `sessionLocked` flag. Restarting or reloading scripts preserves both.
An unset lock flag defaults to unlocked. Return teleports dismount players,
stop elytra flight, and clear velocity and fall distance. Every return checks
ownership, world-height bounds, and full-body containment in the saved home
chunk, with at most 125 nearby candidates within that chunk. Home validation
does not inspect supporting blocks, fluids, hazards, or collisions; changing
blocks at a checkpoint does not invalidate it.

### Shared faction definitions and parties

Edit `kubejs/config/factions.json` while the server is stopped, then restart.
Both recipe gating and party selection read this validated document. Its four
factions are Stargazers, Mechanists, Spellcasters, and Ritualists. Stargazers and
Mechanists share `science_shared`; Spellcasters and Ritualists share `magic_shared`.
For example, a faction entry has this shape (retain its complete existing mod list):

```json
{
  "id": "stargazers",
  "name": "Stargazers",
  "mods": ["ae2"],
  "sharedGroups": ["science_shared"]
}
```

The top-level `factions` and `sharedGroups` arrays contain entries with stable
lowercase IDs; groups have `id` and `mods`. Keep `version` at `1`. Every mod must
belong to exactly one faction or shared group. Duplicate IDs, conflicting mod
assignments, and unknown group references are rejected before creating parties.
Change names or mod assignments as needed; names are used for selection and
initial party creation, and owners can rename their party independently. Keep
existing IDs stable. Adding or removing factions/groups is a **new-world
customization**, not a migration of an existing save. Restart after editing the
document or changing either dependency; do not rely on live recipe reloads.

Only an unused new world (no played ticks, known players, or teams) receives
parties. Existing worlds receive no automatic party creation, adoption, or
membership migration. Party UUID mappings are stored in FTB Teams manager data
inside the save and survive script reloads and restarts. Back up the whole save;
a missing mapped party is an error and is not silently recreated.

| Command | Who can use it | Effect |
| --- | --- | --- |
| `/faction choose` | Unaffiliated players | Redisplays the selection prompt and blue, underlined `[Faction Name]` links. |
| `/faction join <id>` | Unaffiliated players | Joins the selected faction as an ordinary member, even if invite-only. |
| `/ftbteams party transfer_ownership_for <party> <player>` | Operator/console | Appoints an existing member as party owner using native FTB completion. |
| `/faction assign <id> <player>` | Operator/console | Moves an online player to a faction; validates its home first while locked. |
| `/faction remove <player>` | Operator/console | Removes an online player; restores system ownership first if needed. |

Faction IDs support partial-ID Tab completion in `join` and `assign`.
Assignment uses **faction first**; the old
player-first `assign` syntax is replaced.

Use FTB's normal [team management commands and GUI](https://docs.feed-the-beast.com/mod-docs/mods/suite/Teams/)
for invitations, officers, settings, and ownership. `/faction owner` is removed;
the native ownership command takes a Tab-completed party identifier and a member.

Appointed owners need not be operators. They retain FTB settings, invitations,
kicks, officer promotion/demotion, alliances, and home management. Creation,
voluntary leaving, ownership transfer, and disbanding require an operator.
Changing membership leaves party UUIDs, territory, and saved homes intact.
Reserved system identities hold initial ownership and remain protected members
after appointment, so removing the last human does not delete the faction.
Do not disband a configured faction, even as an operator: its mapping would then
require restoring a backup.

Two generated FTB ranks (`faction_members` and `faction_operators`) enforce the
`command.ftbteams.party.create`, `.leave`, `.transfer_ownership`,
`.transfer_ownership_for`, and `command.ftbteams.force-disband` permissions in
managed worlds. Their settings are maintained by the script. The bundled guard
also checks native GUI paths, protects system identities, and enforces quest reward
forfeiture. It contains no faction names or mod lists and requires exactly FTB
Teams 2101.1.11 and FTB Quests 2101.1.36. Both are pinned. Rebuild and reverify it
before updating either mod. Its source and build instructions are in
`automation/faction-guard/`.

Two additional maintained ranks (`infrastructure_members` and
`infrastructure_operators`) deny/allow `command.spawn` and `command.back` in
existing and new worlds using [Essentials rank permissions](https://docs.feed-the-beast.com/mod-docs/mods/suite/Essentials/Ranks_Integration/).
Unrelated rank settings are preserved.

Membership uses the documented [KubeJS FTB Teams events](https://kubejs.com/wiki/addons/ftb-xmod-compat)
for joins and departures, with tick reconciliation after reloads. It synchronizes **actual AStages stages**, including exclusive and
shared stages, on login, changes, and script reload. Only IDs controlled by the
faction document are removed; unrelated progression such as `first_join` is
preserved. KubeJS's separate stage storage is not used as a substitute. AStages
recipe restrictions still load in existing worlds, but their membership/stages
are not automatically migrated by this feature.

### Quest rewards and faction access

In managed faction worlds, FTB quest progress remains shared. When claiming a
reward, the guard checks the parent quest's item tasks against the player's
current faction and shared mod groups. If any item task has no accessible option,
**the reward is permanently forfeited**: FTB records the claim but delivers
nothing. Automatic claims, claim-all, and choice rewards use the same check.
Changing factions afterward cannot recover that forfeited claim. Existing rewards
already delivered are not revoked, and existing unmanaged worlds retain normal
quest behavior. FTB's ordinary per-player/team-reward and repeatable-quest claim
semantics remain in effect; a team reward's forfeiture affects its shared claim.

Tags and filters use FTB's matching-item list, and a task with an accessible
alternative is permitted. Vanilla and unassigned mods remain accessible. Unresolved
filters are left unrestricted and logged once per quest until cache reload. This
is an item-requirement rule: non-item tasks and reward contents are not screened.
Quest requirements are cached, then invalidated when scripts, quests, or datapacks
reload. Operators obey the reward rule too.

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

Run `node --test automation/tests/*.test.cjs` from the repository root
and `npx eslint .` from `kubejs`. CI runs lint and all test suites. Faction tests cover definition validation,
new-world initialization, identity persistence, stage reconciliation, selection,
operator commands, locked-session holding, partial-ID completion, hyperlink
formatting, native membership events, existing-world travel permissions, quest
requirement checks, cache reload, and local boundary returns. Session policy tests cover permissions,
claim cancellation, persistence, home preflight, rank/bonus normalization,
negative coordinates, dimensions, shared claims, gaps, invalid homes, and riders.

The consolidated integration passes 47 automated policy tests and 36 isolated
native checks, including console/operator ownership transfer, nonmember rejection,
protected system membership, personal-home command removal, target completion,
and spawn/back permissions in managed and existing-world contexts. Restart and
script reload preserve four party UUIDs. GUI clicks and connected-player event
acceptance still require a normal modded client.

The pinned NeoForge/FTB/KubeJS staging server has also been exercised with
connected protocol clients: 626 claims, console and player permissions, frozen
bulk/admin operations, closure in wilderness, disconnected claimed teleports,
new-player rejection, invalid-home disconnection, and reload/restart persistence
passed. The force-loading allowance remained 25. Before deploying to the full pack, use a disposable
multiplayer world and complete these checks with normal modded clients:

- Set each existing faction's home, lock from console and an operator, and check
  nonoperators cannot lock/unlock. Test missing homes and offline parties.
- Claim more than 500 chunks while unlocked; confirm force-loading limits stay
  unchanged. While locked, try map clicks/dragging, command radius claims,
  unclaim-all, admin claim-as/unclaim-as, and admin bulk removal. Inspect the
  authoritative claims afterward; bulk command summaries may count attempts.
- Walk/fly/ride across adjacent own, allied, enemy, and server claims. Cross a
  wilderness boundary: verify a quiet return near the departure block, not home.
  Check closure/login in wilderness and unsafe-snapshot home fallback. Test holes,
  diagonal corners, negative chunk edges, elytra, and fast modded vehicles.
- Test closure in wilderness, reconnect, death/respawn, portals, pearls, chorus,
  cross-dimension `/tp`, FTB Essentials, Waystones, and other modded travel.
  A claimed destination in a disconnected zone must remain accessible.
- Unclaim a home: affected members must be disconnected and operators
  alerted. Remove a member in a new faction world: they must enter selection
  holding instead. Existing claims must remain intact. Unlock to repair
  setup, then confirm homes and lock state survive script reload and restart.
- In a disposable new world, verify four parties exist before joining. Try
  create, leave, transfer ownership, and disband through commands and the FTB
  GUI as a nonoperator owner; all must be denied. Confirm invitations, kicks,
  officer management, settings, alliances, and homes still work. Appoint an
  owner, remove the last human, reload, and restart; verify UUIDs and empty
  parties persist. During a lock, join without a party, try interactions and
  movement, and select a faction with a valid home. Confirm recipe access follows
  membership and unrelated stages survive. Use **Craftoria Factions Test** for
  full-pack client acceptance; launching it applies the local packwiz update.
- Claim an inaccessible-mod quest through individual, automatic, choice, and
  claim-all paths: verify no reward is delivered and the claim is consumed. Move
  the player to an eligible faction and restart: verify forfeiture persists.
  Confirm eligible, shared-mod, and vanilla quest rewards work normally.
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

### Packwiz hosting on GitHub Pages

Use `https://jesuswazowski.github.io/Craftoria-Factions/pack.toml` as the
packwiz bootstrap pack URL. GitHub Pages publishes the `main` branch root.
The root `.nojekyll` file disables Jekyll so in-game Markdown guides and all
other pack files are served unchanged, preserving packwiz checksums.

Before publishing pack updates, run `packwiz refresh` from a clean checkout
of the files being published. The index must not reference local-only or
Git-ignored files; every indexed file must exist in the repository. Commit
`index.toml` and the corresponding `pack.toml` hash together, then confirm
that the Pages build and deployment succeeds after pushing.
