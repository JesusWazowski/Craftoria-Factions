# Faction milestones: design notes

October 26, 2026. Companion to [FACTION_CONTENT_DESIGN.md](../FACTION_CONTENT_DESIGN.md).
The quest-by-quest table is generated in [faction-milestone-quests.md](faction-milestone-quests.md);
mechanics and maintenance are in [README.md](../README.md#faction-milestones).

## What was built

- One milestone chapter per faction, in a new **Faction Milestones** chapter group.
  Each chapter is visible only to its own faction (a hidden charter quest gates it).
- Claim allowance: every party starts with **4** claimable chunks. Completing its own
  chapter adds exactly **60**, to **64**. FTB Chunks enforces 64 as a hard team cap.
- Two identical 1-chunk starters open every chapter: *Plant the Banner* (a valid faction
  home set with `/sethome`; the description explains how homes and locked sessions work)
  and *Pack for the Journey* (any Sophisticated Backpack).
- Inside a mod, quests follow that mod's own progression. Between mods there is no order:
  every pillar starts from the charter, so a faction can open its chapter anywhere.
- Each faction also has an optional, chunk-free *Diplomatic Interfaces* quest listing its
  connector content that needs another faction's materials.

Interpretation: "four new milestone quest lines for each faction" was read as one line
per faction, four in total. The two starters are the "two identical or similar starter
quests in each category".

## Who receives the chunks

The allowance is derived from the party's completed milestone quests, and every member
of the party carries it as a personal FTB Chunks bonus. This was chosen over granting
the faction leader because of how FTB Chunks 2101.1.22 computes party limits:

- A bonus stored on a **party** is never counted, and reading it moves it onto the owner.
- Under `party_limit_mode: "largest"` a party's limit is the largest **member** limit,
  each made of the base permission plus that member's personal bonus.
- Faction parties are owned by a reserved system identity until an operator appoints a
  human owner, and owners can change. A leader-only bonus would follow the person, not
  the faction, and would vanish or move with an ownership transfer.

Giving every member the party's value means owner changes, late joiners and offline
members do not matter, and a player moved to another faction carries the new faction's
value within a second. Quest progress is per party, so the faction's achievements stay
with the faction. Existing worlds whose cached member limits are still "unlimited" are
rebuilt once (see README).

## Pacing model

All four chapters spend chunks on the same schedule, so equal teams investing equal time
gain territory at about the same rate:

| Band | Focused hours (one player) | Chunks per faction |
|---|---|---:|
| Starters | first session | 2 |
| Tier I | 0–8 | 10 |
| Tier II | 8–25 | 14 |
| Tier III | 25–70 | 16 |
| Tier IV | 70–200 | 14 |
| Capstone | after the tier IV pillars it names | 4 |

Hour bands come from the effort estimates in the Craftoria progression research
(observed playthroughs where available, recipe math otherwise). They are focused-play
estimates for one player; more players move a faction through them faster. Tiers are
assigned by **cumulative** effort, not by a mod's own stage names. Examples:

- Mekanism is the fast tech line here (SPS 10× cheaper), so fission and its turbine are
  tier III and fusion, antimatter, the MekaSuit and the infinite tier are tier IV, with
  quantities (two antimatter pellets, two UU-Matter, four infinite circuits) chosen to put
  the Stargazer tier IV total in the same range as MI's nuclear-to-plasma climb.
- Modern Industrialization is the slowest tech line, so it holds most of the Mechanist
  tier IV chunks (nuclear, singularity, fusion) and its steam age is tier I.
- Magic endgames are shorter per mod than tech endgames, so the Spellcaster and Ritualist
  tier IV bands are filled with more pillars (Spectrum's moonstone tier and Glass Crest,
  Elemancer armor, Tyros; Cataclysm's abyssal bosses, Pinnacle salvage, a relic
  collection, Ancient Eldritch, Transcendence, Malignant Stronghold).

Within a tier, chunks scale with **space** where a technology needs it (fission reactors
and turbines, MI's nuclear and fusion structures, the Spectrum moonstone pedestal
structure, trains, the AdvancedAE quantum computer, the Ender Library, mob farms, ritual
fields) and otherwise with difficulty. Trains get extra chunks because a locked session
keeps everyone inside claimed chunks: track that is meant to be ridden needs claims.

### Volume quests

FTB Quests item tasks can consume very large counts, submitted in batches from the
inventory or piped into a Task Screen. They are used where mass production is the
faction's loop:

| Faction | Quest | Requirement |
|---|---|---|
| Stargazers | Processor Foundry (II) | 512 logic, 512 calculation, 256 engineering processors |
| Stargazers | Fluix Flood (III) | 8,192 Fluix Crystals |
| Mechanists | Brass Foundry (II) | 4,096 Brass Ingots |
| Mechanists | Precision Line (III) | 1,024 Precision Mechanisms |
| Mechanists | Mill Output (IV) | 4,096 stainless steel + 512 titanium ingots |
| Spellcasters | Wellspring (II) | 2,048 Source Gems |
| Spellcasters | Chromatic Hoard (III) | 512 each topaz, citrine, amethyst, onyx shards |
| Spellcasters | Moonstone Hoard (IV) | 512 Moonstone Shards |
| Ritualists | Spirit Harvest (II) | 1,024 arcane + 256 wicked + 256 sacred spirits |
| Ritualists | Salvage Hoard (IV) | rare, epic and mythic Apotheosis salvage |

Mechanists carry one extra volume quest because continuous production is their identity.
Ritualist volume is loot-based (reaped spirits; salvaged affix gear) rather than factory
output, matching their loop; kill-count grinding was considered and rejected because FTB
does not credit automated (fake-player) kills.

## Self-sufficiency

Every chunk-awarding quest is completable by the faction alone with its own and shared
mods plus Everyone content. Pack recipes with cross-faction gates were deliberately left
out of the chunk path:

| Left out | Why |
|---|---|
| MI Budding Incubator | Its structure needs AE2 growth accelerators (Stargazers). The Model Synthesizer is used instead. |
| MI Ooze Lab | Built from Mekanism reactor glass and Just Dire Things blocks (Stargazers). |
| AdvancedAE Flight Card | Needs an MI electronic circuit and an Eternal Starlight rocket. |
| JDT flight upgrade | Needs Occultism, Iron's Spells and Ars Elemental parts. |
| Infinity cells | Need MI stainless steel tanks and Mekanism cosmic parts. |
| Trial of Awaken | Its pearl needs the Actually Additions Empowerer (science-shared). |

Replication appears for both science factions: replica ingots need either the MI
Electrolyzer (Mechanists) or the Mekanism APNS (Stargazers), so each has an independent
route. Cross-faction trade still helps everywhere (for example Mechanists' MI mithril
for Iron's books), and the optional Diplomatic Interfaces quests point at it.

## New mod assignments

Mod IDs come from the pack's `config/crash_assistant/modlist.json` (written from the
loaded jars) and the mods' published sources. Of the 240 loaded mod IDs that
`factions.json` did not list, the gameplay mods were assigned using
FACTION_CONTENT_DESIGN.md's rules; the rest are technical. FACTION_CONTENT_DESIGN.md's
appendix is a dated handoff snapshot and was left as written.

| Mod (ID) | Assignment | Reason | Confidence |
|---|---|---|---|
| Applied Construction Sticks (`appliedsticks`) | Stargazers | Connector that lets Construction Sticks draw from an ME network; it registers no items and is only meaningful with AE2, like Applied Pneumatics and Create Stock Bridge. | High |
| Sophisticated Storage Create Integration (`sophisticatedstoragecreateintegration`) | Mechanists | Its function is Sophisticated storage on Create contraptions, so its use depends on Create parts (the Ars Creo rule). Ordinary storage stays Everyone. | Medium: Everyone is also defensible as storage QoL. |
| Enigmatic Arcana (`enigmatic_arcana`) | Ritualists | Iron's × Malum connector built on Malum spirit infusion, so it needs the Ritualist altar infrastructure (as Cataclysm Spellbooks does). | Medium |
| Repeatable Trial Vaults (`repeatable_trial_vaults`) | Ritualists | Turns trial chambers into a repeatable loot loop. No recipes, so this marks faction content only. | Medium |
| BEER (`beer`) | Ritualists | Extends enchanting-library reach (Apothic Enchanting). No recipes, so this marks faction content only. | Medium |
| XyCraft core (`xycraft_core`) | science_shared | Parent of the XyCraft family already in science_shared. | High |
| Sophisticated Backpacks, Sophisticated Core | Everyone | The design doc names backpacks as baseline; now explicit. | High |
| Spectral Decorations (`spectral_decorations`), Wireless Terminal Color (`wireless_terminal_color`) | Everyone | Decorative integrations, following the Rechiseled AE2 / Crystalix decision. | Medium: "addons follow parent" would give Spellcasters / Stargazers. |
| Ender Storage, Jumbo Furnace | Everyone | Broad logistics and smelting, like Entangled and Tesseract. | High |
| Lootr, Loot Integrations and its Hopo, Structory, Towns and Towers, WDA and YUNG's addons | Everyone | Per-player chests and loot distribution for universal structures. Loot Integrations: Cataclysm stays Ritualist with Cataclysm. | High |
| Structure and worldgen mods (YUNG's, When Dungeons Arise, Structory, Towns and Towers, Hopo, Desert Oasis, Farmers Structures, Oh The Trees You'll Grow) | Everyone | World generation without faction specialization. | High |
| Pufferfish's Skills, Attributes, Unofficial Additions; Adventurer Skills | Everyone | Universal XP progression for every playstyle. | High |
| Enhanced Celestials 2 core and default lunar events | Everyone | World events that affect every faction alike. | Medium |
| Small QoL and furniture: Charm of Undying, Comforts, Curious Armor Stands, Elytra Slot, Bridging Mod, Chisel, Rechiseled: Chipped, Macaw's and Aurelj's Paintings, Stick It!, CFM Watt About Power (follows Refurbished Furniture), Trade Cycling, Vanilla Backport, FTB Ultimine, Guard Villagers, Creeper Overhaul, Accelerated Decay, Jumpy Boats, Can't Sleep Clowns, Trofers, Farmer's Cutting OTBWG and Seasonal Let's Do (follow Farmer's Delight / Let's Do), Let's Do Compat | Everyone | Building, comfort, decoration and everyday baseline. | High |

Left technical and unlisted (unrestricted by fallback, no gameplay loop): libraries and
APIs (for example Curios, GeckoLib, Lodestone, Lionfish, Cerbon's, Revelationary,
Trenzalore, Tesseract API, the KubeJS integration libraries), the FTB infrastructure
mods, UI and recipe viewers (EMI and add-ons, Jade, Boss Checklist, Leaderboards),
client visuals and audio, shader support (including Enhanced Celestials 2 shader
support) and performance mods.

## Coverage

Every gameplay mod assigned to a faction or its shared group appears in that faction's
chapter, except content with nothing a quest can check:

- No items of their own: Applied Construction Sticks (links Construction Sticks to ME),
  Mekanism Unleashed (raises upgrade caps, allows Meka enchanting), Iron's Apothic
  Invaders (adds Iron's mobs to Apotheosis' invader pool).
- UI or integration only: AE2 Crafting Tree, JEI Mekanism Multiblocks, MekaGenJei,
  MekaJadeUpgrade, Mekanism Ponders, Mekanism Curios, Ars Unification, MI Sound Addon,
  the Schematicannon and Schematic Checker add-ons, Create Ultimine, Filters Anywhere,
  the Integrated Dynamics/Tunnels compatibility namespaces, Loot Integrations: Cataclysm
  and the Reliquified Cataclysm relics fix.
- Libraries: Myotus, Ace's Spell Utils, GTBC SpellLib, HazentouveLib.
- Passive systems: Apothic Attributes, Extra Apoth Compat, Wither Skeleton Tweaks,
  the Iron's dynamic skill tree.
- World structures without a reliably checkable ID: Twilight Treehouses.

These are named in the relevant quest descriptions instead. Shared mods appear in both
member factions' chapters with identical chunk values; the Modular Routers connector
quest asks each science faction for the connector it can build from its own parts
(Mekanistic Routers for Stargazers, Modern Industrial Routers for Mechanists).

## Verification status

- Every item, entity, dimension, advancement and stat ID in the spec was checked against
  the pack's own files or the mod's published source at the pinned version. XyCraft,
  Gaze, Ars Musique and GTBC's Spellbooks have no public source; their IDs come from
  lang files extracted from the released jars. Craftability of the Gaze items and the
  XyCraft extractor was not confirmed, so Gaze uses an any-of filter.
- FTB Filter System rejects a whole filter if any listed item ID is unknown, so every
  ID inside an any-of filter was checked individually.
- Not yet done: a launch in **Craftoria Factions Test**. Check in game that each charter
  completes only for its faction, `/sethome` completes the home quest, rewards announce
  the new allowance, `/faction claims` matches FTB's claim screen, Task Screens accept
  the volume items, and an existing world's party drops from "unlimited" to its earned
  allowance after one restart.
- Unrelated existing issue: the upstream Hephaestus quest chapter and KubeJS scripts
  were merged, but no Hephaestus mod is in `mods/`, so that chapter's items do not exist.
