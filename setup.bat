@echo off
REM 🚀 QUICK START SCRIPT - The Lev Labs Fabric App (Windows)
REM This script helps you quickly configure and start the app

echo.
echo ================================================
echo   🎯 The Lev Labs - Quick Start Setup
echo ================================================
echo.

REM Check Node.js
echo ✓ Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ✗ Node.js is not installed. Please install Node.js 16+
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% found
echo.

REM Install dependencies
echo ✓ Installing dependencies...
if not exist "node_modules" (
    call npm install --silent
    echo ✓ Dependencies installed
) else (
    echo ✓ Dependencies already installed
)
echo.

REM Create .env.local
echo ✓ Checking environment configuration...
if not exist ".env.local" (
    echo.
    echo Please enter your backend API URL:
    echo (Example: https://api.example.com)
    set /p api_url="API URL (Press Enter for default): "
    
    if "!api_url!"=="" (
        set api_url=https://apperal-clothing-app-production.up.railway.app
        echo Using default API: !api_url!
    )
    
    REM Create .env.local
    (
        echo # Backend API Configuration
        echo VITE_API_URL=!api_url!
        echo VITE_API_TIMEOUT=30000
        echo.
        echo # App Configuration
        echo VITE_APP_NAME=The Lev Labs
        echo VITE_ENABLE_DEBUG=false
    ) > .env.local
    
    echo ✓ Configuration file created ^(.env.local^)
) else (
    echo ✓ Configuration file exists ^(.env.local^)
    echo.
    echo Current API URL:
    find "VITE_API_URL" .env.local
)
echo.

REM Ready to start
echo ================================================
echo ✅ Setup Complete!
echo ================================================
echo.
echo To start the development server, run:
echo.
echo   npm run dev
echo.
echo Then open your browser to:
echo   http://localhost:5173
echo.
echo ================================================
echo 📚 For more information, see:
echo   - SETUP_GUIDE.md
echo   - README_UPDATED.md
echo   - IMPLEMENTATION_REPORT.md
echo ================================================
echo.
pause
