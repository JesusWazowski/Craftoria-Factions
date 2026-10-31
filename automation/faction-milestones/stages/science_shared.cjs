const { item } = require('../helpers.cjs');

// Shared groups: both member factions receive the same quests and chunk values.
// The router connector a faction can build from its own parts (both connectors are science-shared).
const scienceShared = router => [
  {
    key: 'routing', pillar: 'shared', tier: 1, chunks: 1, title: 'Routing Theory', icon: 'modularrouters:modular_router',
    subtitle: 'Shared science: Modular Routers and Pipez.',
    tasks: [item('modularrouters:modular_router', 2), item('modularrouters:sender_module_1'), item(router), item('pipez:item_pipe', 16), item('pipez:fluid_pipe', 8), item('pipez:energy_pipe', 8)],
    desc: ['&7Your first logistics are routers and pipes. Both are shared between the science factions, as are the Mekanistic Routers and Modern Industrial Routers connectors; this quest asks for the one your own machines can build.'],
  },
  {
    key: 'xycraft', pillar: 'shared', tier: 1, chunks: 1, title: 'Xychorium Crystals', icon: 'xycraft_world:xychorium_gem_blue',
    subtitle: 'Shared science: XyCraft.',
    tasks: [item('xycraft_world:xychorium_gem_blue', 16), item('xycraft_world:xychorium_gem_red', 16), item('xycraft_world:xychorium_gem_green', 16), item('xycraft_machines:extractor'), item('xycraft_override:bricks_blue', 8)],
    desc: ['&7Xychorium crystals feed XyCraft machines and storage. In this pack XyCraft uses iron where it would use aluminium, so it is an early iron-tier option.', '', '&7The bronze-drill MI quarry also yields xychorium.'],
  },
  {
    key: 'hnn', pillar: 'shared', tier: 2, chunks: 1, title: 'Simulated Prey', icon: 'hostilenetworks:sim_chamber',
    subtitle: 'Shared science: Hostile Neural Networks.',
    tasks: [item('hostilenetworks:deep_learner'), item('hostilenetworks:sim_chamber', 2), item('hostilenetworks:loot_fabricator', 2), item('hostilenetworks:prediction_matrix', 64)],
    desc: ['&7Data models are the only way to automate boss drops here: bosses are blacklisted from spawners, cloning and crushers.', '', '&7Train a model by killing its mob with the Deep Learner equipped, then run it in a Simulation Chamber.'],
  },
  {
    key: 'industry', pillar: 'shared', tier: 2, chunks: 1, title: 'Industrial Collective', icon: 'actuallyadditions:empowerer',
    subtitle: 'Shared science: Industrial Foregoing, Actually Additions and Tempad.',
    tasks: [item('industrialforegoing:machine_frame_simple'), item('industrialforegoing:mob_crusher'), item('industrialforegoing:laser_drill'),
      item('mifa:speed_addon_3'), item('actuallyadditions:empowerer'), item('actuallyadditions:atomic_reconstructor'), item('tempad:tempad')],
    desc: ['&7MIFA pushes Industrial Foregoing addons past tier 2. The Actually Additions &bEmpowerer&7 is mandatory for Cosmic Matter and the boss-gateway pearls, so other factions may come to you for it.', '', '&7Its crusher doubles late MI ores. A &bTempad&7 opens timed doors home, for a price in chronons.'],
  },
  {
    key: 'replication', pillar: 'shared', tier: 3, chunks: 2, title: 'Matter From Nothing', icon: 'replication:replicator',
    subtitle: 'Shared science: Replication.',
    tasks: [item('replication:identification_chamber'), item('replication:disintegrator'), item('replication:replicator'), item('replication:matter_tank', 2),
      item('replication:chip_storage'), item('replication:replication_terminal'), item('replication:replica_ingot', 16)],
    desc: ['&7Replica ingots need quantum infusion plus either the &bMI Electrolyzer&7 (Mechanists) or the &bMekanism APNS&7 (Stargazers).', '', '&7Replication copies diamonds, gems, common metals and drops, but not iridium, platinum, titanium, tungsten or plutonium.'],
  },
];


module.exports = scienceShared;
