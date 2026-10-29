@echo off
title BIL BAKALIM - YONETICI VE KUPON PANELI
cd /d "%~dp0"
echo ====================================================
echo      BIL BAKALIM - YONETICI VE KUPON PANELI
echo ====================================================
echo.
echo Yonetici Giris PIN: 1453
echo.
netstat -ano | findstr :3000 >nul
if %errorlevel% neq 0 (
    echo [BILGI] Oyun sunucusu calismiyor, arkaplanda baslatiliyor...
    start /min "Bil Bakalim Sunucu" cmd /c "node server.js"
    timeout /t 2 >nul
)
echo Tarayici aciliyor: http://localhost:3000/admin.html
start http://localhost:3000/admin.html
