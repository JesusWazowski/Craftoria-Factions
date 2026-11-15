const ClaimVisibilityTeams = Java.loadClass('dev.ftb.mods.ftbteams.api.FTBTeamsAPI');
const ClaimVisibilityProperty = Java.loadClass('dev.ftb.mods.ftbchunks.api.FTBChunksProperties').CLAIM_VISIBILITY;
const ClaimVisibilityDefault = Java.loadClass('dev.ftb.mods.ftbchunks.FTBChunksWorldConfig').DEF_CLAIM_VISIBILITY;
const ClaimVisibilityPrivate = Java.loadClass('dev.ftb.mods.ftbteams.api.property.PrivacyMode').PRIVATE;

ServerEvents.loaded(() => {
  // FTB Teams uses this flag for both server-side GUI submissions and settings commands.
  ClaimVisibilityProperty.notPlayerEditable();
  ClaimVisibilityDefault.set(ClaimVisibilityPrivate);

  const manager = ClaimVisibilityTeams.api().getManager();
  let changed = false;
  manager.getTeams().forEach(team => {
    if (team.getProperty(ClaimVisibilityProperty) !== ClaimVisibilityPrivate) {
      team.setProperty(ClaimVisibilityProperty, ClaimVisibilityPrivate);
      changed = true;
    }
  });
  if (changed) manager.saveNow();
});
