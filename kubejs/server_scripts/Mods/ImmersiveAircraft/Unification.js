// priority: -900
// Local Create Immersive Aircrafts datapack integration. Use the same common
// plate ingredients as the rest of Craftoria; Almost Unified retains ownership
// of the preferred item (MI iron/copper plates, Create brass sheets).
ServerEvents.recipes(event => {
  const aircraftRecipes = [
    { mod: 'immersive_aircraft' },
    { mod: 'man_of_many_planes' },
    { mod: 'create_recipes' },
  ];

  event.replaceInput(aircraftRecipes, 'create:iron_sheet', '#c:plates/iron');
  event.replaceInput(aircraftRecipes, 'create:copper_sheet', '#c:plates/copper');
  event.replaceInput(aircraftRecipes, 'create:brass_sheet', '#c:plates/brass');
});
