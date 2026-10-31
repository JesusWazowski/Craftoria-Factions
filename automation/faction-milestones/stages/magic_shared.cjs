const { item } = require('../helpers.cjs');

const magicShared = () => [
  {
    key: 'waystones', pillar: 'shared', tier: 1, chunks: 1, title: 'Paths Between Stones', icon: 'waystones:waystone',
    subtitle: 'Shared magic: Waystones and Pylons.',
    tasks: [item('waystones:warp_stone'), item('waystones:waystone', 2), item('pylons:expulsion_pylon')],
    desc: ['&7Waystone travel costs one level per 100 blocks (27 levels across dimensions). Warp plates and global waystones are free.', '', '&7Under a locked session, travel destinations must be in claimed chunks. An &bExpulsion Pylon&7 keeps unwanted visitors out of your claim.'],
  },
  {
    key: 'theurgy', pillar: 'shared', tier: 2, chunks: 1, title: 'Spagyrics', icon: 'theurgy:calcination_oven',
    subtitle: 'Shared magic: Theurgy alchemy.',
    tasks: [item('theurgy:pyromantic_brazier'), item('theurgy:calcination_oven'), item('theurgy:liquefaction_cauldron'), item('theurgy:distiller'), item('theurgy:incubator'), item('theurgy:mercury_shard', 16)],
    desc: ['&7Break matter into salt, sulfur and mercury, then put it back together as something better.', '', '&7Rare and precious sulfurs need iesnium, fluix or iridium, so some of them are trade goods.'],
  },
  {
    key: 'integrated', pillar: 'shared', tier: 2, chunks: 1, title: 'Integrated Thought', icon: 'integrateddynamics:logic_programmer',
    subtitle: 'Shared magic: Integrated Dynamics, Tunnels and Scripting.',
    tasks: [item('integrateddynamics:squeezer'), item('integrateddynamics:drying_basin'), item('integrateddynamics:logic_programmer'),
      item('integrateddynamics:variable_transformer_input', 4), item('integrateddynamics:cable', 32), item('integratedtunnels:part_interface_item', 2), item('integratedscripting:scripting_drive')],
    desc: ['&7Integrated Dynamics is magic-shared here for its menril magitech flavour. It is logic and transport only: Integrated Terminals and Crafting are not in the pack.'],
  },
  {
    key: 'reliquary', pillar: 'shared', tier: 3, chunks: 1, title: 'Relics of the Fallen', icon: 'reliquary:alkahestry_tome',
    subtitle: 'Shared magic: Reliquary.',
    tasks: [item('reliquary:alkahestry_tome'), item('reliquary:fortune_coin'), item('reliquary:rending_gale'), item('reliquary:emperor_chalice')],
    desc: ['&7Every Reliquary ingredient comes from mob kills in this pack: the gold-ingot fallback recipes are disabled.', '', '&7The Emperor\'s Chalice is also part of the infinity water cell.'],
  },
  {
    key: 'reformation', pillar: 'shared', tier: 3, chunks: 2, title: 'Reformation Array', icon: 'theurgy:reformation_source_pedestal',
    subtitle: 'Shared magic: endless sulfur.',
    tasks: [item('theurgy:reformation_source_pedestal'), item('theurgy:reformation_target_pedestal'), item('theurgy:reformation_result_pedestal'),
      item('theurgy:sulfuric_flux_emitter'), item('theurgy:alchemical_sulfur_netherite')],
    desc: ['&7The Reformation Array copies a sulfur endlessly: in effect, an infinite ore of your choice. An array takes floor space; claim accordingly.'],
  },
];


module.exports = magicShared;
