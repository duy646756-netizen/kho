# Kho Chỉ Chính Hãng — hướng dẫn cài đặt

Làm một lần, khoảng **30 phút**. Không tốn đồng nào, không cần thẻ ngân hàng.

Làm trên **máy tính** cho dễ, cài lên iPhone ở bước cuối.

---

## Phần A — Dựng máy chủ trên Google (~15 phút)

### A1. Tạo bảng tính

1. Mở trình duyệt, gõ **sheets.new** rồi Enter → một bảng tính trống hiện ra
2. Bấm vào chữ *"Bảng tính không có tiêu đề"* ở góc trên trái, đổi thành **Kho Chỉ Chính Hãng**

### A2. Dán mã máy chủ

1. Trên thanh menu chọn **Tiện ích mở rộng** → **Apps Script**
2. Tab mới mở ra, có sẵn vài dòng chữ `function myFunction() {}` — **bôi đen xoá hết**
3. Mở file **`apps-script/Code.gs`** trong thư mục này bằng Notepad, **chọn tất cả (Ctrl+A), chép (Ctrl+C)**
4. Quay lại Apps Script, **dán (Ctrl+V)**
5. Bấm biểu tượng **đĩa mềm** (Lưu) hoặc Ctrl+S

### A3. Chạy lần đầu

1. Ở thanh phía trên có ô chọn hàm — chọn **`khoiTao`**
2. Bấm **Chạy**
3. Google sẽ hỏi quyền. Làm theo thứ tự:
   - **Xem lại quyền** → chọn tài khoản Google của bạn
   - Hiện màn hình *"Google chưa xác minh ứng dụng này"* → bấm **Nâng cao** (chữ nhỏ góc dưới trái)
   - Bấm **Đi tới Kho Chỉ Chính Hãng (không an toàn)**
   - Bấm **Cho phép**

   > **Cảnh báo này là bình thường.** Google hiện nó cho mọi đoạn mã tự viết chưa nộp lên duyệt. Mã này chạy trong tài khoản của chính bạn và chỉ đụng vào bảng tính vừa tạo.

4. Quay lại bảng tính, kiểm tra đã có **7 tab** ở đáy: *SanPham, TonKho, BanHang, ThuChi, NguoiDung, NhatKy, CaiDat*

Xong bước này bạn đã có tài khoản **`chu`** với mật khẩu **`123456`**.

### A4. Đổi mật khẩu ngay

1. Về tab Apps Script, tìm gần đầu file 2 dòng:
   ```
   var TAI_KHOAN_CAN_DOI = 'chu';
   var MAT_KHAU_MOI      = 'hay-doi-mat-khau-nay';
   ```
2. Sửa `hay-doi-mat-khau-nay` thành mật khẩu bạn muốn (giữ nguyên dấu nháy)
3. Ctrl+S để lưu
4. Chọn hàm **`doiMatKhauCuaToi`** → bấm **Chạy**

### A5. Thêm tài khoản cho người trông quán

1. Tìm 3 dòng:
   ```
   var NV_TAI_KHOAN = 'an';
   var NV_TEN_HIEN_THI = 'An trông quán';
   var NV_MAT_KHAU = '123456';
   ```
2. Sửa thành tên và mật khẩu của bạn mình
3. Ctrl+S → chọn hàm **`themNhanVien`** → **Chạy**

Muốn thêm người nữa thì sửa lại 3 dòng đó rồi chạy lại.

### A6. Bật máy chủ

1. Góc trên phải bấm **Triển khai** → **Bản triển khai mới**
2. Bấm biểu tượng **bánh răng** cạnh chữ *"Chọn loại"* → chọn **Ứng dụng web**
3. Điền:
   - Mô tả: `Kho CCH`
   - Thực thi với tư cách: **Tôi**
   - Ai có quyền truy cập: **Bất kỳ ai**
4. Bấm **Triển khai** → cho phép nếu được hỏi
5. **CHÉP LẠI ĐƯỜNG DẪN "Ứng dụng web"** — dạng
   `https://script.google.com/macros/s/AKfy..../exec`

   Dán tạm vào Zalo của chính mình để lát nữa lấy trên điện thoại.

> **"Bất kỳ ai" có nguy hiểm không?** Không. Nó chỉ nghĩa là không cần đăng nhập Google mới gọi được — nếu bắt đăng nhập Google thì app không chạy nổi. Muốn đọc hay sửa dữ liệu vẫn phải có **tài khoản và mật khẩu** bạn vừa tạo.

---

## Phần B — Đưa app lên mạng (~10 phút)

### B1. Tạo tài khoản GitHub

1. Vào **github.com** → **Sign up** → tạo tài khoản miễn phí

### B2. Tạo kho chứa

1. Góc trên phải bấm **+** → **New repository**
2. Repository name: **`kho`**
3. Chọn **Public**
4. Bấm **Create repository**

### B3. Tải file lên

1. Bấm dòng chữ **uploading an existing file**
2. Kéo thả **6 file** này vào (chỉ 6 file, **không kéo thư mục `apps-script`**):
   - `index.html`
   - `manifest.webmanifest`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
   - `apple-touch-icon.png`
3. Bấm **Commit changes**

### B4. Bật trang web

1. Vào tab **Settings** → cột trái chọn **Pages**
2. Mục *Source*: chọn **Deploy from a branch**
3. Branch: chọn **main** và **/ (root)** → bấm **Save**
4. Đợi 1–2 phút, tải lại trang, sẽ hiện link dạng:
   `https://tên-tài-khoản.github.io/kho/`

Đó là địa chỉ app của bạn.

---

## Phần C — Cài lên iPhone (~2 phút)

1. Mở **Safari** (bắt buộc Safari, không dùng Chrome), vào link ở bước B4
2. Bấm mũi tên **▸ Địa chỉ máy chủ**, dán đường dẫn Apps Script đã chép ở bước A6
3. Gõ tài khoản **`chu`** và mật khẩu mới → **Đăng nhập**
4. Bấm nút **Chia sẻ** (ô vuông có mũi tên lên, ở thanh dưới)
5. Kéo xuống chọn **Thêm vào MH chính** → **Thêm**

Icon logo cửa hàng hiện trên màn hình chính. Bấm vào là mở toàn màn hình, không thấy thanh Safari.

**Máy của người trông quán:** làm y hệt, chỉ khác là đăng nhập bằng tài khoản `an` bạn tạo ở bước A5.

**Máy tính ở quán:** mở link bằng Chrome, bấm biểu tượng cài đặt ở góc phải thanh địa chỉ.

---

## Phần D — Bắt đầu dùng

Kho đang trống. Mở **Nhập hàng**:

- **Mẫu mới**: để ô *"Nhập cho mẫu nào"* ở dòng *— Thêm mẫu mới —*, điền tên, giá, vị trí, rồi bấm **+** vào từng size
- **Mẫu đã có, về thêm hàng**: chọn tên mẫu ở ô đó, chỉ cần bấm **+** vào size

Với 100 mẫu đầu tiên, gõ thẳng vào bảng tính trên máy tính sẽ nhanh hơn nhiều:
mở tab **SanPham** điền từng dòng, rồi tab **TonKho** điền `MaSP | Size | SoLuong`.
Xong vào app bấm **Cài đặt → Tải lại**.

---

## Khi có trục trặc

| Hiện tượng | Xử lý |
|---|---|
| *"Không nối được máy chủ"* | Dán lại đường dẫn Apps Script ở mục **Địa chỉ máy chủ**. Phải kết thúc bằng **`/exec`**, không phải `/dev` |
| Huy hiệu **"N chờ gửi"** không chịu hết | Mất mạng. Có mạng lại nó tự gửi, hoặc vào **Cài đặt → Tải lại** |
| Sửa mã trong Apps Script xong app không đổi | Phải **Triển khai → Quản lý bản triển khai → sửa (bút chì) → Phiên bản: Mới → Triển khai** |
| Lỡ xoá nhầm dữ liệu trong bảng tính | Trong Google Sheets: **Tệp → Lịch sử phiên bản → Xem lịch sử phiên bản**, chọn mốc trước lúc xoá rồi khôi phục |
| Muốn khoá tài khoản ai đó | Mở tab **NguoiDung**, sửa cột *TrangThai* thành `khoa` |

---

## Những gì chạy tự động

- **Mỗi đêm 2 giờ sáng**: bản sao toàn bộ bảng tính được cất vào thư mục Drive *"Sao luu kho Chi Chinh Hang"*, giữ 30 bản gần nhất
- **Mọi thay đổi** đều ghi vào tab *NhatKy*: ai làm, làm gì, lúc nào
- **Mỗi lần bán**: trừ tồn → ghi sổ bán hàng → ghi một khoản Thu vào sổ thu chi

## Việc nên làm mỗi tháng

Vào **Cài đặt → Tải kho về máy**, lưu file CSV vào máy tính.
Đây là lớp phòng thân cuối cùng, phòng khi tài khoản Google gặp chuyện.
