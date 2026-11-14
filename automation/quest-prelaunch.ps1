[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$GameDirectory,
    [string]$JavaPath,
    [string]$PackUrl,
    [string]$BackupDirectory,
    [switch]$BackupOnly
)

$ErrorActionPreference = 'Stop'

function Get-StreamHash([System.IO.Stream]$Stream) {
    $algorithm = [System.Security.Cryptography.SHA256]::Create()
    try {
        return [BitConverter]::ToString($algorithm.ComputeHash($Stream)).Replace('-', '').ToLowerInvariant()
    } finally {
        $algorithm.Dispose()
    }
}

try {
    if (-not $BackupDirectory) { $BackupDirectory = Join-Path (Split-Path -Parent $PSScriptRoot) 'quest-backups' }
    $gameRoot = (Resolve-Path -LiteralPath $GameDirectory).Path
    $source = (Resolve-Path -LiteralPath (Join-Path $gameRoot 'config\ftbquests\quests')).Path
    $files = @(Get-ChildItem -LiteralPath $source -Recurse -File -Force)
    if ($files.Count -eq 0) { throw 'The quest folder is empty; refusing to run packwiz without a backup.' }

    # Record every file before archiving, including language files and hidden files.
    $expected = @{}
    foreach ($file in $files) {
        $relative = $file.FullName.Substring($source.Length + 1).Replace('\', '/')
        $expected[$relative] = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    }
    $backupRoot = [System.IO.Path]::GetFullPath($BackupDirectory)
    # Backups must be outside the folder being archived.
    if ($backupRoot -eq $source -or $backupRoot.StartsWith($source + '\', [StringComparison]::OrdinalIgnoreCase)) {
        throw 'The backup directory must be outside the quest folder.'
    }
    New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
    $name = 'quests-' + [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssfffZ') + '-' + [guid]::NewGuid().ToString('N')
    $destination = Join-Path $backupRoot ($name + '.zip')
    $partial = $destination + '.partial'
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($source, $partial)
    $archive = [System.IO.Compression.ZipFile]::OpenRead($partial)
    try {
        $entries = @($archive.Entries | Where-Object { $_.Name })
        if ($entries.Count -ne $expected.Count) { throw 'The quest backup file count does not match the source.' }
        foreach ($entry in $entries) {
            $relative = $entry.FullName.Replace('\', '/')
            if (-not $expected.ContainsKey($relative)) { throw "Unexpected backup entry: $relative" }
            $stream = $entry.Open()
            try { $actualHash = Get-StreamHash $stream } finally { $stream.Dispose() }
            if ($actualHash -ne $expected[$relative]) { throw "Quest backup verification failed: $relative" }
        }
    } finally {
        $archive.Dispose()
    }
    Move-Item -LiteralPath $partial -Destination $destination
    Write-Output "Verified quest backup: $destination ($($expected.Count) files)"

    if (-not $BackupOnly) {
        if (-not $JavaPath -or -not $PackUrl) { throw 'JavaPath and PackUrl are required to run packwiz.' }
        # Use the console Java executable so PowerShell waits and captures the installer exit code.
        if ([System.IO.Path]::GetFileName($JavaPath) -ieq 'javaw.exe') {
            $consoleJava = Join-Path (Split-Path -Parent $JavaPath) 'java.exe'
            if (-not (Test-Path -LiteralPath $consoleJava -PathType Leaf)) { throw "Java executable not found: $consoleJava" }
            $JavaPath = $consoleJava
        }
        $bootstrap = Join-Path $gameRoot 'packwiz-installer-bootstrap.jar'
        if (-not (Test-Path -LiteralPath $bootstrap -PathType Leaf)) { throw "Packwiz bootstrap not found: $bootstrap" }
        & $JavaPath '-jar' $bootstrap $PackUrl
        if ($LASTEXITCODE -ne 0) { throw "Packwiz exited with code $LASTEXITCODE" }
    }
} catch {
    Write-Error -Message ("Quest backup / pre-launch failed; launch stopped: " + $_.Exception.Message) -ErrorAction Continue
    exit 1
}
