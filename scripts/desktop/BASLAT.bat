@echo off
chcp 65001 >nul
title Ayfleks - Dev Sunucu
cd /d "%~dp0\..\.."

where node >nul 2>&1
if errorlevel 1 (
  echo [HATA] Node.js bulunamadi.
  pause
  exit /b 1
)

if not exist node_modules (
  echo node_modules yok. Once KUR.bat calistirin.
  pause
  exit /b 1
)

if not exist .env.local (
  copy /Y .env.example .env.local >nul
)

echo.
echo  Ayfleks aciliyor: http://localhost:3000
echo  Panel: http://localhost:3000/panel  (sifre: demo123)
echo  Durdurmak icin bu pencerede Ctrl+C
echo.

start "" http://localhost:3000
call npm run dev
