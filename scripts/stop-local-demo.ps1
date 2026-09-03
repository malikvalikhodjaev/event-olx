$ErrorActionPreference = "Stop"

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$stateDirectory = Join-Path $repositoryRoot ".local-demo"
$pidFile = Join-Path $stateDirectory "marosim.pid"

if (-not (Test-Path $pidFile)) {
  Write-Host "Локальный Marosim не запущен этим скриптом." -ForegroundColor Yellow
  exit 0
}

$processIdText = (Get-Content $pidFile -Raw).Trim()
$processId = 0
if (-not [int]::TryParse($processIdText, [ref]$processId)) {
  throw "Файл состояния повреждён: $pidFile"
}

$listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.OwningProcess -eq $processId } |
  Select-Object -First 1

if (-not $listener) {
  throw "Процесс из файла состояния не слушает порт 3000. Ничего не остановлено."
}

Stop-Process -Id $processId
Remove-Item -LiteralPath $pidFile
Write-Host "Локальный Marosim остановлен." -ForegroundColor Green
