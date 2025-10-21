# Email Configuration Update Script
# This script will help you update your .env file with email credentials

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Email Configuration Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Get the .env file path
$envFile = Join-Path $PSScriptRoot ".env"

# Check if .env exists
if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item (Join-Path $PSScriptRoot ".env.example") $envFile
}

# Read current .env content
$envContent = Get-Content $envFile -Raw

# Prompt for email
Write-Host "Enter your Gmail address: " -NoNewline -ForegroundColor Green
$emailUser = Read-Host

# Use the provided app password
$appPassword = "pjzx ckyo puey uwei"
$appPasswordClean = $appPassword -replace '\s', ''

Write-Host ""
Write-Host "Updating .env file..." -ForegroundColor Yellow

# Update EMAIL_USER
if ($envContent -match 'EMAIL_USER=.*') {
    $envContent = $envContent -replace 'EMAIL_USER=.*', "EMAIL_USER=$emailUser"
} else {
    $envContent += "`nEMAIL_USER=$emailUser"
}

# Update EMAIL_PASSWORD
if ($envContent -match 'EMAIL_PASSWORD=.*') {
    $envContent = $envContent -replace 'EMAIL_PASSWORD=.*', "EMAIL_PASSWORD=$appPasswordClean"
} else {
    $envContent += "`nEMAIL_PASSWORD=$appPasswordClean"
}

# Update EMAIL_HOST
if ($envContent -match 'EMAIL_HOST=.*') {
    $envContent = $envContent -replace 'EMAIL_HOST=.*', 'EMAIL_HOST=smtp.gmail.com'
} else {
    $envContent += "`nEMAIL_HOST=smtp.gmail.com"
}

# Update EMAIL_PORT
if ($envContent -match 'EMAIL_PORT=.*') {
    $envContent = $envContent -replace 'EMAIL_PORT=.*', 'EMAIL_PORT=587'
} else {
    $envContent += "`nEMAIL_PORT=587"
}

# Save the updated content
Set-Content -Path $envFile -Value $envContent

Write-Host ""
Write-Host "✅ Email configuration updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  EMAIL_HOST: smtp.gmail.com" -ForegroundColor White
Write-Host "  EMAIL_PORT: 587" -ForegroundColor White
Write-Host "  EMAIL_USER: $emailUser" -ForegroundColor White
Write-Host "  EMAIL_PASSWORD: ****************" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Stop your server (Ctrl+C)" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Look for: '✅ Email service is ready to send emails'" -ForegroundColor White
Write-Host ""
