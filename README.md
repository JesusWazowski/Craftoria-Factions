# Craftoria - 1.21

## Faction content design handoff

[FACTION_CONTENT_DESIGN.md](FACTION_CONTENT_DESIGN.md) records the faction
identities, content-sorting principles, current exceptions, and assignment
snapshot for further gameplay research. It covers content beyond crafting
recipes and provides distinctions for later quest classification without
specifying a milestone system. Implementation and operating details remain below.

## AdachiRei-nui recipe compatibility

`kubejs/server_scripts/Mods/AdachiReiNui/Recipes.js` restores the four crafting
recipes from AdachiRei-nui NeoForge v1.1.5 on Minecraft 1.21.1 without editing
the mod JAR. Its bundled recipes use the obsolete `recipes/` directory and
`result.item` format. The script preserves the original shaped patterns,
ingredients, recipe IDs, and yields: one of each stuffed Rei variant, or eight
Adachi Rei's blocks from one Stuffed Adachi Rei surrounded by eight white wool.

These are temporary fixes. On every AdachiRei-nui version change, check and
validate all four native recipes; remove each workaround once its native recipe
works, and delete the script when all four are fixed. Version changes alone do
not prove the recipes are repaired. Reload server data with `/reload` or restart
to apply the script. Verify all four recipes in **Craftoria Factions Test**.

## Recipes from local additions

The 2026-10-17 static audit against the locally available `upstream/main`
(`d9b70f8c6`) covers 439 recipe JSON files in added mods and OpenLoader packs,
including disabled/overridden recipes. Source versions, recipe types, and
ingredient references are recorded in `automation/additional-recipes-audit.json`.
Packwiz-managed mod archives were checked against their pinned download hashes.

`kubejs/server_scripts/Mods/ImmersiveAircraft/Unification.js` explicitly converts
Create iron, copper, and brass sheets to `#c:plates/iron`, `#c:plates/copper`, and
`#c:plates/brass` in aircraft recipe namespaces. This covers ten recipes in the
Create Immersive Aircrafts datapack, retaining their patterns and yields. The
existing Almost Unified priorities select Modern Industrialization iron/copper
plates and Create brass sheets, while accepting other items in those tags.

Big Cannons (151 recipes) and Radars (18) already use common plate/metal tags.
Big Cannons bronze/steel crafting and Create processing outputs are covered by
the existing Almost Unified material rules. Its cast iron, nethersteel, cannon
parts, assembly intermediates, and molten fluids remain distinct. The Man of
Many Planes datapack, Compact Machines pack, CC:Tweaked, FramedBlocksPlus, and
Plushie Buddies introduce no additional plate substitutions; their shared
materials use the existing global rules. The AdachiRei-nui repair is documented
above. Source inspection does not confirm the final runtime recipe registry.

After installing in **Craftoria Factions Test**, check the aircraft propeller,
hull reinforcement, eco engine, cannon mount, radar dish, and bronze/steel
processing recipes with the preferred materials. Inspect KubeJS/Almost Unified
logs for reload errors. No Minecraft instance was launched for this audit.

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
lowercase IDs; groups have `id` and `mods`. Keep `version` at `1`. Restricted mods
belong to exactly one faction or shared group. `unrestrictedMods` records explicit
Everyone decisions without adding a stage or party; other unassigned mods are
also unrestricted. Duplicate IDs, conflicting mod
assignments, and unknown group references are rejected before creating parties.
Change names or mod assignments as needed; names are used for selection and
initial party creation, and owners can rename their party independently. Keep
existing IDs stable. Adding or removing factions/groups is a **new-world
customization**, not a migration of an existing save. Restart after editing the
document or changing either dependency; do not rely on live recipe reloads.

### Recipe access and balance decisions (October 26, 2026)

Addon assignments follow their parents except for the explicitly chosen
cross-mod integrations. Everyone includes CC:Tweaked and its addons, Farmer's
Delight and Ars Delight, Flux Networks, Functional Storage, Sophisticated
Storage in Motion, Compact Machines, Logistics Networks, LaserIO, More Red,
Little Big Redstone, SFM, and the other explicitly unrestricted utilities in
`factions.json`. Everyone does not grant a stage or create a fifth faction.
Twilight Delight remains Ritualists. Both Modular Routers connectors follow
Modular Routers in `science_shared`. Integrated Dynamics and its addons,
including their compatibility namespaces, use `magic_shared`.

`kubejs/config/faction_recipe_overrides.json` lists recipes available to everyone
despite their mod's faction assignment. The pinned AStages 2.5.3
`ARecipeModRestriction.ignoreItems(String...)` method takes **recipe IDs**, not
item IDs. It excludes only those exact IDs from the matching recipe-namespace
restriction. The configured exceptions cover both directions of AE2 interface,
pattern-provider and energy-acceptor block/cable-part conversions, and all six
compression/decompression recipes across Ars experience, greater experience,
giant experience and gargantuan experience gems. Initial AE2 device crafting,
other Ars equipment, and unrelated conversion recipes retain their normal gates.

The October 26 conversion expansion additionally exempts the 168 recipe IDs for
the 85 reviewed one-item-in/one-item-out reversible pairs, plus all 189 entries
in the reviewed state-reset/disassembly list. The exact groups and prior 12-ID
baseline are recorded in `automation/faction-recipe-override-audit.json`; the
runtime document now contains 369 unique recipe IDs. Other compression and
decompression exceptions were not added. The six existing XP-gem conversion
exceptions remain as previously approved. Recipe exceptions do not create
new item-task exemptions for quest rewards.

These reset/disassembly recipes are real recipe-manager definitions, generally
loaded from JSON whose `type` selects custom Java matching/result code in the
mod. The reviewed list contains 170 AE2-style cell-disassembly definitions,
seven crafting-unit transformations, five Integrated Dynamics clears, one
Mekanism clear, one Pipez clear, and four Spectrum clears. It also contains
one ordinary XyCraft stonecutting entry caught by the original scan; that exact
ID is included for completeness but is outside the crafting-table gate.

**Startup troubleshooting watchpoint:** if new cross-faction crafting bugs,
configuration loss, unexpected component refunds, or reset/disassembly output
problems appear after this update, check these custom serializers first. Save
the recipe ID, mod version, faction/stages, exact input stack/components and
observed result, and compare behavior with an eligible faction in a disposable
test world. An exception changes eligibility only; it does not rewrite the
serializer or guarantee its component handling. Use the audit's
`stateResetAndDisassembly` list to identify specific suspect exception IDs;
remove only the relevant IDs from `recipeIds` while investigating and restart.
Do not alter compression recipes or disable faction gating globally as a
workaround. Full-pack client acceptance remains pending; Minecraft was not
launched for this change.

The same document's `publicQuestItems` exempts those four XP-gem items from the
faction quest-reward item-task check. They are generic XP tokens for machines
and quests; this does not exempt other requirements in the same quest or change
quest progress sharing. AE2 conversion outputs are not generally exempted from
quest checks. Recipe restrictions match recipe-ID namespaces, whereas quest
checks match item-ID namespaces; a pack-authored cross-namespace recipe can
therefore have different access. These overrides do not change existing recipes,
ingredients, output quantities, stored item components, or machine access.

The optional `recipeNamespaceAliases` object in `factions.json` maps a recipe
namespace to an assigned mod ID. XyCraft's native recipes use `xycraft:`, so
`"xycraft": "xycraft_world"` makes them follow the XyCraft family's science-shared
assignment. Alias targets must exist in the assigned or explicit unrestricted
mod lists; aliases cannot overlap actual configured mod IDs. This adds no stage
or item restriction. Other pack-generated `craftoria:` recipes retain their
existing namespace behavior.

Keep the following balance decisions visible when revisiting assignments:

- Farmer's Delight, including Ars Delight, is an Everyone baseline and a possible
  content addition for an unpopular faction. Always move Ars Delight with it.
- Functional Storage is Everyone and a possible logistical boost for a faction
  that lacks storage options.
- Modular Routers is science-shared, with Everyone as a future option. Keep both
  its Mekanism and MI connectors with it.
- After reviewing the two science factions side by side, MI and its addons,
  including Modern Dynamics, remain Mechanists. Replication is `science_shared`.
  This keeps a substantial industrial progression path for each science faction
  while sharing access to replication. Preserve this decision unless a later
  balance review revisits MI/Mekanism replication progression and HNN farms.
- Powah remains Stargazers; reconsider Mechanists if they lose MI.

Restart after applying faction or override changes. No automatic world/party
migration is performed. The [grouped faction review](docs/mod-faction-review.md) and
[conversion override review](docs/recipe-conversion-review.md) are tracked
decision aids, not distributable gameplay configuration.

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

### Manual stages for testing

Normal managed-world behavior makes faction stages follow party membership on
login, membership changes, and reload. Consequently, faction stages granted with
AStages commands are normally replaced on rejoin; unrelated stages are preserved.

Operators can pause that synchronization for an individual online player:

- `/faction stages manual [player]`: preserve that player's current stages and let
  native AStages commands control them, including after rejoin/reload/restart.
- `/faction stages auto [player]`: immediately restore normal party-based stages.

Omit the player to target yourself; console must specify a player. Enable manual
mode before granting testing stages. The mode is saved by player UUID in the
world's FTB Teams manager data, and membership changes do not clear it. It does
not grant stages itself or bypass session locks, faction selection, or membership-
based quest rewards. Other players retain automatic synchronization. Fully restart
or reload server scripts to register the new commands.

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

The consolidated integration passes 50 automated policy tests and 36 isolated
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


### Optional technical and distance-rendering mods

The packwiz bootstrap installer offers these client mods, all disabled by default:

| Mod | Selected release | Dedicated server |
| --- | --- | --- |
| Distant Horizons | 3.3.3 / Minecraft 1.21.1 | Required |
| Bobby ReNeoForged | 5.2.4-0.4+mc1.21 | Client only |
| Bobby Sync | 1.3 | Required |
| Tweakerge | 0.4.3+mc1.21.1 | Client only |
| Forgematica | 0.4.3+mc1.21.1 | Client only |
| BoccHUD | 0.4.1+mc1.21.1 | Client only |
| Carpet: NeoForged | 1.0.8 | Required |
| Finally Useful Stonecutter | 1.1 | Client only |
| ServuxForged | 0.4.1+mc1.21.1 | Required; server only |

Choose **either Bobby or Distant Horizons**, or leave both off. When choosing
Bobby, also select Bobby Sync if server cache downloads are wanted. Disable
Bobby Sync when choosing Distant Horizons. These are pack selection guidelines;
the standard installer cannot enforce them.

MaFgLib 0.4.3 is required on clients so selecting any of Tweakerge, Forgematica,
or BoccHUD cannot leave its shared library missing. Bobby's required Cloth Config
15.0.140 is already required by the pack. Libraries therefore install even when
the optional features are off. Bobby Sync 1.3 omits Bobby from its dependency
metadata, but still needs Bobby on the client; select both checkboxes manually.

Stock packwiz's option table supports only optional/default/description, with no
dependency selection, groups, or mutually exclusive choices. Dependency discovery
in `packwiz modrinth install` is an authoring feature, not a runtime option resolver.
Strict radio-button choices or automatic Bobby/Bobby Sync grouping require a
custom installer/selector, or separately maintained pack profiles.
Use the graphical bootstrap installer for client selection. In installer 0.5.14,
headless/CLI mode accepts all newly presented options, ignoring their disabled
defaults; it will install both distance renderers unless choices were already
saved in that installation's `packwiz.json`.

Server-capable additions have separate required `side = "server"` metadata;
their client entries remain optional and `side = "client"`. Run the installer
with `-s server` for a dedicated server. Server JAR filenames have a `-server`
suffix so wrong-side cleanup cannot remove the client's optional copy. Use
separate client and server installation folders. Bobby itself and MaFgLib are
client only; Bobby Sync's server component does not require Bobby.
Both entries in each client/server pair are pinned. Update each pair together
and retain the server filename suffix; ordinary `packwiz update` must not
silently undo the separate destinations or leave different protocol versions.

Forgematica is explicitly pinned with top-level `pin = true`: Modrinth release
PFUOWUDF incorrectly marks its sources JAR as primary. The manifest instead uses
the compiled JAR and its published SHA-512 hash. Keep this pin until the upstream
artifact selection is corrected and a replacement is audited. This release also
contains the upstream access-transformer fix. Existing ModernFix, FerriteCore,
and Packet Fixer remain in the pack. Carpet-Fixes has no native NeoForge 1.21.1
release; Fabric-only patches are not installed through Connector as a workaround.

Carpet rules retain upstream defaults; no extra travel commands or gameplay
rules are enabled here. Bobby Sync exposes `/bobbysync sync [radius] [dimension]`,
`/bobbysync config`, and `/bobbysync cancel`; it transfers server region data
rather than enforcing faction-claim visibility. Its upstream notes list modded
dimensions as unsupported. Neither distance renderer expands faction movement
or interaction permissions. Check rendering, shaders, HUDs, schematics, and
server cache transfer in **Craftoria Factions Test** before accepting the update.
Minecraft is not launched by the release validation.
Release validation checked every indexed file and all new artifact hashes,
compiled NeoForge JAR contents, isolated server installs and repeat updates,
and client downloads plus persisted-option deselection cleanup.

### Server support for the technical client mods

[ServuxForged](https://modrinth.com/mod/servuxforged) is the native NeoForge
server companion for all three technical client ports. It installs automatically
on dedicated servers and is excluded from clients; it is not needed in single
player. Ordinary client features work without it, but Carpet alone does not
provide all of these mods' server integrations.

| Client mod | Additional support supplied by ServuxForged |
| --- | --- |
| Forgematica (Litematica) | Entity/block-entity data for schematics, schematic transfer and creative-mode server pasting, and accurate Easy Place protocol support |
| BoccHUD (MiniHUD) | Structure bounding boxes, server HUD and entity data, and optional debug-data integration |
| Tweakerge (Tweakeroo) | Entity/block-entity data and accurate placement protocol V3; its automatic protocol selection prefers Servux over Carpet's V2 |

Checked the published sources for the exact installed versions: Litematica and
Tweaks protocols are V1, HUD and Structures V2, and Entities and Debug V1 on
both client and server. This verifies the protocol versions; connected-client
acceptance in **Craftoria Factions Test** is still required.

ServuxForged 0.4.1 is the security-fixed Minecraft 1.21.1 release identified in
the [maintainer's advisory](https://github.com/CagayakeGirls/litematica-neoforge/issues/11).
The installed Forgematica 0.4.3 is newer than its fixed 0.4.2 release. This
ServuxForged version has no additional mod dependencies; BadPackets applies to
older releases and is not required here.

Installing the companion makes the integration available; it does not enable
every toggle or grant every permission. Upstream defaults enable the normal data
providers, but disable debug data, seed sharing, weather sharing, HUD loggers,
and stackable shulkers. Server pasting still requires creative mode and its
permission check. Player inventory and Ender Chest queries default to permission
level 2. These defaults are retained; client feature toggles and server settings
still control access. No extra Carpet extensions are required for these core
integrations, and no faction travel restrictions are changed.
