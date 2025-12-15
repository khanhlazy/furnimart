@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   FurniMart Installation Script
echo ========================================
echo.

REM Backend Setup
echo [1/4] Setting up Backend...
cd backend

if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
)

echo Installing dependencies...
call npm install

if !errorlevel! neq 0 (
    echo Error: Backend installation failed
    exit /b 1
)

echo ✓ Backend setup completed
echo.

REM Frontend Setup
echo [2/4] Setting up Frontend...
cd ..\frontend

if not exist .env.local (
    echo Creating .env.local from .env.example...
    copy .env.example .env.local
)

echo Installing dependencies...
call npm install

if !errorlevel! neq 0 (
    echo Error: Frontend installation failed
    exit /b 1
)

echo ✓ Frontend setup completed
echo.

REM Summary
echo [3/4] Installation Summary
echo.
echo ✓ All dependencies installed
echo.
echo Quick Start:
echo.
echo Terminal 1 - Backend:
echo   cd backend ^&^& npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend ^&^& npm run dev
echo.
echo Terminal 3 - Seed Data:
echo   cd backend ^&^& npm run seed
echo.
echo URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:3001
echo   API Docs: http://localhost:3001/api/docs
echo.
