param(
    [Parameter(Mandatory = $true)]
    [string]$InputDocx,

    [Parameter(Mandatory = $true)]
    [string]$OutputDirectory,

    [Parameter(Mandatory = $true)]
    [string]$PdfName,

    [Parameter(Mandatory = $true)]
    [string]$PdfToPpm
)

$ErrorActionPreference = "Stop"
$documentPath = (Resolve-Path -LiteralPath $InputDocx).Path
$outputPath = [System.IO.Path]::GetFullPath($OutputDirectory)
[System.IO.Directory]::CreateDirectory($outputPath) | Out-Null
$pdfPath = Join-Path $outputPath $PdfName

$word = $null
$document = $null
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $document = $word.Documents.Open($documentPath, $false, $true)
    $document.ExportAsFixedFormat($pdfPath, 17)
}
finally {
    if ($null -ne $document) {
        $document.Close($false)
        [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($document)
    }
    if ($null -ne $word) {
        $word.Quit()
        [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($word)
    }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}

& $PdfToPpm -png -r 140 $pdfPath (Join-Path $outputPath "page")
if ($LASTEXITCODE -ne 0) {
    throw "pdftoppm failed with exit code $LASTEXITCODE"
}

$index = 1
Get-ChildItem -LiteralPath $outputPath -Filter "page-*.png" | Sort-Object Name | ForEach-Object {
    $target = Join-Path $outputPath ("page-{0:D2}.png" -f $index)
    if ($_.FullName -ne $target) {
        Move-Item -LiteralPath $_.FullName -Destination $target -Force
    }
    $index++
}

Write-Output $pdfPath
Write-Output ("Pages: {0}" -f ($index - 1))
