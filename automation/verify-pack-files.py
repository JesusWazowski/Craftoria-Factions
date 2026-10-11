"""Verify installed files against the repository's packwiz index and metadata.

Usage: python automation/verify-pack-files.py GAME_FOLDER OUTPUT_JSON
Requires Python 3.11+. Does not download or alter installed files.
"""
import hashlib
import json
import sys
import tomllib
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def read_toml(path):
    with path.open('rb') as source:
        return tomllib.load(source)


def digest(path, algorithm):
    with path.open('rb') as source:
        return hashlib.file_digest(source, algorithm.replace('-', '')).hexdigest()


def audit(game_folder):
    pack = read_toml(ROOT / 'pack.toml')
    index_path = ROOT / pack['index']['file']
    if digest(index_path, pack['index']['hash-format']) != pack['index']['hash']:
        raise ValueError('pack.toml index hash does not match index.toml')
    index = read_toml(index_path)
    results = []
    managed_paths = set()
    for entry in index['files']:
        row = {'index_file': entry['file']}
        if entry.get('metafile', False):
            metadata_path = ROOT / entry['file']
            if digest(metadata_path, index['hash-format']) != entry['hash']:
                raise ValueError(f'Indexed metadata hash mismatch: {entry["file"]}')
            metadata = read_toml(metadata_path)
            relative = str(Path(entry['file']).parent / metadata['filename']).replace('\\', '/')
            download = metadata['download']
            row.update(name=metadata['name'], kind='external',
                       side=metadata.get('side', 'both'),
                       update=metadata.get('update', {}),
                       url=download.get('url'),
                       algorithm=download['hash-format'], expected=download['hash'])
        else:
            relative = entry['file']
            row.update(kind='bundled', side='both', algorithm=index['hash-format'],
                       expected=entry['hash'])
        row['file'] = relative
        managed_paths.add(relative)
        installed = game_folder / relative
        if row['side'] == 'server':
            row['status'] = 'server-only'
        elif not installed.is_file():
            row['status'] = 'missing'
        else:
            row['actual'] = digest(installed, row['algorithm'])
            row['status'] = 'verified' if row['actual'] == row['expected'] else 'mismatch'
        results.append(row)
    extras = []
    for folder in ('mods', 'resourcepacks', 'shaderpacks'):
        for path in (game_folder / folder).glob('*'):
            if path.is_file() and path.suffix.lower() in ('.jar', '.zip'):
                relative = path.relative_to(game_folder).as_posix()
                if relative not in managed_paths:
                    extras.append(relative)
    return {'counts': dict(Counter(row['status'] for row in results)),
            'external_counts': dict(Counter(row['status'] for row in results if row['kind'] == 'external')),
            'unmanaged_archives': extras, 'files': results}


if __name__ == '__main__':
    report = audit(Path(sys.argv[1]).resolve())
    Path(sys.argv[2]).write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(json.dumps({key: value for key, value in report.items() if key != 'files'}, indent=2))
