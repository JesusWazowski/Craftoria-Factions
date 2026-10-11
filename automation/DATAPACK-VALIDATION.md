# Datapack selection validation failure

The `Craftoria Factions Test` log on 2026-10-11 repeatedly failed validation
with this exception after recipes and advancements had loaded:

```text
NullPointerException: Cannot invoke "ServerLevel.getServer()" because "original" is null
FakeServerLevel.<init>
BlockTestLevel.<init>
FakeLevelManager.getServer
BlockTestLevel.get
FaucetBehaviorsManager.onLevelLoad
FaucetBehaviorsManager.apply
CreateWorldScreen: Failed to validate datapack
```

Affected installed versions: Supplementaries 1.21.1-3.9.9, Moonlight
1.21.1-3.6.8, World Preview NeoForged 1.3.1, Minecraft 1.21.1.

Supplementaries' faucet reload listener checks whether a current server exists,
then passes `currentServer.overworld()` into its test-level constructor without
checking whether that overworld exists. World Preview registers a temporary
server during world creation without creating its normal server levels. This
provides a likely explanation for the null level during validation; a restart
without World Preview is needed to confirm the workaround in this pack.

Sources:

- [Supplementaries faucet reload code](https://github.com/MehVahdJukaar/Supplementaries/blob/1.21.1/common/src/main/java/net/mehvahdjukaar/supplementaries/common/block/faucet/FaucetBehaviorsManager.java)
- [World Preview NeoForged temporary server setup](https://github.com/Alwis2000/world-preview-NF/blob/HEAD/src/main/java/com/caeruleusTait/world/preview/backend/worker/SampleUtils.java)
- [Upstream World Preview / Supplementaries incompatibility report](https://github.com/caeruleusDraconis/world-preview/issues/65) (reported on Minecraft 1.20.1; supporting evidence, not a reproduction of this pack)

The simplest workaround is to disable World Preview and restart the game.
Keep Supplementaries, Moonlight, and the OpenLoader datapacks enabled. Changing
pack formats or removing recipes will not repair this Java null-pointer error.

Verify in the Prism instance `Craftoria Factions Test`, whose packwiz bootstrap
updates from the local pack server. Open Create New World, open Data Packs,
and press Done with the same selected packs. Successful validation returns to
world creation. Check `minecraft/logs/latest.log` for any new
`Failed to validate datapack` exception if it still fails.

Other recipe and loot-modifier errors appear earlier in the log, but this
exception is the failure that aborts the selection-screen validation.
