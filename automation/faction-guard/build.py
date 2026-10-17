"""Build the tiny guard using a Prism 1.21.1 instance's installed libraries (Java 21)."""
import argparse
import pathlib
import subprocess
import zipfile

p = argparse.ArgumentParser()
p.add_argument('prism_root', type=pathlib.Path)
p.add_argument('instance', type=pathlib.Path, help='Minecraft directory containing mods/')
p.add_argument('--java-bin', type=pathlib.Path, required=True)
a = p.parse_args()
root = pathlib.Path(__file__).resolve().parent
build = root / '.build'
classes = build / 'classes'
classes.mkdir(parents=True, exist_ok=True)
jars = sorted((a.prism_root / 'libraries').rglob('*.jar'))
# A single pinned mapped Minecraft jar avoids accidentally compiling against another MC release.
mapped = a.prism_root / 'libraries/net/neoforged/neoforge/21.1.249/neoforge-21.1.249-client.jar'
vanilla = a.prism_root / 'libraries/net/minecraft/client/1.21.1-20240808.144430/client-1.21.1-20240808.144430-srg.jar'
jars = [mapped, vanilla] + [jar for jar in jars if jar not in [mapped, vanilla] and not
    (jar.name.startswith('neoforge-') and not jar.name.endswith('-universal.jar'))
    and '/minecraft/' not in jar.as_posix() and '/forge/' not in jar.as_posix()]
jars += sorted((a.instance / 'mods').glob('*.jar'))
import os
classpath = os.pathsep.join(str(jar.resolve()) for jar in jars)
args = build / 'javac.args'
args.write_text('--release\n21\n-proc:none\n-classpath\n"' + classpath.replace('\\', '/')
    + '"\n-d\n"' + str(classes).replace('\\', '/') + '"\n"'
    + str(root / 'src/craftoria/factions/FactionGuard.java').replace('\\', '/') + '"\n', encoding='utf-8')
subprocess.run([str(a.java_bin / 'javac.exe'), '@' + str(args)], check=True)
output = root.parents[1] / 'mods/craftoria-factions-guard-1.1.1.jar'
with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as jar:
    for directory in [classes, root / 'resources']:
        for file in sorted(directory.rglob('*')):
            if file.is_file():
                entry = zipfile.ZipInfo(file.relative_to(directory).as_posix(), (2026, 1, 1, 0, 0, 0))
                entry.compress_type = zipfile.ZIP_DEFLATED
                jar.writestr(entry, file.read_bytes())
    jar.writestr(zipfile.ZipInfo('META-INF/MANIFEST.MF', (2026, 1, 1, 0, 0, 0)), 'Manifest-Version: 1.0\nFMLModType: MOD\n\n')
print(output)
