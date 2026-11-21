// Cancel the player's gliding state rather than modifying an equipped item.
// This also covers Elytra Slot/Caelus and other providers of vanilla gliding.
ServerEvents.tick(event => {
  event.server.getPlayerList().getPlayers().forEach(player => {
    if (player.isFallFlying() && player.isShiftKeyDown()) {
      player.stopFallFlying();
    }
  });
});
