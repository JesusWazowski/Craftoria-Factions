// Source of truth for milestone composition. Keep keys and task order stable to preserve progress IDs.
module.exports = {
  baseClaims: 4,
  maxClaims: 124,
  group: { key: 'group', title: '&6&lFaction Milestones' },
  factions: [
    require('./stages/stargazers.cjs'),
    require('./stages/mechanists.cjs'),
    require('./stages/spellcasters.cjs'),
    require('./stages/ritualists.cjs'),
  ],
};
