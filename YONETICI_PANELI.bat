@echo off
title BIL BAKALIM - YONETICI VE KUPON PANELI
cd /d "%~dp0"
echo ====================================================
echo      BIL BAKALIM - YONETICI VE KUPON PANELI
echo ====================================================
echo.
echo Yonetici Giris PIN: 1453
echo Yonetici Paneli Aciliyor...
echo.
start http://localhost:3000/admin.html
