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
var SHEET_NHANH = 'NhapNhanh';

var SZ_GIAY_ARR = ['35','36','37','38','39','40','41','42','43','44','45'];
var SZ_AO_ARR   = ['XS','S','M','L','XL','XXL','3XL'];
var LOAI_VN = { 'Giày': 'giay', 'Dép': 'dep', 'Áo': 'ao', 'Quần': 'quan', 'Đồ bộ': 'dobo', 'Mũ': 'mu' };

var COT = {};
COT[SHEET_SP]  = ['MaSP','Ten','Hang','Loai','Mau','GiaNhap','GiaBan','ViTri','AnhID','GhiChu','TrangThai','NgayTao'];
COT[SHEET_TON] = ['MaSP','Size','SoLuong'];
COT[SHEET_BAN] = ['MaGD','ThoiGian','MaSP','Ten','Size','SoLuong','GiaBan','GiaNhap','ThanhTien','Lai','HinhThuc','NguoiBan'];
COT[SHEET_TC]  = ['MaPhieu','ThoiGian','Loai','DanhMuc','NoiDung','SoTien','HinhThuc','NguoiTao','MaLienKet'];
COT[SHEET_ND]  = ['TenDangNhap','TenHienThi','MatKhauHash','Salt','VaiTro','TrangThai'];
COT[SHEET_LOG] = ['ThoiGian','NguoiDung','HanhDong','ChiTiet'];
COT[SHEET_CD]  = ['Khoa','GiaTri'];
COT[SHEET_NHANH] = ['Tên sản phẩm','Hãng','Loại','Màu','Giá nhập','Giá bán','Vị trí trong kho','Ghi chú']
  .concat(SZ_GIAY_ARR).concat(SZ_AO_ARR).concat(['Freesize','Kết quả']);

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
  lamDepBang();
  var tt = ss.getSheetByName('Trang tính1') || ss.getSheetByName('Sheet1');
  if (tt && ss.getSheets().length > 1) { try { ss.deleteSheet(tt); } catch (e) {} }
  ss.setActiveSheet(ss.getSheetByName(SHEET_NHANH));
  Logger.log('XONG. Tài khoản: chu / 123456 — ĐỔI MẬT KHẨU NGAY bằng hàm doiMatKhauCuaToi.');
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

/**
 * Sinh mã sản phẩm dạng  NI-260910-4129.
 * daDung: đối tượng chứa các mã đã dùng, để nạp hàng loạt không đụng nhau.
 */
function taoMa_(d, daDung) {
  var h = String(d.Hang || 'SP').replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 2) || 'SP';
  var n = new Date();
  var ngay = String(n.getFullYear()).slice(2)
    + ('0' + (n.getMonth() + 1)).slice(-2) + ('0' + n.getDate()).slice(-2);
  var ma;
  for (var i = 0; i < 200; i++) {
    ma = h + '-' + ngay + '-' + String(Math.floor(Math.random() * 9000) + 1000);
    var trung = daDung ? !!daDung[ma] : !!timSP_(ma);
    if (!trung) { if (daDung) daDung[ma] = 1; return ma; }
  }
  // hết đường thì gắn thêm mốc thời gian, chắc chắn không trùng
  ma = h + '-' + ngay + '-' + String(Date.now()).slice(-6);
  if (daDung) daDung[ma] = 1;
  return ma;
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

/* =================================================================
   BẢNG NHẬP NHANH + LÀM ĐẸP BẢNG TÍNH
   Mỗi sản phẩm một dòng. Điền số lượng vào cột size rồi bấm
   menu  Chỉ Chính Hãng → Nạp hàng vào kho.
   ================================================================= */

var MAU_DO   = '#D93A55';
var MAU_HONG = '#FBF0F2';
var MAU_VIEN = '#EEDAE0';

/** Menu riêng, hiện mỗi lần mở bảng tính */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Chỉ Chính Hãng')
    .addItem('⬆  Nạp hàng vào kho', 'napHangTuNhapNhanh')
    .addItem('🧹  Dọn dòng đã nạp', 'donDongDaNap')
    .addSeparator()
    .addItem('📊  Xem tồn kho tổng hợp', 'xemTonKho')
    .addItem('🎨  Làm đẹp lại bảng', 'lamDepBang')
    .addItem('💾  Sao lưu ngay', 'saoLuu')
    .addToUi();
}

/* ---------------- LÀM ĐẸP ---------------- */

function lamDepBang() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.keys(COT).forEach(function (ten) {
    var sh = ss.getSheetByName(ten);
    if (!sh) return;
    var nCot = COT[ten].length;

    var head = sh.getRange(1, 1, 1, nCot);
    head.setBackground(MAU_DO).setFontColor('#FFFFFF').setFontWeight('bold')
        .setVerticalAlignment('middle').setWrap(true);
    sh.setFrozenRows(1);
    sh.setRowHeight(1, 34);

    var maxR = Math.max(sh.getMaxRows(), 2);
    var than = sh.getRange(2, 1, maxR - 1, nCot);
    than.setVerticalAlignment('middle');
    try {
      sh.getBandings().forEach(function (b) { b.remove(); });
      sh.getRange(1, 1, maxR, nCot)
        .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
      sh.getBandings()[0].setHeaderRowColor(MAU_DO).setFirstRowColor('#FFFFFF').setSecondRowColor(MAU_HONG);
    } catch (e) {}

    sh.getRange(1, 1, maxR, nCot).setBorder(true, true, true, true, true, true, MAU_VIEN,
      SpreadsheetApp.BorderStyle.SOLID);
  });

  dinhDangCot_(SHEET_SP, { 'Ten': 260, 'Hang': 90, 'Loai': 70, 'Mau': 110, 'ViTri': 150, 'GhiChu': 160, 'MaSP': 130 },
    ['GiaNhap', 'GiaBan'], ['NgayTao']);
  dinhDangCot_(SHEET_TON, { 'MaSP': 130, 'Size': 70, 'SoLuong': 80 }, [], []);
  dinhDangCot_(SHEET_BAN, { 'Ten': 240, 'MaSP': 130, 'MaGD': 130 },
    ['GiaBan', 'GiaNhap', 'ThanhTien', 'Lai'], ['ThoiGian']);
  dinhDangCot_(SHEET_TC, { 'NoiDung': 260, 'DanhMuc': 120, 'MaPhieu': 130, 'MaLienKet': 130 },
    ['SoTien'], ['ThoiGian']);
  dinhDangCot_(SHEET_ND, { 'MatKhauHash': 160, 'Salt': 160, 'TenHienThi': 160 }, [], []);
  dinhDangCot_(SHEET_LOG, { 'ChiTiet': 320, 'HanhDong': 130 }, [], ['ThoiGian']);
  dinhDangCot_(SHEET_CD, { 'Khoa': 150, 'GiaTri': 420 }, [], []);

  chonSan_(SHEET_SP, 'Loai', ['giay', 'dep', 'ao', 'quan', 'dobo', 'mu']);
  chonSan_(SHEET_SP, 'TrangThai', ['hien', 'an']);
  chonSan_(SHEET_ND, 'VaiTro', ['chu', 'nv']);
  chonSan_(SHEET_ND, 'TrangThai', ['hoat_dong', 'khoa']);
  chonSan_(SHEET_TC, 'Loai', ['Thu', 'Chi']);
  chonSan_(SHEET_TC, 'HinhThuc', ['Tiền mặt', 'Chuyển khoản']);

  taoBangNhapNhanh_();
  SpreadsheetApp.flush();
}

function dinhDangCot_(ten, rong, cotTien, cotNgay) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(ten);
  if (!sh) return;
  var cols = COT[ten], maxR = Math.max(sh.getMaxRows(), 2);

  Object.keys(rong).forEach(function (k) {
    var i = cols.indexOf(k);
    if (i >= 0) sh.setColumnWidth(i + 1, rong[k]);
  });
  (cotTien || []).forEach(function (k) {
    var i = cols.indexOf(k);
    if (i >= 0) sh.getRange(2, i + 1, maxR - 1, 1).setNumberFormat('#,##0"đ"').setHorizontalAlignment('right');
  });
  (cotNgay || []).forEach(function (k) {
    var i = cols.indexOf(k);
    if (i < 0) return;
    sh.getRange(2, i + 1, maxR - 1, 1).setNumberFormat('dd/MM/yyyy  HH:mm');
    sh.setColumnWidth(i + 1, 150);
  });
}

function chonSan_(ten, cot, ds) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ten);
  if (!sh) return;
  var i = COT[ten].indexOf(cot);
  if (i < 0) return;
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(ds, true)
    .setAllowInvalid(false).build();
  sh.getRange(2, i + 1, Math.max(sh.getMaxRows() - 1, 1), 1).setDataValidation(rule);
}

/* ---------------- BẢNG NHẬP NHANH ---------------- */

function taoBangNhapNhanh_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NHANH);
  if (!sh) sh = ss.insertSheet(SHEET_NHANH, 0);
  ss.setActiveSheet(sh); ss.moveActiveSheet(1);
  var cols = COT[SHEET_NHANH];

  if (sh.getLastRow() === 0 || String(sh.getRange(1, 1).getValue()) !== cols[0]) {
    sh.getRange(1, 1, 1, cols.length).setValues([cols]);
  }

  // Hàng chú thích nhóm size, ngay trên tiêu đề
  sh.setFrozenRows(1);
  sh.setFrozenColumns(1);
  sh.setRowHeight(1, 38);

  var iSize = cols.indexOf('35');
  var iAo = cols.indexOf('XS');
  var iFree = cols.indexOf('Freesize');
  var iKQ = cols.indexOf('Kết quả');

  sh.getRange(1, 1, 1, cols.length)
    .setBackground(MAU_DO).setFontColor('#FFFFFF').setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  sh.getRange(1, iSize + 1, 1, SZ_GIAY_ARR.length).setBackground('#08949C');
  sh.getRange(1, iAo + 1, 1, SZ_AO_ARR.length).setBackground('#6C4FD0');
  sh.getRange(1, iFree + 1, 1, 1).setBackground('#B26A0A');
  sh.getRange(1, iKQ + 1, 1, 1).setBackground('#4A4E56');

  sh.setColumnWidth(1, 250);          // Tên
  sh.setColumnWidth(2, 100);          // Hãng
  sh.setColumnWidth(3, 90);           // Loại
  sh.setColumnWidth(4, 110);          // Màu
  sh.setColumnWidth(5, 110);          // Giá nhập
  sh.setColumnWidth(6, 110);          // Giá bán
  sh.setColumnWidth(7, 150);          // Vị trí
  sh.setColumnWidth(8, 130);          // Ghi chú
  for (var c = iSize + 1; c <= iFree + 1; c++) sh.setColumnWidth(c, 44);
  sh.setColumnWidth(iKQ + 1, 190);

  var maxR = Math.max(sh.getMaxRows(), 200);
  if (sh.getMaxRows() < 200) sh.insertRowsAfter(sh.getMaxRows(), 200 - sh.getMaxRows());

  sh.getRange(2, 5, maxR - 1, 2).setNumberFormat('#,##0"đ"');
  sh.getRange(2, iSize + 1, maxR - 1, SZ_GIAY_ARR.length + SZ_AO_ARR.length + 1)
    .setNumberFormat('0').setHorizontalAlignment('center');
  sh.getRange(2, iKQ + 1, maxR - 1, 1).setFontColor('#08949C').setFontSize(10);

  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Giày', 'Dép', 'Áo', 'Quần', 'Đồ bộ', 'Mũ'], true)
    .setAllowInvalid(false).build();
  sh.getRange(2, 3, maxR - 1, 1).setDataValidation(rule);

  var ruleHang = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Nike', 'Adidas', 'Puma', 'New Balance', 'New Era', 'Khác'], true)
    .setAllowInvalid(true).build();
  sh.getRange(2, 2, maxR - 1, 1).setDataValidation(ruleHang);

  sh.getRange(1, 1, maxR, cols.length)
    .setBorder(true, true, true, true, true, true, MAU_VIEN, SpreadsheetApp.BorderStyle.SOLID);

  // ô hướng dẫn nổi
  var note = sh.getRange(1, 1);
  note.setNote('MỖI SẢN PHẨM MỘT DÒNG.\n\n'
    + '1. Điền Tên, Hãng, Loại, Giá nhập, Giá bán, Vị trí\n'
    + '2. Điền số lượng vào ĐÚNG NHÓM SIZE:\n'
    + '   • Giày, Dép  → dùng nhóm xanh (35–45)\n'
    + '   • Áo, Quần, Đồ bộ → dùng nhóm tím (XS–3XL)\n'
    + '   • Mũ → cột Freesize (cam)\n'
    + '3. Menu "Chỉ Chính Hãng" → "Nạp hàng vào kho"\n\n'
    + 'Ô nào để trống thì bỏ qua. Nạp xong cột Kết quả hiện mã sản phẩm.');
}

/* ---------------- NẠP HÀNG ---------------- */

function napHangTuNhapNhanh() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NHANH);
  if (!sh) { ui.alert('Chưa có bảng NhapNhanh. Chạy "Làm đẹp lại bảng" trước.'); return; }

  var cols = COT[SHEET_NHANH];
  var iKQ = cols.indexOf('Kết quả');
  var iSize = cols.indexOf('35');
  var iAo = cols.indexOf('XS');
  var iFree = cols.indexOf('Freesize');
  var lastRow = sh.getLastRow();
  if (lastRow < 2) { ui.alert('Bảng nhập nhanh chưa có dòng nào.'); return; }

  var v = sh.getRange(2, 1, lastRow - 1, cols.length).getValues();
  var shSP = sheet_(SHEET_SP), shTon = sheet_(SHEET_TON), shTC = sheet_(SHEET_TC);

  var themSP = [], themTon = [], themTC = [], ketQua = [], soMau = 0, soMon = 0, tongTien = 0;
  var now = new Date();

  // gom sẵn mọi mã đang có để mã mới không đụng mã cũ, cũng không đụng nhau
  var daDung = {};
  docBang_(SHEET_SP).forEach(function (p) { daDung[String(p.MaSP)] = 1; });

  for (var r = 0; r < v.length; r++) {
    var row = v[r];
    var ten = String(row[0] || '').trim();
    var daNap = String(row[iKQ] || '').trim();

    if (!ten || daNap) { ketQua.push([row[iKQ] || '']); continue; }

    var loaiVN = String(row[2] || '').trim();
    var loai = LOAI_VN[loaiVN];
    if (!loai) { ketQua.push(['⚠ thiếu Loại']); continue; }

    var dsSize = (loai === 'mu') ? ['Freesize']
               : (loai === 'giay' || loai === 'dep') ? SZ_GIAY_ARR : SZ_AO_ARR;
    var goc = (loai === 'mu') ? iFree : (loai === 'giay' || loai === 'dep') ? iSize : iAo;

    var ton = {}, tong = 0;
    for (var k = 0; k < dsSize.length; k++) {
      var n = Number(row[goc + k]) || 0;
      if (n > 0) { ton[dsSize[k]] = n; tong += n; }
    }
    if (tong === 0) { ketQua.push(['⚠ chưa điền số lượng']); continue; }

    var hang = String(row[1] || '').trim();
    var ma = taoMa_({ Hang: hang }, daDung);
    var giaNhap = Number(row[4]) || 0, giaBan = Number(row[5]) || 0;

    themSP.push([ma, ten, hang, loai, String(row[3] || ''), giaNhap, giaBan,
      String(row[6] || ''), '', String(row[7] || ''), 'hien', now]);
    for (var s in ton) themTon.push([ma, s, ton[s]]);

    var tien = giaNhap * tong;
    if (tien > 0) {
      themTC.push(['TC' + (now.getTime() + soMau), now, 'Chi', 'Nhập hàng',
        ten + ' · ' + tong + ' món', tien, 'Chuyển khoản', 'nhap_nhanh', ma]);
      tongTien += tien;
    }
    ketQua.push(['✓ ' + ma + ' · ' + tong + ' món']);
    soMau++; soMon += tong;
  }

  if (!soMau) {
    ui.alert('Không có dòng mới nào để nạp.\n\nDòng đã nạp rồi thì cột "Kết quả" có dấu ✓ — muốn nạp lại phải xoá ô đó.');
    return;
  }

  if (themSP.length) shSP.getRange(shSP.getLastRow() + 1, 1, themSP.length, themSP[0].length).setValues(themSP);
  if (themTon.length) shTon.getRange(shTon.getLastRow() + 1, 1, themTon.length, 3).setValues(themTon);
  if (themTC.length) shTC.getRange(shTC.getLastRow() + 1, 1, themTC.length, themTC[0].length).setValues(themTC);

  sh.getRange(2, iKQ + 1, ketQua.length, 1).setValues(ketQua);
  ghiLog_('nhap_nhanh', 'nap_hang', soMau + ' mẫu, ' + soMon + ' món');

  ui.alert('Đã nạp xong',
    'Thêm ' + soMau + ' mẫu, tổng ' + soMon + ' món.\n'
    + 'Đã ghi Chi nhập hàng: ' + tongTien.toLocaleString('vi-VN') + 'đ\n\n'
    + 'Mở app bấm Cài đặt → Tải lại là thấy ngay.', ui.ButtonSet.OK);
}

/** Xoá các dòng đã nạp cho bảng gọn lại */
function donDongDaNap() {
  var ui = SpreadsheetApp.getUi();
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NHANH);
  var iKQ = COT[SHEET_NHANH].indexOf('Kết quả');
  var lastRow = sh.getLastRow();
  if (lastRow < 2) return;

  var v = sh.getRange(2, iKQ + 1, lastRow - 1, 1).getValues();
  var xoa = 0;
  for (var r = v.length - 1; r >= 0; r--) {
    if (String(v[r][0]).indexOf('✓') === 0) { sh.deleteRow(r + 2); xoa++; }
  }
  ui.alert(xoa ? ('Đã dọn ' + xoa + ' dòng đã nạp.') : 'Không có dòng nào đã nạp.');
}

/** Bảng tổng hợp tồn kho, dễ nhìn hơn tab TonKho thô */
function xemTonKho() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ten = 'TongHopTon';
  var sh = ss.getSheetByName(ten);
  if (sh) ss.deleteSheet(sh);
  sh = ss.insertSheet(ten);

  var sp = docBang_(SHEET_SP).filter(function (p) { return p.TrangThai !== 'an'; });
  var ton = docBang_(SHEET_TON);
  var map = {};
  ton.forEach(function (t) {
    if (!map[t.MaSP]) map[t.MaSP] = {};
    map[t.MaSP][String(t.Size)] = Number(t.SoLuong) || 0;
  });

  var cot = ['Mã', 'Tên sản phẩm', 'Loại', 'Vị trí', 'Tổng còn']
    .concat(SZ_GIAY_ARR).concat(SZ_AO_ARR).concat(['Freesize']);
  var rows = [cot];

  sp.forEach(function (p) {
    var t = map[p.MaSP] || {};
    var tong = 0;
    for (var k in t) tong += t[k];
    var r = [p.MaSP, p.Ten, p.Loai, p.ViTri, tong];
    SZ_GIAY_ARR.concat(SZ_AO_ARR).concat(['Freesize']).forEach(function (s) {
      r.push(t[s] === undefined ? '' : t[s]);
    });
    rows.push(r);
  });

  sh.getRange(1, 1, rows.length, cot.length).setValues(rows);
  sh.getRange(1, 1, 1, cot.length).setBackground(MAU_DO).setFontColor('#FFFFFF')
    .setFontWeight('bold').setHorizontalAlignment('center');
  sh.setFrozenRows(1); sh.setFrozenColumns(2);
  sh.setColumnWidth(1, 130); sh.setColumnWidth(2, 260); sh.setColumnWidth(3, 70);
  sh.setColumnWidth(4, 150); sh.setColumnWidth(5, 80);
  for (var c = 6; c <= cot.length; c++) sh.setColumnWidth(c, 44);

  if (rows.length > 1) {
    var vung = sh.getRange(2, 6, rows.length - 1, cot.length - 5);
    var het = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberEqualTo(0).setBackground('#F3DFE5').setFontColor('#9F8B93')
      .setRanges([vung]).build();
    var it = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberEqualTo(1).setBackground('#FBEBD4').setFontColor('#B26A0A')
      .setRanges([vung]).build();
    sh.setConditionalFormatRules([het, it]);
    sh.getRange(2, 5, rows.length - 1, 1).setFontWeight('bold');
  }
  ss.setActiveSheet(sh);
}
