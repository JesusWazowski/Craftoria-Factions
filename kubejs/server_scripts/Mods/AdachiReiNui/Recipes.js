// Temporary compatibility fix for AdachiRei-nui NeoForge v1.1.5 / Minecraft 1.21.1.
// Upstream uses recipes/ instead of recipe/ and result.item instead of result.id.
// On mod version changes, validate native recipes and remove fixes once upstream works.
// Original patterns, ingredients, counts, and recipe IDs are preserved.
ServerEvents.recipes(event => {
  event.shaped('adachirei-nui:adachi-nui', ['RKL', 'ODO', 'HGH'], {
    R: 'minecraft:redstone_lamp',
    K: 'minecraft:black_carpet',
    L: 'minecraft:repeater',
    O: 'minecraft:orange_wool',
    D: 'minecraft:redstone',
    H: 'minecraft:white_wool',
    G: 'minecraft:gray_wool',
  }).id('adachirei-nui:adachi-nui');

  event.shaped('adachirei-nui:adachi-nui_new', ['OOL', 'GDG', 'GIG'], {
    L: 'minecraft:comparator',
    O: 'minecraft:orange_wool',
    D: 'minecraft:redstone_block',
    I: 'minecraft:iron_nugget',
    G: 'minecraft:gray_wool',
  }).id('adachirei-nui:adachi-nui_new');

  event.shaped('adachirei-nui:adachi-nui_vocaloid', ['RKL', 'ODO', 'HGH'], {
    R: 'minecraft:redstone_lamp',
    K: 'minecraft:black_carpet',
    L: 'minecraft:repeater',
    O: 'minecraft:orange_wool',
    D: 'minecraft:redstone_block',
    H: 'minecraft:gray_wool',
    G: 'minecraft:white_wool',
  }).id('adachirei-nui:adachi-nui_vocaloid');

  event.shaped('8x adachirei-nui:adachirei-nui_box', ['HHH', 'HAH', 'HHH'], {
    A: 'adachirei-nui:adachi-nui',
    H: 'minecraft:white_wool',
  }).id('adachirei-nui:adachirei-nui_box');

});
