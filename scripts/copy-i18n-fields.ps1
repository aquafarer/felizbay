param(
  [string]$PageName,
  [string]$FieldsYaml
)

$pagesDir = "C:\official\src\data\pages"
$enFile = "$pagesDir\$PageName.yaml"
$langDirs = @('ar','da','de','el','es','fi','fr','it','nl','no','pl','pt','ru','sv')

foreach ($lang in $langDirs) {
  $langFile = "$pagesDir\$lang\$PageName.yaml"
  if (Test-Path $langFile) {
    $content = Get-Content $langFile -Raw
    # Check if the field already exists
    $fieldName = ($FieldsYaml -split ':' | Select-Object -First 1).Trim()
    if ($content -notmatch "^$fieldName:") {
      # Append before last non-empty line (before closing content)
      $content = $content.TrimEnd() + "`r`n`r`n$FieldsYaml`r`n"
      Set-Content $langFile $content -NoNewline
      Write-Host "Updated: $lang\$PageName.yaml"
    } else {
      Write-Host "Skipped (exists): $lang\$PageName.yaml"
    }
  } else {
    Write-Host "Missing: $lang\$PageName.yaml"
  }
}
