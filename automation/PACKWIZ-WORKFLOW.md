# Maintaining the Prism / packwiz pack

Develop in this repository and install into a separate Prism instance. Minecraft
1.21.1 and NeoForge 21.1.249 are defined in `pack.toml`.

## File sources

The 15 API-blocked files with exact Modrinth matches are now managed by
`packwiz modrinth install --project-id ID --version-id VERSION --version-filename FILE`.
Their `.pw.toml` files include download URLs, hashes, and `[update.modrinth]` IDs.
Versions were matched by file hash, not by the project's latest release.
Structory: Towers remains pinned, as it was upstream.

The remaining files are distributed directly:

- `mods/apothic-nerf-1.21.1-neo.jar`
- `mods/framedblocksplus-0.1.1.jar`
- `resourcepacks/Craftoria Chinese Translation Resource.zip`
- `resourcepacks/Better SB Upgrades.zip`
- `resourcepacks/Aquaculture 2 Excalibur Support.zip`
- `resourcepacks/Pixel's Simple HUD.zip`
- `resourcepacks/Pretty X Smart Pipez Mekanism.zip`
- `resourcepacks/Pretty X Smart Pipez.zip`
- `resourcepacks/Suren Sophisticated Storage v2.0.0 1.21-1.21.1.zip`

The translation resource is a ZIP and must stay in `resourcepacks/`, not `mods/`.
Explicit exceptions in `.gitignore` and `.packwizignore` include these nine files.
Their old CurseForge metadata was removed so the installer does not request the
same files from the blocked API. The owner reports written rehosting permission
from each creator. Other locally downloaded JARs and ZIPs remain ignored.

## Updates

1. Fetch and merge changes from `upstream/main` into your fork's branch. `origin`
   refers to your fork. Resolve source metadata conflicts so these projects keep
   their Modrinth entries; remove any restored duplicate CurseForge entries.
2. To independently update a managed project, run `packwiz update <project>`.
   `packwiz update --all` checks every managed project and can change hundreds of
   mods; review its changes and test them before committing. Pinned projects
   stay pinned until explicitly unpinned.
3. Raw local binaries have no automatic update metadata. For a new version,
   replace the binary, update the filename exceptions in both ignore files, and
   verify its source hash. Keep it in its appropriate folder.
4. Run `packwiz refresh` after manually changing files. This indexes included raw
   binaries as ordinary files and updates the index hash in `pack.toml`.
5. Review and commit the changed metadata/binaries, ignore rules, `index.toml`,
   and `pack.toml` together. Publish those commits through your existing pack
   hosting workflow so clients can receive them.

## Testing

Run `packwiz serve` in the repository and leave it running. It refreshes the index
when queried. In Prism's instance custom commands, use:

```text
"$INST_JAVA" -jar "$INST_MC_DIR/packwiz-installer-bootstrap.jar" http://localhost:8080/pack.toml
```

Place the bootstrap JAR in the instance's Minecraft folder. Launch from Prism,
check that the installer finishes without manual downloads, and verify the game
reaches its main menu. Inspect `logs/latest.log` and `logs/kubejs/` for runtime
errors. A successful packwiz update alone does not verify a successful game launch.

For a read-only hash audit of an installed client, run (Python 3.11+):

```text
python automation/verify-pack-files.py "PATH/TO/INSTANCE/minecraft" automation/instance-hash-audit.json
```

This checks every indexed client file against its pinned hash and reports missing,
changed, and unmanaged archives. Config mismatches can reflect deliberate local
settings; inspect them without overwriting your factions command restrictions.
Use a separate empty folder for installer download tests so existing resource
packs cannot conceal CurseForge API restrictions. See `RESOURCE-DOWNLOAD-AUDIT.md`
for the additional nine resource packs found by that test.

## Documentation

- https://packwiz.infra.link/tutorials/creating/adding-mods/
- https://packwiz.infra.link/tutorials/creating/getting-started/
- https://packwiz.infra.link/tutorials/installing/packwiz-installer/
