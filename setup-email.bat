@echo off
echo ==================================
echo Email Configuration Setup
echo ==================================
echo.

REM Check if .env exists, if not create from example
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy ".env.example" ".env"
)

echo.
echo Please enter your Gmail address:
set /p EMAIL_USER=

REM Remove the .env file and recreate with proper settings
echo.
echo Updating .env file...

(
echo # Server Configuration
echo PORT=5000
echo NODE_ENV=development
echo.
echo # MongoDB Configuration
echo MONGODB_URI=mongodb://localhost:27017/certificate-management
echo.
echo # JWT Secret
echo JWT_SECRET=your_jwt_secret_key_here_change_in_production
echo.
echo # Email Configuration (Nodemailer^)
echo EMAIL_HOST=smtp.gmail.com
echo EMAIL_PORT=587
echo EMAIL_USER=%EMAIL_USER%
echo EMAIL_PASSWORD=pjzxckyopueyuwei
echo.
echo # Frontend URL
echo CLIENT_URL=http://localhost:3000
) > .env

echo.
echo ✓ Email configuration updated successfully!
echo.
echo Configuration:
echo   EMAIL_HOST: smtp.gmail.com
echo   EMAIL_PORT: 587
echo   EMAIL_USER: %EMAIL_USER%
echo   EMAIL_PASSWORD: ****************
echo.
echo Next steps:
echo 1. Stop your server (Ctrl+C)
echo 2. Run: npm run dev
echo 3. Look for: "Email service is ready to send emails"
echo.
pause
