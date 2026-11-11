ServerEvents.recipes(event => {
  const item = id => ({ item: id });
  const tag = id => ({ tag: id });
  const nugget = tag('c:nuggets/iron');
  const ignition = item('minecraft:flint_and_steel');
  const press = null;

  function assemble(id, ingredient, steps) {
    const unfinished = `craftoria:incomplete_${id}`;
    const sequence = steps.map(input => ({
      type: input === press ? 'create:pressing' : 'create:deploying',
      ingredients: input === press ? [item(unfinished)] : [item(unfinished), input],
      results: [{ id: unfinished }],
    }));
    event.custom({
      type: 'create:sequenced_assembly',
      ingredient,
      transitional_item: { id: unfinished },
      loops: 1,
      sequence,
      results: [{ id: `musketmod:${id}` }],
    }).id(`musketmod:sequenced_assembly/${id}`);
  }

  ['musket', 'blunderbuss', 'pistol'].forEach(id => event.remove({ id: `musketmod:${id}` }));

  const ironPlate = tag('c:plates/iron');
  const copperPlate = tag('c:plates/copper');
  assemble('musket', tag('minecraft:planks'), [ironPlate, ironPlate, press, nugget, ignition]);
  assemble('blunderbuss', tag('minecraft:planks'), [copperPlate, copperPlate, press, nugget, ignition]);
  assemble('pistol', tag('c:rods/wooden'), [tag('c:ingots/iron'), nugget, ignition]);
});
