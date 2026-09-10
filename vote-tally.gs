/**
 * Islington Book Club — vote tally
 * Paste this whole file into Apps Script (Extensions → Apps Script) on a
 * Google Sheet, then Deploy → New deployment → Web app.
 *
 * Sheet columns are created automatically: When | Month | Name | Choice | Title
 * One row per vote. A second vote from the same name in the same month
 * overwrites the first, so the tally is always one-vote-per-member.
 */

var SHEET_NAME = 'Votes';

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['When', 'Month', 'Name', 'Choice', 'Title']);
  }
  return sh;
}

function readVotes_(month) {
  var rows = sheet_().getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[2]) continue;
    if (month && String(r[1]) !== String(month)) continue;
    out.push({ at: r[0], name: String(r[2]), choice: Number(r[3]), title: String(r[4] || '') });
  }
  return out;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var month = (e && e.parameter && e.parameter.month) || '';
  return json_({ ok: true, month: month, votes: readVotes_(month) });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var body = JSON.parse(e.postData.contents);
    var name = String(body.name || '').trim();
    var month = String(body.month || '');
    if (!name) return json_({ ok: false, error: 'name required' });

    var sh = sheet_();
    var rows = sh.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      if (String(rows[i][1]) === month &&
          String(rows[i][2]).toLowerCase() === name.toLowerCase()) {
        sh.deleteRow(i + 1);
      }
    }
    sh.appendRow([new Date().toISOString(), month, name, Number(body.choice), String(body.title || '')]);

    return json_({ ok: true, votes: readVotes_(month) });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
