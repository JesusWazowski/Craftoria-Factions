"""Build the resource-only NeoForge coremod with deterministic archive bytes."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent
output = root.parents[1] / "mods/craftoria-pylons-compat-1.0.0.jar"
with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as jar:
    for file in sorted((root / "resources").rglob("*")):
        if file.is_file():
            entry = zipfile.ZipInfo(file.relative_to(root / "resources").as_posix(), (2026, 1, 1, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            jar.writestr(entry, file.read_bytes().replace(b"\r\n", b"\n"))
    jar.writestr(zipfile.ZipInfo("META-INF/MANIFEST.MF", (2026, 1, 1, 0, 0, 0)),
                 "Manifest-Version: 1.0\nFMLModType: MOD\n\n")
print(output)
