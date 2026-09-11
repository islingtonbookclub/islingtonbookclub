/**
 * Islington Book Club — RSVP lists
 *
 * Paste into a Google Sheet: Extensions → Apps Script, replace the sample code,
 * save, then Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the /exec address into Housekeeping → RSVP server.
 *
 * Each event gets its OWN TAB in the spreadsheet, named exactly what you typed
 * as the event's Title in Housekeeping.
 * Two columns per tab: Name | Attending (Yes/No).
 * Answering again replaces that person's earlier row.
 */

/**
 * The tab is named after the event TITLE exactly as it is typed in
 * Housekeeping. The site sends "date|title", so everything before the first
 * bar is dropped. Google limits tab names to 100 chars and forbids : \ / ? * [ ]
 */
function tabName_(eventId) {
  var raw = String(eventId || '');
  var bar = raw.indexOf('|');
  var name = (bar === -1 ? raw : raw.substring(bar + 1)).replace(/[:\\\/\?\*\[\]]/g, '-').trim();
  if (!name) name = 'Event';
  return name.substring(0, 99);
}

function sheetFor_(eventId, createIfMissing) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = tabName_(eventId);
  var sh = ss.getSheetByName(name);
  if (!sh && createIfMissing) {
    sh = ss.insertSheet(name);
    sh.appendRow(['Name', 'Attending']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function readRsvps_(eventId) {
  var sh = sheetFor_(eventId, false);
  if (!sh) return [];
  var rows = sh.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    out.push({
      name: String(rows[i][0]),
      coming: String(rows[i][1]).toLowerCase() === 'yes'
    });
  }
  return out;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var id = (e && e.parameter && e.parameter.event) || '';
  return json_({ ok: true, event: id, rsvps: readRsvps_(id) });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var body = JSON.parse(e.postData.contents);
    var name = String(body.name || '').trim();
    var id = String(body.event || '');
    if (!name) return json_({ ok: false, error: 'name required' });

    var sh = sheetFor_(id, true);
    var rows = sh.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      if (String(rows[i][0]).toLowerCase() === name.toLowerCase()) sh.deleteRow(i + 1);
    }
    // { remove: true } deletes the person instead of adding a row (admin edits)
    if (!body.remove) sh.appendRow([name, body.coming ? 'Yes' : 'No']);

    return json_({ ok: true, rsvps: readRsvps_(id) });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
