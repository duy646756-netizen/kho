@echo off
title Day app len GitHub - Kho Chi Chinh Hang
cd /d "%~dp0"

echo.
echo ==================================================
echo    DAY APP KHO CHI CHINH HANG LEN GITHUB
echo ==================================================
echo.
echo Truoc khi chay, ban phai co:
echo   1. Tai khoan github.com
echo   2. Kho ten "kho", chon Public
echo      (KHONG tich "Add a README file")
echo.
set /p U=Ten tai khoan GitHub cua ban:

if "%U%"=="" (
  echo.
  echo Ban chua nhap gi ca. Dong cua so roi chay lai.
  echo.
  pause
  exit /b
)

echo.
echo --------------------------------------------------
echo  DIA CHI MAY CHU (Apps Script)
echo --------------------------------------------------
echo Dan link Ung dung web cua Apps Script vao day.
echo No co dang:  https://script.google.com/macros/s/AKfy.../exec
echo.
echo Gan san mot lan o day thi SAU NAY KHONG MAY NAO PHAI DAN NUA.
echo Bo trong neu ban muon tu dan tay trong app.
echo.
set /p A=Dia chi may chu:

if not "%A%"=="" (
  echo %A% | findstr /E /C:"/exec" >nul
  if errorlevel 1 (
    echo.
    echo !! Dia chi phai ket thuc bang  /exec  chu khong phai /dev
    echo    Kiem tra lai roi chay lai file nay.
    echo.
    pause
    exit /b
  )
  echo.
  echo Dang gan dia chi may chu vao app...
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0gan-dia-chi.ps1" -DiaChi "%A%"
  if errorlevel 1 (
    echo Khong gan duoc. Van tiep tuc day len, ban se dan tay trong app.
  ) else (
    echo Da gan xong.
  )
  git add index.html >nul 2>&1
  git -c core.autocrlf=false commit -q -m "Gan dia chi may chu" >nul 2>&1
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
echo    XONG!
echo ==================================================
echo.
echo Dia chi app cua ban:
echo    https://%U%.github.io/kho/
echo.
echo Doi 1-2 phut cho GitHub dung xong roi mo len.
echo.
echo Neu day la lan dau, vao https://github.com/%U%/kho
echo   Settings ^> Pages ^> Source: Deploy from a branch
echo   Branch: main + / (root) ^> Save
echo.
echo TREN DIEN THOAI: mo app roi dong han di, mo lai de nhan ban moi.
echo.
pause
exit /b

:LOI
echo.
echo ==================================================
echo    CHUA DAY LEN DUOC
echo ==================================================
echo.
echo Thuong do 1 trong 3 ly do:
echo   - Chua tao kho ten "kho" tren github.com
echo   - Go sai ten tai khoan (phai dung y het, khong dau)
echo   - Bam Cancel o cua so dang nhap GitHub
echo.
echo Sua xong bam dup file nay chay lai. Chay lai nhieu lan khong sao.
echo.
pause
exit /b
