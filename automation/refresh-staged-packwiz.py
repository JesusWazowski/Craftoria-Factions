"""Refresh existing Packwiz index hashes using staged Git bytes.

Stage pack content changes first, then run this script and stage index.toml
and pack.toml. Run packwiz refresh first when adding or removing pack files.
Requires Python 3.11+.
"""
import hashlib
import re
import subprocess
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main():
    index_path = ROOT / "index.toml"
    index_text = index_path.read_text(encoding="utf-8")
    index = tomllib.loads(index_text)
    entries = index["files"]
    requests = "".join(f":{entry['file']}\n" for entry in entries).encode()
    result = subprocess.run(
        ["git", "-c", f"safe.directory={ROOT.as_posix()}", "cat-file", "--batch"], input=requests, cwd=ROOT,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True,
    )
    position = 0
    hashes = {}
    for entry in entries:
        end = result.stdout.index(b"\n", position)
        header = result.stdout[position:end].split()
        if len(header) != 3 or header[1] != b"blob":
            raise ValueError(f"Indexed file is absent from staging: {entry['file']}")
        size = int(header[2])
        start = end + 1
        content = result.stdout[start:start + size]
        position = start + size + 1
        hashes[entry["file"]] = hashlib.new(index["hash-format"], content).hexdigest()

    def replace_entry(match):
        block = match.group()
        fields = tomllib.loads(block)
        return re.sub(
            r'(?m)^hash = "[^"]+"',
            f'hash = "{hashes[fields["files"][0]["file"]]}"',
            block,
        )

    updated = re.sub(r"(?ms)^\[\[files\]\].*?(?=^\[\[files\]\]|\Z)", replace_entry, index_text)
    index_bytes = updated.encode("utf-8")
    pack_path = ROOT / "pack.toml"
    pack_text = pack_path.read_text(encoding="utf-8")
    pack = tomllib.loads(pack_text)
    digest = hashlib.new(pack["index"]["hash-format"], index_bytes).hexdigest()
    pack_text, count = re.subn(
        r'(?m)^(hash = ")[^"]+(")$', lambda m: m[1] + digest + m[2], pack_text,
    )
    if count != 1:
        raise ValueError("Expected one index hash in pack.toml")
    index_path.write_bytes(index_bytes)
    pack_path.write_bytes(pack_text.encode("utf-8"))
    print(f"Refreshed {len(entries)} indexed hashes from staged Git bytes.")


if __name__ == "__main__":
    main()
