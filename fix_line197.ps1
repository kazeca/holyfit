$file = "src/pages/Dashboard.jsx"
$content = Get-Content $file -Raw
$content = $content -replace '\{/\* Bento Grid \*/ \}', '{/* Bento Grid */}'
$content | Set-Content $file -NoNewline
Write-Host "Fixed line 197"
