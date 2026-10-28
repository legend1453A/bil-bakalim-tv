@echo off
title BIL BAKALIM TV SUNUCUSU
cd /d "%~dp0"
echo ====================================================
echo      BIL BAKALIM - TV PARTI YARISMASI BASLATILIYOR
echo ====================================================
echo.
echo TV Ekrani: http://localhost:3000
echo.
start http://localhost:3000
node server.js
pause
