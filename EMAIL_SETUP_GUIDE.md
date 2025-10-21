# Email Configuration Guide

## Problem
The certificates show "Pending" status because the email service is failing to authenticate with the SMTP server (Error 535: Authentication failed).

## Solution

### Option 1: Using Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env file** (located at `d:\certificate management system\.env`)
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_character_app_password
   ```

4. **Restart the server**
   - Stop the current server (Ctrl+C in terminal)
   - Run `npm run dev` again

### Option 2: Using Other Email Services

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

#### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASSWORD=your_app_password
```

#### Custom SMTP Server
```env
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
```

## New Feature: Resend Email Button

I've added a **Resend Email** button (✉️ icon) that appears next to certificates with "Pending" status. 

### How to Use:
1. Fix your email configuration (see above)
2. Restart the server
3. Go to the Certificates tab in Admin Dashboard
4. Click the mail icon (✉️) next to any certificate with "Pending" status
5. The email will be sent and status will update to "Sent"

## Testing Email Configuration

After updating your `.env` file:

1. Restart the server
2. Create a new test certificate
3. Check if the email is sent successfully
4. If it still fails, check the server logs for specific error messages

## Common Issues

### Error 535: Authentication Failed
- **Cause**: Wrong credentials or 2FA not configured
- **Solution**: Use App Password for Gmail or check credentials

### Error 534: Username and Password not accepted
- **Cause**: Less secure app access disabled
- **Solution**: Enable 2FA and use App Password

### Connection Timeout
- **Cause**: Firewall or wrong port
- **Solution**: Check firewall settings and use port 587

### SSL/TLS Errors
- **Cause**: Wrong security settings
- **Solution**: Use port 587 with `secure: false` (already configured)

## API Endpoint

The new resend email endpoint:
```
POST /api/certificates/:id/resend-email
```

This endpoint:
- Requires admin authentication
- Sends the certificate email to the recipient
- Updates the certificate's `emailSent` status
- Returns success/error message

## Code Changes Made

1. **Backend**: Added `/api/certificates/:id/resend-email` endpoint in `server/routes/certificates.js`
2. **Frontend**: Added `resendEmail` method in `client/src/services/api.js`
3. **UI**: Added resend button in `client/src/pages/AdminDashboard.js`

## Next Steps

1. Update your `.env` file with correct email credentials
2. Restart the server
3. Test by creating a new certificate or using the resend button
4. Monitor server logs for any errors
