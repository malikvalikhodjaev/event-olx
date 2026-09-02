$ErrorActionPreference = "Stop"

$catalogImageDirectory = Join-Path $PSScriptRoot "..\public\catalog\photos"
New-Item -ItemType Directory -Force -Path $catalogImageDirectory | Out-Null

$catalogImages = @(
    @{ Name = "banquet.jpg"; Id = "5572569" },
    @{ Name = "catering.jpg"; Id = "20551987" },
    @{ Name = "photographer.jpg"; Id = "21560369" },
    @{ Name = "videographer.jpg"; Id = "33419101" },
    @{ Name = "decor.jpg"; Id = "6479583" },
    @{ Name = "dj.jpg"; Id = "15349818" },
    @{ Name = "host.jpg"; Id = "38997659" },
    @{ Name = "workshop.jpg"; Id = "33634824" },
    @{ Name = "wedding-car.jpg"; Id = "18006120" },
    @{ Name = "bouquet.jpg"; Id = "19238272" },
    @{ Name = "invitations.jpg"; Id = "35005576" },
    @{ Name = "cake.jpg"; Id = "17001825" },
    @{ Name = "chairs.jpg"; Id = "29188023" },
    @{ Name = "audio.jpg"; Id = "8132756" },
    @{ Name = "stage.jpg"; Id = "16458219" },
    @{ Name = "microphone.jpg"; Id = "15609007" }
)

foreach ($catalogImage in $catalogImages) {
    $downloadUrl = "https://images.pexels.com/photos/$($catalogImage.Id)/pexels-photo-$($catalogImage.Id).jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
    $targetPath = Join-Path $catalogImageDirectory $catalogImage.Name
    Invoke-WebRequest -Uri $downloadUrl -OutFile $targetPath
    Write-Host "Downloaded $($catalogImage.Name)"
}
