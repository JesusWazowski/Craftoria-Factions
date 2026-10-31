const { any, custom, BACKPACKS } = require('./helpers.cjs');

// Identical for every faction: 1 chunk each.
const starters = factionName => [
  {
    key: 'home', title: 'Plant the Banner', subtitle: 'Use /sethome to establish your faction base.', chunks: 1,
    icon: 'minecraft:white_banner', shape: 'gear', size: 1.5, starter: true,
    tasks: [custom('home', 'Set a valid faction home', 'minecraft:compass')],
    desc: [
      `&7Every ${factionName} enterprise starts from a fixed point. Your party owner or an officer must stand inside a chunk your faction has claimed and run &b/sethome&7.`,
      '',
      '&6How faction homes work',
      '&7- &b/sethome&7 saves the dimension, position and facing of whoever runs it. It only works while the session is &aunlocked&7, inside your own claim, within world height. Operators can also run &b/sethome <party>&7 for any faction.',
      '&7- &b/home&7 shows the saved home. It never teleports: travel is built, not commanded.',
      '&7- Operators cannot &block&7 a session until every faction has a valid home.',
      '&7- While a session is locked, anyone found in the wilderness is returned to the last claimed position they stood in, or to this home. New and reassigned members also arrive here.',
      '&7- If the home chunk is unclaimed, the home becomes invalid and members are disconnected until it is fixed.',
      '',
      '&7This task completes automatically once your faction has a valid home. Your faction starts with &b4&7 claimable chunks; this milestone line raises that to &b64&7.',
    ],
  },
  {
    key: 'backpack', title: 'Pack for the Journey', subtitle: 'Sew a Sophisticated Backpack.', chunks: 1,
    icon: 'sophisticatedbackpacks:backpack', shape: 'gear', size: 1.5, starter: true,
    tasks: [any(BACKPACKS, 'Any Sophisticated Backpack')],
    desc: [
      '&7Sophisticated Backpacks are open to every faction. A backpack is your portable stockpile while claims are scarce.',
      '',
      '&7Upgrades from the backpack also work in Sophisticated Storage chests and barrels in this pack, and any backpack tier counts for this quest.',
    ],
  },
];


module.exports = starters;
