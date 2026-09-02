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
    @{ Name = "microphone.jpg"; Id = "15609007" },
    @{ Name = "conference-room.jpg"; Id = "31107445" },
    @{ Name = "wedding-terrace.jpg"; Id = "17023029" },
    @{ Name = "venue-luxury.jpg"; Id = "17206174" },
    @{ Name = "catering-wedding.jpg"; Id = "33419107" },
    @{ Name = "buffet-luxury.jpg"; Id = "32689486" },
    @{ Name = "buffet-outdoor.jpg"; Id = "18281681" },
    @{ Name = "decor-floral.jpg"; Id = "37710446" },
    @{ Name = "decor-balloon.jpg"; Id = "11282245" },
    @{ Name = "decor-table.jpg"; Id = "9509563" },
    @{ Name = "event-coordinator.jpg"; Id = "7648051" },
    @{ Name = "event-registration.jpg"; Id = "7648043" },
    @{ Name = "saxophone.jpg"; Id = "26835508" },
    @{ Name = "team-game.jpg"; Id = "7551430" },
    @{ Name = "team-grid.jpg"; Id = "35143632" },
    @{ Name = "team-trust.jpg"; Id = "10855590" },
    @{ Name = "gift-boxes.jpg"; Id = "30151963" },
    @{ Name = "gift-floral.jpg"; Id = "16660109" },
    @{ Name = "tableware.jpg"; Id = "13965315" },
    @{ Name = "audio-mixer.jpg"; Id = "12020445" },
    @{ Name = "sound-mixer-event.jpg"; Id = "26690299" },
    @{ Name = "conference-av.jpg"; Id = "17056964" },
    @{ Name = "projector-room.jpg"; Id = "8761313" },
    @{ Name = "led-stage.jpg"; Id = "7513414" },
    @{ Name = "conference-speaker.jpg"; Id = "29708259" },
    @{ Name = "conference-presentation.jpg"; Id = "29708245" },
    @{ Name = "audio-engineer.jpg"; Id = "28643185" },
    @{ Name = "luxury-car.jpg"; Id = "36676183" },
    @{ Name = "wedding-couple.jpg"; Id = "29410867" },
    @{ Name = "garden-night.jpg"; Id = "30562609" },
    @{ Name = "candy-balloons.jpg"; Id = "5610387" },
    @{ Name = "table-roses.jpg"; Id = "13045649" },
    @{ Name = "venue-round-tables.jpg"; Id = "36774692" },
    @{ Name = "wedding-buffet.jpg"; Id = "37976954" },
    @{ Name = "event-tent.jpg"; Id = "8392460" },
    @{ Name = "wireless-speaker.jpg"; Id = "20802528" },
    @{ Name = "wireless-lapel.jpg"; Id = "33456958" }
)

foreach ($catalogImage in $catalogImages) {
    $downloadUrl = "https://images.pexels.com/photos/$($catalogImage.Id)/pexels-photo-$($catalogImage.Id).jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
    $targetPath = Join-Path $catalogImageDirectory $catalogImage.Name
    Invoke-WebRequest -Uri $downloadUrl -OutFile $targetPath
    Write-Host "Downloaded $($catalogImage.Name)"
}
