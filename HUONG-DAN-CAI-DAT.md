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

Thư mục `kho-chi-chinh-hang` **đã được chuẩn bị sẵn thành một kho git**, đã có bản ghi đầu tiên.
Bạn chọn **một trong hai cách** ở bước B2.

### B1. Tạo kho trên GitHub (cách nào cũng cần bước này)

1. Vào **github.com** → **Sign up** → tạo tài khoản miễn phí
2. Góc trên phải bấm dấu **+** → **New repository**
3. Repository name: gõ **`kho`**
4. Chọn **Public**

   > Bắt buộc phải Public, vì GitHub Pages miễn phí chỉ chạy với kho công khai.
   > **Công khai ở đây là công khai mã nguồn app, không phải dữ liệu cửa hàng.**
   > Tôi đã rà lại toàn bộ file: không có mật khẩu, không có địa chỉ máy chủ nào bị nhúng vào.
   > Kho hàng, giá vốn, sổ thu chi nằm trong Google Sheet riêng của bạn — muốn xem vẫn phải có mật khẩu.

5. **Không tích** ô *"Add a README file"*
6. Bấm **Create repository**

Trang hiện ra sau đó có dòng địa chỉ dạng `https://github.com/TEN-CUA-BAN/kho.git` — để đó, lát cần.

### B2 — Cách 1: kéo thả (dễ hơn, không phải gõ lệnh)

1. Ở trang kho vừa tạo, bấm dòng chữ **uploading an existing file**
2. Mở thư mục `Downloads\kho-chi-chinh-hang` trong File Explorer
3. Bấm Ctrl+A chọn hết rồi **kéo thả tất cả** vào ô trên trình duyệt
   (kéo cả thư mục `apps-script` — nó không ảnh hưởng gì, lại có thêm một bản lưu mã máy chủ phòng thân)
4. Kéo xuống dưới bấm **Commit changes**

### B2 — Cách 2: đẩy bằng lệnh (gõ một lần, sau này cập nhật chỉ mất 1 dòng)

1. Mở File Explorer vào `Downloads\kho-chi-chinh-hang`
2. Bấm chuột phải vào chỗ trống → **Open Git Bash here**
   (nếu không thấy dòng đó thì dùng Cách 1)
3. Gõ 2 lệnh sau, **thay `TEN-CUA-BAN`** bằng tên tài khoản GitHub của bạn:

   ```
   git remote add origin https://github.com/TEN-CUA-BAN/kho.git
   git push -u origin main
   ```

4. Một cửa sổ đăng nhập GitHub bật lên → đăng nhập → xong

### B3. Bật trang web

1. Trong kho trên GitHub, vào tab **Settings** (răng cưa, hàng trên cùng)
2. Cột trái kéo xuống chọn **Pages**
3. Mục *Source*: chọn **Deploy from a branch**
4. Mục *Branch*: chọn **main** và **/ (root)** → bấm **Save**
5. **Đợi 1–2 phút** rồi tải lại trang. Phía trên sẽ hiện dòng
   *"Your site is live at ..."* với địa chỉ dạng:

   ```
   https://TEN-CUA-BAN.github.io/kho/
   ```

Đó là địa chỉ app của bạn. Gửi cho tôi để tôi kiểm tra hộ xem đã chạy đúng chưa.

### Sau này muốn sửa app

- Dùng Cách 1: vào kho, bấm **Add file → Upload files**, kéo file mới vào, Commit
- Dùng Cách 2: mở Git Bash trong thư mục đó rồi gõ
  ```
  git add -A && git commit -m "cap nhat" && git push
  ```

Sửa xong đợi 1–2 phút Pages tự cập nhật. Trên điện thoại **đóng hẳn app rồi mở lại** để nhận bản mới.

---

## Phần C — Cài lên iPhone (~2 phút)

1. Mở **Safari** (bắt buộc Safari, không dùng Chrome), vào link ở bước B3
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
