$pagesDir = "C:\official\src\data\pages"
$langDirs = @('ar','da','de','el','es','fi','fr','it','nl','no','pl','pt','ru','sv')

$fields = @'
intelligence_tagline: Factory Intelligence
intelligence_title: Explore Our Manufacturing Capabilities

intelligence_cards:
  - title: Production Capacity
    icon: C
    icon_bg: blue
    desc: '12,000 m² facility producing 15,000+ boats/yr across SUP (8,000+), RIB (2,000+), inflatable dinghy (5,000+), and safety equipment lines. 200+ workers, 2 shifts.'
    metrics:
      - label: MOQ
        value: 'SUP: 5–10 / RIB: 2–5'
      - label: Lead Time
        value: '30–45 days'
    link: /factory/capacity
    link_label: Full capacity details →
  - title: Quality Lab & Testing
    icon: Q
    icon_bg: green
    desc: 'Independent QC lab with 4 testing stages: raw material inspection (tensile, tear, UV), 48h pressure hold at 1.25x rated pressure, seam peel testing, and load/balance verification on every boat.'
    metrics:
      - label: Lab Equipment
        value: 'Tensile tester, temp chamber, leak tank'
      - label: Standards
        value: 'ISO 9001, CE, AS 1799'
    link: /factory/quality-lab
    link_label: 'Lab procedures & equipment →'
  - title: OEM/ODM Capability
    icon: O
    icon_bg: purple
    desc: 'End-to-end OEM/ODM services: custom mould design, private-label packaging, custom tube colors, deck graphics (digital & screen printing), Hypalon upgrade option, and drop-ship logistics.'
    metrics:
      - label: Certifications
        value: 'ISO 9001, BSCI, CE, REACH'
      - label: Shipping
        value: 'FOB, CIF, DDP to 50+ countries'
    link: /factory/oem-capability
    link_label: 'Full OEM services →'
'@

foreach ($lang in $langDirs) {
  $langFile = "$pagesDir\$lang\factory.yaml"
  if (Test-Path $langFile) {
    $content = Get-Content $langFile -Raw
    if ($content -notmatch "^intelligence_tagline:" -and $content -notmatch "intelligence_cards:") {
      $content = $content.TrimEnd() + "`r`n`r`n$fields`r`n"
      Set-Content $langFile $content -NoNewline
      Write-Host "Updated: $lang\factory.yaml"
    } else {
      Write-Host "Skipped (exists): $lang\factory.yaml"
    }
  } else {
    Write-Host "Missing: $lang\factory.yaml"
  }
}
