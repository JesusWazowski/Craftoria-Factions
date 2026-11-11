ServerEvents.recipes(event => {
  const shortcuts = [
    'mffs:steel_compound',
    'mffs:steel_ingot',
    'createbigcannons:mixing/alloy_steel',
    'createbigcannons:mixing/alloy_bronze_brass',
    'createbigcannons:mixing/alloy_bronze_tin',
    'createbigcannons:mixing/alloy_bronze_tinless',
    // Keep Nethersteel obtainable through the route that consumes progressed steel.
    'createbigcannons:mixing/alloy_nethersteel_cast_iron',
  ];

  shortcuts.forEach(id => event.remove({ id }));
});
