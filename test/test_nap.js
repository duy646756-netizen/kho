/* Chạy thử napHangTuNhapNhanh bằng Google Sheets giả lập. */
const fs = require('fs');

/* ---------- Sheet giả ---------- */
class FakeSheet {
  constructor(name, header) {
    this.name = name;
    this.rows = [header.slice()];
  }
  getLastRow() {
    for (let i = this.rows.length - 1; i >= 0; i--) {
      if (this.rows[i] && this.rows[i].some(c => c !== '' && c != null)) return i + 1;
    }
    return 0;
  }
  getMaxRows() { return Math.max(this.rows.length, 200); }
  _cell(r, c) {
    if (!this.rows[r - 1]) this.rows[r - 1] = [];
    return this.rows[r - 1][c - 1];
  }
  getRange(r, c, nr = 1, nc = 1) {
    const sh = this;
    return {
      getValues() {
        const out = [];
        for (let i = 0; i < nr; i++) {
          const row = [];
          for (let j = 0; j < nc; j++) row.push(sh._cell(r + i, c + j) ?? '');
          out.push(row);
        }
        return out;
      },
      getValue() { return sh._cell(r, c) ?? ''; },
      setValues(v) {
        for (let i = 0; i < v.length; i++) {
          if (!sh.rows[r + i - 1]) sh.rows[r + i - 1] = [];
          for (let j = 0; j < v[i].length; j++) sh.rows[r + i - 1][c + j - 1] = v[i][j];
        }
        return this;
      },
      setValue(x) { if (!sh.rows[r - 1]) sh.rows[r - 1] = []; sh.rows[r - 1][c - 1] = x; return this; },
      setNote() { return this; }, setBackground() { return this; }, setFontColor() { return this; },
      setFontWeight() { return this; }, setFontSize() { return this; }, setWrap() { return this; },
      setBorder() { return this; }, setNumberFormat() { return this; },
      setHorizontalAlignment() { return this; }, setVerticalAlignment() { return this; },
      setDataValidation() { return this; }, applyRowBanding() { return { setHeaderRowColor(){return this}, setFirstRowColor(){return this}, setSecondRowColor(){return this} } }
    };
  }
  appendRow(v) { this.rows[this.getLastRow()] = v.slice(); }
  setFrozenRows() {} setFrozenColumns() {} setRowHeight() {} setColumnWidth() {}
  getBandings() { return []; } insertRowsAfter() {} deleteRow(r) { this.rows.splice(r - 1, 1); }
  setConditionalFormatRules() {}
}

const SHEETS = {};
let alerts = [];

global.SpreadsheetApp = {
  getActiveSpreadsheet: () => ({
    getSheetByName: n => SHEETS[n] || null,
    insertSheet: (n, pos) => (SHEETS[n] = new FakeSheet(n, [])),
    deleteSheet: () => {},
    getSheets: () => Object.values(SHEETS),
    setActiveSheet: () => {}, moveActiveSheet: () => {}, getName: () => 'test'
  }),
  getUi: () => ({
    alert: (...a) => { alerts.push(a.join(' | ')); },
    ButtonSet: { OK: 1 },
    createMenu: () => ({ addItem() { return this }, addSeparator() { return this }, addToUi() {} })
  }),
  newDataValidation: () => ({ requireValueInList() { return this }, setAllowInvalid() { return this }, build() { return {} } }),
  newConditionalFormatRule: () => ({ whenNumberEqualTo(){return this}, setBackground(){return this}, setFontColor(){return this}, setRanges(){return this}, build(){return {}} }),
  BandingTheme: { LIGHT_GREY: 1 },
  BorderStyle: { SOLID: 1 },
  flush: () => {}
};
global.Logger = { log: () => {} };
global.Utilities = {
  base64Encode: s => Buffer.from(String(s)).toString('base64'),
  getUuid: () => 'uuid-' + Math.random(),
  computeDigest: (a, s) => Buffer.from(String(s)),
  DigestAlgorithm: { SHA_256: 1 }, Charset: { UTF_8: 1 }
};

/* ---------- nạp Code.gs ---------- */
let src = fs.readFileSync('C:/Users/Windows/Downloads/kho-chi-chinh-hang/apps-script/Code.gs', 'utf8');
eval(src);

/* ---------- dựng dữ liệu ---------- */
Object.keys(COT).forEach(n => { SHEETS[n] = new FakeSheet(n, COT[n]); });

const cols = COT[SHEET_NHANH];
const iSize = cols.indexOf('35'), iAo = cols.indexOf('XS'), iFree = cols.indexOf('Freesize');

function dong(ten, hang, loaiVN, mau, giaNhap, giaBan, vitri, sizes) {
  const r = new Array(cols.length).fill('');
  r[0] = ten; r[1] = hang; r[2] = loaiVN; r[3] = mau;
  r[4] = giaNhap; r[5] = giaBan; r[6] = vitri;
  for (const [s, n] of Object.entries(sizes)) {
    let idx;
    if (s === 'Freesize') idx = iFree;
    else if (SZ_GIAY_ARR.includes(s)) idx = iSize + SZ_GIAY_ARR.indexOf(s);
    else idx = iAo + SZ_AO_ARR.indexOf(s);
    r[idx] = n;
  }
  return r;
}

const nh = SHEETS[SHEET_NHANH];
const test = [
  dong("Nike Air Force 1 '07", 'Nike', 'Giày', 'Trắng', 1750000, 2290000, 'Kệ A · Thùng 2', { '39': 3, '40': 4, '41': 2, '42': 1 }),
  dong('Adidas Samba OG', 'Adidas', 'Giày', 'Đen', 2150000, 2850000, 'Kệ B · Thùng 1', { '40': 2, '41': 5 }),
  dong('Áo thun Nike Club', 'Nike', 'Áo', 'Đen', 420000, 690000, 'Kệ E · Móc 4', { 'M': 5, 'L': 4, 'XL': 2 }),
  dong('Mũ New Era NY', 'New Era', 'Mũ', 'Đen', 560000, 850000, 'Kệ G · Hộp 2', { 'Freesize': 6 }),
  dong('Đồ bộ Adidas hồng', 'Adidas', 'Đồ bộ', 'Hồng', 640000, 990000, 'Kệ F · Ngăn 4', { 'S': 2, 'M': 3 }),
  dong('Thiếu loại', 'Nike', '', 'Trắng', 100, 200, '', { '40': 2 }),          // phải báo lỗi
  dong('Chưa điền số lượng', 'Nike', 'Giày', 'Trắng', 100, 200, '', {}),        // phải báo lỗi
];
test.forEach((r, i) => nh.rows[i + 1] = r);

/* ---------- chạy ---------- */
napHangTuNhapNhanh();

/* ---------- kiểm tra ---------- */
const sp = SHEETS[SHEET_SP].rows.slice(1).filter(r => r && r[0]);
const ton = SHEETS[SHEET_TON].rows.slice(1).filter(r => r && r[0]);
const tc = SHEETS[SHEET_TC].rows.slice(1).filter(r => r && r[0]);
const kq = nh.rows.slice(1, 8).map(r => r[cols.indexOf('Kết quả')]);

console.log('--- Thông báo:', alerts.join('\n'));
console.log('\n--- Sản phẩm tạo ra:', sp.length);
sp.forEach(r => console.log('   ', r[0], '|', r[1], '| loại =', r[3], '| vốn', r[5], '| bán', r[6]));
console.log('\n--- Dòng tồn kho:', ton.length);
const theoMa = {};
ton.forEach(r => { (theoMa[r[0]] = theoMa[r[0]] || []).push(r[1] + ':' + r[2]); });
Object.entries(theoMa).forEach(([m, v]) => console.log('   ', m, '→', v.join(' ')));
console.log('\n--- Khoản chi ghi tự động:', tc.length);
tc.forEach(r => console.log('   ', r[3], '|', r[4], '|', r[5]));
console.log('\n--- Cột Kết quả từng dòng:');
kq.forEach((k, i) => console.log('   dòng', i + 1, '→', k));

/* ---------- các phép kiểm ---------- */
let loi = [];
if (sp.length !== 5) loi.push('phải tạo 5 mẫu, thực tế ' + sp.length);
const ma = sp.map(r => r[0]);
if (new Set(ma).size !== ma.length) loi.push('CÓ MÃ TRÙNG NHAU');
if (ton.length !== 4 + 2 + 3 + 1 + 2) loi.push('số dòng tồn sai: ' + ton.length);
if (tc.length !== 5) loi.push('số khoản chi sai: ' + tc.length);
const af1 = ton.filter(r => r[0] === ma[0]);
if (af1.reduce((a, r) => a + r[2], 0) !== 10) loi.push('tổng tồn AF1 sai');
if (tc[0][5] !== 1750000 * 10) loi.push('tiền chi AF1 sai: ' + tc[0][5]);
if (!String(kq[5]).includes('thiếu Loại')) loi.push('dòng thiếu loại không báo lỗi');
if (!String(kq[6]).includes('chưa điền')) loi.push('dòng trống số lượng không báo lỗi');

/* chạy lần 2: không được nạp trùng */
const spTruoc = sp.length;
alerts = [];
napHangTuNhapNhanh();
const spSau = SHEETS[SHEET_SP].rows.slice(1).filter(r => r && r[0]).length;
if (spSau !== spTruoc) loi.push('CHẠY LẦN 2 BỊ NẠP TRÙNG: ' + spTruoc + ' → ' + spSau);
console.log('\n--- Chạy lại lần 2:', alerts.join(' '), '| số mẫu vẫn là', spSau);

/* ---------- thử nạp 120 mẫu cùng hãng cùng ngày ---------- */
Object.keys(COT).forEach(n => { SHEETS[n] = new FakeSheet(n, COT[n]); });
const nh2 = SHEETS[SHEET_NHANH];
for (let i = 0; i < 120; i++) {
  nh2.rows[i + 1] = dong('Nike mau so ' + i, 'Nike', 'Giày', 'Trang', 1000000, 1500000, 'Ke A', { '41': 2 });
}
alerts = [];
napHangTuNhapNhanh();
const sp2 = SHEETS[SHEET_SP].rows.slice(1).filter(r => r && r[0]);
const ma2 = sp2.map(r => r[0]);
const trung = ma2.length - new Set(ma2).size;
console.log('\n--- Nap 120 mau cung hang cung ngay:');
console.log('    tao ra', sp2.length, 'ma | so ma bi trung =', trung);
console.log('    vi du:', ma2.slice(0, 3).join(', '));
if (sp2.length !== 120) loi.push('nap 120 mau chi ra ' + sp2.length);
if (trung !== 0) loi.push('CO ' + trung + ' MA TRUNG khi nap hang loat');

console.log('\n=============================');
console.log(loi.length ? 'LỖI:\n - ' + loi.join('\n - ') : 'TẤT CẢ PHÉP KIỂM ĐỀU ĐẠT');
