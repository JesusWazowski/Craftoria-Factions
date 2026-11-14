const { item } = require('../helpers.cjs');

const magicShared = () => [
  {
    key: 'waystones', pillar: 'shared', tier: 1, chunks: 1, title: 'Waystones and Pylons', icon: 'waystones:waystone',
    tasks: [item('waystones:warp_stone'), item('waystones:waystone', 2), item('pylons:expulsion_pylon')],
  },
  {
    key: 'theurgy', pillar: 'shared', tier: 2, chunks: 1, title: 'Theurgy Alchemy', icon: 'theurgy:calcination_oven',
    tasks: [item('theurgy:pyromantic_brazier'), item('theurgy:calcination_oven'), item('theurgy:liquefaction_cauldron'), item('theurgy:distiller'), item('theurgy:incubator'), item('theurgy:mercury_shard', 16)],
  },
  {
    key: 'integrated', pillar: 'shared', tier: 2, chunks: 1, title: 'Integrated Dynamics and Tunnels', icon: 'integrateddynamics:logic_programmer',
    tasks: [item('integrateddynamics:squeezer'), item('integrateddynamics:drying_basin'), item('integrateddynamics:logic_programmer'),
      item('integrateddynamics:variable_transformer_input', 4), item('integrateddynamics:cable', 32), item('integratedtunnels:part_interface_item', 2), item('integratedscripting:scripting_drive')],
  },
  {
    key: 'reliquary', pillar: 'shared', tier: 3, chunks: 1, title: 'Reliquary Tools', icon: 'reliquary:alkahestry_tome',
    tasks: [item('reliquary:alkahestry_tome'), item('reliquary:fortune_coin'), item('reliquary:rending_gale'), item('reliquary:emperor_chalice')],
  },
  {
    key: 'reformation', pillar: 'shared', tier: 3, chunks: 2, title: 'Sulfur Reformation', icon: 'theurgy:reformation_source_pedestal',
    tasks: [item('theurgy:reformation_source_pedestal'), item('theurgy:reformation_target_pedestal'), item('theurgy:reformation_result_pedestal'),
      item('theurgy:sulfuric_flux_emitter'), item('theurgy:alchemical_sulfur_netherite')],
  },
];


module.exports = magicShared;
