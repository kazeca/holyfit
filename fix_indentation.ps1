$file = "src/pages/Dashboard.jsx"
$content = Get-Content $file -Raw
# Fix line 198 indentation - it should be at the same level as line 197
$content = $content -replace '(\{/\* Bento Grid \*/\})\r\n    <div className="grid', '$1' + "`r`n" + '            <div className="grid'
$content | Set-Content $file -NoNewline
Write-Host "Fixed line 198 indentation"
