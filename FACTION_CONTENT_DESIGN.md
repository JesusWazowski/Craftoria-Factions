# Craftoria Factions: content identity and sorting guide

Design handoff — October 26, 2026

## Purpose and scope

Use this document to research and classify the rest of the pack's content, and to understand which faction an accomplishment naturally represents. Classification covers complete gameplay systems: automation, infrastructure, equipment, exploration, dimensions, bosses, loot, enchanting, resources, and interactions between mods. It is not limited to crafting-table recipes.

This document defines distinctions and sorting principles. It does **not** specify a milestone system, quest tree, reward schedule, new access restrictions, or a server deployment. Those are separate work. A research agent should propose classifications with evidence and uncertainty, without silently changing established assignments.

## Authority and interpretation

Apply sources in this order:

1. Subsequent explicit decisions from the server owner.
2. The owner's current decisions recorded here, including exceptions and the final MI/Replication decision.
3. The implemented assignments in `kubejs/config/factions.json`, including the reviewed suggestions the owner approved as a batch.
4. The faction identities from the original proposal, as clarified below.
5. New gameplay research and recommendations.

The original proposal is a source of intended playstyles, not an authoritative mod list. In particular, do not restore old assignments for Reliquary, Replication, Theurgy, Integrated Dynamics, Actually Additions, Relics, or Starcatcher. Do not reintroduce absent Modular Force Field System or RFTools mods because the proposal mentions them.

Distinguish three kinds of statements throughout the research:

- **Established decision:** an assignment or rule the owner has chosen. Explain consequences, but retain it unless a new decision changes it.
- **Design expectation:** the experience a faction should offer. Verify whether the actual pack delivers it.
- **Research finding or recommendation:** a version-specific gameplay fact or a proposed adjustment. Identify evidence and confidence; do not present it as an accepted rule.

The appendix is the current configuration snapshot. Some entries were assigned by accepting an earlier review's suggested fits rather than through individual discussion. They remain the implemented baseline, but their underlying balance assumptions can be researched and questioned explicitly.

## The central design principle

Factions specialize in **ways of solving problems**, rather than owning every useful tool associated with their theme. Their important differences should be recognizable in the infrastructure they build, the progression they pursue, and the accomplishments they value.

Basic quality of life, useful general logistics, building tools, and server-performance measures are often available to everyone. A mod can be powerful and still belong in the common baseline. Conversely, an apparently small addon can belong to a faction if it materially extends that faction's signature system.

Balance should consider the value of complete gameplay loops, not the number of mod IDs. An addon containing one interface, a UI integration, and a major industrial progression mod do not represent equal amounts of content.

## Faction distinctions at a glance

| Dimension | Stargazers | Mechanists | Spellcasters | Ritualists |
|---|---|---|---|---|
| Core identity | Extensive scientific automation and integrated electronic infrastructure | Physical engineering, continuous production, transport, and industrial planning | Experimentation with magic, spells, and unusual automation methods | Exploration, combat, ritual progression, loot, and enchanting |
| Preferred problem-solving style | Centralize resources, automate requests, scale and integrate systems | Design material flows, mechanisms, production chains, and working installations | Combine magical mechanics creatively and adapt abilities to different problems | Discover, defeat, acquire, and turn encounters or supernatural systems into advantages |
| Signature infrastructure | ME networks, Mekanism production and power, automated crafting | Create mechanisms, MI factories, pneumatic systems, aircraft and artillery | Ars systems, spellcasting equipment, magical processes and Spectrum | Ritual setups, spawner/loot systems, enchanting and expedition support |
| What distinguishes success | A dependable, scalable system that delivers complex outputs on demand | A planned production or engineering system that works continuously and purposefully | A creative magical application or a meaningful advance in magical capability | A significant discovery, encounter, acquired capability, or developed ritual/loot loop |
| Main design tradeoff | Powerful systems can depend on substantial infrastructure, power, and maintenance | Engineering and production benefit from planning, layout, and coordinated supply | Unusual methods reward experimentation; scaling and versatility need pack-specific assessment | Exploration and combat compete with preparation and development of ritual/farming infrastructure |

These are emphases, not exclusive activity permissions. All factions can build, explore, fight, automate with common tools, and collaborate.

## Stargazers

### Intended experience

Stargazers should offer the strongest identity around extensive scientific automation, on-demand crafting, and powerful integrated logistics. Their systems should support a relatively self-sufficient or isolationist approach once established. Isolationism is a playstyle supported by their tools, not a requirement to avoid trade or cooperation.

AE2 and Mekanism are the central families. Powah and Just Dire Things remain part of the identity; Mining Gadgets and the assigned extensions support it. The relevant question for new content is whether it deepens this style of integrated, scalable scientific infrastructure.

### Strengths and tradeoffs

The intended strengths are strong logistics, automation at scale, and advanced technological equipment. The intended counterweight is dependence on functioning infrastructure: production chains, power, and the resources needed to sustain equipment. The original proposal cites dangerous industrial systems and power-dependent gear as examples. Research the actual pack configuration before asserting specific reactor risks, failure consequences, or equipment limitations.

The faction is not defined by having the only usable logistics. Many excellent logistics tools are deliberately universal. Its distinction is the AE2/Mekanism ecosystem and the way those systems integrate and scale.

The original phrase “no magical conveniences” should be understood as a specialization preference, not an implemented blanket ban on magical item use. Ars Énergistique is explicitly Stargazers because of its ME-system role. Do not move it back to magic merely because of its name.

## Mechanists

### Intended experience

Mechanists emphasize logistics challenges, continuous production, practical engineering, transport, and planned installations. Their signature projects should be understandable as working mechanisms or production systems rather than simply requests submitted to an integrated network.

Create and its engineering/combat addons, Modern Industrialization and its addons, PneumaticCraft, and Immersive Aircraft form the core. Exposure and its Polaroid addon belong here through the owner's modern-technology interpretation. Ars Creo belongs here because its meaningful use depends on Create parts.

### Strengths and tradeoffs

The original proposal's appeal is that Create production lines are enjoyable and effective, while MI supplies a substantial industrial progression path. Planning, material flow, layout, and readiness should matter. The original expectation that Mechanists must plan ahead to project offensive power is an identity goal to evaluate against actual aircraft, cannon, pneumatic, and common-tool capabilities.

Do not preserve “logistics is difficult” by taking away baseline storage, redstone, SFM, CC:Tweaked, Flux Networks, LaserIO, or other approved common utilities. The challenge should emerge from their distinctive systems, not from withholding routine quality of life.

The owner noted that interested Mechanist players expressed less interest in factory building than Stargazer players. After a side-by-side review, the final decision was nevertheless to **retain MI with Mechanists** to preserve a substantial industrial path on both science factions. This decision is settled; the earlier interest concern remains useful context for evaluating enjoyment and progression burden.

Reliquary is no longer Mechanists. The original assignment came from mistaking it for another mod.

## Spellcasters

### Intended experience

Spellcasters emphasize experimentation with magic, powerful and flexible spells, unusual crafting/automation methods, and the satisfaction of developing a magical toolkit. Exploration and farming support that toolkit rather than defining the faction's primary identity.

Ars Nouveau and its assigned addons, Iron's Spells 'n Spellbooks and its assigned addons, and Spectrum are the principal families. A strong candidate for Spellcasters adds meaningful spell construction, magical experimentation, unusual magical production, or applications of an expanding magical toolkit.

### Strengths and tradeoffs

The original proposal expects experimentation to unlock powerful combinations. Evaluate both practical utility and combat applications. The historical claim that magic scales less well than science is a **balance hypothesis**, not a fact to assume or a weakness to enforce artificially. Check the actual pack's throughput, automation, transport, equipment, and resource systems.

Spellcasters can automate. Their identity comes from how their systems operate and the choices they offer, not from a prohibition on factories or logistics. Shared Integrated Dynamics, Theurgy, and other magic-shared content contribute to their available tools.

Do not interpret “all Ars addons” literally across the newer exceptions: Ars Creo is Mechanists, Ars Énergistique is Stargazers, and Ars Delight follows the universal Farmer's Delight baseline. Theurgy is magic-shared, and Starcatcher is Everyone. Actually Additions is science-shared.

## Ritualists

### Intended experience

Ritualists emphasize exploration, combat, supernatural progression, enchanting, and acquiring or improving valuable loot and equipment. Encounters, discoveries, preparation, and developed loot/farming systems should provide much of their distinctive content.

The established families include Occultism, Apotheosis, Twilight Forest, Eternal Starlight, Cataclysm, Bosses of Mass Destruction, and the other assignments in the appendix. Relics is now Ritualists. Reliquified Artifacts is Ritualists because rare-loot farming fits this exploration/loot identity. Nature's Compass is intentionally Ritualists: both its flavor and its early-game advantage matter. JAMD and Just Another Void Dimension were also placed here for flavor.

### Strengths and tradeoffs

The original proposal anticipates strong direct-combat capability and less need for a large scientific factory before becoming useful. Research the actual preparation and infrastructure each major system needs. Ritualists are **not** an automation-free faction: their current content includes ritual production, spawner-related progression, and loot-farming tools. The distinction is that these loops support exploration, supernatural progression, and combat rather than making a centralized electronic factory the main attraction.

Likewise, the original idea that technological gear may eventually outclass enchanted gear is a hypothesis to test. Do not assume that Ritualists must attack others to remain relevant, or design mandatory violence as compensation for an unverified scaling problem.

Assigning a dimension, boss mod, or loot ecosystem to Ritualists identifies its faction content and potential accomplishments. It does not itself establish exclusive permission to enter that dimension, encounter the boss, or possess its drops.

## Shared content and the common baseline

### Science-shared: Stargazers and Mechanists

`science_shared` supports both scientific approaches without erasing their distinct cores. It currently includes Actually Additions, Hostile Neural Networks, Industrial Foregoing and MIFA, Modular Routers and its Mekanism/MI connectors, Pipez, Replication, Schematic Energistics, Tempad, and the XyCraft family.

The final MI/Replication arrangement matters especially:

- MI and its addons, including Modern Dynamics, remain Mechanists.
- Mekanism remains Stargazers.
- Replication is science-shared. The owner's reasoning is that access is tied to MI or Mekanism progression and arrives substantially earlier through MI. Verify the pack's exact dependency paths when researching progression.
- The owner also identifies MI late-game parts as important to high-throughput HNN farms. Shared ownership of HNN does not prove both factions have identical independent access to every optimal component.
- Powah remains Stargazers. Moving it to Mechanists is a future consideration **if Mechanists lose MI**, not an approved change now.

Schematic Energistics is shared because collaboration between the science factions can make it useful. Shared access to a connector does not grant unrestricted access to both parent ecosystems or eliminate their material dependencies.

### Magic-shared: Spellcasters and Ritualists

`magic_shared` supports the common magical side of the design. It currently includes Integrated Dynamics and its addons/compatibility namespaces, Theurgy, Reliquary, Waystones, Artifacts, Iron's Gems 'n Jewelry, and Pylons.

Integrated Dynamics is intentionally magic-shared: the owner prefers its magitech flavor here, and science factions already have analogous functions through AE2 and Create. Its logistical power is not a reason to move it back to Everyone. Theurgy is shared as a magical counterpart to replication. Reliquary is shared after correcting the original misidentification.

Relics and Artifacts no longer have the same assignment: **Relics is Ritualists; Artifacts remains magic-shared.** Reliquified Artifacts has its own explicit Ritualist assignment.

### Everyone

Everyone is the common capability baseline, not a fifth faction or a new shared stage. Use it for deliberately universal content, not as a claim that an unreviewed mod has been fully assessed.

The owner's recurring reasons for universal access are:

| Reason | Established examples and interpretation |
|---|---|
| General control, programming, and redstone | CC:Tweaked and its addons, Advanced Peripherals, UnlimitedPeripheralWorks, SFM, More Red, Little Big Redstone. Programming/control of existing blocks is treated as general utility; redstone is considered part of the vanilla baseline. |
| Broad logistics rather than signature progression | Logistics Networks, Flux Networks, LaserIO, Entangled, Pipe Connector, Tank Storage, Tesseract. Strong utility can justify common access instead of exclusivity. |
| Performance and infrastructure practicality | Compact Machines is universal as a lag-reduction measure. Flux Networks is universal both because it is powerful and because the owner considers it lag-friendly. Treat those as design reasons; measure actual performance if making technical claims. |
| Storage and construction quality of life | Sophisticated Storage/Backpacks, Sophisticated Storage in Motion, Functional Storage, Building Gadgets, Construction Sticks. Preserve a useful baseline for all factions. |
| Decorative content without meaningful specialization | Crystalix and Rechiseled AE2. An AE2 visual theme alone does not make decoration Stargazer progression. |
| Shared everyday content | Farmer's Delight and its ordinary addons, including Ars Delight; Starcatcher; Shrink; Nether Descent. Nether Descent is treated as a vanilla-biome expansion with minimal gameplay advantage. |
| Libraries without a relevant gameplay advantage | Iron's Lib is explicitly Everyone. Assess what a library actually exposes rather than assigning all dependent systems to its theme. |

LaserIO is also a longstanding favorite whose universal availability may matter particularly to Ritualist players. Pipe Connector is universal despite being most useful to science. Tesseract is universal because the owner sees it as an expensive alternative to Entangled, not a distinct faction identity.

The original proposal explicitly includes Sophisticated Backpacks in the universal baseline. Its absence from an explicit list in `factions.json` is not an intention to restrict it; unassigned mods are currently unrestricted as well.

## Addons and connectors

### Ordinary addons follow their parent

Classify a gameplay addon with its parent unless an explicit exception says otherwise. Apply this recursively to addons of addons. This keeps one coherent progression ecosystem from being split accidentally across factions.

Do not confuse dependencies with design parentage. A library used by several mods is not automatically an addon of all of them. A standalone mod that happens to exchange standard items, fluids, or energy with another mod is not automatically a connector. Modern Dynamics is mechanically an independent pipe mod, but it follows MI by an explicit owner decision.

UI-only integrations and libraries may add little faction content even when assigned to an ecosystem. Include that distinction when assessing how much content a faction has.

### Connectors need a functional decision

A connector meaningfully joins two ecosystems. Show it under both parents in research reports, while giving it one effective assignment. Do not automatically make every connector shared: determine which parent infrastructure is required to use its relevant functionality, whether it has useful independent features, and whether its role is cooperation or specialized access.

| Connector or family | Established assignment | Owner's governing reason or rule |
|---|---|---|
| Applied Pneumatics | Stargazers | Only meaningfully usable with an ME system. |
| Create Stock Bridge | Stargazers | Only meaningfully usable with an ME system. |
| Ars Énergistique | Stargazers | Explicit ME-side assignment. |
| Ars Creo | Mechanists | Its use depends on Create parts. |
| Schematic Energistics | Science-shared | Useful when either science faction collaborates with the other. |
| Advanced Peripherals and UnlimitedPeripheralWorks | Everyone | They include general utilities; their integrations do not justify excluding other factions. CC:Tweaked and its addons remain universal. |
| Rechiseled AE2 | Everyone | No relevant gameplay advantage; decorative integration. |
| Ars Delight | With Farmer's Delight; currently Everyone | Its crafting content is not meaningfully Ars-specialized. Always keep it with Farmer's Delight. |
| Twilight Delight | Always Ritualists | Explicit exception to following the universal food ecosystem. |
| Reliquified Artifacts | Ritualists | Rare-loot farming fits Ritualist exploration/loot progression. |
| Modular Routers' Mekanism and MI connectors | With Modular Routers; currently science-shared | Always keep these with the router parent, not with the other endpoint. |

Other implemented connector assignments remain the baseline in the appendix. For example, Applied Mekanistics and Applied Replicatics are Stargazers; Ars Technica remains Spellcasters; Cataclysm Spellbooks remains Ritualists. Do not infer a new assignment for them from a superficially similar exception.

## How to sort additional content

Evaluate the actual configured gameplay, not just the mod's title, theme, or default upstream recipes.

1. **Identify the content's role.** Is it a complete progression loop, an addon, a connector, an encounter/loot source, a general utility, decoration, or technical support?
2. **Check established decisions first.** Reuse the parent's assignment where appropriate. Respect explicit Everyone and connector exceptions.
3. **Ask what players actually do.** What is the repeated activity and the meaningful payoff? Which faction's way of solving problems does it reinforce?
4. **Trace prerequisites and outputs.** Consider infrastructure, power or other resources, exploration requirements, pack-specific crafting/processing, and which other systems benefit. Separate access to an item from independent access to its production chain.
5. **Evaluate common utility.** Would exclusivity mainly make ordinary building, storage, control, transport support, or server performance worse for everyone else? Would the tool add distinctive progression or merely remove inconvenience?
6. **Evaluate balance at the system level.** Consider effective production capacity, versatility, combat readiness, mobility, infrastructure dependence, resource acquisition, scaling, and player interest. Mod count is only an inventory check.
7. **Record a recommendation and uncertainty.** Explain the fit, the tradeoff, and any conflict with an established decision. An unresolved question should remain visible rather than becoming an invented rule.

Research content with no crafting recipes too: dimensions, structures, boss encounters, dropped equipment, enchanting/spawner mechanics, world resources, spell unlocks, passive systems, and code-defined interactions can all represent faction content. Keep technical/client support mods visible in the inventory without pretending they supply a gameplay progression loop.

Cross-faction cooperation is a legitimate outcome. Preserve reasons to trade materials, components, expertise, or services without assuming every shared system must be independently optimal for both factions. Conversely, identify any prerequisite that would make a faction's core identity depend entirely on another faction; present that consequence for review.

For evidence, prioritize the exact pack versions, KubeJS changes, datapacks, configuration, official mod documentation, and source code. Distinguish upstream behavior from pack behavior, theoretical possibilities from verified mechanics, and access to a recipe from access to an entire system. No new gameplay research was conducted to establish the expectations in this document; its design authority is the owner's proposal and subsequent decisions.

## Rebalancing candidates, not automatic changes

| Content | Current decision | Condition worth revisiting |
|---|---|---|
| Farmer's Delight | Everyone; Ars Delight always follows it | Possible content addition for an unpopular faction. Do not move it now. |
| Functional Storage | Everyone; addons follow | Possible logistical addition if a faction lacks options. |
| Modular Routers | Science-shared; both connectors follow | Everyone remains a possible later choice. |
| Powah | Stargazers | Consider Mechanists if MI is moved away from them in a later review. |
| MI / Mekanism / Replication / HNN relationship | MI Mechanists, Mekanism Stargazers, Replication and HNN science-shared | Investigate actual progression timing and high-throughput dependencies before proposing further changes. The current MI decision is settled. |

## Using these distinctions to classify future accomplishments

Attribute an accomplishment by the distinctive capability it demonstrates. An integrated on-demand scientific production system points toward Stargazers; a functioning engineered production/transport installation toward Mechanists; a creative or advanced magical application toward Spellcasters; and a consequential discovery, encounter, ritual, enchanting, or loot-development achievement toward Ritualists.

Shared systems can support both associated factions. Common tools should generally be treated as baseline support rather than exclusive achievements. A cross-mod accomplishment can have one principal identity and secondary collaborators; list both without changing its underlying mod assignments. Acquiring a traded item or converting/resetting an existing one does not by itself demonstrate developing the corresponding system.

This is classification guidance only. Quest implementation, completion detection, credit sharing, rewards, and any new enforcement should be designed separately.

## Technical boundaries a research agent must understand

The current implementation is narrower than this design taxonomy:

- `factions.json` defines four stable faction IDs and two shared groups. Party membership normally supplies faction/shared AStages stages. Everyone adds no stage. Explicit `unrestrictedMods` decisions and other unassigned mods are currently unrestricted.
- Recipe gating uses recipe-ID namespaces and is being designed around the default crafting table. It does not establish blanket restrictions on item possession/use, machines, dimensions, boss access, or loot. A design assignment or accomplishment category must not be mistaken for an implemented ban.
- Recipe namespaces and item namespaces can differ. XyCraft has an explicit recipe alias; pack-generated `craftoria:` recipes require separate inspection. The older crafting-table-only review is not a complete gameplay inventory.
- The current quest-reward guard checks accessible alternatives in **item tasks** against membership. Non-item tasks and reward contents are not screened by that rule. Ordinary FTB quest progress/reward-sharing semantics remain in effect. Do not assume an exploration/boss accomplishment is faction-exclusive just because its content has an assigned faction. Ineligible reward claims can be consumed permanently; implementation details are in README.md.
- Recipe exceptions and quest item exceptions are different. The four generic Ars XP-gem items are explicitly permitted in quest item checks, but other recipe-conversion outputs do not receive blanket quest exemptions.

### Universal conversions and reset behavior

The owner approved convenient single-item conversions independently of mod ownership. There are currently **369 exact recipe-ID exceptions**: the prior 12-ID baseline, another 168 IDs covering 85 reviewed one-item-in/one-item-out pairs, and all 189 entries in the reset/disassembly review. The baseline includes AE2 block/cable-part conversions and six XP-gem compression/decompression recipes. Other compression/decompression rules were left unchanged.

Do not treat these exceptions as permission to manufacture the original devices or to claim an entire mod's progression. Do not award distinctive progression merely for repeatedly changing an item's form or clearing its configuration.

Most reset/disassembly entries use JSON definitions backed by custom Java serializers; the reviewed list also contains one ordinary stonecutting entry. Their implementation was not replaced. They are a recorded startup troubleshooting watchpoint for component loss, unexpected refunds, or cross-faction behavior. Exact IDs, groups, and investigation notes are in README.md and `automation/faction-recipe-override-audit.json`.

### Reference files and scope of authority

| File | Role |
|---|---|
| `kubejs/config/factions.json` | Current restricted, shared, explicit Everyone assignments and recipe aliases. |
| `kubejs/config/faction_recipe_overrides.json` | Exact public recipe IDs and the four public XP quest-item IDs. |
| `automation/faction-recipe-override-audit.json` | Approved exception groups and their prior baseline. |
| `README.md` | Current implementation, commands, operating constraints, reward behavior, and troubleshooting. |
| `mods/*.pw.toml`, `pack.toml`, `index.toml` | Pack inventory and pinned distribution references. |
| `kubejs/`, `config/`, `defaultconfigs/`, OpenLoader packs | Pack-specific gameplay changes that research must account for. |
| `docs/mod-faction-review.md`, `docs/recipe-conversion-review.md` | Tracked research aids; static evidence and limited coverage, not the full design or runtime registry. |

This handoff authorizes no remote server/dashboard/share access and no Minecraft launch. Follow the repository's access instructions. Preserve stable faction IDs and existing QOL/travel-command decisions; propose additional restrictions explicitly rather than implementing them as a side effect of classification. Existing worlds must not be automatically migrated. This document changes no gameplay configuration.

## Appendix: implemented assignment snapshot

The following lists are copied from the local configuration as of this handoff. They are mod-ID assignments, not a claim that each entry contributes the same amount of gameplay or that every gameplay feature is technically gated. The owner-approved common baseline also includes Sophisticated Backpacks, which is presently unrestricted through the unassigned-mod fallback.

Mods not listed here still require classification research. Their currently unrestricted technical behavior is not proof that the owner deliberately selected Everyone for them. The source pack contains many libraries, client mods, world-generation systems, and integrations outside the earlier recipe-focused review.

<!-- ASSIGNMENT_SNAPSHOT -->

### Stargazers — 39 mod IDs

Assignment: `stargazers`.

```text
advanced_ae, ae2, ae2ct, ae2importexportcard, ae2netanalyser, ae2tb, ae2wtlib, appflux,
appliedpneumatics, appmek, apprep, arseng, betterp2p, bigger_ae2, createstockbridge, enderdrives,
extendedae, extendedae_plus, gmut, jei_mekanism_multiblocks, justdirethings, megacells, mekagenjei,
mekajadeupgrade, mekanism, mekanism_extras, mekanism_ponders, mekanism_unleashed, mekanismcurios,
mekanismgenerators, mekanismtools, mekaweapons, mekmm, merequester, mininggadgets,
moremekanismprocessing, myotus, powah, wcwt
```

### Mechanists — 32 mod IDs

Assignment: `mechanists`.

```text
ars_creo, bellsandwhistles, copycats, create, create_connected, create_dragons_plus,
create_enchantment_industry, create_enhanced_schematicannon, create_hypertube,
create_pattern_schematics, create_radar, createaddition, createbigcannons, createcasing, createdeco,
createfastschematiccannon, createfiltersanywhere, createschematicchecker, createultimine, exposure,
exposure_polaroid, extended_industrialization, immersive_aircraft, industrialization_overdrive,
man_of_many_planes, mi_sound_addon, mi_tweaks, mi_utilities, modern_industrialization,
moderndynamics, pneumaticcraft, yet_another_industrialization
```

### Spellcasters — 23 mod IDs

Assignment: `spellcasters`.

```text
aces_spell_utils, ars_additions, ars_controle, ars_elemancy, ars_elemental, ars_musique,
ars_nouveau, ars_ocultas, ars_technica, ars_unification, ars_zero, crystal_chronicles,
gametechbcs_spellbooks, gtbcs_spell_lib, hazennstuff, hazentouvelib, irons_spellbooks,
irons_spells_dynamic_skilltree, not_enough_glyphs, reliquified_ars_nouveau,
reliquified_irons_spells_and_spellbooks, spectrum, starbunclemania
```

### Ritualists — 34 mod IDs

Assignment: `ritualists`.

```text
animusnv, apotheosis, apothic_attributes, apothic_enchanting, apothic_spawners,
bosses_of_mass_destruction, cataclysm, cataclysm_spellbooks, cognition, cursedearth,
eternal_starlight, extra_apoth_compat, gateways, gaze, irons_apothic, irons_apothic_invaders, jamd,
javd, lootintegrations_cataclysm, malum, mob_grinding_utils, naturescompass, neovitae,
oathboundrelics, occultism, relics, reliquified_artifacts, reliquified_lenders_cataclysm,
reliquified_lenders_cataclysm_new_relics_fix, the_bumblezone, twilight_treehouses, twilightdelight,
twilightforest, wstweaks
```

### science_shared — 14 mod IDs

Assignment: `science_shared`.

```text
actuallyadditions, hostilenetworks, industrialforegoing, mekanisticrouters, mifa,
modernindustrialrouters, modularrouters, pipez, replication, schematicenergistics, tempad,
xycraft_machines, xycraft_override, xycraft_world
```

### magic_shared — 11 mod IDs

Assignment: `magic_shared`.

```text
artifacts, integrateddynamics, integrateddynamicscompat, integratedscripting, integratedtunnels,
integratedtunnelscompat, irons_jewelry, pylons, reliquary, theurgy, waystones
```

### Everyone (explicit unrestricted list) — 107 mod IDs

Assignment: `everyone`.

```text
adachirei_nui, advancedperipherals, akashictome, animal_feeding_trough, animal_pen, aquaculture,
arsdelight, arts_and_crafts, autochefsdelight, bankstorage, barbequesdelight, beachparty,
biomeswevegone, blahaj, brewery, buildinggadgets2, chipped, compactmachines, computercraft,
constructionstick, cookingforblockheads, craftingstation, craftoria_core, crystalix, displaydelight,
duckling, dummmmmmy, dumplings_delight, elevatorid, ends_delight, entangled, factory_blocks,
farm_and_charm, farmersdelight, farmingforblockheads, fluxnetworks, framedblocks, framedblocksplus,
fruitsdelight, ftbfiltersystem, ftbquests, functionalstorage, gag, glassential, handcrafted,
herbalbrews, irons_lib, kubejs, laserio, little_big_redstone, logisticsnetworks, luminax, mbtool,
mcwbridges, mcwdoors, mcwfences, mcwholidays, mcwlights, mcwpaths, mcwroofs, mcwstairs, mcwtrpdoors,
mcwwindows, measurements, mechtrowel, modonomicon, moredelight, morefunctionalstorage, morered,
moreredxcctcompat, netherdescent, oceansdelight, patchouli, peripheralworks, phantoms_utilities,
pipe_connector, plushie_buddies, rechiseled, rechiseledae, refurbished_furniture, ribbits,
rusticdelight, sereneseasons, sfm, shrink, simplemagnets, simplylight, solcarrot,
sophisticatedstorage, sophisticatedstorageinmotion, starcatcher, storagedelight, supplementaries,
sushigocrafting, tankstorage, tesseract, thaumon, torchmaster, transfer_labels, transmog, trashcans,
utilitarian, vinery, woodwevegot, xtonesreworked, yigd, yungscavebiomes
```

