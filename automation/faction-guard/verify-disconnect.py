"""Offline disconnect-message classifier and native constructor transformer checks."""
import argparse
import os
from pathlib import Path
import subprocess

p = argparse.ArgumentParser()
p.add_argument("prism_root", type=Path)
p.add_argument("--java-bin", required=True, type=Path)
a = p.parse_args()
root = Path(__file__).resolve().parent
build = root / ".build" / "disconnect-tests"
build.mkdir(parents=True, exist_ok=True)
libraries = a.prism_root / "libraries"
jars = [next(libraries.rglob("nashorn-core-15.4.jar"))]
for artifact in ["asm", "asm-tree", "asm-analysis", "asm-commons", "asm-util"]:
    jars.append(next(libraries.rglob(artifact + "-9.10.1.jar")))
classpath = os.pathsep.join(str(jar.resolve()) for jar in jars)
subprocess.run([
    str(a.java_bin / "javac.exe"), "--release", "21", "-cp", classpath,
    "-d", str(build), str(root / "DisconnectTransformCheck.java"),
    str(root / "src/craftoria/factions/client/ServiceErrorText.java"),
], check=True)
subprocess.run([
    str(a.java_bin / "java.exe"), "-cp", str(build) + os.pathsep + classpath,
    "DisconnectTransformCheck", str(root / "resources/coremods/disconnect.js"),
    str(libraries / "net/minecraft/client/1.21.1-20240808.144430/client-1.21.1-20240808.144430-srg.jar"),
], check=True)
