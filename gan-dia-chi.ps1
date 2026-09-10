# Gan dia chi may chu Apps Script vao index.html
# Dung boi DAY-LEN-GITHUB.bat — khong can chay tay.
param([Parameter(Mandatory=$true)][string]$DiaChi)

$f = Join-Path $PSScriptRoot 'index.html'
if (-not (Test-Path $f)) { Write-Host "Khong thay index.html"; exit 1 }

$noiDung = [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8)
$mau     = "const API_MAC_DINH = '[^']*'; /\* DIA-CHI-MAY-CHU \*/"

if ($noiDung -notmatch $mau) { Write-Host "Khong tim thay cho de gan dia chi"; exit 1 }

$thay = "const API_MAC_DINH = '" + $DiaChi.Trim() + "'; /* DIA-CHI-MAY-CHU */"
$moi  = [regex]::Replace($noiDung, $mau, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $thay })

# Ghi lai bang UTF-8 khong BOM de tieng Viet khong bi vo
[IO.File]::WriteAllText($f, $moi, (New-Object Text.UTF8Encoding($false)))
Write-Host "Da gan dia chi may chu vao app."
exit 0
