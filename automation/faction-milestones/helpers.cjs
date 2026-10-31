const item = (id, count = 1) => ({ type: 'item', id, count });
const consume = (id, count) => ({ type: 'item', id, count, consume: true });
// FTB Filter System expression; title is shown instead of the filter token.
const any = (ids, title, count = 1) => ({ type: 'item', filter: 'or(' + ids.map(id => `item(${id})`).join('') + ')', icon: ids[0], title, count });
const fromMod = (mod, title, count, icon) => ({ type: 'item', filter: `mod(${mod})`, icon, title, count });
const kill = (entity, title, value = 1, icon) => ({ type: 'kill', entity, value, title, icon });
const adv = (advancement, title, icon) => ({ type: 'advancement', advancement, title, icon });
const dim = (dimension, title, icon) => ({ type: 'dimension', dimension, title, icon });
const custom = (kind, title, icon) => ({ type: 'custom', kind, title, icon });
const stat = (id, value, title, icon) => ({ type: 'stat', stat: id, value, title, icon });

const BACKPACKS = ['sophisticatedbackpacks:backpack', 'sophisticatedbackpacks:copper_backpack',
  'sophisticatedbackpacks:iron_backpack', 'sophisticatedbackpacks:gold_backpack',
  'sophisticatedbackpacks:diamond_backpack', 'sophisticatedbackpacks:netherite_backpack'];


module.exports = { item, consume, any, fromMod, kill, adv, dim, custom, stat, BACKPACKS };
