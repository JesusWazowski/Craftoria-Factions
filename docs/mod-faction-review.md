# Crafting-table mod / faction review

Assignments updated October 26, 2026. Crafting-table evidence and inclusion decisions are retained from the saved audit.

**220 mod entries with locally evidenced default crafting-table recipes**: 114 faction/shared assignments and 106 Everyone entries. Rows represent pack entries; the two CC:Tweaked listings share one mod ID and recipe namespace.

Only standard shaped/shapeless crafting-table recipes qualify for this report. Machine, ritual, apparatus, smithing, smelting, stonecutting and Create mechanical-crafting recipes do not qualify. Recipes fitting the 2×2 inventory grid still count because they also work in the default crafting table.

Evidence comes from the exact locally available pack JARs, enabled OpenLoader datapack files, local KubeJS data and directly readable literal KubeJS shaped/shapeless additions. Known explicit recipe/output removals and resolvable mod-loaded conditions were applied. This is a conservative static audit, not a live recipe-manager dump: dynamic scripts, tags, custom serializers and unresolved conditions can omit additional qualifying mods. A row proves a standard crafting-table recipe definition was found; it does not claim all recipes from that mod are crafting-table recipes or restricted.

Matching uses recipe-ID and output-item namespaces. The example shows both; cross-namespace outputs must be checked before relying on a faction restriction. CraftoriaCore includes the pack’s KubeJS-generated `craftoria` content; AdachiRei-nui uses the content namespace `adachirei-nui`.

Assignments implement the October 26 user decisions. `science_shared` means Stargazers + Mechanists; `magic_shared` means Spellcasters + Ritualists. “Everyone” means leave the mod explicitly unrestricted; it is not a new configured shared group. The current assignments and explicit Everyone choices are applied to the configuration. Links come from local mod metadata and MODLIST.md; the FramedBlocksPlus link was verified against its official CurseForge page.

MI remains with Mechanists; Replication is science-shared; Powah remains Stargazers. Everyone is an explicit unrestricted assignment, not a new faction. The suggestion column is blank because these decisions are now applied. See [conversion candidates](recipe-conversion-review.md) for the approved one-item conversions and reset/disassembly overrides, including the startup troubleshooting notes.

Addons appear beneath their parent mod. Addons of addons retain their immediate parent in the relationship column. Each family has a separate **Connectors** table; a connector appears under every parent it bridges, including multi-integration mods. Repeated connector rows count as one mod entry in the totals. Generic library dependencies and ordinary item/energy compatibility do not make a mod a connector. A parent without crafting-table evidence is shown only as a context heading, without adding it to the audited mod list.

## Current crafting-table comparison

| Current assignment | Unique mod entries |
|---|---:|
| Stargazers | 32 |
| Mechanists | 24 |
| Spellcasters | 13 |
| Ritualists | 24 |
| science_shared | 13 |
| magic_shared | 8 |
| Everyone | 106 |
| Unassigned | 0 |

## Parent mods and their addons

### [Let's Do] Farm & Charm

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [\[Let's Do\] Farm & Charm](https://www.curseforge.com/projects/1038103) | `farm_and_charm` | Everyone | — | Applied the reviewed suggested fit. | `farm_and_charm:barley_ball` → `farm_and_charm:barley_ball` |
| ↳ Addon | [\[Let's Do\] Brewery - Farm&Charm Compat](https://www.curseforge.com/projects/1038106) | `brewery` | Everyone | — | Follows parent farm_and_charm. | `brewery:bar_counter` → `brewery:bar_counter` |

### Apotheosis

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Apotheosis](https://www.curseforge.com/minecraft/mc-mods/apotheosis) | `apotheosis` | Ritualists | — | Applied the reviewed suggested fit. | `apotheosis:augmenting_table` → `apotheosis:augmenting_table` |
| ↳ Companion module | [Apothic Enchanting](https://www.curseforge.com/minecraft/mc-mods/apothic-enchanting) | `apothic_enchanting` | Ritualists | — | Follows parent apotheosis. | `apothic_enchanting:apothic_enchanting_table` → `apothic_enchanting:apothic_enchanting_table` |

### Applied Energistics 2

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Applied Energistics 2](https://www.curseforge.com/minecraft/mc-mods/applied-energistics-2) | `ae2` | Stargazers | — | Applied the reviewed suggested fit. | `ae2:decorative/certus_quartz_bricks` → `ae2:quartz_bricks` |
| ↳ Addon | [AdvancedAE](https://www.curseforge.com/minecraft/mc-mods/advancedae) | `advanced_ae` | Stargazers | — | Follows parent ae2. | `advanced_ae:advanced_io_bus` → `advanced_ae:advanced_io_bus_part` |
| ↳ Addon | [AE2 Import Export Card](https://www.curseforge.com/projects/982512) | `ae2importexportcard` | Stargazers | — | Follows parent ae2. | `ae2importexportcard:block_picker_card` → `ae2importexportcard:block_picker_card` |
| ↳ Addon | [AE2 Network Analyser](https://www.curseforge.com/minecraft/mc-mods/ae2-network-analyser) | `ae2netanalyser` | Stargazers | — | Follows parent ae2. | `ae2netanalyser:analyser` → `ae2netanalyser:network_analyser` |
| ↳ Addon | [AE2 Tangible Bookmarks](https://www.curseforge.com/minecraft/mc-mods/ae2-tangible-bookmarks) | `ae2tb` | Stargazers | — | Follows parent ae2. | `ae2tb:terminal_bookmark_interact_card` → `ae2tb:terminal_bookmark_interact_card` |
| ↳ Addon | [Applied Energistics 2 Wireless Terminals](https://www.curseforge.com/minecraft/mc-mods/applied-energistics-2-wireless-terminals) | `ae2wtlib` | Stargazers | — | Follows parent ae2. | `ae2wtlib:magnet_card` → `ae2wtlib:magnet_card` |
| ↳↳ Addon of Applied Energistics 2 Wireless Terminals | [AE2 WCWT](https://www.curseforge.com/minecraft/mc-mods/ae2-wcwt) | `wcwt` | Stargazers | — | Follows parent ae2wtlib. | `wcwt:advanced_coding_card_from_ae2_cell_workbench` → `wcwt:advanced_coding_card` |
| ↳ Addon | [Applied Flux](https://www.curseforge.com/minecraft/mc-mods/applied-flux) | `appflux` | Stargazers | — | Follows parent ae2. | `appflux:16k_core` → `appflux:core_16k` |
| ↳ Addon | [Better P2P](https://www.curseforge.com/minecraft/mc-mods/betterp2p) | `betterp2p` | Stargazers | — | Follows parent ae2. | `betterp2p:advanced_memory_card` → `betterp2p:advanced_memory_card` |
| ↳ Addon | [Bigger AE2](https://www.curseforge.com/minecraft/mc-mods/bigger-ae2) | `bigger_ae2` | Stargazers | — | Follows parent ae2. | `bigger_ae2:1024_core_crafting_accelerator` → `bigger_ae2:1024_core_crafting_accelerator` |
| ↳ Addon | [EnderDrives](https://www.curseforge.com/minecraft/mc-mods/enderdrives) | `enderdrives` | Stargazers | — | Follows parent ae2. | `enderdrives:ender_disk_16k_advanced` → `enderdrives:ender_disk_16k` |
| ↳ Addon | [ExtendedAE](https://www.curseforge.com/projects/892005) | `extendedae` | Stargazers | — | Follows parent ae2. | `extendedae:assembler_matrix_frame` → `extendedae:assembler_matrix_frame` |
| ↳↳ Addon of ExtendedAE | [ExtendedAE-Plus](https://www.curseforge.com/minecraft/mc-mods/extendedae-plus) | `extendedae_plus` | Stargazers | — | Follows parent extendedae. | `extendedae_plus:assembler_matrix_crafter_plus` → `extendedae_plus:assembler_matrix_crafter_plus` |
| ↳ Addon | [ME Requester](https://www.curseforge.com/minecraft/mc-mods/merequester) | `merequester` | Stargazers | — | Follows parent ae2. | `merequester:requester` → `merequester:requester` |
| ↳ Addon | [MEGA Cells](https://www.curseforge.com/minecraft/mc-mods/mega-cells) | `megacells` | Stargazers | — | Follows parent ae2. | `megacells:cells/cell_component_16m` → `megacells:cell_component_16m` |
| ↳ Support library / AE2 extension | [Myotus Lib](https://www.curseforge.com/minecraft/mc-mods/myotus-lib) | `myotus` | Stargazers | — | Follows parent ae2. | `myotus:crafting/charged_ender_pearl_block` → `myotus:charged_ender_pearl_block` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** CC: Tweaked ↔ Applied Energistics 2 | [Advanced Peripherals](https://www.curseforge.com/minecraft/mc-mods/advanced-peripherals) | `advancedperipherals` | Everyone | — | User decision (October 26, 2026). | `advancedperipherals:ae_disk_cell_16m` → `advancedperipherals:ae_disk_cell_16m` |
| **Connector:** Applied Energistics 2 ↔ Mekanism | [Applied Mekanistics](https://www.curseforge.com/minecraft/mc-mods/applied-mekanistics) | `appmek` | Stargazers | — | Applied the reviewed suggested fit. | `appmek:chemical_cell_housing` → `appmek:chemical_cell_housing` |
| **Connector:** Applied Energistics 2 ↔ PneumaticCraft: Repressurized | [Applied Pneumatics](https://www.curseforge.com/minecraft/mc-mods/applied-pneumatics) | `appliedpneumatics` | Stargazers | — | User decision (October 26, 2026). | `appliedpneumatics:amadron_wireless_terminal` → `appliedpneumatics:amadron_wireless_terminal` |
| **Connector:** Applied Energistics 2 ↔ Replication | [Applied Replicatics](https://www.curseforge.com/projects/1440118) | `apprep` | Stargazers | — | Applied the reviewed suggested fit. | `apprep:cells/matter_cell_16k` → `apprep:matter_cell_16k` |
| **Connector:** Applied Energistics 2 ↔ Ars Nouveau | [Ars Énergistique](https://www.curseforge.com/minecraft/mc-mods/ars-energistique) | `arseng` | Stargazers | — | User decision (October 26, 2026). | `arseng:cable_source_acceptor` → `arseng:cable_source_acceptor` |
| **Connector:** Applied Energistics 2 ↔ Create | [Create Stock Bridge](https://www.curseforge.com/minecraft/mc-mods/create-stock-bridge) | `createstockbridge` | Stargazers | — | User decision (October 26, 2026). | `createstockbridge:ae_bridge` → `createstockbridge:ae_bridge` |
| **Connector:** Applied Energistics 2 ↔ Rechiseled | [Rechiseled: Applied Energistics 2](https://www.curseforge.com/minecraft/mc-mods/rechiseled-applied-energistics-2) | `rechiseledae` | Everyone | — | User decision (October 26, 2026). | `rechiseledae:chiseling_pattern_encoder` → `rechiseledae:chiseling_pattern_encoder` |
| **Connector:** Applied Energistics 2 ↔ Create | [Schematic Energistics](https://www.curseforge.com/projects/1283481) | `schematicenergistics` | science_shared | — | User decision (October 26, 2026). | `schematicenergistics:cannon_interface` → `schematicenergistics:cannon_interface` |
| **Connector:** CC: Tweaked ↔ Applied Energistics 2 | [UnlimitedPeripheralWorks](https://www.curseforge.com/projects/621851) | `peripheralworks` | Everyone | — | User decision (October 26, 2026). | `peripheralworks:ae2_pattern_pedestal` → `peripheralworks:ae2_pattern_pedestal` |

### Ars Nouveau

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Ars Nouveau](https://www.curseforge.com/minecraft/mc-mods/ars-nouveau) | `ars_nouveau` | Spellcasters | — | Applied the reviewed suggested fit. | `ars_nouveau:agronomic_sourcelink` → `ars_nouveau:agronomic_sourcelink` |
| ↳ Addon | [Ars Additions](https://www.curseforge.com/minecraft/mc-mods/ars-additions) | `ars_additions` | Spellcasters | — | Follows parent ars_nouveau. | `ars_additions:clear_advanced_dominion_wand` → `ars_additions:advanced_dominion_wand` |
| ↳ Addon | [Ars Controle](https://www.curseforge.com/minecraft/mc-mods/ars-controle) | `ars_controle` | Spellcasters | — | Follows parent ars_nouveau. | `ars_controle:scroll_holder` → `ars_controle:scroll_holder` |
| ↳ Addon | [Ars Elemental](https://www.curseforge.com/minecraft/mc-mods/ars-elemental) | `ars_elemental` | Spellcasters | — | Follows parent ars_nouveau. | `ars_elemental:advanced_prism` → `ars_elemental:advanced_prism` |
| ↳ Addon | [Ars Zero](https://www.curseforge.com/minecraft/mc-mods/ars-zero) | `ars_zero` | Spellcasters | — | Follows parent ars_nouveau. | `ars_zero:archwood_rod` → `ars_zero:archwood_rod` |
| ↳ Addon | [StarbuncleMania](https://www.curseforge.com/minecraft/mc-mods/starbunclemania) | `starbunclemania` | Spellcasters | — | Follows parent ars_nouveau. | `starbunclemania:alak_hat` → `starbunclemania:alak_hat` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** Ars Nouveau ↔ Create | [Ars Creo](https://www.curseforge.com/minecraft/mc-mods/ars-creo) | `ars_creo` | Mechanists | — | User decision (October 26, 2026). | `ars_creo:starbuncle_wheel` → `ars_creo:starbuncle_wheel` |
| **Connector:** Ars Nouveau ↔ Farmer's Delight | [Ars Nouveau's Flavors & Delight](https://www.curseforge.com/minecraft/mc-mods/ars-nouveaus-flavors-delight) | `arsdelight` | Everyone | — | User decision (October 26, 2026). | `arsdelight:archwood_cabinet` → `arsdelight:archwood_cabinet` |
| **Connector:** Ars Nouveau ↔ Create | [Ars Technica](https://www.curseforge.com/minecraft/mc-mods/ars-technica) | `ars_technica` | Spellcasters | — | Applied the reviewed suggested fit. | `ars_technica:gargantuan_experience_gem` → `ars_technica:gargantuan_experience_gem` |
| **Connector:** Applied Energistics 2 ↔ Ars Nouveau | [Ars Énergistique](https://www.curseforge.com/minecraft/mc-mods/ars-energistique) | `arseng` | Stargazers | — | User decision (October 26, 2026). | `arseng:cable_source_acceptor` → `arseng:cable_source_acceptor` |
| **Connector:** CC: Tweaked ↔ Ars Nouveau | [UnlimitedPeripheralWorks](https://www.curseforge.com/projects/621851) | `peripheralworks` | Everyone | — | User decision (October 26, 2026). | `peripheralworks:ae2_pattern_pedestal` → `peripheralworks:ae2_pattern_pedestal` |

### Artifacts

[Artifacts](https://www.curseforge.com/minecraft/mc-mods/artifacts) is a parent context only; it has no qualifying row in the saved crafting-table audit.

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** Relics ↔ Artifacts | [Reliquified Artifacts](https://www.curseforge.com/minecraft/mc-mods/reliquified-artifacts) | `reliquified_artifacts` | Ritualists | — | User decision (October 26, 2026). | `reliquified_artifacts:mimi_dust` → `reliquified_artifacts:mimi_dust` |

### CC: Tweaked

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [CC: Tweaked (Unofficial)](https://www.curseforge.com/projects/1527866) | `computercraft` | Everyone | — | User decision (October 26, 2026). | `computercraft:cable` → `computercraft:cable` |
| Parent / base mod | [CC: Tweaked](https://modrinth.com/mod/gu7yAYhd) | `computercraft` | Everyone | — | User decision (October 26, 2026). | `computercraft:cable` → `computercraft:cable` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** CC: Tweaked ↔ Applied Energistics 2 ↔ Mekanism | [Advanced Peripherals](https://www.curseforge.com/minecraft/mc-mods/advanced-peripherals) | `advancedperipherals` | Everyone | — | User decision (October 26, 2026). | `advancedperipherals:ae_disk_cell_16m` → `advancedperipherals:ae_disk_cell_16m` |
| **Connector:** CC: Tweaked ↔ Applied Energistics 2 ↔ Ars Nouveau ↔ Create ↔ Flux Networks ↔ Hostile Neural Networks ↔ Integrated Dynamics ↔ Modern Industrialization ↔ Nature's Compass ↔ Occultism ↔ Powah! (Rearchitected) ↔ Theurgy | [UnlimitedPeripheralWorks](https://www.curseforge.com/projects/621851) | `peripheralworks` | Everyone | — | User decision (October 26, 2026). | `peripheralworks:ae2_pattern_pedestal` → `peripheralworks:ae2_pattern_pedestal` |

### Create

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Create](https://www.curseforge.com/minecraft/mc-mods/create) | `create` | Mechanists | — | Applied the reviewed suggested fit. | `create:acacia_window` → `create:acacia_window` |
| ↳ Addon | [Create Big Cannons](https://modrinth.com/mod/GWp4jCJj) | `createbigcannons` | Mechanists | — | Follows parent create. | `createbigcannons:ap_autocannon_round` → `createbigcannons:ap_autocannon_round` |
| ↳↳ Addon of Create Big Cannons | [Create: Radars](https://modrinth.com/mod/BLu2Yqfq) | `create_radar` | Mechanists | — | Follows parent createbigcannons. | `create_radar:crafting/auto_pitch_controller` → `create_radar:auto_pitch_controller` |
| ↳ Addon | [Create Crafts & Additions](https://www.curseforge.com/projects/439890) | `createaddition` | Mechanists | — | Follows parent create. | `createaddition:crafting/barbed_wire` → `createaddition:barbed_wire` |
| ↳ Addon | [Create Deco](https://www.curseforge.com/minecraft/mc-mods/create-deco) | `createdeco` | Mechanists | — | Follows parent create. | `createdeco:andesite_catwalk_stairs` → `createdeco:andesite_catwalk_stairs` |
| ↳ Addon | [Create Encased](https://www.curseforge.com/minecraft/mc-mods/create-encased) | `createcasing` | Mechanists | — | Follows parent create. | `createcasing:crafting/adjustable_chain_drive/brass` → `createcasing:brass_adjustable_chain_gearshift` |
| ↳ Addon | [Create: Bells & Whistles](https://www.curseforge.com/minecraft/mc-mods/bellsandwhistles) | `bellsandwhistles` | Mechanists | — | Follows parent create. | `bellsandwhistles:bogie_steps/andesite_bogie_steps` → `bellsandwhistles:andesite_bogie_steps` |
| ↳ Addon | [Create: Enchantment Industry](https://www.curseforge.com/projects/688768) | `create_enchantment_industry` | Mechanists | — | Follows parent create. | `create_enchantment_industry:crafting/affix_augmentor` → `create_enchantment_industry:affix_augmentor` |
| ↳ Addon | [Create: Filters Anywhere](https://www.curseforge.com/minecraft/mc-mods/create-filters-anywhere) | `createfiltersanywhere` | Mechanists | — | Follows parent create. | `createfiltersanywhere:attribute_filter_alt` → `create:attribute_filter` |
| ↳ Addon | [Create: Hypertubes](https://www.curseforge.com/minecraft/mc-mods/hypertubes) | `create_hypertube` | Mechanists | — | Follows parent create. | `create_hypertube:hyper_accelerator_small_cogwheel` → `create_hypertube:hypertube_accelerator` |
| ↳ Addon | [Create: Pattern Schematics](https://www.curseforge.com/minecraft/mc-mods/create-pattern-schematics) | `create_pattern_schematics` | Mechanists | — | Follows parent create. | `create_pattern_schematics:pattern_schematic` → `create_pattern_schematics:empty_pattern_schematic` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** Ars Nouveau ↔ Create | [Ars Creo](https://www.curseforge.com/minecraft/mc-mods/ars-creo) | `ars_creo` | Mechanists | — | User decision (October 26, 2026). | `ars_creo:starbuncle_wheel` → `ars_creo:starbuncle_wheel` |
| **Connector:** Ars Nouveau ↔ Create | [Ars Technica](https://www.curseforge.com/minecraft/mc-mods/ars-technica) | `ars_technica` | Spellcasters | — | Applied the reviewed suggested fit. | `ars_technica:gargantuan_experience_gem` → `ars_technica:gargantuan_experience_gem` |
| **Connector:** Applied Energistics 2 ↔ Create | [Create Stock Bridge](https://www.curseforge.com/minecraft/mc-mods/create-stock-bridge) | `createstockbridge` | Stargazers | — | User decision (October 26, 2026). | `createstockbridge:ae_bridge` → `createstockbridge:ae_bridge` |
| **Connector:** Applied Energistics 2 ↔ Create | [Schematic Energistics](https://www.curseforge.com/projects/1283481) | `schematicenergistics` | science_shared | — | User decision (October 26, 2026). | `schematicenergistics:cannon_interface` → `schematicenergistics:cannon_interface` |
| **Connector:** CC: Tweaked ↔ Create | [UnlimitedPeripheralWorks](https://www.curseforge.com/projects/621851) | `peripheralworks` | Everyone | — | User decision (October 26, 2026). | `peripheralworks:ae2_pattern_pedestal` → `peripheralworks:ae2_pattern_pedestal` |

### Exposure

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Exposure](https://www.curseforge.com/projects/871755) | `exposure` | Mechanists | — | User decision (October 26, 2026). | `exposure:album` → `exposure:album` |
| ↳ Addon | [Exposure: Polaroid](https://www.curseforge.com/minecraft/mc-mods/exposure-polaroid) | `exposure_polaroid` | Mechanists | — | Follows parent exposure. | `exposure_polaroid:high_sensitivity_instant_black_and_white_slide` → `exposure_polaroid:high_sensitivity_instant_black_and_white_slide` |

### Farmer's Delight

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Farmer's Delight](https://www.curseforge.com/minecraft/mc-mods/farmers-delight) | `farmersdelight` | Everyone | — | User decision (October 26, 2026). | `farmersdelight:acacia_cabinet` → `farmersdelight:acacia_cabinet` |
| ↳ Addon | [Barbeque's Delight \[Forge/NeoForge\]](https://www.curseforge.com/minecraft/mc-mods/barbeques-delight) | `barbequesdelight` | Everyone | — | Follows parent farmersdelight. | `barbequesdelight:grill` → `barbequesdelight:grill` |
| ↳ Addon | [Display Delight](https://www.curseforge.com/minecraft/mc-mods/display-delight) | `displaydelight` | Everyone | — | Follows parent farmersdelight. | `displaydelight:food_plate` → `displaydelight:food_plate` |
| ↳ Addon | [Dumplings Delight Rewrapped](https://www.curseforge.com/minecraft/mc-mods/dumplings-delight-rewrapped) | `dumplings_delight` | Everyone | — | Follows parent farmersdelight. | `dumplings_delight:celery_crate` → `dumplings_delight:celery_crate` |
| ↳ Addon | [End's Delight](https://www.curseforge.com/minecraft/mc-mods/ends-delight) | `ends_delight` | Everyone | — | Follows parent farmersdelight. | `ends_delight:chorus_fruit_crate` → `ends_delight:chorus_fruit_crate` |
| ↳ Addon | [Fruits Delight](https://www.curseforge.com/minecraft/mc-mods/fruits-delight) | `fruitsdelight` | Everyone | — | Follows parent farmersdelight. | `fruitsdelight:apple_crate` → `fruitsdelight:apple_crate` |
| ↳ Addon | [More Delight (Forge & Neoforge)](https://www.curseforge.com/minecraft/mc-mods/more-delight-forge) | `moredelight` | Everyone | — | Follows parent farmersdelight. | `moredelight:chicken_salad` → `moredelight:chicken_salad` |
| ↳ Addon | [Ocean's Delight](https://www.curseforge.com/minecraft/mc-mods/oceans-delight) | `oceansdelight` | Everyone | — | Follows parent farmersdelight. | `oceansdelight:cabbage_wrapped_elder_guardian` → `oceansdelight:cabbage_wrapped_elder_guardian` |
| ↳ Addon | [Rustic Delight](https://www.curseforge.com/minecraft/mc-mods/rustic-delight) | `rusticdelight` | Everyone | — | Follows parent farmersdelight. | `rusticdelight:potato_salad` → `rusticdelight:potato_salad` |
| ↳ Addon | [Storage Delight (Forge & Neoforge)](https://www.curseforge.com/projects/979761) | `storagedelight` | Everyone | — | Follows parent farmersdelight. | `storagedelight:acacia_bookshelf_with_door` → `storagedelight:acacia_bookshelf_with_door` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** Ars Nouveau ↔ Farmer's Delight | [Ars Nouveau's Flavors & Delight](https://www.curseforge.com/minecraft/mc-mods/ars-nouveaus-flavors-delight) | `arsdelight` | Everyone | — | User decision (October 26, 2026). | `arsdelight:archwood_cabinet` → `arsdelight:archwood_cabinet` |
| **Connector:** Farmer's Delight ↔ The Twilight Forest | [Twilight's Flavors & Delight](https://www.curseforge.com/minecraft/mc-mods/twilights-flavors-delight) | `twilightdelight` | Ritualists | — | User decision (October 26, 2026). | `twilightdelight:aurora_pie` → `twilightdelight:aurora_pie` |

### Flux Networks

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Flux Networks](https://www.curseforge.com/minecraft/mc-mods/flux-networks) | `fluxnetworks` | Everyone | — | User decision (October 26, 2026). | `fluxnetworks:basic_flux_storage` → `fluxnetworks:basic_flux_storage` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** CC: Tweaked ↔ Flux Networks | [UnlimitedPeripheralWorks](https://www.curseforge.com/projects/621851) | `peripheralworks` | Everyone | — | User decision (October 26, 2026). | `peripheralworks:ae2_pattern_pedestal` → `peripheralworks:ae2_pattern_pedestal` |

### FramedBlocks

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [FramedBlocks](https://www.curseforge.com/minecraft/mc-mods/framedblocks) | `framedblocks` | Everyone | — | Applied the reviewed suggested fit. | `framedblocks:framed_activator_rail_slope` → `framedblocks:framed_activator_rail_slope` |
| ↳ Addon | [FramedBlocksPlus](https://www.curseforge.com/minecraft/mc-mods/framedblocksplus) | `framedblocksplus` | Everyone | — | Follows parent framedblocks. | `framedblocksplus:framed_channel` → `framedblocksplus:framed_channel` |

### Functional Storage

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Functional Storage](https://www.curseforge.com/minecraft/mc-mods/functional-storage) | `functionalstorage` | Everyone | — | User decision (October 26, 2026). | `functionalstorage:obsidian_upgrade` → `functionalstorage:obsidian_upgrade` |
| ↳ Addon | [More Functional Storage](https://www.curseforge.com/minecraft/mc-mods/more-functional-storage) | `morefunctionalstorage` | Everyone | — | Follows parent functionalstorage. | `morefunctionalstorage:breaker_upgrade` → `morefunctionalstorage:breaker_upgrade` |

### Hostile Neural Networks

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Hostile Neural Networks](https://www.curseforge.com/minecraft/mc-mods/hostile-neural-networks) | `hostilenetworks` | science_shared | — | Applied the reviewed suggested fit. | `hostilenetworks:data_center` → `hostilenetworks:data_center` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** CC: Tweaked ↔ Hostile Neural Networks | [UnlimitedPeripheralWorks](https://www.curseforge.com/projects/621851) | `peripheralworks` | Everyone | — | User decision (October 26, 2026). | `peripheralworks:ae2_pattern_pedestal` → `peripheralworks:ae2_pattern_pedestal` |

### Integrated Dynamics

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Integrated Dynamics](https://www.curseforge.com/projects/236307) | `integrateddynamics`, `integrateddynamicscompat` | magic_shared | — | User decision (October 26, 2026). | `integrateddynamics:crafting/cable` → `integrateddynamics:cable` |
| ↳ Addon | [Integrated Scripting](https://www.curseforge.com/minecraft/mc-mods/integrated-scripting) | `integratedscripting` | magic_shared | — | Follows parent integrateddynamics. | `integratedscripting:crafting/part_terminal_scripting` → `integratedscripting:part_terminal_scripting` |
| ↳ Addon | [Integrated Tunnels](https://www.curseforge.com/projects/251389) | `integratedtunnels`, `integratedtunnelscompat` | magic_shared | — | Follows parent integrateddynamics. | `integratedtunnels:crafting/part_exporter_energy` → `integratedtunnels:part_exporter_energy` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** CC: Tweaked ↔ Integrated Dynamics | [UnlimitedPeripheralWorks](https://www.curseforge.com/projects/621851) | `peripheralworks` | Everyone | — | User decision (October 26, 2026). | `peripheralworks:ae2_pattern_pedestal` → `peripheralworks:ae2_pattern_pedestal` |

### Iron's Spells 'n Spellbooks

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Iron's Spells 'n Spellbooks](https://www.curseforge.com/minecraft/mc-mods/irons-spells-n-spellbooks) | `irons_spellbooks` | Spellcasters | — | Applied the reviewed suggested fit. | `irons_spellbooks:affinity_ring` → `irons_spellbooks:affinity_ring` |
| ↳ Addon | [Crystal Chronicles - Iron's Spells 'n Spellbooks](https://www.curseforge.com/minecraft/mc-mods/crystal-chronicles) | `crystal_chronicles` | Spellcasters | — | Follows parent irons_spellbooks. | `crystal_chronicles:aurum_slab` → `crystal_chronicles:aurum_slab` |
| ↳ Addon | [GTBC's Spellbooks - Iron's Spells Addon](https://www.curseforge.com/minecraft/mc-mods/gtbcs-spellbooks) | `gametechbcs_spellbooks` | Spellcasters | — | Follows parent irons_spellbooks. | `gametechbcs_spellbooks:gtbcs_magical_repository` → `gametechbcs_spellbooks:gtbcs_magical_repository` |
| ↳ Addon | [Hazen 'N Stuff](https://www.curseforge.com/minecraft/mc-mods/hazen-n-stuff) | `hazennstuff` | Spellcasters | — | Follows parent irons_spellbooks. | `hazennstuff:crafting/armor/alchemist_supreme/alchemist_supreme_boots` → `hazennstuff:alchemist_supreme_boots` |
| ↳ Support library with craftable content | [HazentouveLib](https://www.curseforge.com/minecraft/mc-mods/hazentouvelib) | `hazentouvelib` | Spellcasters | — | Follows parent irons_spellbooks. | `hazentouvelib:crafting/runes/cosmic_rune` → `hazentouvelib:cosmic_rune` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** L_Ender 's Cataclysm ↔ Iron's Spells 'n Spellbooks | [Cataclysm: Spellbooks](https://www.curseforge.com/minecraft/mc-mods/cataclysm-spellbooks) | `cataclysm_spellbooks` | Ritualists | — | Applied the reviewed suggested fit. | `cataclysm_spellbooks:abyssal_rune` → `cataclysm_spellbooks:abyssal_rune` |

### L_Ender 's Cataclysm

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [L_Ender 's Cataclysm](https://www.curseforge.com/minecraft/mc-mods/lendercataclysm) | `cataclysm` | Ritualists | — | Applied the reviewed suggested fit. | `cataclysm:abyss_eye` → `cataclysm:abyss_eye` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** L_Ender 's Cataclysm ↔ Iron's Spells 'n Spellbooks | [Cataclysm: Spellbooks](https://www.curseforge.com/minecraft/mc-mods/cataclysm-spellbooks) | `cataclysm_spellbooks` | Ritualists | — | Applied the reviewed suggested fit. | `cataclysm_spellbooks:abyssal_rune` → `cataclysm_spellbooks:abyssal_rune` |

### Mekanism

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Mekanism](https://www.curseforge.com/minecraft/mc-mods/mekanism) | `mekanism` | Stargazers | — | Applied the reviewed suggested fit. | `mekanism:antiprotonic_nucleosynthesizer` → `mekanism:antiprotonic_nucleosynthesizer` |
| ↳ Addon | [Gravitational Modulating Additional Unit](https://www.curseforge.com/minecraft/mc-mods/gravitational-modulating-additional-unit) | `gmut` | Stargazers | — | Follows parent mekanism. | `gmut:module_gravitational_modulating_additional_unit` → `gmut:module_gravitational_modulating_additional_unit` |
| ↳ Addon | [Mekanism Extras](https://www.curseforge.com/minecraft/mc-mods/mekanism-extras) | `mekanism_extras` | Stargazers | — | Follows parent mekanism. | `mekanism_extras:control_circuit/absolute` → `mekanism_extras:absolute_control_circuit` |
| ↳ Addon | [Mekanism Generators](https://www.curseforge.com/minecraft/mc-mods/mekanism-generators) | `mekanismgenerators` | Stargazers | — | Follows parent mekanism. | `mekanismgenerators:electromagnetic_coil` → `mekanismgenerators:electromagnetic_coil` |
| ↳ Addon | [Mekanism Tools](https://www.curseforge.com/minecraft/mc-mods/mekanism-tools) | `mekanismtools` | Stargazers | — | Follows parent mekanism. | `mekanismtools:bronze/armor/boots` → `mekanismtools:bronze_boots` |
| ↳ Addon | [Mekanism: Weapons](https://www.curseforge.com/projects/929829) | `mekaweapons` | Stargazers | — | Follows parent mekanism. | `mekaweapons:bow_riser` → `mekaweapons:bow_riser` |
| ↳ Addon | [Mekanism:More Machine](https://www.curseforge.com/minecraft/mc-mods/mekanism-more-machine) | `mekmm` | Stargazers | — | Follows parent mekanism. | `mekmm:ambient_gas_collector` → `mekmm:ambient_gas_collector` |
| ↳ Addon | [More Mekanism Processing](https://www.curseforge.com/minecraft/mc-mods/more-mekanism-processing) | `moremekanismprocessing` | Stargazers | — | Follows parent mekanism. | `moremekanismprocessing:processing/aluminum/ingot/from_nugget` → `moremekanismprocessing:aluminum_ingot` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** CC: Tweaked ↔ Mekanism | [Advanced Peripherals](https://www.curseforge.com/minecraft/mc-mods/advanced-peripherals) | `advancedperipherals` | Everyone | — | User decision (October 26, 2026). | `advancedperipherals:ae_disk_cell_16m` → `advancedperipherals:ae_disk_cell_16m` |
| **Connector:** Applied Energistics 2 ↔ Mekanism | [Applied Mekanistics](https://www.curseforge.com/minecraft/mc-mods/applied-mekanistics) | `appmek` | Stargazers | — | Applied the reviewed suggested fit. | `appmek:chemical_cell_housing` → `appmek:chemical_cell_housing` |
| **Connector:** Mekanism ↔ Modular Routers | [Mekanistic Routers](https://www.curseforge.com/minecraft/mc-mods/mekanistic-routers) | `mekanisticrouters` | science_shared | — | Follows parent modularrouters. | `mekanisticrouters:chemical_module_mk1` → `mekanisticrouters:chemical_module_mk1` |

### Modern Industrialization

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Modern Industrialization](https://www.curseforge.com/minecraft/mc-mods/modern-industrialization) | `modern_industrialization` | Mechanists | — | User decision (October 26, 2026). | `modern_industrialization:armor/diesel_jetpack` → `modern_industrialization:diesel_jetpack` |
| ↳ Addon | [Extended Industrialization](https://www.curseforge.com/minecraft/mc-mods/extended-industrialization) | `extended_industrialization` | Mechanists | — | Follows parent modern_industrialization. | `extended_industrialization:casing/craft/steel_plated_bricks` → `extended_industrialization:steel_plated_bricks` |
| ↳ Addon | [Industrialization Overdrive](https://www.curseforge.com/projects/1089065) | `industrialization_overdrive` | Mechanists | — | Follows parent modern_industrialization. | `industrialization_overdrive:machines/multi_processing_array/craft` → `industrialization_overdrive:multi_processing_array` |
| ↳ Addon | [MI Tweaks](https://www.curseforge.com/minecraft/mc-mods/mi-tweaks) | `mi_tweaks` | Mechanists | — | Follows parent modern_industrialization. | `mi_tweaks:flux_transformer` → `mi_tweaks:flux_transformer` |
| ↳ Addon | [MI Utilities](https://www.curseforge.com/projects/1668499) | `mi_utilities` | Mechanists | — | Follows parent modern_industrialization. | `mi_utilities:items/tier_swapper` → `mi_utilities:tier_swapper` |
| ↳ Assigned companion (user decision) | [Modern Dynamics](https://www.curseforge.com/minecraft/mc-mods/modern-dynamics) | `moderndynamics` | Mechanists | — | Follows parent modern_industrialization. | `moderndynamics:attractor` → `moderndynamics:attractor` |
| ↳ Addon | [Modern Industrialization Sound Addon](https://www.curseforge.com/minecraft/mc-mods/modern-industrialization-sound-addon) | `mi_sound_addon` | Mechanists | — | Follows parent modern_industrialization. | `mi_sound_addon:mallet` → `mi_sound_addon:mallet` |
| ↳ Addon | [Yet Another Industrialization!](https://www.curseforge.com/projects/1358516) | `yet_another_industrialization` | Mechanists | — | Follows parent modern_industrialization. | `yet_another_industrialization:craft/advanced_mixed_input_hatch` → `yet_another_industrialization:advanced_mixed_input_hatch` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** Modern Industrialization ↔ Modular Routers | [Modern Industrial Routers](https://www.curseforge.com/minecraft/mc-mods/modern-industrial-routers) | `modernindustrialrouters` | science_shared | — | Follows parent modularrouters. | `modernindustrialrouters:ev_upgrade` → `modernindustrialrouters:ev_upgrade` |
| **Connector:** CC: Tweaked ↔ Modern Industrialization | [UnlimitedPeripheralWorks](https://www.curseforge.com/projects/621851) | `peripheralworks` | Everyone | — | User decision (October 26, 2026). | `peripheralworks:ae2_pattern_pedestal` → `peripheralworks:ae2_pattern_pedestal` |

### Modular Routers

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Modular Routers](https://www.curseforge.com/minecraft/mc-mods/modular-routers) | `modularrouters` | science_shared | — | User decision (October 26, 2026). | `modularrouters:activator_module` → `modularrouters:activator_module` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** Mekanism ↔ Modular Routers | [Mekanistic Routers](https://www.curseforge.com/minecraft/mc-mods/mekanistic-routers) | `mekanisticrouters` | science_shared | — | Follows parent modularrouters. | `mekanisticrouters:chemical_module_mk1` → `mekanisticrouters:chemical_module_mk1` |
| **Connector:** Modern Industrialization ↔ Modular Routers | [Modern Industrial Routers](https://www.curseforge.com/minecraft/mc-mods/modern-industrial-routers) | `modernindustrialrouters` | science_shared | — | Follows parent modularrouters. | `modernindustrialrouters:ev_upgrade` → `modernindustrialrouters:ev_upgrade` |

### Nature's Compass

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Nature's Compass](https://www.curseforge.com/minecraft/mc-mods/natures-compass) | `naturescompass` | Ritualists | — | User decision (October 26, 2026). | `naturescompass:natures_compass` → `naturescompass:naturescompass` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** CC: Tweaked ↔ Nature's Compass | [UnlimitedPeripheralWorks](https://www.curseforge.com/projects/621851) | `peripheralworks` | Everyone | — | User decision (October 26, 2026). | `peripheralworks:ae2_pattern_pedestal` → `peripheralworks:ae2_pattern_pedestal` |

### Neo Vitae

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Neo Vitae](https://www.curseforge.com/projects/1404763) | `neovitae` | Ritualists | — | Applied the reviewed suggested fit. | `neovitae:ara_vitae` → `neovitae:ara_vitae` |
| ↳ Addon | [Animus](https://www.curseforge.com/projects/229664) | `animusnv` | Ritualists | — | Follows parent neovitae. | `animusnv:arcane_rune` → `animusnv:arcane_rune` |

### Occultism

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Occultism](https://www.curseforge.com/minecraft/mc-mods/occultism) | `occultism` | Ritualists | — | Applied the reviewed suggested fit. | `occultism:crafting/book_of_binding_afrit` → `occultism:book_of_binding_afrit` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** CC: Tweaked ↔ Occultism | [UnlimitedPeripheralWorks](https://www.curseforge.com/projects/621851) | `peripheralworks` | Everyone | — | User decision (October 26, 2026). | `peripheralworks:ae2_pattern_pedestal` → `peripheralworks:ae2_pattern_pedestal` |

### Oh The Biomes We've Gone

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Oh The Biomes We've Gone](https://www.curseforge.com/minecraft/mc-mods/oh-the-biomes-weve-gone) | `biomeswevegone` | Everyone | — | Applied the reviewed suggested fit. | `biomeswevegone:allium_oddion_soup` → `biomeswevegone:allium_oddion_soup` |
| ↳ Addon | [All The Wood We've Got](https://www.curseforge.com/minecraft/mc-mods/all-the-wood-weve-got) | `woodwevegot` | Everyone | — | Follows parent biomeswevegone. | `woodwevegot:aspen_barrel` → `woodwevegot:aspen_barrel` |

### PneumaticCraft: Repressurized

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [PneumaticCraft: Repressurized](https://www.curseforge.com/minecraft/mc-mods/pneumaticcraft-repressurized) | `pneumaticcraft` | Mechanists | — | Applied the reviewed suggested fit. | `pneumaticcraft:aerial_interface` → `pneumaticcraft:aerial_interface` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** Applied Energistics 2 ↔ PneumaticCraft: Repressurized | [Applied Pneumatics](https://www.curseforge.com/minecraft/mc-mods/applied-pneumatics) | `appliedpneumatics` | Stargazers | — | User decision (October 26, 2026). | `appliedpneumatics:amadron_wireless_terminal` → `appliedpneumatics:amadron_wireless_terminal` |

### Powah! (Rearchitected)

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Powah! (Rearchitected)](https://www.curseforge.com/minecraft/mc-mods/powah-rearchitected) | `powah` | Stargazers | — | User decision (October 26, 2026). | `powah:crafting/aerial_pearl` → `powah:aerial_pearl` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** CC: Tweaked ↔ Powah! (Rearchitected) | [UnlimitedPeripheralWorks](https://www.curseforge.com/projects/621851) | `peripheralworks` | Everyone | — | User decision (October 26, 2026). | `peripheralworks:ae2_pattern_pedestal` → `peripheralworks:ae2_pattern_pedestal` |

### Rechiseled

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Rechiseled](https://www.curseforge.com/projects/558998) | `rechiseled` | Everyone | — | Applied the reviewed suggested fit. | `rechiseled:chisel` → `rechiseled:chisel` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** Applied Energistics 2 ↔ Rechiseled | [Rechiseled: Applied Energistics 2](https://www.curseforge.com/minecraft/mc-mods/rechiseled-applied-energistics-2) | `rechiseledae` | Everyone | — | User decision (October 26, 2026). | `rechiseledae:chiseling_pattern_encoder` → `rechiseledae:chiseling_pattern_encoder` |

### Relics

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Relics](https://www.curseforge.com/minecraft/mc-mods/relics-mod) | `relics` | Ritualists | — | User decision (October 26, 2026). | `relics:gold_ingot_from_golden_tooth` → `minecraft:gold_ingot` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** Relics ↔ Artifacts | [Reliquified Artifacts](https://www.curseforge.com/minecraft/mc-mods/reliquified-artifacts) | `reliquified_artifacts` | Ritualists | — | User decision (October 26, 2026). | `reliquified_artifacts:mimi_dust` → `reliquified_artifacts:mimi_dust` |

### Replication

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Replication](https://www.curseforge.com/minecraft/mc-mods/replication) | `replication` | science_shared | — | User decision (October 26, 2026). | `replication:matter_blueprint` → `replication:matter_blueprint` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** Applied Energistics 2 ↔ Replication | [Applied Replicatics](https://www.curseforge.com/projects/1440118) | `apprep` | Stargazers | — | Applied the reviewed suggested fit. | `apprep:cells/matter_cell_16k` → `apprep:matter_cell_16k` |

### Sophisticated Storage

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Sophisticated Storage](https://www.curseforge.com/minecraft/mc-mods/sophisticated-storage) | `sophisticatedstorage` | Everyone | — | Applied the reviewed suggested fit. | `sophisticatedstorage:controller` → `sophisticatedstorage:controller` |
| ↳ Addon | [Sophisticated Storage in Motion](https://www.curseforge.com/minecraft/mc-mods/sophisticated-storage-in-motion) | `sophisticatedstorageinmotion` | Everyone | — | User decision (October 26, 2026). | `sophisticatedstorageinmotion:acacia_storage_boat_from_vanilla` → `sophisticatedstorageinmotion:storage_boat` |

### The Twilight Forest

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [The Twilight Forest](https://www.curseforge.com/minecraft/mc-mods/the-twilight-forest) | `twilightforest` | Ritualists | — | Applied the reviewed suggested fit. | `twilightforest:alpha_yeti_banner_pattern` → `twilightforest:alpha_yeti_banner_pattern` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** Farmer's Delight ↔ The Twilight Forest | [Twilight's Flavors & Delight](https://www.curseforge.com/minecraft/mc-mods/twilights-flavors-delight) | `twilightdelight` | Ritualists | — | User decision (October 26, 2026). | `twilightdelight:aurora_pie` → `twilightdelight:aurora_pie` |

### Theurgy

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [Theurgy](https://www.curseforge.com/minecraft/mc-mods/theurgy) | `theurgy` | magic_shared | — | User decision (October 26, 2026). | `theurgy:crafting/shaped/amethyst_divination_rod` → `theurgy:amethyst_divination_rod` |

#### Connectors

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| **Connector:** CC: Tweaked ↔ Theurgy | [UnlimitedPeripheralWorks](https://www.curseforge.com/projects/621851) | `peripheralworks` | Everyone | — | User decision (October 26, 2026). | `peripheralworks:ae2_pattern_pedestal` → `peripheralworks:ae2_pattern_pedestal` |

### XyCraft: World

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Parent / base mod | [XyCraft: World](https://www.curseforge.com/minecraft/mc-mods/xycraft-world) | `xycraft_world` | science_shared | — | Applied the reviewed suggested fit. | `xycraft:packing/aluminum_ingot_forced` → `xycraft_world:aluminum_ingot` |
| ↳ XyCraft companion module | [XyCraft: Machines](https://www.curseforge.com/minecraft/mc-mods/xycraft-machines) | `xycraft_machines` | science_shared | — | Follows parent xycraft_world. | `xycraft:shaped/aluminum_wrench` → `xycraft_machines:aluminum_wrench` |
| ↳ XyCraft companion module | [XyCraft: Override](https://www.curseforge.com/minecraft/mc-mods/xycraft-override) | `xycraft_override` | science_shared | — | Follows parent xycraft_world. | `xycraft_override:shaped/bricks_blue` → `xycraft_override:bricks_blue` |

## Standalone mods

These have no identified parent/addon relationship in this review. Sharing a theme or author does not make one mod an addon of another.

| Relationship | Mod | Mod ID | Current assignment | Suggested fit if unassigned | Reason | Example crafting-table recipe → output |
|---|---|---|---|---|---|---|
| Standalone / independent utility | [\[Let's Do\] Beachparty](https://www.curseforge.com/projects/858691) | `beachparty` | Everyone | — | Applied the reviewed suggested fit. | `beachparty:beach_chair` → `beachparty:beach_chair` |
| Standalone / independent utility | [\[Let's Do\] HerbalBrews](https://www.curseforge.com/projects/951221) | `herbalbrews` | Everyone | — | Applied the reviewed suggested fit. | `herbalbrews:cauldron` → `herbalbrews:cauldron` |
| Standalone / independent utility | [\[Let's Do\] Vinery](https://www.curseforge.com/projects/704465) | `vinery` | Everyone | — | Applied the reviewed suggested fit. | `vinery:acacia_lattice` → `vinery:acacia_lattice` |
| Standalone / independent utility | [Actually Additions](https://www.curseforge.com/minecraft/mc-mods/actually-additions) | `actuallyadditions` | science_shared | — | Applied the reviewed suggested fit. | `actuallyadditions:advanced_coil` → `actuallyadditions:advanced_coil` |
| Standalone / independent utility | [AdachiRei-nui](https://modrinth.com/mod/zA0tDCfF) | `adachirei_nui` | Everyone | — | Applied the reviewed suggested fit. | `adachirei-nui:adachi-nui` → `adachirei-nui:adachi-nui` |
| Standalone / independent utility | [Akashic Tome](https://www.curseforge.com/minecraft/mc-mods/akashic-tome) | `akashictome` | Everyone | — | Applied the reviewed suggested fit. | `akashictome:tome` → `akashictome:tome` |
| Standalone / independent utility | [Animal Feeding Trough \[Fabric / Forge / Quilt / NeoForge\]](https://www.curseforge.com/minecraft/mc-mods/animal-feeding-trough) | `animal_feeding_trough` | Everyone | — | Applied the reviewed suggested fit. | `animal_feeding_trough:feeding_trough` → `animal_feeding_trough:feeding_trough` |
| Standalone / independent utility | [Animal Pens](https://www.curseforge.com/minecraft/mc-mods/animal-pens) | `animal_pen` | Everyone | — | Applied the reviewed suggested fit. | `animal_pen:animal_cage` → `animal_pen:animal_cage` |
| Standalone / independent utility | [Aquaculture 2](https://www.curseforge.com/minecraft/mc-mods/aquaculture) | `aquaculture` | Everyone | — | Applied the reviewed suggested fit. | `aquaculture:acacia_fish_mount` → `aquaculture:acacia_fish_mount` |
| Standalone / independent utility | [Arts & Crafts](https://www.curseforge.com/minecraft/mc-mods/artsandcrafts) | `arts_and_crafts` | Everyone | — | Applied the reviewed suggested fit. | `arts_and_crafts:beige_pietraforte_brick_slab` → `arts_and_crafts:beige_pietraforte_brick_slab` |
| Standalone / independent utility | [Bank Storage](https://www.curseforge.com/minecraft/mc-mods/bank-storage) | `bankstorage` | Everyone | — | Applied the reviewed suggested fit. | `bankstorage:bank_dock` → `bankstorage:bank_dock` |
| Standalone / independent utility | [Bosses of Mass Destruction \[Forge / NeoForge\]](https://www.curseforge.com/minecraft/mc-mods/bosses-of-mass-destruction-forge) | `bosses_of_mass_destruction` | Ritualists | — | Applied the reviewed suggested fit. | `bosses_of_mass_destruction:blast_amplifier` → `bosses_of_mass_destruction:monolith_block` |
| Standalone / independent utility | [Building Gadgets](https://www.curseforge.com/minecraft/mc-mods/building-gadgets) | `buildinggadgets2` | Everyone | — | Applied the reviewed suggested fit. | `buildinggadgets2:gadget_building` → `buildinggadgets2:gadget_building` |
| Standalone / independent utility | [Chipped](https://www.curseforge.com/minecraft/mc-mods/chipped) | `chipped` | Everyone | — | Applied the reviewed suggested fit. | `chipped:alchemy_book` → `chipped:alchemy_book` |
| Standalone / independent utility | [Cognition (Experience Obelisk)](https://www.curseforge.com/minecraft/mc-mods/cognition-mod) | `cognition` | Ritualists | — | Applied the reviewed suggested fit. | `cognition:accelerator` → `cognition:accelerator` |
| Standalone / independent utility | [Compact Machines](https://www.curseforge.com/minecraft/mc-mods/compact-machines) | `compactmachines` | Everyone | — | User decision (October 26, 2026). | `compactmachines:enlarging_module` → `compactmachines:enlarging_module` |
| Standalone / independent utility | [Construction Sticks](https://www.curseforge.com/minecraft/mc-mods/construction-sticks) | `constructionstick` | Everyone | — | Applied the reviewed suggested fit. | `constructionstick:copper_stick` → `constructionstick:copper_stick` |
| Standalone / independent utility | [Cooking for Blockheads](https://www.curseforge.com/minecraft/mc-mods/cooking-for-blockheads) | `cookingforblockheads` | Everyone | — | Applied the reviewed suggested fit. | `cookingforblockheads:black_kitchen_floor` → `cookingforblockheads:black_kitchen_floor` |
| Standalone / independent utility | [Crafting Station](https://www.curseforge.com/minecraft/mc-mods/crafting-station) | `craftingstation` | Everyone | — | Applied the reviewed suggested fit. | `craftingstation:crafting_station` → `craftingstation:crafting_station` |
| Standalone / independent utility | [CraftoriaCore](https://www.curseforge.com/minecraft/mc-mods/craftoria-core) | `craftoria_core` | Everyone | — | Applied the reviewed suggested fit. | `craftoria:mi/shaped/quantum_fluid_input_hatch` → `modern_industrialization:quantum_fluid_input_hatch` |
| Standalone / independent utility | [Crystalix](https://www.curseforge.com/minecraft/mc-mods/crystalix) | `crystalix` | Everyone | — | User decision (October 26, 2026). | `crystalix:bordered_crystalix_glass` → `crystalix:bordered_crystalix_glass` |
| Standalone / independent utility | [Cursed Earth Returns](https://www.curseforge.com/minecraft/mc-mods/cursed-earth-returns) | `cursedearth` | Ritualists | — | Applied the reviewed suggested fit. | `cursedearth:blessed_flower` → `cursedearth:blessed_flower` |
| Standalone / independent utility | [Duckling](https://www.curseforge.com/minecraft/mc-mods/duckling) | `duckling` | Everyone | — | Applied the reviewed suggested fit. | `duckling:holiday_fruit_cake` → `duckling:holiday_fruit_cake` |
| Standalone / independent utility | [Entangled](https://www.curseforge.com/minecraft/mc-mods/entangled) | `entangled` | Everyone | — | User decision (October 26, 2026). | `entangled:block` → `entangled:block` |
| Standalone / independent utility | [Eternal Starlight](https://www.curseforge.com/projects/1080592) | `eternal_starlight` | Ritualists | — | Applied the reviewed suggested fit. | `eternal_starlight:acacia_starfire_bird_aviary` → `eternal_starlight:acacia_starfire_bird_aviary` |
| Standalone / independent utility | [Factory Blocks \[Forge/Fabric/NeoForge\]](https://www.curseforge.com/minecraft/mc-mods/factory-blocks) | `factory_blocks` | Everyone | — | Applied the reviewed suggested fit. | `factory_blocks:factory` → `factory_blocks:factory` |
| Standalone / independent utility | [Farming for Blockheads](https://www.curseforge.com/minecraft/mc-mods/farming-for-blockheads) | `farmingforblockheads` | Everyone | — | Applied the reviewed suggested fit. | `farmingforblockheads:chicken_nest` → `farmingforblockheads:chicken_nest` |
| Standalone / independent utility | [FTB Filter System](https://www.curseforge.com/minecraft/mc-mods/ftb-filter-system) | `ftbfiltersystem` | Everyone | — | Applied the reviewed suggested fit. | `ftbfiltersystem:smart_filter` → `ftbfiltersystem:smart_filter` |
| Standalone / independent utility | [FTB Quests (NeoForge)](https://www.curseforge.com/projects/289412) | `ftbquests` | Everyone | — | Applied the reviewed suggested fit. | `ftbquests:book` → `ftbquests:book` |
| Standalone / independent utility | [Gadgets Against Grind](https://www.curseforge.com/minecraft/mc-mods/gag) | `gag` | Everyone | — | Applied the reviewed suggested fit. | `gag:escape_rope` → `gag:escape_rope` |
| Standalone / independent utility | [Gateways to Eternity](https://www.curseforge.com/minecraft/mc-mods/gateways-to-eternity) | `gateways` | Ritualists | — | Applied the reviewed suggested fit. | `apotheosis:gateways/tiered/ascent` → `gateways:gate_pearl` |
| Standalone / independent utility | [Glassential Renewed](https://www.curseforge.com/minecraft/mc-mods/glassential-renewed) | `glassential` | Everyone | — | Applied the reviewed suggested fit. | `glassential:acacia_glass_door` → `glassential:acacia_glass_door` |
| Standalone / independent utility | [Handcrafted](https://www.curseforge.com/minecraft/mc-mods/handcrafted) | `handcrafted` | Everyone | — | Applied the reviewed suggested fit. | `handcrafted:acacia_bench` → `handcrafted:acacia_bench` |
| Standalone / independent utility | [Immersive Aircraft](https://www.curseforge.com/projects/666014) | `immersive_aircraft` | Mechanists | — | Applied the reviewed suggested fit. | `immersive_aircraft:boiler` → `immersive_aircraft:boiler` |
| Standalone / independent utility | [Industrial Foregoing](https://www.curseforge.com/minecraft/mc-mods/industrial-foregoing) | `industrialforegoing` | science_shared | — | Applied the reviewed suggested fit. | `industrialforegoing:laser_lens_black_recolor` → `industrialforegoing:black_laser_lens` |
| Standalone / independent utility | [Iron's Gems 'n Jewelry](https://www.curseforge.com/minecraft/mc-mods/irons-jewelry) | `irons_jewelry` | magic_shared | — | Applied the reviewed suggested fit. | `irons_jewelry:jewelcrafting_guide` → `irons_jewelry:jewelcrafting_guide` |
| Standalone / independent utility | [Iron's Lib](https://www.curseforge.com/projects/1492763) | `irons_lib` | Everyone | — | User decision (October 26, 2026). | `irons_lib:transmog_table` → `irons_lib:transmog_table` |
| Standalone / independent utility | [JAMD](https://www.curseforge.com/minecraft/mc-mods/jamd) | `jamd` | Ritualists | — | User decision (October 26, 2026). | `jamd:end_portal_block` → `jamd:end_portal` |
| Standalone / independent utility | [Just Another Void Dimension](https://www.curseforge.com/minecraft/mc-mods/javd) | `javd` | Ritualists | — | User decision (October 26, 2026). | `javd:portal_block` → `javd:portal_block` |
| Standalone / independent utility | [Just Dire Things](https://www.curseforge.com/minecraft/mc-mods/just-dire-things) | `justdirethings` | Stargazers | — | Applied the reviewed suggested fit. | `justdirethings:blazegold_axe` → `justdirethings:blazegold_axe` |
| Standalone / independent utility | [KubeJS](https://www.curseforge.com/minecraft/mc-mods/kubejs) | `kubejs` | Everyone | — | Applied the reviewed suggested fit. | `kubejs:static_audit/recipes/129` → `minecraft:blaze_rod` |
| Standalone / independent utility | [LaserIO](https://www.curseforge.com/minecraft/mc-mods/laserio) | `laserio` | Everyone | — | User decision (October 26, 2026). | `laserio:card_chemical` → `laserio:card_chemical` |
| Standalone / independent utility | [Little Big Redstone](https://www.curseforge.com/minecraft/mc-mods/little-big-redstone) | `little_big_redstone` | Everyone | — | User decision (October 26, 2026). | `little_big_redstone:floppy_disk/black` → `little_big_redstone:black_floppy_disk` |
| Standalone / independent utility | [Logistics Network](https://www.curseforge.com/projects/1448257) | `logisticsnetworks` | Everyone | — | User decision (October 26, 2026). | `logisticsnetworks:computer` → `logisticsnetworks:computer` |
| Standalone / independent utility | [Luminax](https://www.curseforge.com/minecraft/mc-mods/luminax) | `luminax` | Everyone | — | Applied the reviewed suggested fit. | `luminax:black_luminax_block` → `luminax:black_luminax_block` |
| Standalone / independent utility | [Macaw's Bridges](https://www.curseforge.com/minecraft/mc-mods/macaws-bridges) | `mcwbridges` | Everyone | — | Applied the reviewed suggested fit. | `mcwbridges:acacia_bridge_pier` → `mcwbridges:acacia_bridge_pier` |
| Standalone / independent utility | [Macaw's Doors](https://www.curseforge.com/minecraft/mc-mods/macaws-doors) | `mcwdoors` | Everyone | — | Applied the reviewed suggested fit. | `mcwdoors:acacia_bamboo_door` → `mcwdoors:acacia_bamboo_door` |
| Standalone / independent utility | [Macaw's Fences and Walls](https://www.curseforge.com/minecraft/mc-mods/macaws-fences-and-walls) | `mcwfences` | Everyone | — | Applied the reviewed suggested fit. | `mcwfences:acacia_curved_gate` → `mcwfences:acacia_curved_gate` |
| Standalone / independent utility | [Macaw's Holidays](https://www.curseforge.com/minecraft/mc-mods/macaws-holidays) | `mcwholidays` | Everyone | — | Applied the reviewed suggested fit. | `mcwholidays:bat_doormat` → `mcwholidays:bat_doormat` |
| Standalone / independent utility | [Macaw's Lights and Lamps](https://www.curseforge.com/minecraft/mc-mods/macaws-lights-and-lamps) | `mcwlights` | Everyone | — | Applied the reviewed suggested fit. | `mcwlights:acacia_ceiling_fan_light` → `mcwlights:acacia_ceiling_fan_light` |
| Standalone / independent utility | [Macaw's Paths and Pavings](https://www.curseforge.com/minecraft/mc-mods/macaws-paths-and-pavings) | `mcwpaths` | Everyone | — | Applied the reviewed suggested fit. | `mcwpaths:acacia_planks_path` → `mcwpaths:acacia_planks_path` |
| Standalone / independent utility | [Macaw's Roofs](https://www.curseforge.com/minecraft/mc-mods/macaws-roofs) | `mcwroofs` | Everyone | — | Applied the reviewed suggested fit. | `mcwroofs:acacia_attic_roof` → `mcwroofs:acacia_attic_roof` |
| Standalone / independent utility | [Macaw's Stairs](https://www.curseforge.com/minecraft/mc-mods/macaws-stairs) | `mcwstairs` | Everyone | — | Applied the reviewed suggested fit. | `mcwstairs:acacia_balcony` → `mcwstairs:acacia_balcony` |
| Standalone / independent utility | [Macaw's Trapdoors](https://www.curseforge.com/minecraft/mc-mods/macaws-trapdoors) | `mcwtrpdoors` | Everyone | — | Applied the reviewed suggested fit. | `mcwtrpdoors:acacia_bamboo_trapdoor` → `mcwtrpdoors:acacia_bamboo_trapdoor` |
| Standalone / independent utility | [Macaw's Windows](https://www.curseforge.com/minecraft/mc-mods/macaws-windows) | `mcwwindows` | Everyone | — | Applied the reviewed suggested fit. | `mcwwindows:acacia_blinds` → `mcwwindows:acacia_blinds` |
| Standalone / independent utility | [Malum](https://www.curseforge.com/minecraft/mc-mods/malum) | `malum` | Ritualists | — | Applied the reviewed suggested fit. | `malum:ace_prideweave` → `malum:ace_prideweave` |
| Standalone / independent utility | [Measurements](https://www.curseforge.com/minecraft/mc-mods/measurements) | `measurements` | Everyone | — | Applied the reviewed suggested fit. | `measurements:tape_measure` → `measurements:tape_measure` |
| Standalone / independent utility | [Mech Trowel](https://www.curseforge.com/minecraft/mc-mods/mech-trowel) | `mechtrowel` | Everyone | — | Applied the reviewed suggested fit. | `mechtrowel:mech_trowel` → `mechtrowel:mech_trowel` |
| Standalone / independent utility | [Mining Gadgets](https://www.curseforge.com/minecraft/mc-mods/mining-gadgets) | `mininggadgets` | Stargazers | — | Applied the reviewed suggested fit. | `mininggadgets:mininggadget` → `mininggadgets:mininggadget` |
| Standalone / independent utility | [MmmMmmMmmMmm (Target Dummy)](https://www.curseforge.com/projects/225738) | `dummmmmmy` | Everyone | — | Applied the reviewed suggested fit. | `dummmmmmy:dummy_crafting` → `dummmmmmy:target_dummy` |
| Standalone / independent utility | [Mob Grinding Utils](https://www.curseforge.com/minecraft/mc-mods/mob-grinding-utils) | `mob_grinding_utils` | Ritualists | — | Applied the reviewed suggested fit. | `mob_grinding_utils:recipe_absorption_hopper` → `mob_grinding_utils:absorption_hopper` |
| Standalone / independent utility | [Modonomicon](https://www.curseforge.com/projects/538392) | `modonomicon` | Everyone | — | Applied the reviewed suggested fit. | `theurgy:crafting/shapeless/the_hermetica` → `modonomicon:modonomicon` |
| Standalone / independent utility | [More Red](https://www.curseforge.com/minecraft/mc-mods/more-red) | `morered` | Everyone | — | User decision (October 26, 2026). | `morered:and_2_gate` → `morered:and_2_gate` |
| Standalone / independent utility | [MrCrayfish's Furniture Mod: Refurbished](https://www.curseforge.com/minecraft/mc-mods/refurbished-furniture) | `refurbished_furniture` | Everyone | — | Applied the reviewed suggested fit. | `refurbished_furniture:acacia_dark_ceiling_fan` → `refurbished_furniture:acacia_dark_ceiling_fan` |
| Standalone / independent utility | [Multi Builder Tool](https://www.curseforge.com/minecraft/mc-mods/multi-builder-tool) | `mbtool` | Everyone | — | Applied the reviewed suggested fit. | `mbtool:mbtool` → `mbtool:mbtool` |
| Standalone / independent utility | [Neo-Blåhaj](https://www.curseforge.com/minecraft/mc-mods/neo-blahaj) | `blahaj` | Everyone | — | Applied the reviewed suggested fit. | `blahaj:crafting/blue_shark` → `blahaj:blue_shark` |
| Standalone / independent utility | [Nether Descent](https://www.curseforge.com/minecraft/mc-mods/nether-descent) | `netherdescent` | Everyone | — | User decision (October 26, 2026). | `netherdescent:arisian_bookshelf` → `netherdescent:arisian_bookshelf` |
| Standalone / independent utility | [Oathbound Relics](https://www.curseforge.com/projects/1503076) | `oathboundrelics` | Ritualists | — | Applied the reviewed suggested fit. | `oathboundrelics:aredrite_boots` → `oathboundrelics:aredrite_boots` |
| Standalone / independent utility | [OpenBlocks Elevator](https://www.curseforge.com/minecraft/mc-mods/openblocks-elevator) | `elevatorid` | Everyone | — | Applied the reviewed suggested fit. | `elevatorid:elevator_black` → `elevatorid:elevator_black` |
| Standalone / independent utility | [Patchouli](https://www.curseforge.com/minecraft/mc-mods/patchouli) | `patchouli` | Everyone | — | Applied the reviewed suggested fit. | `patchouli:guide_book` → `patchouli:guide_book` |
| Standalone / independent utility | [Phantom's Utilities](https://www.curseforge.com/minecraft/mc-mods/phantoms-utilities) | `phantoms_utilities` | Everyone | — | Applied the reviewed suggested fit. | `phantoms_utilities:spray_can` → `phantoms_utilities:spray_can` |
| Standalone / independent utility | [Pipe Connector](https://www.curseforge.com/minecraft/mc-mods/pipe-connector) | `pipe_connector` | Everyone | — | User decision (October 26, 2026). | `pipe_connector:pipe_connector` → `pipe_connector:pipe_connector` |
| Standalone / independent utility | [Pipez](https://www.curseforge.com/minecraft/mc-mods/pipez) | `pipez` | science_shared | — | Applied the reviewed suggested fit. | `pipez:energy_pipe` → `pipez:energy_pipe` |
| Standalone / independent utility | [Plushie Buddies](https://www.curseforge.com/minecraft/mc-mods/plushie-buddies) | `plushie_buddies` | Everyone | — | Applied the reviewed suggested fit. | `plushie_buddies:fabric` → `plushie_buddies:fabric` |
| Standalone / independent utility | [Pylons](https://www.curseforge.com/minecraft/mc-mods/pylons) | `pylons` | magic_shared | — | Applied the reviewed suggested fit. | `pylons:block_filter` → `pylons:block_filter` |
| Standalone / independent utility | [Reliquary Reincarnations](https://www.curseforge.com/minecraft/mc-mods/reliquary-reincarnations) | `reliquary` | magic_shared | — | User decision (October 26, 2026). | `reliquary:alkahestry_altar` → `reliquary:alkahestry_altar` |
| Standalone / independent utility | [Ribbits](https://www.curseforge.com/minecraft/mc-mods/ribbits) | `ribbits` | Everyone | — | Applied the reviewed suggested fit. | `ribbits:mossy_oak_door` → `ribbits:mossy_oak_door` |
| Standalone / independent utility | [Serene Seasons](https://www.curseforge.com/minecraft/mc-mods/serene-seasons) | `sereneseasons` | Everyone | — | Applied the reviewed suggested fit. | `sereneseasons:calendar` → `sereneseasons:calendar` |
| Standalone / independent utility | [Shrink.](https://www.curseforge.com/minecraft/mc-mods/shrink_) | `shrink` | Everyone | — | User decision (October 26, 2026). | `shrink:shrinking_device` → `shrink:shrinking_device` |
| Standalone / independent utility | [Simple Magnets](https://www.curseforge.com/minecraft/mc-mods/simple-magnets) | `simplemagnets` | Everyone | — | Applied the reviewed suggested fit. | `simplemagnets:advanced_demagnetization_coil` → `simplemagnets:advanced_demagnetization_coil` |
| Standalone / independent utility | [Simply Light](https://www.curseforge.com/minecraft/mc-mods/simply-light) | `simplylight` | Everyone | — | Applied the reviewed suggested fit. | `simplylight:bulb` → `simplylight:lightbulb` |
| Standalone / independent utility | [Spectrum](https://www.curseforge.com/minecraft/mc-mods/spectrum) | `spectrum` | Spellcasters | — | User decision (October 26, 2026). | `spectrum:crafting_table/ash/ash_from_flakes` → `spectrum:ash_flakes` |
| Standalone / independent utility | [Spice of Life: Carrot Edition](https://www.curseforge.com/minecraft/mc-mods/spice-of-life-carrot-edition) | `solcarrot` | Everyone | — | Applied the reviewed suggested fit. | `solcarrot:food_book` → `solcarrot:food_book` |
| Standalone / independent utility | [Starcatcher](https://www.curseforge.com/projects/1357603) | `starcatcher` | Everyone | — | User decision (October 26, 2026). | `starcatcher:almighty_worm` → `starcatcher:almighty_worm` |
| Standalone / independent utility | [Super Factory Manager ( SFM )](https://www.curseforge.com/minecraft/mc-mods/super-factory-manager) | `sfm` | Everyone | — | User decision (October 26, 2026). | `sfm:cable` → `sfm:cable` |
| Standalone / independent utility | [Supplementaries](https://www.curseforge.com/minecraft/mc-mods/supplementaries) | `supplementaries` | Everyone | — | Applied the reviewed suggested fit. | `supplementaries:blast_armor_trim_smithing_template` → `supplementaries:blast_armor_trim_smithing_template` |
| Standalone / independent utility | [Sushi Go Crafting](https://www.curseforge.com/minecraft/mc-mods/sushigocrafting) | `sushigocrafting` | Everyone | — | Applied the reviewed suggested fit. | `sushigocrafting:seaweed_on_a_stick` → `sushigocrafting:seaweed_on_a_stick` |
| Standalone / independent utility | [Tank Storage](https://www.curseforge.com/minecraft/mc-mods/tank-storage) | `tankstorage` | Everyone | — | User decision (October 26, 2026). | `tankstorage:tank_1` → `tankstorage:tank_1` |
| Standalone / independent utility | [Tempad](https://www.curseforge.com/minecraft/mc-mods/tempad) | `tempad` | science_shared | — | Applied the reviewed suggested fit. | `tempad:card_cheap` → `tempad:location_card` |
| Standalone / independent utility | [Tesseract](https://www.curseforge.com/minecraft/mc-mods/tesseract) | `tesseract` | Everyone | — | User decision (October 26, 2026). | `tesseract:tesseract` → `tesseract:tesseract` |
| Standalone / independent utility | [Thaumon](https://www.curseforge.com/minecraft/mc-mods/thaumon) | `thaumon` | Everyone | — | Applied the reviewed suggested fit. | `thaumon:alchemists_greatwood_bookshelf` → `thaumon:alchemists_greatwood_bookshelf` |
| Standalone / independent utility | [The Bumblezone (NeoForge/Forge)](https://www.curseforge.com/projects/362479) | `the_bumblezone` | Ritualists | — | Applied the reviewed suggested fit. | `the_bumblezone:ancient_wax/bricks_slab` → `the_bumblezone:ancient_wax_bricks_slab` |
| Standalone / independent utility | [Torchmaster](https://www.curseforge.com/projects/254268) | `torchmaster` | Everyone | — | Applied the reviewed suggested fit. | `torchmaster:dreadlamp` → `torchmaster:dreadlamp` |
| Standalone / independent utility | [Transfer Labels](https://www.curseforge.com/minecraft/mc-mods/transfer-labels) | `transfer_labels` | Everyone | — | Applied the reviewed suggested fit. | `transfer_labels:fluidstack_extract_label_to_fluidstack_insert_label` → `transfer_labels:fluidstack_extract_transfer_label` |
| Standalone / independent utility | [Transmog](https://www.curseforge.com/minecraft/mc-mods/transmog) | `transmog` | Everyone | — | Applied the reviewed suggested fit. | `transmog:transmogrification_table` → `transmog:transmogrification_table` |
| Standalone / independent utility | [Trash Cans](https://www.curseforge.com/minecraft/mc-mods/trash-cans) | `trashcans` | Everyone | — | Applied the reviewed suggested fit. | `trashcans:energy_trash_can` → `trashcans:energy_trash_can` |
| Standalone / independent utility | [Utilitarian](https://www.curseforge.com/minecraft/mc-mods/utilitarian) | `utilitarian` | Everyone | — | Applied the reviewed suggested fit. | `utilitarian:angel_block` → `utilitarian:angel_block` |
| Standalone / independent utility | [Waystones](https://www.curseforge.com/projects/245755) | `waystones` | magic_shared | — | Applied the reviewed suggested fit. | `waystones:black_portstone` → `waystones:black_portstone` |
| Standalone / independent utility | [Wither Skeleton Tweaks](https://www.curseforge.com/minecraft/mc-mods/wither-skeleton-tweaks) | `wstweaks` | Ritualists | — | Applied the reviewed suggested fit. | `wstweaks:immolation_blade` → `wstweaks:immolation_blade` |
| Standalone / independent utility | [Xtones Reworked](https://www.curseforge.com/minecraft/mc-mods/xtones-reworked) | `xtonesreworked` | Everyone | — | Applied the reviewed suggested fit. | `xtonesreworked:agon_block_0` → `xtonesreworked:agon_block_0` |
| Standalone / independent utility | [You're in Grave Danger](https://www.curseforge.com/minecraft/mc-mods/youre-in-grave-danger) | `yigd` | Everyone | — | Applied the reviewed suggested fit. | `yigd:grave` → `yigd:grave` |
| Standalone / independent utility | [YUNG's Cave Biomes (Forge/NeoForge)](https://www.curseforge.com/minecraft/mc-mods/yungs-cave-biomes) | `yungscavebiomes` | Everyone | — | Applied the reviewed suggested fit. | `yungscavebiomes:ancient_armor_trim_smithing_template` → `yungscavebiomes:ancient_armor_trim_smithing_template` |

## Relationship checks

Grouping uses local mod metadata, required gameplay dependencies and the installed JARs’ integration packages. Optional integration listings describe intended bridges; their availability can depend on configuration. Additional references:

- [UnlimitedPeripheralWorks integration documentation](https://docs.siredvin.site/UnlimitedPeripheralWorks/).
- [Myotus upstream description: an AE2 extension library](https://github.com/mc-myo-s-mod/Myotus).
- [Sophisticated Storage in Motion: a storage/minecart addon](https://www.curseforge.com/minecraft/mc-mods/sophisticated-storage-in-motion); this is not the separate Create integration mod.
- [Modern Dynamics](https://www.curseforge.com/minecraft/mc-mods/modern-dynamics) is an independent pipe mod, and [Crystalix](https://www.curseforge.com/minecraft/mc-mods/crystalix) is an independent glass mod. Neither is grouped as an addon based on its name.

## Audit scope
The comparison covers 534 packwiz entries and the three explicitly distributed raw JARs. Entries without qualifying evidence are omitted from the mod table; absence here does not imply a mod is absent from the pack. Some excluded mods have only machine/ritual recipes, loot content, or no recipes.

Exact local JARs unavailable for inspection: AStages. Their contents were not guessed or included. The in-pack raw copies of I’m Fast and Seasonal Let’s Do were inspected when available.

The review does not change faction assignments, gameplay, or the packwiz index. Minecraft was not launched and no remote server was accessed.
