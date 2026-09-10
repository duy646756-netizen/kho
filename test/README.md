# Kiểm thử máy chủ Apps Script

Chạy bằng Node, dùng Google Sheets giả lập **có áp đúng giới hạn thật**
(trang tính mới chỉ có 26 cột, 1000 dòng — vượt ra là văng lỗi).

```
node test/test_khoitao.js    # dựng bảng lần đầu, tài khoản, lịch sao lưu
node test/test_nap.js        # nạp hàng từ bảng NhapNhanh, chống trùng mã
```

Sửa `Code.gs` xong nên chạy lại hai lệnh này trước khi dán lên Apps Script.
