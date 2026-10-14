$pagesDir = "C:\official\src\data\pages"
$langDirs = @('ar','da','de','el','es','fi','fr','it','nl','no','pl','pt','ru','sv')
$oldPattern = "Beginner's guide to selecting the right stand-up paddleboard for your weight, skill level, and intended use."
$newLine = '        desc: "Beginner''s guide to selecting the right stand-up paddleboard for your weight, skill level, and intended use."'

foreach ($lang in $langDirs) {
  $f = "$pagesDir\$lang\academy.yaml"
  if (Test-Path $f) {
    $lines = Get-Content $f
    $changed = $false
    for ($i = 0; $i -lt $lines.Count; $i++) {
      if ($lines[$i] -match [regex]::Escape($oldPattern)) {
        $lines[$i] = $newLine
        $changed = $true
      }
    }
    if ($changed) {
      Set-Content $f $lines
      Write-Host "Fixed: $lang\academy.yaml"
    } else {
      Write-Host "Skip: $lang\academy.yaml"
    }
  }
}
