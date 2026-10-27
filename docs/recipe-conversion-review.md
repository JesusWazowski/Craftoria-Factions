# Crafting conversion overrides

October 26, 2026. The 85 one-item conversion pairs and all 189 reset/disassembly entries below now have public recipe overrides. Other compression rules are unchanged.

This is a static scan of the pinned local mod JAR recipe definitions. The 1:1 list requires a direct item-only crafting recipe and a matching reverse recipe, with one item in and one item out. It does not count tools, tags or alternative ingredients as exact evidence. Recipes removed or changed dynamically, recipe conditions, component preservation and creative-only items still need live-client verification. No Minecraft launch or server access was performed.

A reversible recipe can still change gameplay behavior: swapping a normal/inverted bus or a stationary/rotating turret is more than a cosmetic change. These specific lists were approved by the user; this does not exempt other conversions or compression recipes. Gates use recipe-ID namespaces; cross-mod item names alone do not establish which gate applies.

## Already approved and implemented

| Conversion | Exact recipe IDs exempted for everyone |
|---|---|
| AE2 interface block ↔ cable part | `ae2:network/blocks/interfaces_interface_alt`, `ae2:network/blocks/interfaces_interface_part` |
| AE2 pattern-provider block ↔ cable part | `ae2:network/blocks/pattern_providers_interface_alt`, `ae2:network/blocks/pattern_providers_interface_part` |
| AE2 energy-acceptor block ↔ cable part | `ae2:network/blocks/energy_energy_acceptor_alt`, `ae2:network/parts/energy_acceptor` |
| Ars experience gem ↔ greater gem, 4:1 | `ars_nouveau:experience_gem`, `ars_nouveau:greater_experience_gem` |
| Greater gem ↔ giant gem, 4:1 | `ars_technica:giant_experience_gem`, `ars_technica:greater_from_giant_experience_gem` |
| Giant gem ↔ gargantuan gem, 4:1 | `ars_technica:gargantuan_experience_gem`, `ars_technica:giant_from_gargantuan_experience_gem` |

## Closest matches to the AE2 convenience exceptions

| Family | Candidate | Decision consideration |
|---|---|---|
| AdvancedAE / ExtendedAE | Advanced/small pattern providers and extended interfaces/providers: block ↔ part | Closest equivalents to the approved AE2 exceptions; Public recipe override applied. |
| Applied Flux | Flux accessor block ↔ cable part | Same device in two placement forms; Public recipe override applied. |
| Ars Énergistique | Source acceptor block ↔ cable part | Same device in two placement forms; Public recipe override applied. |
| Schematic Energistics | Cannon interface block ↔ cable part | Same device in two placement forms; Public recipe override applied. |
| Create family | Horizontal ↔ vertical gearboxes, tanks/vessels, vaults/silos and Copycat shape changes | Some change layout only; others change useful operating behavior. |
| PneumaticCraft | Import ↔ export assembly I/O units, reinforced chest ↔ chest core | Switches operational role or placement; component behavior needs verification. |
| AE2 / Create / Cognition | Normal/inverted toggle buses or clutches, linked transmitter, accelerator variants | Changes behavior/polarity; explicitly approved despite the behavioral difference. |
| Ars Nouveau | Pedestal ↔ platform, basic ↔ rotating turret, sconce variants | Turret behavior differs; pedestal/platform and decorative forms may be convenience candidates. |
| Powah | Vertical ↔ horizontal dielectric rods | Orientation conversion only in the recipe definitions. |
| Theurgy / MI family | Extractor ↔ inserter; input ↔ output hatches | Switches logistics direction/role, rather than adding material. |

## All 85 approved 1:1 reversible pairs

Every row below includes the formerly gated recipe IDs now exempted for that pair. Native reverse counterparts can be in a different namespace; the scan requires them but the assignment column identifies the owning mod stage, not a restriction on these exempt recipes. All listed IDs are now included in the override document.

| Items exchanged | Mod assignment | Public recipe override IDs |
|---|---|---|
| `advanced_ae:adv_pattern_provider` ↔ `advanced_ae:adv_pattern_provider_part` | stargazers | `advanced_ae:advpatpro2`, `advanced_ae:advpatpropart` |
| `advanced_ae:small_adv_pattern_provider` ↔ `advanced_ae:small_adv_pattern_provider_part` | stargazers | `advanced_ae:smalladvpatpro2`, `advanced_ae:smalladvpatpropart` |
| `ae2:inverted_toggle_bus` ↔ `ae2:toggle_bus` | stargazers | `ae2:network/parts/toggle_bus_alt`, `ae2:network/parts/toggle_bus_inverted_alt` |
| `appflux:flux_accessor` ↔ `appflux:part_flux_accessor` | stargazers | `appflux:flux_accessor_alt`, `appflux:part_flux_accessor` |
| `ars_additions:polished_sourcestone_chain` ↔ `ars_additions:sourcestone_chain` | spellcasters | `ars_additions:crafting/chains/reversed_polished_sourcestone_chain`, `ars_additions:crafting/chains/reversed_sourcestone_chain` |
| `ars_additions:polished_sourcestone_lantern` ↔ `ars_additions:sourcestone_lantern` | spellcasters | `ars_additions:crafting/lanterns/reversed_polished_sourcestone_lantern`, `ars_additions:crafting/lanterns/reversed_sourcestone_lantern` |
| `ars_additions:polished_sourcestone_magelight_lantern` ↔ `ars_additions:sourcestone_magelight_lantern` | spellcasters | `ars_additions:crafting/lanterns/reversed_polished_sourcestone_magelight_lantern`, `ars_additions:crafting/lanterns/reversed_sourcestone_magelight_lantern` |
| `ars_elemental:spore_blossom_up` ↔ `minecraft:spore_blossom` | spellcasters | `ars_elemental:alt_blossom`, `ars_elemental:spore_blossom_up` |
| `ars_nouveau:arcane_pedestal` ↔ `ars_nouveau:arcane_platform` | spellcasters | `ars_nouveau:arcane_platform`, `ars_nouveau:platform_to_pedestal` |
| `ars_nouveau:basic_spell_turret` ↔ `ars_nouveau:rotating_spell_turret` | spellcasters | `ars_nouveau:rotating_spell_turret`, `ars_nouveau:rotating_turret_to_basic_spell_turret` |
| `ars_nouveau:polished_sconce` ↔ `ars_nouveau:sourcestone_sconce` | spellcasters | `ars_nouveau:polished_sconce`, `ars_nouveau:polished_source_sconce` |
| `arseng:cable_source_acceptor` ↔ `arseng:source_acceptor` | stargazers | `arseng:cable_source_acceptor`, `arseng:source_acceptor_from_part` |
| `bellsandwhistles:corrugated_metro_panel` ↔ `bellsandwhistles:metro_panel` | mechanists | `bellsandwhistles:metro/corrugated_metro_panel_from_panel`, `bellsandwhistles:metro/metro_panel_from_corrugated` |
| `cognition:accelerator` ↔ `cognition:linear_accelerator` | ritualists | `cognition:accelerator_from_linear`, `cognition:linear_accelerator` |
| `copycats:copycat_flat_pane` ↔ `copycats:copycat_pane` | mechanists | `copycats:crafting/copycat_flat_pane_from_conversion`, `copycats:crafting/copycat_pane_from_conversion` |
| `copycats:copycat_folding_door` ↔ `copycats:copycat_sliding_door` | mechanists | `copycats:crafting/copycat_folding_door_from_conversion`, `copycats:crafting/copycat_sliding_door_from_conversion` |
| `copycats:copycat_slice` ↔ `copycats:copycat_vertical_slice` | mechanists | `copycats:crafting/copycat_slice_from_conversion`, `copycats:crafting/copycat_vertical_slice_from_conversion` |
| `copycats:copycat_slope` ↔ `copycats:copycat_vertical_slope` | mechanists | `copycats:crafting/copycat_slope_from_conversion`, `copycats:crafting/copycat_vertical_slope_from_conversion` |
| `copycats:copycat_stairs` ↔ `copycats:copycat_vertical_stairs` | mechanists | `copycats:crafting/copycat_stairs_from_conversion`, `copycats:crafting/copycat_vertical_stairs_from_conversion` |
| `copycats:copycat_trapdoor` ↔ `create:copycat_panel` | mechanists | `copycats:crafting/copycat_panel_from_conversion`, `copycats:crafting/copycat_trapdoor_from_conversion` |
| `create:clutch` ↔ `create_connected:inverted_clutch` | mechanists | `create_connected:crafting/kinetics/clutch_from_conversion`, `create_connected:crafting/kinetics/inverted_clutch_from_conversion` |
| `create:copycat_step` ↔ `create_connected:copycat_vertical_step` | mechanists | `create_connected:crafting/palettes/copycat_step_from_conversion`, `create_connected:crafting/palettes/copycat_vertical_step_from_conversion` |
| `create:fluid_tank` ↔ `create_connected:fluid_vessel` | mechanists | `create_connected:crafting/kinetics/fluid_tank_from_conversion`, `create_connected:crafting/kinetics/fluid_vessel_from_conversion` |
| `create:gearbox` ↔ `create:vertical_gearbox` | mechanists | `create:crafting/kinetics/gearbox_from_conversion`, `create:crafting/kinetics/vertical_gearbox_from_conversion` |
| `create:gearshift` ↔ `create_connected:inverted_gearshift` | mechanists | `create_connected:crafting/kinetics/gearshift_from_conversion`, `create_connected:crafting/kinetics/inverted_gearshift_from_conversion` |
| `create:item_vault` ↔ `create_connected:item_silo` | mechanists | `create_connected:crafting/kinetics/item_silo_from_conversion`, `create_connected:crafting/kinetics/item_vault_from_conversion` |
| `create:linear_chassis` ↔ `create:secondary_linear_chassis` | mechanists | `create:crafting/kinetics/linear_chassis_from_conversion`, `create:crafting/kinetics/secondary_linear_chassis_from_conversion` |
| `create:packager` ↔ `create:repackager` | mechanists | `create:crafting/logistics/packager_from_conversion`, `create:crafting/logistics/repackager_from_conversion` |
| `create:redstone_link` ↔ `create_connected:linked_transmitter` | mechanists | `create_connected:crafting/kinetics/linked_transmitter_from_conversion`, `create_connected:crafting/kinetics/redstone_link_from_conversion` |
| `create:rose_quartz_tiles` ↔ `create:small_rose_quartz_tiles` | mechanists | `create:crafting/materials/rose_quartz_tiles_from_conversion`, `create:crafting/materials/small_rose_quartz_tiles_from_conversion` |
| `create:sail_frame` ↔ `create:white_sail` | mechanists | `create:crafting/kinetics/sail_frame_from_conversion`, `create:crafting/kinetics/white_sail_from_conversion` |
| `create:speedometer` ↔ `create:stressometer` | mechanists | `create:crafting/kinetics/speedometer_from_conversion`, `create:crafting/kinetics/stressometer_from_conversion` |
| `create_connected:brass_gearbox` ↔ `create_connected:vertical_brass_gearbox` | mechanists | `create_connected:crafting/kinetics/brass_gearbox_from_conversion`, `create_connected:crafting/kinetics/vertical_brass_gearbox_from_conversion` |
| `create_connected:parallel_gearbox` ↔ `create_connected:vertical_parallel_gearbox` | mechanists | `create_connected:crafting/kinetics/parallel_gearbox_from_conversion`, `create_connected:crafting/kinetics/vertical_parallel_gearbox_from_conversion` |
| `create_connected:six_way_gearbox` ↔ `create_connected:vertical_six_way_gearbox` | mechanists | `create_connected:crafting/kinetics/six_way_gearbox_from_conversion`, `create_connected:crafting/kinetics/vertical_six_way_gearbox_from_conversion` |
| `createcasing:brass_gearbox` ↔ `createcasing:vertical_brass_gearbox` | mechanists | `createcasing:crafting/gearbox/brass_from_conversion`, `createcasing:crafting/gearbox/brass_vertical_from_conversion` |
| `createcasing:copper_gearbox` ↔ `createcasing:vertical_copper_gearbox` | mechanists | `createcasing:crafting/gearbox/copper_from_conversion`, `createcasing:crafting/gearbox/copper_vertical_from_conversion` |
| `createcasing:creative_gearbox` ↔ `createcasing:vertical_creative_gearbox` | mechanists | `createcasing:crafting/gearbox/creative_from_conversion`, `createcasing:crafting/gearbox/creative_vertical_from_conversion` |
| `createcasing:industrial_iron_gearbox` ↔ `createcasing:vertical_industrial_iron_gearbox` | mechanists | `createcasing:crafting/gearbox/industrial_iron_from_conversion`, `createcasing:crafting/gearbox/industrial_iron_vertical_from_conversion` |
| `createcasing:railway_gearbox` ↔ `createcasing:vertical_railway_gearbox` | mechanists | `createcasing:crafting/gearbox/railway_from_conversion`, `createcasing:crafting/gearbox/railway_vertical_from_conversion` |
| `createcasing:refined_radiance_gearbox` ↔ `createcasing:vertical_refined_radiance_gearbox` | mechanists | `createcasing:crafting/gearbox/refined_radiance_from_conversion`, `createcasing:crafting/gearbox/refined_radiance_vertical_from_conversion` |
| `createcasing:shadow_steel_gearbox` ↔ `createcasing:vertical_shadow_steel_gearbox` | mechanists | `createcasing:crafting/gearbox/shadow_steel_from_conversion`, `createcasing:crafting/gearbox/shadow_steel_vertical_from_conversion` |
| `createcasing:vertical_weathered_iron_gearbox` ↔ `createcasing:weathered_iron_gearbox` | mechanists | `createcasing:crafting/gearbox/weathered_iron_from_conversion`, `createcasing:crafting/gearbox/weathered_iron_vertical_from_conversion` |
| `discerning_the_eldritch:eldritch_rune` ↔ `hazennstuff:eldritch_rune` | spellcasters | `hazennstuff:crafting/materials/eldritch_rune_to_dte`, `hazennstuff:crafting/materials/eldritch_rune_to_hns` |
| `extended_industrialization:tesla_coil` ↔ `extended_industrialization:tesla_receiver` | mechanists | `extended_industrialization:machines/tesla_coil/craft/from_tesla_receiver`, `extended_industrialization:machines/tesla_receiver/craft/from_tesla_coil` |
| `extendedae:ex_emc_interface` ↔ `extendedae:ex_emc_interface_part` | stargazers | `extendedae:ex_emc_interface_alt`, `extendedae:ex_emc_interface_part` |
| `extendedae:ex_interface` ↔ `extendedae:ex_interface_part` | stargazers | `extendedae:ex_interface_alt`, `extendedae:ex_interface_part` |
| `extendedae:ex_pattern_provider` ↔ `extendedae:ex_pattern_provider_part` | stargazers | `extendedae:ex_pattern_provider_alt`, `extendedae:ex_pattern_provider_part` |
| `extendedae:oversize_interface` ↔ `extendedae:oversize_interface_part` | stargazers | `extendedae:oversize_interface_alt`, `extendedae:oversize_interface_part` |
| `integrateddynamics:logic_programmer` ↔ `integrateddynamics:portable_logic_programmer` | magic_shared | `integrateddynamics:crafting/logic_programmer_from_portable`, `integrateddynamics:crafting/logic_programmer_to_portable` |
| `megacells:cable_mega_emc_interface` ↔ `megacells:mega_emc_interface` | stargazers | `megacells:network/mega_emc_interface_block`, `megacells:network/mega_emc_interface_part` |
| `megacells:cable_mega_interface` ↔ `megacells:mega_interface` | stargazers | `megacells:network/mega_interface_block`, `megacells:network/mega_interface_part` |
| `megacells:cable_mega_pattern_provider` ↔ `megacells:mega_pattern_provider` | stargazers | `megacells:network/mega_pattern_provider_block`, `megacells:network/mega_pattern_provider_part` |
| `mob_grinding_utils:solid_xp_mould_baby` ↔ `mob_grinding_utils:solid_xp_mould_blank` | ritualists | `mob_grinding_utils:recipe_mould_baby_upgrade`, `mob_grinding_utils:recipe_mould_reset` |
| `modern_industrialization:advanced_fluid_input_hatch` ↔ `modern_industrialization:advanced_fluid_output_hatch` | mechanists | `modern_industrialization:hatches/advanced/fluid_input_from_output`, `modern_industrialization:hatches/advanced/fluid_output_from_input` |
| `modern_industrialization:advanced_item_input_hatch` ↔ `modern_industrialization:advanced_item_output_hatch` | mechanists | `modern_industrialization:hatches/advanced/item_input_from_output`, `modern_industrialization:hatches/advanced/item_output_from_input` |
| `modern_industrialization:bronze_fluid_input_hatch` ↔ `modern_industrialization:bronze_fluid_output_hatch` | mechanists | `modern_industrialization:hatches/bronze/fluid_input_from_output`, `modern_industrialization:hatches/bronze/fluid_output_from_input` |
| `modern_industrialization:bronze_item_input_hatch` ↔ `modern_industrialization:bronze_item_output_hatch` | mechanists | `modern_industrialization:hatches/bronze/item_input_from_output`, `modern_industrialization:hatches/bronze/item_output_from_input` |
| `modern_industrialization:ev_energy_input_hatch` ↔ `modern_industrialization:ev_energy_output_hatch` | mechanists | `modern_industrialization:hatches/highly_advanced/energy_input_from_output`, `modern_industrialization:hatches/highly_advanced/energy_output_from_input` |
| `modern_industrialization:ev_hv_transformer` ↔ `modern_industrialization:hv_ev_transformer` | mechanists | `modern_industrialization:electric_age/transformer/hv_ev/down_to_up`, `modern_industrialization:electric_age/transformer/hv_ev/up_to_down` |
| `modern_industrialization:ev_superconductor_transformer` ↔ `modern_industrialization:superconductor_ev_transformer` | mechanists | `modern_industrialization:electric_age/transformer/ev_supra/down_to_up`, `modern_industrialization:electric_age/transformer/ev_supra/up_to_down` |
| `modern_industrialization:highly_advanced_fluid_input_hatch` ↔ `modern_industrialization:highly_advanced_fluid_output_hatch` | mechanists | `modern_industrialization:hatches/highly_advanced/fluid_input_from_output`, `modern_industrialization:hatches/highly_advanced/fluid_output_from_input` |
| `modern_industrialization:highly_advanced_item_input_hatch` ↔ `modern_industrialization:highly_advanced_item_output_hatch` | mechanists | `modern_industrialization:hatches/highly_advanced/item_input_from_output`, `modern_industrialization:hatches/highly_advanced/item_output_from_input` |
| `modern_industrialization:hv_energy_input_hatch` ↔ `modern_industrialization:hv_energy_output_hatch` | mechanists | `modern_industrialization:hatches/turbo/energy_input_from_output`, `modern_industrialization:hatches/turbo/energy_output_from_input` |
| `modern_industrialization:hv_mv_transformer` ↔ `modern_industrialization:mv_hv_transformer` | mechanists | `modern_industrialization:electric_age/transformer/mv_hv/down_to_up`, `modern_industrialization:electric_age/transformer/mv_hv/up_to_down` |
| `modern_industrialization:lv_energy_input_hatch` ↔ `modern_industrialization:lv_energy_output_hatch` | mechanists | `modern_industrialization:hatches/basic/energy_input_from_output`, `modern_industrialization:hatches/basic/energy_output_from_input` |
| `modern_industrialization:lv_mv_transformer` ↔ `modern_industrialization:mv_lv_transformer` | mechanists | `modern_industrialization:electric_age/transformer/lv_mv/down_to_up`, `modern_industrialization:electric_age/transformer/lv_mv/up_to_down` |
| `modern_industrialization:mv_energy_input_hatch` ↔ `modern_industrialization:mv_energy_output_hatch` | mechanists | `modern_industrialization:hatches/advanced/energy_input_from_output`, `modern_industrialization:hatches/advanced/energy_output_from_input` |
| `modern_industrialization:steel_fluid_input_hatch` ↔ `modern_industrialization:steel_fluid_output_hatch` | mechanists | `modern_industrialization:hatches/steel/fluid_input_from_output`, `modern_industrialization:hatches/steel/fluid_output_from_input` |
| `modern_industrialization:steel_item_input_hatch` ↔ `modern_industrialization:steel_item_output_hatch` | mechanists | `modern_industrialization:hatches/steel/item_input_from_output`, `modern_industrialization:hatches/steel/item_output_from_input` |
| `modern_industrialization:superconductor_energy_input_hatch` ↔ `modern_industrialization:superconductor_energy_output_hatch` | mechanists | `modern_industrialization:hatches/quantum/energy_input_from_output`, `modern_industrialization:hatches/quantum/energy_output_from_input` |
| `modern_industrialization:turbo_fluid_input_hatch` ↔ `modern_industrialization:turbo_fluid_output_hatch` | mechanists | `modern_industrialization:hatches/turbo/fluid_input_from_output`, `modern_industrialization:hatches/turbo/fluid_output_from_input` |
| `modern_industrialization:turbo_item_input_hatch` ↔ `modern_industrialization:turbo_item_output_hatch` | mechanists | `modern_industrialization:hatches/turbo/item_input_from_output`, `modern_industrialization:hatches/turbo/item_output_from_input` |
| `modularrouters:range_down_augment` ↔ `modularrouters:range_up_augment` | science_shared | `modularrouters:range_down_from_up`, `modularrouters:range_up_from_down` |
| `neovitae:input_routing_node` ↔ `neovitae:output_routing_node` | ritualists | `neovitae:input_routing_node_from_output`, `neovitae:output_routing_node_from_input` |
| `pneumaticcraft:assembly_io_unit_export` ↔ `pneumaticcraft:assembly_io_unit_import` | mechanists | `pneumaticcraft:assembly_io_unit_export_from_import`, `pneumaticcraft:assembly_io_unit_import_from_export` |
| `pneumaticcraft:compressed_brick_tile` ↔ `pneumaticcraft:compressed_bricks` | mechanists | `pneumaticcraft:compressed_bricks_from_tile` |
| `pneumaticcraft:display_shelf` ↔ `pneumaticcraft:display_table` | mechanists | `pneumaticcraft:display_shelf`, `pneumaticcraft:display_table_from_shelf` |
| `pneumaticcraft:reinforced_brick_tile` ↔ `pneumaticcraft:reinforced_bricks` | mechanists | `pneumaticcraft:reinforced_bricks_from_tile` |
| `powah:dielectric_rod` ↔ `powah:dielectric_rod_horizontal` | stargazers | `powah:crafting/dielectric_rod_2`, `powah:crafting/dielectric_rod_h_2` |
| `schematicenergistics:cannon_interface` ↔ `schematicenergistics:cannon_interface_part` | science_shared | `schematicenergistics:cannon_interface_to_part`, `schematicenergistics:part_to_cannon_interface` |
| `theurgy:logistics_item_extractor` ↔ `theurgy:logistics_item_inserter` | magic_shared | `theurgy:crafting/shapeless/logistics_item_extractor_from_inserter`, `theurgy:crafting/shapeless/logistics_item_inserter_from_extractor` |
| `xycraft_machines:mekanical_condenser` ↔ `xycraft_machines:mekanical_evaporator` | science_shared | `xycraft:shapeless/mekanical_condenser_shift`, `xycraft:shapeless/mekanical_evaporator_shift` |
| `xycraft_world:lamp_rgb_glowing_inverted_white` ↔ `xycraft_world:lamp_rgb_glowing_white` | science_shared | `xycraft:shapeless/lamp_rgb`, `xycraft:shapeless/lamp_rgb_inverted` |
| `yet_another_industrialization:large_storage_unit_input_hatch` ↔ `yet_another_industrialization:large_storage_unit_output_hatch` | mechanists | `yet_another_industrialization:craft/large_storage_unit_input_hatch_convert`, `yet_another_industrialization:craft/large_storage_unit_output_hatch_convert` |

## Approved reset/disassembly entries — troubleshooting watchpoint

These serializer-based recipes are not proven 1:1 cycles by the JSON scan. Some can erase configuration, stored contents or return components. All 189 IDs in this exact list were approved for public recipe access. Their definitions and custom code were not changed. Keep this group as a first troubleshooting suspect if reset, item-component or refund behavior differs after startup. Of the 189 entries, 188 use custom serializers; one is ordinary XyCraft stonecutting caught by the original scan and is outside the crafting-table gate.

| Serializer | Definitions found | Example recipe ID |
|---|---:|---|
| `ae2:crafting_unit_transform` | 7 | `megacells:crafting/16m_crafting_storage_disassembly` |
| `ae2:storage_cell_disassembly` | 170 | `ae2:cell_upgrade/fluid_storage_cell_16k` |
| `integrateddynamics:crafting_special_nbt_clear` | 5 | `integrateddynamics:special/clear_delay` |
| `mekanism:clear_configuration` | 1 | `mekanism:clear_configuration` |
| `minecraft:stonecutting` | 1 | `xycraft:stonecutting/glass_viewer_glowing_clear` |
| `pipez:clear_components` | 1 | `pipez:clear_upgrade` |
| `spectrum:clear_crafting_tablet` | 1 | `spectrum:crafting_table/special/clear_crafting_tablet` |
| `spectrum:clear_ender_splice` | 1 | `spectrum:crafting_table/special/clear_ender_splice` |
| `spectrum:clear_ink` | 1 | `spectrum:crafting_table/special/clear_ink` |
| `spectrum:clear_potion_fillable` | 1 | `spectrum:crafting_table/special/clear_potion_fillable` |

## Material compression / decompression

Other reversible ratios (for example ingot ↔ storage block) were kept separate. They conserve a material count but can affect storage, recipe inputs and progression. Only the explicitly approved XP-gem ratios are public overrides.

| Restricted recipe namespace | Distinct material pairs found |
|---|---:|
| `actuallyadditions` | 20 |
| `advanced_ae` | 1 |
| `ae2` | 2 |
| `ars_nouveau` | 2 |
| `cataclysm` | 7 |
| `cognition` | 4 |
| `create` | 60 |
| `create_enchantment_industry` | 1 |
| `createaddition` | 3 |
| `createbigcannons` | 9 |
| `createdeco` | 10 |
| `crystal_chronicles` | 2 |
| `eternal_starlight` | 21 |
| `hazennstuff` | 6 |
| `industrialforegoing` | 1 |
| `integrateddynamics` | 2 |
| `justdirethings` | 10 |
| `malum` | 32 |
| `mekanism` | 1 |
| `mob_grinding_utils` | 1 |
| `modern_industrialization` | 2 |
| `moderndynamics` | 5 |
| `myotus` | 2 |
| `neovitae` | 2 |
| `pneumaticcraft` | 8 |
| `powah` | 6 |
| `replication` | 2 |
| `the_bumblezone` | 21 |
| `theurgy` | 1 |
| `twilightdelight` | 1 |
| `twilightforest` | 2 |
| `xycraft` | 1 |
| `yet_another_industrialization` | 1 |

## Already-public examples

CC:Tweaked wired modem ↔ full-block modem, SFM cable ↔ fancy cable, and Simply Light orientation/on-off variants already have no faction recipe restriction because their mods are available to everyone. They need no new override.

XyCraft definitions in the source use the `xycraft:` recipe namespace while their items use `xycraft_world:` / `xycraft_machines:`. The configuration now explicitly aliases `xycraft` recipes to the `xycraft_world` assignment, so these native recipes follow science-shared as intended. Pack-generated `craftoria:` recipes remain a separate namespace.
