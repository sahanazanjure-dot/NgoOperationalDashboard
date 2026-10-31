@echo off
cd /d "%~dp0"
title NGO Operational Dashboard
echo ==========================================================
echo       NGO Operational Dashboard - Management Portal
echo ==========================================================
echo.
echo Starting Express Backend & Vite Frontend...
echo.

REM Open browser after 2 seconds in background
start "" cmd /c "ping 127.0.0.1 -n 3 >nul && start http://localhost:3000"

REM Run dev environment (Express server on 5001 + Vite on 3000)
npm run dev:all
pause
