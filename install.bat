@echo off
echo ============================================
echo Certificate Management System - Installer
echo ============================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is installed!
node --version
echo.

echo [2/4] Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [3/4] Installing frontend dependencies...
cd client
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies!
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed successfully!
echo.

echo [4/4] Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo .env file created! Please edit it with your configuration.
) else (
    echo .env file already exists!
)
echo.

echo ============================================
echo Installation Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Edit .env file with your configuration
echo 2. Make sure MongoDB is running
echo 3. Run: npm run dev
echo.
echo For detailed setup instructions, see SETUP_GUIDE.md
echo For quick start, see QUICKSTART.md
echo.
pause
