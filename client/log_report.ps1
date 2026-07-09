# AI Daily Report Logger - クライアント側サンプル (PowerShell)
#
# Claude / Claude Code との会話内容を、Google Apps Script Web App 経由で
# Google スプレッドシートに1行として自動記録する。
#
# 事前準備:
#   $GasEndpoint を、GASのデプロイ後に発行されたウェブアプリURLに書き換える。
#
# 使い方:
#   .\log_report.ps1 -Hours "3時間" -Summary "作業内容" -Insight "気づき" -Handoff "翌日への引き継ぎ" -Mood "★★★★☆"

param(
    [string]$Date = (Get-Date -Format "yyyy-MM-dd"),
    [string]$Hours,
    [string]$Summary,
    [string]$Insight = "",
    [string]$Handoff = "",
    [string]$Mood = ""
)

$GasEndpoint = "https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec"  # デプロイ後のURLに置き換える

$body = @{
    date     = $Date
    hours    = $Hours
    summary  = $Summary
    insight  = $Insight
    handoff  = $Handoff
    mood     = $Mood
} | ConvertTo-Json

# PowerShellの既定の文字列送信は日本語などマルチバイト文字が「?」に文字化けするため、
# JSON文字列をUTF-8のバイト列に明示的に変換してから送信する。
$utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($body)

$resp = Invoke-WebRequest -Uri $GasEndpoint -Method POST -Body $utf8Bytes -ContentType "application/json; charset=utf-8" -UseBasicParsing
Write-Output $resp.Content
