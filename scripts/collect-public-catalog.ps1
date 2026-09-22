param(
  [string]$OutputPath = "docs/research/olx-public-catalog-research.json",
  [int]$CandidatesPerCategory = 18
)

$ErrorActionPreference = "Stop"

$groups = @(
  @{ id="cat-venue"; terms=@("банкетный зал", "тойхона"); include="банкет|тойхона|toyxona|ресторан|зал для" },
  @{ id="cat-catering"; terms=@("кейтеринг", "фуршет"); include="кейтеринг|кетеринг|ketering|фуршет|кофе.?брейк|плов" },
  @{ id="cat-photo"; terms=@("свадебный фотограф", "свадебная видеосъемка"); include="фото|видео|съ[её]м|videograf|fotograf" },
  @{ id="cat-decor"; terms=@("оформление свадьбы", "фотозона свадьба"); include="оформлен|aform|dekor|декор|фото.?зон" },
  @{ id="cat-host"; terms=@("ведущий свадьба", "тамада"); include="ведущ|тама|boshlov|бошлов" },
  @{ id="cat-music"; terms=@("музыканты свадьба", "диджей свадьба"); include="музык|диджей|dj|ансамбл|саксофон|карнай|сурнай" },
  @{ id="cat-transport"; terms=@("авто на свадьбу", "свадебный кортеж"); include="авто|мерс|кортеж|limuzin|лимузин|transfer|трансфер" },
  @{ id="cat-training"; terms=@("тимбилдинг", "корпоративный тренинг"); include="тимбилдинг|team.?building|тренинг|корпоратив" },
  @{ id="cat-planning"; terms=@("организация свадьбы", "свадебный координатор"); include="организац|координат|под ключ|event" },
  @{ id="cat-marry-me"; terms=@("marry me", "предложение руки и сердца"); include="marry|merry|мерри|предложен|романтик|sovg|podarka" },
  @{ id="cat-flowers"; terms=@("букет невесты", "свадебные цветы"); include="букет|цветы|флорист|гул" },
  @{ id="cat-event-details"; terms=@("свадебные аксессуары", "шары на свадьбу"); include="аксессуар|шар|декор|украш" },
  @{ id="cat-gifts-print"; terms=@("пригласительные свадьба", "подарки гостям свадьба"); include="приглас|таклиф|taklif|подар|sovg|открытк" },
  @{ id="cat-cakes"; terms=@("свадебный торт", "сладкий стол свадьба"); include="торт|десерт|кэнди|кенди|слад" },
  @{ id="cat-tableware"; terms=@("аренда посуды", "аренда столов стульев"); include="посуд|стол|стуль|сервиров" },
  @{ id="cat-sound-light"; terms=@("аренда звука света", "аренда колонок"); include="звук|свет|колон|микроф|audio" },
  @{ id="cat-screens-stage"; terms=@("LED экран аренда", "аренда сцены"); include="экран|led|лэд|лед|сцен|подиум|проектор" },
  @{ id="cat-event-rental"; terms=@("аренда шатра", "аренда мебели мероприятия"); include="шат|мебел|стол|стул|палат" },
  @{ id="cat-power-effects"; terms=@("холодный фонтан", "аренда генератора"); include="фонтан|фейер|дым|генератор|движок|спецэфф" }
)

$candidates = New-Object System.Collections.Generic.List[object]
$seen = @{}
foreach ($group in $groups) {
  $categoryCount = 0
  foreach ($term in $group.terms) {
    $termCount = 0
    $queryUrl = "https://www.olx.uz/tashkent/q-$([uri]::EscapeDataString($term.Replace(' ', '-')))/"
    try { $page = Invoke-WebRequest -Uri $queryUrl -UseBasicParsing -TimeoutSec 30 -ErrorAction Stop }
    catch { Write-Host "Search unavailable: $($group.id) $term"; continue }
    $links = [regex]::Matches($page.Content, '/d/(?:oz/)?obyavlenie/[^"<> ]+?\.html') | ForEach-Object { $_.Value } | Select-Object -Unique
    foreach ($path in $links) {
      if ($categoryCount -ge $CandidatesPerCategory) { break }
      if ($termCount -ge [math]::Ceiling($CandidatesPerCategory / $group.terms.Count)) { break }
      $url = "https://www.olx.uz$path"
      $id = [regex]::Match($url, '-(ID[0-9A-Za-z]+)\.html$').Groups[1].Value
      if (-not $id -or $seen.ContainsKey($id)) { continue }
      $seen[$id] = $true
      $candidates.Add([pscustomobject]@{ categoryId=$group.id; sourceId=$id; url=$url; query=$term; include=$group.include })
      $categoryCount += 1
      $termCount += 1
    }
  }
  Write-Host "$($group.id): $categoryCount candidates"
}

Write-Host "Fetching $($candidates.Count) public listing pages"
$observedAt = (Get-Date).ToString('yyyy-MM-dd')
$records = $candidates | ForEach-Object -Parallel {
  $candidate = $_
  try {
    $response = Invoke-WebRequest -Uri $candidate.url -UseBasicParsing -TimeoutSec 25 -ErrorAction Stop
    $html = $response.Content
    $jsonLd = [regex]::Match($html, '<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if (-not $jsonLd.Success) { return }
    $schema = $jsonLd.Groups[1].Value | ConvertFrom-Json -ErrorAction Stop
    $sellerNameMatch = [regex]::Match($html, 'data-testid="user-profile-user-name"[^>]*>(.*?)</h4>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $sellerLinkMatch = [regex]::Match($html, '<a href="(/list/user/[^"]+)" data-testid="user-profile-link"')
    $imageMatch = [regex]::Match($html, '<meta[^>]+property="og:image"[^>]+content="([^"]+)"')
    $titleMatch = [regex]::Match($html, '<meta[^>]+property="og:title"[^>]+content="([^"]+)"')
    if (-not $sellerNameMatch.Success -or -not $sellerLinkMatch.Success -or -not $imageMatch.Success) { return }
    $authorName = [System.Net.WebUtility]::HtmlDecode(($sellerNameMatch.Groups[1].Value -replace '<[^>]+>', '')).Trim()
    $title = if ($schema.provider.name) { [string]$schema.provider.name } elseif ($schema.name) { [string]$schema.name } else { '' }
    $description = if ($schema.provider.description) { [string]$schema.provider.description } elseif ($schema.description) { [string]$schema.description } else { '' }
    if (-not $title -or -not $authorName) { return }
    if ($title -notmatch $candidate.include) { return }
    $pageTitle = if ($titleMatch.Success) { [System.Net.WebUtility]::HtmlDecode($titleMatch.Groups[1].Value) } else { '' }
    if ($pageTitle -notmatch 'Ташкент|Toshkent|Tashkent' -and $description -notmatch 'Ташкент|Toshkent|Tashkent') { return }
    [pscustomobject]@{
      categoryId = $candidate.categoryId
      sourceId = $candidate.sourceId
      title = [System.Net.WebUtility]::HtmlDecode($title).Trim()
      description = [System.Net.WebUtility]::HtmlDecode($description).Trim()
      authorName = $authorName
      authorUrl = "https://www.olx.uz$($sellerLinkMatch.Groups[1].Value)"
      offerUrl = $candidate.url
      imageUrl = [System.Net.WebUtility]::HtmlDecode($imageMatch.Groups[1].Value)
      location = if ($schema.provider.address.addressLocality) { [string]$schema.provider.address.addressLocality } else { "Ташкент" }
      priceFrom = if ($schema.offers.price) { [decimal]$schema.offers.price } else { $null }
      observedAt = $using:observedAt
      source = "OLX.uz"
    }
  } catch { return }
} -ThrottleLimit 5

$output = Join-Path (Get-Location) $OutputPath
New-Item -ItemType Directory -Path (Split-Path -Parent $output) -Force | Out-Null
$records | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $output -Encoding utf8
Write-Host "Saved $(@($records).Count) current listings to $output"
