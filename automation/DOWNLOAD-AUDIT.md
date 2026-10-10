# API-excluded file download audit

All 15 files from the Prism installer log were downloaded and verified against the SHA-1 in their packwiz metadata. Mod JARs are in mods/; resource pack ZIPs are in resourcepacks/.

| File | Source | Verified SHA-1 |
| --- | --- | --- |
| apothic-nerf-1.21.1-neo.jar | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/apothic-nerf/files/8821106) | `e2c676f13de33198e75affc85c2c27ca2a567da7` |
| emi-qol-tweaks-neoforge-1.2.jar | [Modrinth](https://modrinth.com/version/TP3aTluA) | `3194afe3f6570b92473c44592cb690b32c3a22ae` |
| entityculling-neoforge-1.11.2-mc1.21.1.jar | [Modrinth](https://modrinth.com/version/8w8FfUPs) | `2f723582d44b60b41d701a797846eaa45a3fef58` |
| framedblocksplus-0.1.1.jar | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/framedblocksplus/files/8831880) | `4b5884dbe2cec75f1bdaeef6ad34c0f4edb3f4e5` |
| imfast-NEOFORGE-1.21.1-1.0.3.jar | [Modrinth](https://modrinth.com/version/FWI4gJ6y) | `f8e92ef61de3751f619238eed5ae9952b5a049d0` |
| Loot Beams Refork-neoforge-1.21.1-3.4.7.jar | [Modrinth](https://modrinth.com/version/lsOrQAr5) | `38012122e012278c22e40321f85aaa8ccdaffce4` |
| notenoughanimations-neoforge-1.12.6-mc1.21.1.jar | [Modrinth](https://modrinth.com/version/VCuMsK45) | `2098ae4965ebefb2dc8d5aec42a7d5282414fddc` |
| plushie_buddies-1.0.1-neofroge-1.21.1.jar | [Modrinth](https://modrinth.com/version/79cJi8lU) | `03aa8759bf907ab073c56116ba37849fef9f03bd` |
| seasonal_lets_do-neoforge-1.5.0+1.21.jar | [Modrinth](https://modrinth.com/version/yptLMknL) | `d493b8b8b3a7e5805ed43bdb5d4eb5befc0f9853` |
| Structory_Towers_26.1_v1.0.16.jar | [Modrinth](https://modrinth.com/version/ioKwCTuD) | `ed22fe659cb3020f2e86b7619ce721714b9546be` |
| Structory_26.2_v1.3.7.jar | [Modrinth](https://modrinth.com/version/TUbwu7eG) | `8a9a1a1b3f74398310420b6fbe2c26ef142bed42` |
| SubtleEffects-neoforge-1.21.1-1.14.3.jar | [Modrinth](https://modrinth.com/version/s3Fo4cDk) | `f0c846484bd7c769b88f38ab31429457f52552d7` |
| waveycapes-neoforge-1.11.2-mc1.21.1.jar | [Modrinth](https://modrinth.com/version/7ndXqAZv) | `72e114d581618d67e9c3915f18284f1ba971bf67` |
| Craftoria Chinese Translation Resource.zip | [CurseForge](https://www.curseforge.com/minecraft/texture-packs/craftoria-chinese-translation-resource/files/7746282) | `d824a09e6bcd84b00e83ff0d17876fee787bd6c1` |
| Medieval_Style_Lootr.zip | [Modrinth](https://modrinth.com/version/N7HOAO7o) | `cb8cc5682de7419eaf72c1f0b14652d0189c3dac` |


FramedBlocksPlus: official source https://github.com/Naddox/FramedBlocksPlus has a release entry, but no attached binary assets. No matching Modrinth release was returned.

Apothic Nerf and Craftoria Chinese Translation Resource: no exact Modrinth hash matches, no Modrinth search results, and no GitHub repositories returned by name search. Downloaded the pinned files from the CurseForge website download endpoint.

The 12 Modrinth matches have now been installed through packwiz with exact version IDs. The remaining two JARs and translation ZIP are explicitly included in Git and packwiz, and their blocked CurseForge metadata has been removed. See PACKWIZ-WORKFLOW.md for maintenance instructions.
