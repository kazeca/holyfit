$file = "src/pages/Dashboard.jsx"
$content = Get-Content $file -Raw -Encoding UTF8

# Emojis
$content = $content -replace 'ÔÜí', '⚡'
$content = $content -replace '­ƒöÑ', '🔥'
$content = $content -replace '­ƒÆ¬', '💪'
$content = $content -replace '­ƒºÿ', '🧘'
$content = $content -replace '­ƒÅâ', '⚡'
$content = $content -replace 'Ô£à', '✅'
$content = $content -replace '­ƒÆí', '💡'

# Portuguese characters
$content = $content -replace '├ó', 'â'
$content = $content -replace '├º', 'ç'
$content = $content -replace '├í', 'á'
$content = $content -replace '├®', 'é'
$content = $content -replace '├ú', 'ã'
$content = $content -replace '├Á', 'õ'
$content = $content -replace '├│', 'ó'
$content = $content -replace '├¡', 'í'
$content = $content -replace '├ò', 'Õ'
$content = $content -replace '├ígua', 'água'

$content | Set-Content $file -Encoding UTF8 -NoNewline
Write-Host "Fixed all Portuguese characters!"
