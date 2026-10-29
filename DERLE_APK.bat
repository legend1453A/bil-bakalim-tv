@echo off
title Bil Bakalim TV - APK Derleme
color 0A
echo ========================================================
echo   BIL BAKALIM TV - ANDROID APK DERLEME (TV / MOBIL)
echo ========================================================
echo.

set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.12"
set "ANDROID_HOME=C:\AndroidSdk"
set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "C:\Users\legen\.gemini\antigravity\scratch\tv-party-trivia"
echo 1. Web varliklari Android projesine kopyalaniyor...
call npx cap copy android
if exist "android\app\src\main\assets\public\*.apk" del /q /f "android\app\src\main\assets\public\*.apk"

echo.
echo 2. APK derleniyor (Gradle)...
cd /d "C:\Users\legen\.gemini\antigravity\scratch\tv-party-trivia\android"
call gradlew.bat assembleDebug

echo.
echo 3. APK hazirlaniyor...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    copy /y "app\build\outputs\apk\debug\app-debug.apk" "..\public\Bil_Bakalim_TV.apk"
    copy /y "app\build\outputs\apk\debug\app-debug.apk" "..\public\tv.apk"
    copy /y "app\build\outputs\apk\debug\app-debug.apk" "C:\Users\legen\OneDrive\Desktop\Bil_Bakalim_TV.apk"
    echo.
    echo ========================================================
    echo   TEBRIKLER! APK BASARIYLA DERLENDI!
    echo   Masaustunde: Bil_Bakalim_TV.apk
    echo   Web Uzerinde: https://bil-bakalim-tv.onrender.com/tv.apk
    echo ========================================================
) else (
    echo.
    echo [HATA] APK derlenemedi. Detaylar yukarida yer almaktadir.
)

echo.
pause
