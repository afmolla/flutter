@echo off
chcp 65001 >nul
title Ayfleks - Kurulum
cd /d "%~dp0\..\.."

echo.
echo  Ayfleks site kurulumu basliyor...
echo  Klasor: %CD%
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [HATA] Node.js bulunamadi.
  echo Lutfen https://nodejs.org adresinden LTS surumunu kurun ve tekrar deneyin.
  pause
  exit /b 1
)

if not exist .env.local (
  copy /Y .env.example .env.local >nul
  echo [OK] .env.local olusturuldu
)

echo [1/2] npm install...
call npm install
if errorlevel 1 (
  echo [HATA] npm install basarisiz.
  pause
  exit /b 1
)

echo.
echo [OK] Kurulum tamam.
echo Simdi BASLAT.bat dosyasina cift tiklayin.
echo.
pause
