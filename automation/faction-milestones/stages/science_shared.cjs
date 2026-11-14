const { item, tagged } = require('../helpers.cjs');

// Shared groups: both member factions receive the same quests and chunk values.
// The router connector a faction can build from its own parts (both connectors are science-shared).
const scienceShared = () => [
  {
    key: 'routing', pillar: 'shared', tier: 1, chunks: 1, title: 'Modular Routers and an Upgrade', icon: 'modularrouters:modular_router',
    tasks: [item('modularrouters:modular_router', 2), tagged('modularrouters:upgrades', 'Any Modular Routers upgrade', 'modularrouters:speed_upgrade')],
  },
  {
    key: 'xycraft', pillar: 'shared', tier: 1, chunks: 1, title: 'Xychorium Crystals', icon: 'xycraft_world:xychorium_gem_blue',
    tasks: [item('xycraft_world:xychorium_gem_blue', 16), item('xycraft_world:xychorium_gem_red', 16), item('xycraft_world:xychorium_gem_green', 16), item('xycraft_machines:extractor')],
  },
  {
    key: 'hnn', pillar: 'shared', tier: 2, chunks: 1, title: 'Hostile Neural Networks Machines', icon: 'hostilenetworks:sim_chamber',
    tasks: [item('hostilenetworks:deep_learner'), item('hostilenetworks:sim_chamber', 2), item('hostilenetworks:loot_fabricator', 2), item('hostilenetworks:prediction_matrix', 64)],
  },
  {
    key: 'industry', pillar: 'shared', tier: 2, chunks: 1, title: 'Industrial Foregoing and Actually Additions', icon: 'actuallyadditions:empowerer',
    tasks: [item('industrialforegoing:machine_frame_simple'), item('industrialforegoing:mob_crusher'), item('industrialforegoing:laser_drill'),
      item('mifa:speed_addon_3'), item('actuallyadditions:empowerer'), item('actuallyadditions:atomic_reconstructor'), item('tempad:tempad')],
  },
  {
    key: 'replication', pillar: 'shared', tier: 3, chunks: 2, title: 'Replication Machines', icon: 'replication:replicator',
    tasks: [item('replication:identification_chamber'), item('replication:disintegrator'), item('replication:replicator'), item('replication:matter_tank', 2),
      item('replication:chip_storage'), item('replication:replication_terminal'), item('replication:replica_ingot', 16)],
  },
];


module.exports = scienceShared;
