/* Chạy thử khoiTao với Google Sheets giả lập CÓ ÁP GIỚI HẠN THẬT:
   trang tính mới chỉ có 26 cột và 1000 dòng, vượt ra là văng lỗi. */
const fs = require('fs');

class FakeSheet {
  constructor(name, cols = 26, rows = 1000) {
    this.name = name;
    this.maxCols = cols;
    this.maxRows = rows;
    this.data = {};
  }
  getMaxColumns() { return this.maxCols; }
  getMaxRows() { return this.maxRows; }
  insertColumnsAfter(after, n) { this.maxCols += n; }
  insertRowsAfter(after, n) { this.maxRows += n; }
  getLastRow() {
    let m = 0;
    for (const k of Object.keys(this.data)) {
      const r = Number(k.split(':')[0]);
      const v = this.data[k];
      if (v !== '' && v != null && r > m) m = r;
    }
    return m;
  }
  _check(r, c, nr, nc) {
    if (r < 1 || c < 1) throw new Error(`Phạm vi không hợp lệ ở ${this.name}`);
    if (c + nc - 1 > this.maxCols)
      throw new Error(`TRÀN CỘT ở "${this.name}": cần tới cột ${c + nc - 1} nhưng bảng chỉ có ${this.maxCols}`);
    if (r + nr - 1 > this.maxRows)
      throw new Error(`TRÀN DÒNG ở "${this.name}": cần tới dòng ${r + nr - 1} nhưng bảng chỉ có ${this.maxRows}`);
  }
  getRange(r, c, nr = 1, nc = 1) {
    this._check(r, c, nr, nc);
    const sh = this;
    const noop = () => api;
    const api = {
      getValues() {
        const out = [];
        for (let i = 0; i < nr; i++) {
          const row = [];
          for (let j = 0; j < nc; j++) row.push(sh.data[`${r + i}:${c + j}`] ?? '');
          out.push(row);
        }
        return out;
      },
      getValue() { return sh.data[`${r}:${c}`] ?? ''; },
      setValues(v) {
        if (v.length !== nr || v[0].length !== nc)
          throw new Error(`setValues sai kích thước ở ${sh.name}: đưa ${v.length}x${v[0].length}, phạm vi ${nr}x${nc}`);
        for (let i = 0; i < v.length; i++)
          for (let j = 0; j < v[i].length; j++) sh.data[`${r + i}:${c + j}`] = v[i][j];
        return api;
      },
      setValue(x) { sh.data[`${r}:${c}`] = x; return api; },
      setNote: noop, setBackground: noop, setFontColor: noop, setFontWeight: noop,
      setFontSize: noop, setWrap: noop, setBorder: noop, setNumberFormat: noop,
      setHorizontalAlignment: noop, setVerticalAlignment: noop, setDataValidation: noop,
      applyRowBanding() { sh._band = true; return { setHeaderRowColor(){return this}, setFirstRowColor(){return this}, setSecondRowColor(){return this} } }
    };
    return api;
  }
  appendRow(v) {
    if (v.length > this.maxCols) throw new Error(`appendRow tràn cột ở ${this.name}`);
    const r = this.getLastRow() + 1;
    v.forEach((x, j) => this.data[`${r}:${j + 1}`] = x);
  }
  setFrozenRows() {} setFrozenColumns() {} setRowHeight() {} setColumnWidth() {}
  getBandings() { return this._band ? [{ remove: () => { this._band = false }, setHeaderRowColor(){return this}, setFirstRowColor(){return this}, setSecondRowColor(){return this} }] : []; }
  deleteRow() {} setConditionalFormatRules() {}
}

const SHEETS = {};
const logs = [];

global.SpreadsheetApp = {
  getActiveSpreadsheet: () => ({
    getSheetByName: n => SHEETS[n] || null,
    insertSheet: (n) => (SHEETS[n] = new FakeSheet(n)),   // 26 cột, 1000 dòng — như thật
    deleteSheet: n => { delete SHEETS[n && n.name ? n.name : n]; },
    getSheets: () => Object.values(SHEETS),
    setActiveSheet: () => {}, moveActiveSheet: () => {}, getName: () => 'Kho Chỉ Chính Hãng'
  }),
  getUi: () => ({ alert: () => {}, ButtonSet: { OK: 1 },
    createMenu: () => ({ addItem() { return this }, addSeparator() { return this }, addToUi() {} }) }),
  newDataValidation: () => ({ requireValueInList() { return this }, setAllowInvalid() { return this }, build() { return {} } }),
  newConditionalFormatRule: () => ({ whenNumberEqualTo(){return this}, setBackground(){return this}, setFontColor(){return this}, setRanges(){return this}, build(){return {}} }),
  BandingTheme: { LIGHT_GREY: 1 }, BorderStyle: { SOLID: 1 }, flush: () => {}
};
global.Logger = { log: m => logs.push(String(m)) };
global.Utilities = {
  base64Encode: s => Buffer.from(String(s)).toString('base64'),
  getUuid: () => 'uuid-' + Math.random(),
  computeDigest: (a, s) => Buffer.from(String(s)),
  computeHmacSha256Signature: (a, b) => Buffer.from(String(a) + String(b)),
  base64EncodeWebSafe: s => Buffer.from(String(s)).toString('base64url'),
  formatDate: () => '2026-09-10',
  DigestAlgorithm: { SHA_256: 1 }, Charset: { UTF_8: 1 }
};
let triggerTao = 0;
global.ScriptApp = {
  getProjectTriggers: () => [],
  newTrigger: () => ({ timeBased: () => ({ atHour: () => ({ everyDays: () => ({ create: () => { triggerTao++ } }) }) }) })
};
global.DriveApp = { getFoldersByName: () => ({ hasNext: () => false }), createFolder: () => ({}), getFileById: () => ({ makeCopy: () => {} }) };

eval(fs.readFileSync('C:/Users/Windows/Downloads/kho-chi-chinh-hang/apps-script/Code.gs', 'utf8'));

/* ================= CHẠY ================= */
let loi = [];
console.log('--- Chạy khoiTao trên bảng tính trống (đúng giới hạn 26 cột của Google)');
try {
  khoiTao();
  console.log('    khoiTao chạy trót lọt');
} catch (e) {
  loi.push('khoiTao VĂNG LỖI: ' + e.message);
  console.log('    !! ' + e.message);
}

/* kiểm tra kết quả */
const canCo = Object.keys(COT);
canCo.forEach(n => {
  const sh = SHEETS[n];
  if (!sh) { loi.push('thiếu bảng ' + n); return; }
  if (sh.getMaxColumns() < COT[n].length)
    loi.push(`bảng ${n} chỉ có ${sh.getMaxColumns()} cột, cần ${COT[n].length}`);
  const head = sh.getRange(1, 1, 1, COT[n].length).getValues()[0];
  if (String(head[0]) !== COT[n][0]) loi.push('bảng ' + n + ' chưa có tiêu đề');
  if (String(head[COT[n].length - 1]) !== COT[n][COT[n].length - 1])
    loi.push('bảng ' + n + ' thiếu cột cuối "' + COT[n][COT[n].length - 1] + '"');
});

console.log('\n--- Số bảng tạo ra:', Object.keys(SHEETS).length);
Object.keys(SHEETS).forEach(n => console.log('   ', n, '→', SHEETS[n].getMaxColumns(), 'cột'));
console.log('\n--- Lịch sao lưu đặt được:', triggerTao ? 'có' : 'KHÔNG');
if (!triggerTao) loi.push('không đặt được lịch sao lưu hàng đêm');

const nd = SHEETS[SHEET_ND];
console.log('--- Tài khoản tạo sẵn:', nd.getRange(2, 1).getValue(), '/ vai trò', nd.getRange(2, 5).getValue());
if (nd.getRange(2, 1).getValue() !== 'chu') loi.push('chưa tạo tài khoản chu');

console.log('--- Ghi chú bỏ qua (nếu có):', logs.filter(l => l.indexOf('Bỏ qua') === 0).join(' | ') || 'không có');

/* chạy lần 2: phải không hỏng gì */
try { khoiTao(); console.log('--- Chạy khoiTao lần 2: không lỗi'); }
catch (e) { loi.push('khoiTao lần 2 văng lỗi: ' + e.message); }

console.log('\n=============================');
console.log(loi.length ? 'LỖI:\n - ' + loi.join('\n - ') : 'TẤT CẢ PHÉP KIỂM ĐỀU ĐẠT');
process.exit(loi.length ? 1 : 0);
