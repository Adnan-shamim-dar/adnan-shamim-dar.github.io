param(
    [int]$Port = 8088
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Serving portfolio at http://localhost:$Port" -ForegroundColor Green
python -m http.server $Port
