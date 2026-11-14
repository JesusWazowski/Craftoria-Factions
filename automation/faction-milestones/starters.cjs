const { any, custom, BACKPACKS } = require('./helpers.cjs');

// Identical for every faction: 1 chunk each.
const starters = () => [
  {
    key: 'home', title: 'Set a Faction Home', chunks: 1,
    icon: 'minecraft:white_banner', shape: 'gear', size: 1.5, starter: true,
    tasks: [custom('home', 'Set a valid faction home', 'minecraft:compass')],
    desc: [
      "&7The &b/sethome&7 command can be run while in claimed chunks to set a faction home.",
      "",
      "&6How faction homes work",
      "&7- &b/sethome&7 saves your current position and direction. It only works while the session is &aunlocked&7, and you're in a valid space to do so. &o(You can ask an operator to manually &b/sethome <party>&7 if needed.)&r",
      "&7- &b/home&7 shows information about your faction home, rather than teleporting you.",
      "&7- When the session is locked, players standing outside of claimed chunks or newly joining a faction will be teleported to your home.",
      "&7- It is important that factions have a home &bat all times&7. Once your home is established, ensure it is not compromised!",
      "&7- If your home is outside of claimed chunks when the session ends, an operator will need to manually position it in a valid spot. &4Try to avoid this!&r",
      "",
      "&7Simply claim one of your &b4&7 starter chunks, and set a home to complete this quest.",
    ],
  },
  {
    key: 'backpack', title: 'Obtain a Sophisticated Backpack', chunks: 1,
    icon: 'sophisticatedbackpacks:backpack', shape: 'gear', size: 1.5, starter: true,
    tasks: [any(BACKPACKS, 'Any Sophisticated Backpack')],
    desc: [
      "&7Sophisticated Backpacks are an easy-to-craft management tool for early game inventory management. They're so useful that we created this quest to remind everyone to make them!",
      "",
      "&7You can upgrade the backpack with a variety of useful functions. Try searching in the EMI search bar at the bottom of your inventory:",
      "&9\"@sophisticatedbackpacks upgrade\"&r",
    ],
  },
];


module.exports = starters;
