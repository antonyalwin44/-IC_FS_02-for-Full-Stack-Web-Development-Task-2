# 📧 Email Configuration Guide

## Problem: "Failed to send email" Error

This error occurs when the email service is not properly configured in your `.env` file.

## Solution: Configure Gmail SMTP

### Step 1: Enable 2-Factor Authentication on Gmail

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)** → Enter "Certificate System"
4. Click **Generate**
5. Copy the 16-character password (remove spaces)

### Step 3: Update Your .env File

Open your `.env` file and update these values:

```env
# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
```

**Example:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 4: Restart the Server

After updating the `.env` file, restart your server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## Verification

When the server starts, you should see:
```
✅ Email service is ready to send emails
```

If you see an error:
```
❌ Email transporter verification failed
```

Double-check your:
- Gmail address is correct
- App password is correct (16 characters)
- 2FA is enabled on your Google account

## Alternative: Using Other Email Services

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASSWORD=your_app_password
```

### Custom SMTP Server
```env
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=your_email@yourdomain.com
EMAIL_PASSWORD=your_password
```

## Testing Email Functionality

1. Login as admin
2. Create a certificate for a test user
3. Check the server console for email status
4. Check the recipient's inbox (including spam folder)

## Common Issues

### Issue 1: "Invalid login" error
- **Solution**: Make sure you're using an App Password, not your regular Gmail password

### Issue 2: "Connection timeout"
- **Solution**: Check your firewall settings, ensure port 587 is not blocked

### Issue 3: Email goes to spam
- **Solution**: This is normal for development. In production, configure SPF/DKIM records

### Issue 4: "Less secure app access"
- **Solution**: Gmail no longer supports this. You MUST use App Passwords with 2FA

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to version control
- Keep your App Password secure
- Rotate passwords regularly
- Use environment variables in production

## Need Help?

If you're still having issues:
1. Check the server console logs for detailed error messages
2. Verify your Gmail settings
3. Try generating a new App Password
4. Test with a different email service

---

**Quick Checklist:**
- [ ] 2FA enabled on Gmail
- [ ] App Password generated
- [ ] `.env` file updated with correct credentials
- [ ] Server restarted
- [ ] Console shows "Email service is ready"
