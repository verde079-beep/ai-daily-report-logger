/**
 * AI Daily Report Logger - Google Apps Script Web App
 *
 * 会話(自然言語)で伝えた日報の内容を、そのままGoogleスプレッドシートの
 * 「日報」シートに1行追記するだけのシンプルなバックエンド。
 *
 * セットアップ:
 * 1. Googleスプレッドシートを新規作成（または既存のものを開く）
 * 2. 拡張機能 > Apps Script を開き、このファイルの内容を貼り付ける
 * 3. デプロイ > 新しいデプロイ > 種類「ウェブアプリ」を選択
 *    - 実行するユーザー: 自分
 *    - アクセスできるユーザー: 全員
 * 4. 発行されたウェブアプリURLを client/ 側のスクリプトに設定する
 */

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet_();

    sheet.appendRow([
      payload.date || Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd'),
      payload.hours || '',
      payload.summary || '',
      payload.insight || '',
      payload.handoff || '',
      payload.mood || ''
    ]);

    return jsonOutput_({ ok: true });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  return jsonOutput_({ ok: true, message: 'AI Daily Report Logger is running' });
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('日報');
  if (!sheet) {
    sheet = ss.insertSheet('日報');
    sheet.appendRow(['日付', '稼働時間', 'やったこと', '気づき・学び', '翌日への引き継ぎ', '感情スコア']);
  }
  return sheet;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
