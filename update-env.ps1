# Script to update .env file with email configuration
Write-Host "=== Email Configuration Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ".env file created!" -ForegroundColor Green
}

Write-Host "Current .env email configuration:" -ForegroundColor Yellow
Get-Content ".env" | Select-String "EMAIL_"
Write-Host ""

# Get email address
Write-Host "Enter your Gmail address (e.g., yourname@gmail.com):" -ForegroundColor Cyan
$emailUser = Read-Host

# Get app password
Write-Host ""
Write-Host "Enter your Gmail App Password (16 characters, no spaces):" -ForegroundColor Cyan
Write-Host "Example: abcdefghijklmnop" -ForegroundColor Gray
$emailPassword = Read-Host -AsSecureString
$emailPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($emailPassword))

# Remove spaces from password
$emailPasswordPlain = $emailPasswordPlain -replace '\s', ''

# Validate inputs
if ([string]::IsNullOrWhiteSpace($emailUser) -or [string]::IsNullOrWhiteSpace($emailPasswordPlain)) {
    Write-Host ""
    Write-Host "Error: Email or password cannot be empty!" -ForegroundColor Red
    exit 1
}

if ($emailPasswordPlain.Length -ne 16) {
    Write-Host ""
    Write-Host "Warning: App password should be 16 characters. You entered $($emailPasswordPlain.Length) characters." -ForegroundColor Yellow
    Write-Host "Continue anyway? (y/n)" -ForegroundColor Yellow
    $continue = Read-Host
    if ($continue -ne 'y') {
        Write-Host "Cancelled." -ForegroundColor Red
        exit 1
    }
}

# Update .env file
Write-Host ""
Write-Host "Updating .env file..." -ForegroundColor Yellow

$envContent = Get-Content ".env"
$envContent = $envContent -replace 'EMAIL_USER=.*', "EMAIL_USER=$emailUser"
$envContent = $envContent -replace 'EMAIL_PASSWORD=.*', "EMAIL_PASSWORD=$emailPasswordPlain"
$envContent | Set-Content ".env"

Write-Host ""
Write-Host "✅ Email configuration updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Updated configuration:" -ForegroundColor Cyan
Get-Content ".env" | Select-String "EMAIL_USER"
Write-Host "EMAIL_PASSWORD=****************" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  IMPORTANT: Restart your server for changes to take effect!" -ForegroundColor Yellow
Write-Host "   Press Ctrl+C in the server terminal, then run: npm run dev" -ForegroundColor Gray
Write-Host ""
