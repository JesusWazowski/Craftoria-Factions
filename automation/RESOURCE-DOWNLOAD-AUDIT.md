# Resource download audit — 2026-10-10

An installer run in an initially empty folder identified nine more CurseForge
API-blocked resource packs. Existing copies in the Prism instance had concealed
these restrictions. All nine installed ZIPs matched the pinned CurseForge SHA-1.
The owner confirms permission to redistribute the blocked files.

| Resource pack | Replacement source | Original SHA-1 |
| --- | --- | --- |
| Better Sophisticated Backpack Upgrades | Bundled ZIP | `327c49f6ef8b452c12ca47e100da8293fec6213d` |
| Drodi's Illagers x Fresh Animations | [Modrinth exact version](https://modrinth.com/version/afT2DcAE) | `aa2450ad6714794bed25637802b1b6b20ce4e17b` |
| Excalibur Aquaculture 2 support | Bundled ZIP | `9ffe7ce6d0cf4c946759a6da6c13ddcd1720c178` |
| Fresh Animations | [Modrinth exact version](https://modrinth.com/version/xN57JJts) | `73db740a6868e043c5e615c036fca2c912615b6e` |
| Pixel's Simple HUD | Bundled ZIP | `6bb575ab158467e1e6bb08969f937d50b60aa82b` |
| Pretty X Smart Pipez Mekanism | Bundled ZIP | `f221acf545c879b5bfdf30e819747d64183ec78f` |
| Pretty X Smart Pipez | Bundled ZIP | `73e1a40d46b547b18b08cccc3347e021302b3bb5` |
| Suren's Sophisticated Storage | Bundled ZIP | `1333fc555bf89f9c6e218b6b57a4a6d7867f69e6` |
| Torchmaster Remaster | [Modrinth exact version](https://modrinth.com/version/ObbV22EM) | `27b1682e4c81adaab68bf71cad40bb340091775a` |

The six bundled ZIPs were copied from the hash-verified installed files. Their
explicit Git and packwiz ignore exceptions allow the ordinary pack hosting
workflow to distribute them. Obsolete CurseForge metadata was removed, and the
packwiz index was refreshed. No new upstream versions were substituted.

The similarly named Modrinth Excalibur file has a different hash, so it was not
used. Torchmaster's installed filename stays `Torchmaster Remaster.zip`, preserving
existing resource-pack selections even though its Modrinth URL names it differently.

## Verification and configuration preservation

The initial live-client audit verified all 564 externally managed downloads.
There were no missing downloads, archive hash mismatches, or unmanaged archives.
The 47 differing indexed files were all under `config/`; they were preserved.
All audited live config hashes were checked again after the source changes and
were unchanged. No repository config files were modified.

Both server-only mods, I'm Fast and Seasonal Let's Do, were separately downloaded
from their pinned Modrinth URLs and verified with their metadata's SHA-512 hashes.

After the source changes, the isolated client installer finished successfully
without manual downloads. A complete hash audit verified all 5,804 client files,
including 558 external downloads, with zero missing files, mismatches, or unmanaged
archives. Together with the two separately verified server-only mods, every indexed
pack file was covered. Local evidence is in `clean-install-verification.log`,
`clean-hash-audit.json`, `instance-final-hash-audit.json`, and `server-hash-audit.json`.

These source changes are local until the updated metadata, ZIPs, index, and pack
manifest are committed and published through the fork's pack hosting workflow.

The reusable read-only verifier is `verify-pack-files.py`. It checks the index,
metadata, installed files, and unmanaged mod/resource/shader archives. Local JSON
reports and the isolated installer folder are ignored by Git and packwiz.

Download availability and hash verification do not establish that Minecraft
successfully launches or that the pack is compatible with factions gameplay.
