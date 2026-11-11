StartupEvents.registry('item', event => {
  const items = {
    musket: 'Musket',
    blunderbuss: 'Blunderbuss',
    pistol: 'Flintlock Pistol',
    cartridge: 'Paper Cartridge',
  };

  Object.entries(items).forEach(([id, name]) => {
    event.create(`craftoria:incomplete_${id}`)
      .displayName(`Incomplete ${name}`)
      .texture(`craftoria:item/incomplete_${id}`);
  });
});
