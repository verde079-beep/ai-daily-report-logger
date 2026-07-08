"""
AI Daily Report Logger - クライアント側サンプル(Python)

Claude / Claude Code との会話内容を、Google Apps Script Web App 経由で
Googleスプレッドシートに1行として自動記録する。

使い方:
    python log_report.py

事前準備:
    GAS_ENDPOINT を、GASのデプロイ後に発行されたウェブアプリURLに書き換える。
"""
import json
import urllib.request

GAS_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec"  # デプロイ後のURLに置き換える


def log_report(date: str, hours: str, summary: str, insight: str = "", handoff: str = "", mood: str = "") -> dict:
    payload = {
        "date": date,
        "hours": hours,
        "summary": summary,
        "insight": insight,
        "handoff": handoff,
        "mood": mood,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        GAS_ENDPOINT,
        data=data,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


if __name__ == "__main__":
    result = log_report(
        date="2026-07-08",
        hours="3時間",
        summary="AI Daily Report Logger のPoCを作成し、GitHub公開用に整理した",
        insight="Claudeとの会話とGASだけで、日報の自動記録が実現できる",
        handoff="デモ動画を撮影し、評価レポートをまとめる",
        mood="★★★★☆",
    )
    print(result)
