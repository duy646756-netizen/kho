@echo off
setlocal enabledelayedexpansion
title Day app len GitHub - Kho Chi Chinh Hang
cd /d "%~dp0"

echo.
echo ==================================================
echo    DAY APP KHO CHI CHINH HANG LEN GITHUB
echo ==================================================
echo.

rem --- xem con bao nhieu ban va chua day len ---
for /f %%i in ('git rev-list --count origin/main..HEAD 2^>nul') do set CHO=%%i
if "!CHO!"=="" set CHO=?
if "!CHO!"=="0" (
  echo Tren GitHub da la ban moi nhat roi.
) else (
  echo Dang co !CHO! ban va CHUA duoc day len GitHub.
)
echo.

rem --- da tung noi kho chua ---
for /f "delims=" %%i in ('git remote get-url origin 2^>nul') do set CUURL=%%i
if not "!CUURL!"=="" (
  echo Kho da noi: !CUURL!
  echo.
)

set /p U=Ten tai khoan GitHub cua ban [Enter de dung cai cu]:
if "!U!"=="" if "!CUURL!"=="" goto THIEUTEN
if not "!U!"=="" (
  git remote remove origin >nul 2>&1
  git remote add origin https://github.com/!U!/kho.git
)

echo.
echo --------------------------------------------------
echo  DIA CHI MAY CHU (Apps Script)
echo --------------------------------------------------
echo.
echo  QUAN TRONG: dan vao day thi sau nay MO APP LA DANG NHAP LUON,
echo  khong may nao phai dan link nua.
echo.
echo  Lay o dau: Apps Script ^> Trien khai ^> Quan ly ban trien khai
echo             ^> chep duong dan "Ung dung web"
echo  No co dang: https://script.google.com/macros/s/AKfy.../exec
echo.
call :XEMDAGAN
echo.
set /p A=Dan dia chi vao day [Enter de bo qua]:

if "!A!"=="" goto BOQUA
rem KHONG duoc de dau cach truoc dau | vi echo se them dau cach vao cuoi,
rem lam phep so "ket thuc bang /exec" truot oan.
echo !A!| findstr /E /C:"/exec" >nul
if errorlevel 1 goto SAIDIACHI

echo.
echo Dang gan dia chi may chu vao app...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0gan-dia-chi.ps1" -DiaChi "!A!"
if errorlevel 1 goto GANHONG
git add index.html >nul 2>&1
git -c core.autocrlf=false commit -q -m "Gan dia chi may chu" >nul 2>&1
echo    -^> Da gan xong.
goto DAYLEN

:SAIDIACHI
echo.
echo  !! SAI DIA CHI: phai ket thuc bang  /exec  chu khong phai /dev
echo     Dong cua so, lay lai dia chi dung roi chay lai file nay.
echo.
pause
exit /b

:GANHONG
echo    -^> Khong gan duoc, van tiep tuc day len.
goto DAYLEN

:BOQUA
echo.
echo  ^>^> Ban da BO QUA buoc gan dia chi.
echo     Nghia la moi lan mo app tren may moi, ban van phai tu dan link.
echo     Muon khoi phai dan: chay lai file nay va dan dia chi vao.
echo.

:DAYLEN
echo.
echo Dang day file len GitHub...
echo (Neu hien cua so dang nhap GitHub thi dang nhap binh thuong)
echo.
git push -u origin main
if errorlevel 1 goto LOI

rem --- kiem tra that su da len chua ---
git fetch origin >nul 2>&1
for /f %%i in ('git rev-list --count origin/main..HEAD 2^>nul') do set CONLAI=%%i
if not "!CONLAI!"=="0" goto CHUALEN

echo.
echo ==================================================
echo    DA LEN GITHUB THANH CONG
echo ==================================================
call :XEMDAGAN
echo.
echo Doi 1-2 phut cho GitHub dung xong, roi mo:
for /f "delims=" %%i in ('git remote get-url origin') do echo    %%i
echo.
echo TREN DIEN THOAI: dong han app di roi mo lai moi nhan ban moi.
echo.
pause
exit /b

:XEMDAGAN
findstr /C:"const API_MAC_DINH = '';" index.html >nul
if errorlevel 1 (
  echo  Trang thai: DA gan san dia chi may chu - khong phai dan link nua.
) else (
  echo  Trang thai: CHUA gan dia chi - van phai dan link tay trong app.
)
exit /b

:THIEUTEN
echo.
echo Chua co kho nao duoc noi va ban cung chua nhap ten tai khoan.
echo Chay lai va nhap ten tai khoan GitHub.
echo.
pause
exit /b

:CHUALEN
echo.
echo ==================================================
echo    CHUA LEN HET - con !CONLAI! ban va chua day duoc
echo ==================================================
echo Chay lai file nay lan nua.
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
echo   - Go sai ten tai khoan GitHub
echo   - Bam Cancel o cua so dang nhap
echo   - Chua tao kho ten "kho" tren github.com
echo.
echo Sua xong bam dup file nay chay lai. Chay lai nhieu lan khong sao.
echo.
pause
exit /b
