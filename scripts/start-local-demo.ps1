$ErrorActionPreference = "Stop"

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$stateDirectory = Join-Path $repositoryRoot ".local-demo"
$pidFile = Join-Path $stateDirectory "marosim.pid"
$outputLog = Join-Path $stateDirectory "marosim.stdout.log"
$errorLog = Join-Path $stateDirectory "marosim.stderr.log"
$healthUrl = "http://127.0.0.1:3000/api/health"

function Test-MarosimHealth {
  try {
    $health = Invoke-RestMethod -Uri $healthUrl -TimeoutSec 2
    return $health.status -eq "ok" -and $health.service -eq "marosim"
  }
  catch {
    return $false
  }
}

function Show-LocalLinks {
  Write-Host ""
  Write-Host "Marosim работает локально:" -ForegroundColor Green
  Write-Host "Главная:            http://localhost:3000"
  Write-Host "Каталог:            http://localhost:3000/catalog"
  Write-Host "Вход автора:        http://localhost:3000/login?role=supplier&next=/supplier"
  Write-Host "Мобильная версия:   http://localhost:3000/mobile_app"
  Write-Host "Мобильная автора:   http://localhost:3000/mobile_app/supplier"
  Write-Host "Админка:            http://localhost:3000/login?role=admin&next=/admin"
  Write-Host "Условия:            http://localhost:3000/offer"
  Write-Host ""
  Write-Host "Код входа по телефону: 1234"
}

Set-Location $repositoryRoot
New-Item -ItemType Directory -Path $stateDirectory -Force | Out-Null

if (Test-MarosimHealth) {
  Show-LocalLinks
  exit 0
}

$listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  throw "Порт 3000 уже занят процессом $($listener.OwningProcess). Освободите порт и запустите файл ещё раз."
}

$pnpmCommand = Get-Command pnpm.cmd -ErrorAction SilentlyContinue
$nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
if (-not $pnpmCommand -or -not $nodeCommand) {
  throw "Не найдены Node.js или pnpm. Установите версии из README и повторите запуск."
}

$nextCli = Join-Path $repositoryRoot "node_modules\next\dist\bin\next"
if (-not (Test-Path $nextCli)) {
  Write-Host "Устанавливаю зависимости по pnpm-lock.yaml..." -ForegroundColor Yellow
  & $pnpmCommand.Source install --frozen-lockfile
  if ($LASTEXITCODE -ne 0) { throw "Не удалось установить зависимости." }
}

$buildId = Join-Path $repositoryRoot ".next\BUILD_ID"
$buildRequired = -not (Test-Path $buildId)
if (-not $buildRequired) {
  $buildTime = (Get-Item $buildId).LastWriteTimeUtc
  $sourceFiles = @()
  foreach ($sourceDirectoryName in @("app", "components", "lib", "public")) {
    $sourceDirectory = Join-Path $repositoryRoot $sourceDirectoryName
    $sourceFiles += Get-ChildItem -LiteralPath $sourceDirectory -Recurse -File -ErrorAction SilentlyContinue
  }
  foreach ($sourceFileName in @("package.json", "next.config.ts")) {
    $sourceFile = Join-Path $repositoryRoot $sourceFileName
    if (Test-Path -LiteralPath $sourceFile) { $sourceFiles += Get-Item -LiteralPath $sourceFile }
  }
  $newerSource = $sourceFiles |
    Where-Object { $_.LastWriteTimeUtc -gt $buildTime } |
    Select-Object -First 1
  $buildRequired = $null -ne $newerSource
}

if ($buildRequired) {
  Write-Host "Собираю актуальную локальную версию..." -ForegroundColor Yellow
  & $pnpmCommand.Source build
  if ($LASTEXITCODE -ne 0) { throw "Production-сборка завершилась с ошибкой." }
}

$arguments = @("node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "3000")
$process = Start-Process `
  -FilePath $nodeCommand.Source `
  -ArgumentList $arguments `
  -WorkingDirectory $repositoryRoot `
  -WindowStyle Hidden `
  -RedirectStandardOutput $outputLog `
  -RedirectStandardError $errorLog `
  -PassThru

Set-Content -Path $pidFile -Value $process.Id -Encoding ascii

$ready = $false
for ($attempt = 0; $attempt -lt 30; $attempt += 1) {
  Start-Sleep -Seconds 1
  if (Test-MarosimHealth) {
    $ready = $true
    break
  }
  if ($process.HasExited) { break }
}

if (-not $ready) {
  if (-not $process.HasExited) { Stop-Process -Id $process.Id }
  throw "Marosim не запустился. Проверьте $errorLog"
}

Show-LocalLinks
