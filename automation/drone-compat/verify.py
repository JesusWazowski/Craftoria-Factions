"""Offline native drone transformation check; does not launch Minecraft."""
import argparse
import os
from pathlib import Path
import subprocess

p = argparse.ArgumentParser()
p.add_argument("prism_root", type=Path)
p.add_argument("instance", type=Path)
p.add_argument("--java-bin", required=True, type=Path)
a = p.parse_args()
root = Path(__file__).resolve().parent
build = root / ".build"
build.mkdir(exist_ok=True)
jars = [next((a.prism_root / "libraries").rglob("nashorn-core-15.4.jar"))]
for artifact in ["asm", "asm-tree", "asm-analysis", "asm-commons", "asm-util"]:
    jars.append(next((a.prism_root / "libraries").rglob(artifact + "-9.10.1.jar")))
classpath = os.pathsep.join(str(jar.resolve()) for jar in jars)
subprocess.run([str(a.java_bin / "javac.exe"), "--release", "21", "-cp", classpath,
                "-d", str(build), str(root / "DroneTransformCheck.java")], check=True)
subprocess.run([str(a.java_bin / "java.exe"), "-cp", str(build) + os.pathsep + classpath,
                "DroneTransformCheck", str(root / "resources/coremods/drone.js"),
                str(a.instance / "mods/pneumaticcraft-repressurized-8.2.23+mc1.21.1.jar")], check=True)
