/**
 * KHO CHỈ CHÍNH HÃNG — máy chủ chạy trên Google Apps Script
 * ---------------------------------------------------------
 * Dữ liệu thật nằm trong Google Sheet. App trên điện thoại chỉ giữ bản sao.
 *
 * LẦN ĐẦU: mở menu Chạy → chọn hàm  khoiTao  → Chạy.
 * Xong rồi mới Triển khai (Deploy) thành Ứng dụng web.
 */

var SHEET_SP   = 'SanPham';
var SHEET_TON  = 'TonKho';
var SHEET_BAN  = 'BanHang';
var SHEET_TC   = 'ThuChi';
var SHEET_ND   = 'NguoiDung';
var SHEET_LOG  = 'NhatKy';
var SHEET_CD   = 'CaiDat';

var COT = {};
COT[SHEET_SP]  = ['MaSP','Ten','Hang','Loai','Mau','GiaNhap','GiaBan','ViTri','AnhID','GhiChu','TrangThai','NgayTao'];
COT[SHEET_TON] = ['MaSP','Size','SoLuong'];
COT[SHEET_BAN] = ['MaGD','ThoiGian','MaSP','Ten','Size','SoLuong','GiaBan','GiaNhap','ThanhTien','Lai','HinhThuc','NguoiBan'];
COT[SHEET_TC]  = ['MaPhieu','ThoiGian','Loai','DanhMuc','NoiDung','SoTien','HinhThuc','NguoiTao','MaLienKet'];
COT[SHEET_ND]  = ['TenDangNhap','TenHienThi','MatKhauHash','Salt','VaiTro','TrangThai'];
COT[SHEET_LOG] = ['ThoiGian','NguoiDung','HanhDong','ChiTiet'];
COT[SHEET_CD]  = ['Khoa','GiaTri'];

var SIZE_GIAY = '35,36,37,38,39,40,41,42,43,44,45';
var SIZE_AO   = 'XS,S,M,L,XL,XXL,3XL';
var SIZE_MU   = 'Freesize';

/* ===================== CÀI ĐẶT LẦN ĐẦU ===================== */

function khoiTao() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(COT).forEach(function (ten) {
    var sh = ss.getSheetByName(ten);
    if (!sh) sh = ss.insertSheet(ten);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, COT[ten].length).setValues([COT[ten]]);
      sh.getRange(1, 1, 1, COT[ten].length).setFontWeight('bold').setBackground('#FBF0F2');
      sh.setFrozenRows(1);
    }
  });

  var cd = ss.getSheetByName(SHEET_CD);
  if (cd.getLastRow() < 2) {
    cd.getRange(2, 1, 5, 2).setValues([
      ['size_giay', SIZE_GIAY],
      ['size_ao', SIZE_AO],
      ['size_mu', SIZE_MU],
      ['danhmuc_thu', 'Bán hàng,Thu khác'],
      ['danhmuc_chi', 'Nhập hàng,Tiền nhà,Điện nước,Ship,Ăn uống,Lương,Chi khác']
    ]);
  }

  var nd = ss.getSheetByName(SHEET_ND);
  if (nd.getLastRow() < 2) themNguoiDung('chu', 'Chủ shop', '123456', 'chu');
  if (ss.getSheetByName('Sheet1') && ss.getSheets().length > 1) {
    try { ss.deleteSheet(ss.getSheetByName('Sheet1')); } catch (e) {}
  }

  batSaoLuuHangDem();
  Logger.log('XONG. Tài khoản: chu / 123456 — ĐỔI MẬT KHẨU NGAY bằng hàm doiMatKhau.');
}

/* ---------------------------------------------------------------
   HAI HÀM TIỆN LỢI — sửa dòng chữ trong ngoặc rồi bấm Chạy đúng hàm đó.
   (Apps Script không cho điền tham số lúc bấm Chạy, nên làm sẵn thế này.)
   --------------------------------------------------------------- */

// 1) ĐỔI MẬT KHẨU: sửa 2 dòng dưới rồi chạy hàm  doiMatKhauCuaToi
var TAI_KHOAN_CAN_DOI = 'chu';
var MAT_KHAU_MOI      = 'hay-doi-mat-khau-nay';
function doiMatKhauCuaToi() {
  doiMatKhau(TAI_KHOAN_CAN_DOI, MAT_KHAU_MOI);
}

// 2) THÊM NGƯỜI TRÔNG QUÁN: sửa 3 dòng dưới rồi chạy hàm  themNhanVien
var NV_TAI_KHOAN = 'an';
var NV_TEN_HIEN_THI = 'An trông quán';
var NV_MAT_KHAU = '123456';
function themNhanVien() {
  themNguoiDung(NV_TAI_KHOAN, NV_TEN_HIEN_THI, NV_MAT_KHAU, 'nv');
}

/** Thêm tài khoản. vaiTro: 'chu' hoặc 'nv' */
function themNguoiDung(tenDangNhap, tenHienThi, matKhau, vaiTro) {
  var sh = sheet_(SHEET_ND);
  if (timNguoiDung_(tenDangNhap)) throw new Error('Tài khoản đã tồn tại: ' + tenDangNhap);
  var salt = Utilities.base64Encode(Utilities.getUuid());
  sh.appendRow([tenDangNhap, tenHienThi, bam_(salt, matKhau), salt, vaiTro || 'nv', 'hoat_dong']);
  Logger.log('Đã tạo tài khoản: ' + tenDangNhap);
}

/** Đổi mật khẩu cho một tài khoản */
function doiMatKhau(tenDangNhap, matKhauMoi) {
  var u = timNguoiDung_(tenDangNhap);
  if (!u) throw new Error('Không có tài khoản: ' + tenDangNhap);
  var salt = Utilities.base64Encode(Utilities.getUuid());
  var sh = sheet_(SHEET_ND);
  sh.getRange(u._row, 3).setValue(bam_(salt, matKhauMoi));
  sh.getRange(u._row, 4).setValue(salt);
  Logger.log('Đã đổi mật khẩu cho ' + tenDangNhap);
}

/** Khoá / mở tài khoản */
function khoaTaiKhoan(tenDangNhap, khoa) {
  var u = timNguoiDung_(tenDangNhap);
  if (!u) throw new Error('Không có tài khoản: ' + tenDangNhap);
  sheet_(SHEET_ND).getRange(u._row, 6).setValue(khoa ? 'khoa' : 'hoat_dong');
}

/* ===================== SAO LƯU HÀNG ĐÊM ===================== */

function batSaoLuuHangDem() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'saoLuu') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('saoLuu').timeBased().atHour(2).everyDays(1).create();
}

function saoLuu() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var thuMuc = layThuMucSaoLuu_();
  var ten = 'SAOLUU ' + ss.getName() + ' ' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyy-MM-dd');
  DriveApp.getFileById(ss.getId()).makeCopy(ten, thuMuc);
  // chỉ giữ 30 bản gần nhất
  var ds = [], it = thuMuc.getFiles();
  while (it.hasNext()) ds.push(it.next());
  ds.sort(function (a, b) { return b.getDateCreated() - a.getDateCreated(); });
  ds.slice(30).forEach(function (f) { f.setTrashed(true); });
}

function layThuMucSaoLuu_() {
  var ten = 'Sao luu kho Chi Chinh Hang';
  var it = DriveApp.getFoldersByName(ten);
  return it.hasNext() ? it.next() : DriveApp.createFolder(ten);
}

/* ===================== CỔNG VÀO HTTP ===================== */

function doGet(e) {
  return json_({ ok: true, ten: 'Kho Chỉ Chính Hãng', phienBan: 1 });
}

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); }
  catch (err) { return json_({ ok: false, loi: 'DU_LIEU_HONG' }); }

  try {
    var act = req.action;
    if (act === 'login') return json_(dangNhap_(req));

    var me = kiemTraToken_(req.token);
    if (!me) return json_({ ok: false, loi: 'HET_PHIEN' });

    switch (act) {
      case 'pull':     return json_(layTatCa_(me));
      case 'ban':      return json_(ban_(me, req));
      case 'nhap':     return json_(nhapThem_(me, req));
      case 'themSP':   return json_(themSP_(me, req));
      case 'suaSP':    return json_(suaSP_(me, req));
      case 'xoaSP':    return json_(xoaSP_(me, req));
      case 'thuchi':   return json_(themThuChi_(me, req));
      case 'doiMK':    return json_(doiMKApp_(me, req));
      default:         return json_({ ok: false, loi: 'KHONG_HIEU_LENH' });
    }
  } catch (err) {
    return json_({ ok: false, loi: 'LOI_MAY_CHU', chiTiet: String(err && err.message || err) });
  }
}

/* ===================== ĐĂNG NHẬP ===================== */

function dangNhap_(req) {
  var u = timNguoiDung_(String(req.u || '').trim().toLowerCase());
  if (!u || u.TrangThai === 'khoa') return { ok: false, loi: 'SAI_TAI_KHOAN' };
  if (bam_(u.Salt, String(req.p || '')) !== u.MatKhauHash) return { ok: false, loi: 'SAI_TAI_KHOAN' };
  ghiLog_(u.TenDangNhap, 'dang_nhap', '');
  return { ok: true, token: taoToken_(u.TenDangNhap), ten: u.TenHienThi, vaiTro: u.VaiTro };
}

function doiMKApp_(me, req) {
  var u = timNguoiDung_(me.u);
  if (bam_(u.Salt, String(req.cu || '')) !== u.MatKhauHash) return { ok: false, loi: 'SAI_MAT_KHAU_CU' };
  if (String(req.moi || '').length < 6) return { ok: false, loi: 'MAT_KHAU_NGAN' };
  doiMatKhau(me.u, req.moi);
  ghiLog_(me.u, 'doi_mat_khau', '');
  return { ok: true };
}

/* ===================== ĐỌC DỮ LIỆU ===================== */

function layTatCa_(me) {
  var sp = docBang_(SHEET_SP).filter(function (r) { return r.TrangThai !== 'an'; });
  var ton = docBang_(SHEET_TON);

  var map = {};
  sp.forEach(function (p) {
    if (me.vaiTro !== 'chu') p.GiaNhap = null;   // nhân viên không thấy giá vốn
    p.ton = {};
    map[p.MaSP] = p;
  });
  ton.forEach(function (t) {
    if (map[t.MaSP]) map[t.MaSP].ton[t.Size] = Number(t.SoLuong) || 0;
  });

  var moc = new Date(); moc.setDate(moc.getDate() - 90);
  var loc = function (rows) {
    return rows.filter(function (r) { return new Date(r.ThoiGian) >= moc; });
  };

  var kq = {
    ok: true,
    sp: sp,
    cd: docCaiDat_(),
    me: { u: me.u, vaiTro: me.vaiTro },
    thoiDiem: new Date().toISOString()
  };
  if (me.vaiTro === 'chu') {
    kq.bh = loc(docBang_(SHEET_BAN));
    kq.tc = loc(docBang_(SHEET_TC));
  } else {
    kq.bh = []; kq.tc = [];
  }
  return kq;
}

/* ===================== BÁN — CÓ KHOÁ CHỐNG TRÙNG ===================== */

function ban_(me, req) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return { ok: false, loi: 'MAY_CHU_BAN' };
  try {
    var ma = String(req.ma), size = String(req.size), sl = Number(req.sl) || 1;
    var p = timSP_(ma);
    if (!p) return { ok: false, loi: 'KHONG_CO_SP' };

    var sh = sheet_(SHEET_TON);
    var dong = timDongTon_(ma, size);
    var conLai = dong ? Number(sh.getRange(dong, 3).getValue()) : 0;
    if (conLai < sl) return { ok: false, loi: 'HET_HANG', con: conLai };

    sh.getRange(dong, 3).setValue(conLai - sl);

    var now = new Date();
    var thanhTien = Number(p.GiaBan) * sl;
    var lai = (Number(p.GiaBan) - Number(p.GiaNhap)) * sl;
    var maGD = 'BH' + now.getTime();

    sheet_(SHEET_BAN).appendRow([maGD, now, ma, p.Ten, size, sl,
      Number(p.GiaBan), Number(p.GiaNhap), thanhTien, lai, req.ht || 'Tiền mặt', me.u]);

    sheet_(SHEET_TC).appendRow(['TC' + now.getTime(), now, 'Thu', 'Bán hàng',
      p.Ten + ' · size ' + size + (sl > 1 ? ' × ' + sl : ''),
      thanhTien, req.ht || 'Tiền mặt', me.u, maGD]);

    ghiLog_(me.u, 'ban', ma + ' size ' + size + ' × ' + sl);
    return { ok: true, maGD: maGD, con: conLai - sl };
  } finally {
    lock.releaseLock();
  }
}

/* ===================== NHẬP THÊM HÀNG CÓ SẴN ===================== */

function nhapThem_(me, req) {
  if (me.vaiTro !== 'chu') return { ok: false, loi: 'KHONG_CO_QUYEN' };
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return { ok: false, loi: 'MAY_CHU_BAN' };
  try {
    var ma = String(req.ma), sizes = req.sizes || {};
    var p = timSP_(ma);
    if (!p) return { ok: false, loi: 'KHONG_CO_SP' };

    var sh = sheet_(SHEET_TON), tong = 0;
    Object.keys(sizes).forEach(function (s) {
      var them = Number(sizes[s]) || 0;
      if (!them) return;
      tong += them;
      var dong = timDongTon_(ma, s);
      if (dong) sh.getRange(dong, 3).setValue((Number(sh.getRange(dong, 3).getValue()) || 0) + them);
      else sh.appendRow([ma, s, them]);
    });

    var now = new Date();
    var tien = Number(req.tienChi) || (Number(p.GiaNhap) * tong);
    if (tien > 0) {
      sheet_(SHEET_TC).appendRow(['TC' + now.getTime(), now, 'Chi', 'Nhập hàng',
        p.Ten + ' · ' + tong + ' món', tien, req.ht || 'Chuyển khoản', me.u, ma]);
    }
    ghiLog_(me.u, 'nhap_them', ma + ' +' + tong);
    return { ok: true, tong: tong };
  } finally {
    lock.releaseLock();
  }
}

/* ===================== SẢN PHẨM ===================== */

function themSP_(me, req) {
  if (me.vaiTro !== 'chu') return { ok: false, loi: 'KHONG_CO_QUYEN' };
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return { ok: false, loi: 'MAY_CHU_BAN' };
  try {
    var d = req.sp || {};
    var ma = String(d.MaSP || '').trim() || taoMa_(d);
    if (timSP_(ma)) return { ok: false, loi: 'TRUNG_MA', ma: ma };

    var now = new Date();
    sheet_(SHEET_SP).appendRow([ma, d.Ten, d.Hang, d.Loai, d.Mau,
      Number(d.GiaNhap) || 0, Number(d.GiaBan) || 0, d.ViTri || '', d.AnhID || '',
      d.GhiChu || '', 'hien', now]);

    var sizes = req.sizes || {}, tong = 0, sh = sheet_(SHEET_TON);
    Object.keys(sizes).forEach(function (s) {
      var n = Number(sizes[s]) || 0;
      tong += n;
      sh.appendRow([ma, s, n]);
    });

    var tien = Number(req.tienChi) || (Number(d.GiaNhap) || 0) * tong;
    if (tien > 0) {
      sheet_(SHEET_TC).appendRow(['TC' + now.getTime(), now, 'Chi', 'Nhập hàng',
        d.Ten + ' · ' + tong + ' món', tien, req.ht || 'Chuyển khoản', me.u, ma]);
    }
    ghiLog_(me.u, 'them_sp', ma);
    return { ok: true, ma: ma, tong: tong };
  } finally {
    lock.releaseLock();
  }
}

function suaSP_(me, req) {
  if (me.vaiTro !== 'chu') return { ok: false, loi: 'KHONG_CO_QUYEN' };
  var p = timSP_(String(req.ma));
  if (!p) return { ok: false, loi: 'KHONG_CO_SP' };
  var sh = sheet_(SHEET_SP), cols = COT[SHEET_SP];
  Object.keys(req.fields || {}).forEach(function (k) {
    var i = cols.indexOf(k);
    if (i > 0) sh.getRange(p._row, i + 1).setValue(req.fields[k]);
  });
  ghiLog_(me.u, 'sua_sp', req.ma + ' ' + JSON.stringify(req.fields));
  return { ok: true };
}

function xoaSP_(me, req) {
  if (me.vaiTro !== 'chu') return { ok: false, loi: 'KHONG_CO_QUYEN' };
  var p = timSP_(String(req.ma));
  if (!p) return { ok: false, loi: 'KHONG_CO_SP' };
  sheet_(SHEET_SP).getRange(p._row, COT[SHEET_SP].indexOf('TrangThai') + 1).setValue('an');
  ghiLog_(me.u, 'an_sp', req.ma);
  return { ok: true };
}

/* ===================== THU CHI ===================== */

function themThuChi_(me, req) {
  if (me.vaiTro !== 'chu') return { ok: false, loi: 'KHONG_CO_QUYEN' };
  var now = new Date();
  sheet_(SHEET_TC).appendRow(['TC' + now.getTime(), now,
    req.loai === 'Thu' ? 'Thu' : 'Chi', req.danhMuc || 'Chi khác',
    req.noiDung || '', Number(req.soTien) || 0, req.hinhThuc || 'Tiền mặt', me.u, '']);
  ghiLog_(me.u, 'thu_chi', req.loai + ' ' + req.soTien);
  return { ok: true };
}

/* ===================== TIỆN ÍCH ===================== */

function sheet_(ten) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ten);
  if (!sh) throw new Error('Thiếu bảng ' + ten + ' — chạy hàm khoiTao trước.');
  return sh;
}

function docBang_(ten) {
  var sh = sheet_(ten);
  if (sh.getLastRow() < 2) return [];
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, COT[ten].length).getValues();
  var cols = COT[ten];
  return v.map(function (row, i) {
    var o = { _row: i + 2 };
    cols.forEach(function (c, j) {
      o[c] = (row[j] instanceof Date) ? row[j].toISOString() : row[j];
    });
    return o;
  }).filter(function (o) { return o[cols[0]] !== '' && o[cols[0]] !== null; });
}

function docCaiDat_() {
  var o = {};
  docBang_(SHEET_CD).forEach(function (r) { o[r.Khoa] = String(r.GiaTri); });
  return o;
}

function timNguoiDung_(u) {
  var ds = docBang_(SHEET_ND);
  for (var i = 0; i < ds.length; i++) {
    if (String(ds[i].TenDangNhap).toLowerCase() === String(u).toLowerCase()) return ds[i];
  }
  return null;
}

function timSP_(ma) {
  var ds = docBang_(SHEET_SP);
  for (var i = 0; i < ds.length; i++) if (String(ds[i].MaSP) === ma) return ds[i];
  return null;
}

function timDongTon_(ma, size) {
  var sh = sheet_(SHEET_TON);
  if (sh.getLastRow() < 2) return 0;
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues();
  for (var i = 0; i < v.length; i++) {
    if (String(v[i][0]) === ma && String(v[i][1]) === String(size)) return i + 2;
  }
  return 0;
}

function taoMa_(d) {
  var h = String(d.Hang || 'SP').replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 2) || 'SP';
  return h + '-' + String(Date.now()).slice(-6);
}

function bam_(salt, pass) {
  return Utilities.base64Encode(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + '|' + pass, Utilities.Charset.UTF_8));
}

function biMat_() {
  var pr = PropertiesService.getScriptProperties();
  var s = pr.getProperty('BI_MAT');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); pr.setProperty('BI_MAT', s); }
  return s;
}

function taoToken_(u) {
  var het = Date.now() + 30 * 24 * 3600 * 1000;              // 30 ngày
  var than = Utilities.base64EncodeWebSafe(u + '|' + het);
  return than + '.' + Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(than, biMat_()));
}

function kiemTraToken_(t) {
  if (!t || String(t).indexOf('.') < 0) return null;
  var p = String(t).split('.');
  var mongDoi = Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(p[0], biMat_()));
  if (p[1] !== mongDoi) return null;
  var than = Utilities.newBlob(Utilities.base64DecodeWebSafe(p[0])).getDataAsString().split('|');
  if (Number(than[1]) < Date.now()) return null;
  var u = timNguoiDung_(than[0]);
  if (!u || u.TrangThai === 'khoa') return null;
  return { u: u.TenDangNhap, ten: u.TenHienThi, vaiTro: u.VaiTro };
}

function ghiLog_(u, hanhDong, chiTiet) {
  try { sheet_(SHEET_LOG).appendRow([new Date(), u, hanhDong, chiTiet]); } catch (e) {}
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
