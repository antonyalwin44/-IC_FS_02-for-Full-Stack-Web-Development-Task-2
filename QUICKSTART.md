# ⚡ Quick Start Guide - Certificate Management System

Get up and running in 5 minutes!

## 🎯 Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (v14+)
- ✅ MongoDB installed and running
- ✅ A Gmail account (for email functionality)

## 🚀 Installation (3 Steps)

### Step 1: Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 2: Configure Environment
```bash
# Copy environment template
copy .env.example .env
```

Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/certificate-management
JWT_SECRET=your_secret_key_change_this
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

**Get Gmail App Password:**
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Copy 16-character password to `.env`

### Step 3: Start the Application
```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000).

## 🎓 First Use (2 Minutes)

### 1. Create Admin Account
- Open: http://localhost:3000
- Click **"Register"**
- Fill in details:
  - Name: Your Name
  - Email: your@email.com
  - Password: (min 6 chars)
  - Account Type: **Administrator**
- Click **"Create Account"**

### 2. Create Your First Template
- Go to **Dashboard → Templates**
- Click **"Create Template"**
- Fill in:
  - Template Name: "Course Completion"
  - Certificate Title: "Certificate of Achievement"
  - Body Text: "This is to certify that"
  - Organization Name: "Your Organization"
  - Signatory Name: "Your Name"
  - Signatory Title: "Director"
- Click **"Create Template"**

### 3. Issue Your First Certificate
- Go to **Dashboard → Certificates**
- Click **"Issue Certificate"**
- Fill in:
  - Recipient Name: Test User
  - Recipient Email: test@example.com (or your email)
  - Template: Course Completion
  - Course Name: Web Development
- Click **"Issue Certificate"**

✅ **Done!** The certificate is generated and emailed automatically!

## 📥 Download Certificate

- Click the **Download** button next to any certificate
- PDF will be saved to your computer
- Check your email for the certificate attachment

## 🔍 What You Can Do

### As Admin:
- ✅ Create certificate templates
- ✅ Issue certificates to anyone
- ✅ View all certificates
- ✅ Download certificates
- ✅ View analytics and statistics
- ✅ Manage templates

### As User:
- ✅ View your certificates
- ✅ Download your certificates
- ✅ Search certificates
- ✅ Track email delivery status

## 🎨 Customization

### Change Certificate Colors
When creating a template, you can customize:
- Background Color (default: white)
- Text Color (default: black)
- Border Color (default: purple)

### Modify Email Template
Edit: `server/services/emailService.js`
Look for `getCertificateEmailTemplate()` function

### Change Certificate Layout
Edit: `server/services/pdfService.js`
Look for `generateCertificate()` function

## 🐛 Common Issues

### MongoDB Not Running
```bash
# Windows
net start MongoDB

# Mac/Linux
mongod
```

### Port Already in Use
Change `PORT` in `.env` to a different number (e.g., 5001)

### Email Not Sending
- Verify Gmail App Password is correct
- Check 2FA is enabled on Google account
- Ensure no spaces in password

### Can't Login After Registration
- Check MongoDB is running
- Check browser console for errors
- Clear browser cache and try again

## 📚 Next Steps

1. **Read Full Documentation:**
   - `README.md` - Overview and features
   - `SETUP_GUIDE.md` - Detailed setup instructions
   - `FEATURES.md` - Complete feature list
   - `API_DOCUMENTATION.md` - API reference

2. **Customize Your System:**
   - Add your organization logo
   - Customize certificate designs
   - Modify email templates
   - Add custom fields

3. **Deploy to Production:**
   - Set up production MongoDB
   - Configure production email service
   - Deploy backend to Heroku/DigitalOcean
   - Deploy frontend to Vercel/Netlify

## 💡 Pro Tips

1. **Test Email First:** Issue a certificate to your own email to test
2. **Create Multiple Templates:** Different templates for different occasions
3. **Use Strong Passwords:** Especially for admin accounts
4. **Backup Database:** Regularly backup your MongoDB data
5. **Monitor Email Delivery:** Check analytics for email success rate

## 🎉 Success Checklist

- [ ] Dependencies installed
- [ ] MongoDB running
- [ ] Environment variables configured
- [ ] Application started successfully
- [ ] Admin account created
- [ ] First template created
- [ ] First certificate issued
- [ ] Certificate downloaded
- [ ] Email received

**If all checked, you're ready to go!** 🚀

## 🆘 Need Help?

- Check console logs for error messages
- Review `SETUP_GUIDE.md` for detailed troubleshooting
- Ensure all prerequisites are met
- Verify environment variables are correct

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review error messages in console
3. Verify all steps were followed correctly

---

**Happy Certificate Managing!** 🎓✨

**Total Setup Time: ~5 minutes**
**First Certificate: ~2 minutes**
