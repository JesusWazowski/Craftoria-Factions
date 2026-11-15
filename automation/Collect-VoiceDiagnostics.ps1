#Requires -Version 5.1
#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Captures 15 minutes of IPv4 loopback UDP 24454 and host performance.
    Requires Wireshark's dumpcap.exe and Npcap on the Windows host.
.OUTPUTS
    A UTC-stamped folder and ZIP on the current user's Desktop.
#>
param(
    [string]$DumpcapPath = ''
)

$ErrorActionPreference = 'Stop'
if (-not $DumpcapPath) {
    $DumpcapPath = Join-Path $env:ProgramFiles 'Wireshark\dumpcap.exe'
    if (-not (Test-Path -LiteralPath $DumpcapPath -PathType Leaf)) {
        $command = Get-Command dumpcap.exe -CommandType Application -ErrorAction SilentlyContinue
        if ($command) { $DumpcapPath = $command.Source }
    }
}
if (-not (Test-Path -LiteralPath $DumpcapPath -PathType Leaf)) {
    throw 'Install Wireshark with Npcap, or pass -DumpcapPath with the existing path to dumpcap.exe.'
}

$loopback = '\Device\NPF_Loopback'
$interfaces = & $DumpcapPath -D
if ($LASTEXITCODE -ne 0 -or -not ($interfaces -match [regex]::Escape($loopback))) {
    throw 'Npcap loopback capture is unavailable. Check the Npcap installation and run as administrator.'
}

$desktop = [Environment]::GetFolderPath('DesktopDirectory')
if (-not $desktop -or -not (Test-Path -LiteralPath $desktop -PathType Container)) {
    throw 'The current Windows account has no accessible Desktop directory.'
}

$durationSeconds = 900
$sampleInterval = 2
$sampleLimit = [int]($durationSeconds / $sampleInterval)
$stamp = [DateTimeOffset]::UtcNow.ToString('yyyyMMdd-HHmmss-fff')
$bundleName = "VoiceDiagnostics-$stamp-UTC"
$output = Join-Path $desktop $bundleName
$zip = Join-Path $desktop "$bundleName.zip"
$trace = Join-Path $output 'udp-24454.pcapng'
$metadata = Join-Path $output 'capture.txt'
$dumpcapLog = Join-Path $output 'dumpcap.log'
$perfErrors = Join-Path $output 'performance-errors.txt'
$perfCsv = Join-Path $output 'performance.csv'
$issues = @()
$sampleCount = 0

# Windows uses localized counter names. These paths are for English Windows.
$counterPaths = @(
    '\Processor(*)\% Processor Time'
    '\System\Processor Queue Length'
    '\Memory\Available MBytes'
    '\PhysicalDisk(*)\Avg. Disk sec/Transfer'
    '\PhysicalDisk(*)\Current Disk Queue Length'
    '\Network Interface(*)\Bytes Sent/sec'
    '\Network Interface(*)\Bytes Received/sec'
    '\Network Interface(*)\Packets Received Errors'
    '\Network Interface(*)\Packets Outbound Errors'
    '\Process(*)\ID Process'
    '\Process(*)\% Processor Time'
    '\Process(*)\Working Set - Private'
)

$null = New-Item -ItemType Directory -Path $output
@(
    "Computer: $env:COMPUTERNAME"
    "Host time zone: $([TimeZoneInfo]::Local.Id)"
    "Logical processors: $([Environment]::ProcessorCount)"
    'Trace scope: IPv4 loopback traffic to or from UDP port 24454.'
    'Snapshot length: 32 bytes (4-byte Npcap + 20-byte IPv4 + 8-byte UDP headers).'
    "Requested duration: $durationSeconds seconds. Performance sample interval: $sampleInterval seconds."
    "Launch UTC: $([DateTimeOffset]::UtcNow.ToString('o'))"
    "Launch local: $([DateTimeOffset]::Now.ToString('o'))"
) | Set-Content -LiteralPath $metadata

# Dumpcap stops on its own after 900 seconds, even if performance sampling ends early.
$captureFilter = 'ip and udp and port 24454 and host 127.0.0.1'
$captureArgs = "-i $loopback -p -q -s 32 -f ""$captureFilter"" -a duration:$durationSeconds -w ""$trace"""
$capture = Start-Process -FilePath $DumpcapPath -ArgumentList $captureArgs -WindowStyle Hidden `
    -RedirectStandardError $dumpcapLog -PassThru

try {
    $startup = [Diagnostics.Stopwatch]::StartNew()
    while (-not (Test-Path -LiteralPath $trace) -and -not $capture.HasExited -and $startup.Elapsed.TotalSeconds -lt 10) {
        Start-Sleep -Milliseconds 200
    }
    if ($capture.HasExited -or -not (Test-Path -LiteralPath $trace -PathType Leaf)) {
        throw "Loopback capture did not start. See $dumpcapLog."
    }

    Write-Host "Collecting for 15 minutes in $output. Leave this window open."
    Get-Counter -Counter $counterPaths -SampleInterval $sampleInterval -MaxSamples $sampleLimit `
        -ErrorAction Continue 2> $perfErrors |
        ForEach-Object {
            $sampleCount++
            $timestamp = $_.Timestamp.ToUniversalTime().ToString('o')
            foreach ($counter in $_.CounterSamples) {
                # Keep process counters for Java and Playit, including duplicate instances.
                if ($counter.Path -match '\\process\(' -and $counter.InstanceName -notmatch '^(javaw?|playit[^#]*)(?:#\d+)?$') {
                    continue
                }
                [pscustomobject]@{
                    TimestampUtc = $timestamp
                    Path         = $counter.Path
                    Value        = $counter.CookedValue
                    Status       = $counter.Status
                }
            }
        } | Export-Csv -LiteralPath $perfCsv -NoTypeInformation -Encoding UTF8
}
catch {
    $issues += $_.Exception.Message
    Write-Warning $_.Exception.Message
}

if (-not $capture.WaitForExit(($durationSeconds + 15) * 1000)) {
    # This process was launched by this script. Do not stop any other capture.
    $capture.Kill()
    throw "Dumpcap exceeded its time limit. Partial files are in $output."
}
if ($capture.ExitCode -ne 0 -or -not (Test-Path -LiteralPath $trace -PathType Leaf)) {
    $issues += 'UDP capture failed. See dumpcap.log.'
}
if ($sampleCount -lt $sampleLimit -or
    ((Test-Path -LiteralPath $perfErrors) -and (Get-Item -LiteralPath $perfErrors).Length -gt 0)) {
    $issues += 'Performance samples may be incomplete. See performance-errors.txt.'
}

@(
    "End UTC: $([DateTimeOffset]::UtcNow.ToString('o'))"
    "End local: $([DateTimeOffset]::Now.ToString('o'))"
    "Dumpcap exit code: $($capture.ExitCode)"
    "Performance sample sets: $sampleCount / $sampleLimit"
    "Collection issues: $($issues -join ' | ')"
) | Add-Content -LiteralPath $metadata

Compress-Archive -LiteralPath $output -DestinationPath $zip -CompressionLevel Fastest
Write-Host "Send this ZIP with Taildrop: $zip"
if ($issues.Count) { Write-Warning "The bundle may be incomplete. See $metadata." }
