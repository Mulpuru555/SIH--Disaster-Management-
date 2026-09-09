@echo off
title ResQGrid Launcher - Team BharatBytes (SIH26191)
echo ========================================================
echo    STARTING RESQGRID DISASTER MANAGEMENT PLATFORM
echo    Team BharatBytes (Team 16) - SIH 2026
echo    Problem Statement: SIH26191 (MHA / NDRF)
echo ========================================================
echo.

echo 1. Starting Backend API Server (FastAPI + Google OR-Tools)...
start "ResQGrid Backend API" cmd /k "cd /d \"%~dp0backend\" && python -m uvicorn app.main:app --reload --port 8000"

timeout /t 2 >nul

echo 2. Starting Frontend Dashboard (React 19 + Leaflet GIS)...
start "ResQGrid Frontend UI" cmd /k "cd /d \"%~dp0frontend\" && npm run dev"

timeout /t 3 >nul

echo.
echo Opening ResQGrid National Command Portal in your browser...
start http://localhost:5173

echo ========================================================
echo ResQGrid is now running!
echo - Official Portal:  http://localhost:5173
echo - Backend API Docs: http://localhost:8000/docs
echo ========================================================
pause
