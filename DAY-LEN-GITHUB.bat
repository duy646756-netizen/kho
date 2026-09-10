@echo off
title Day app len GitHub - Kho Chi Chinh Hang
cd /d "%~dp0"

echo.
echo ==================================================
echo    DAY APP KHO CHI CHINH HANG LEN GITHUB
echo ==================================================
echo.
echo Truoc khi chay file nay, ban phai lam xong 2 viec:
echo.
echo   1. Tao tai khoan tai github.com
echo   2. Bam dau + goc tren phai ^> New repository
echo      - Repository name: kho
echo      - Chon Public
echo      - KHONG tich "Add a README file"
echo      - Bam Create repository
echo.
echo Neu chua lam, dong cua so nay lai, lam xong roi mo lai.
echo.
set /p U=Nhap ten tai khoan GitHub cua ban:

if "%U%"=="" (
  echo.
  echo Ban chua nhap gi ca. Dong cua so roi chay lai file nay.
  echo.
  pause
  exit /b
)

echo.
echo Dang noi toi kho: https://github.com/%U%/kho.git
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%U%/kho.git

echo Dang day file len...
echo (Neu hien cua so dang nhap GitHub thi dang nhap binh thuong)
echo.
git push -u origin main

if errorlevel 1 goto LOI

echo.
echo ==================================================
echo    XONG! Con 1 buoc cuoi
echo ==================================================
echo.
echo 1. Vao: https://github.com/%U%/kho
echo 2. Bam tab Settings (rang cua, hang tren cung)
echo 3. Cot trai keo xuong chon Pages
echo 4. Muc Source: chon "Deploy from a branch"
echo 5. Muc Branch: chon "main" va "/ (root)" roi bam Save
echo 6. Doi 1-2 phut, tai lai trang
echo.
echo Dia chi app cua ban se la:
echo    https://%U%.github.io/kho/
echo.
echo Gui dia chi do cho Claude de kiem tra ho.
echo.
pause
exit /b

:LOI
echo.
echo ==================================================
echo    CHUA DAY LEN DUOC
echo ==================================================
echo.
echo Thuong do 1 trong 3 ly do sau:
echo.
echo   - Chua tao kho ten "kho" tren github.com
echo   - Go sai ten tai khoan (phai dung y het, khong dau)
echo   - Bam Cancel o cua so dang nhap GitHub
echo.
echo Sua xong roi bam dup file nay chay lai. Chay lai nhieu lan khong sao.
echo.
pause
exit /b
