# 🚀 Certificate Management System - Setup Guide

This guide will help you set up and run the Certificate Management System on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)

## 🔧 Installation Steps

### Step 1: Install Dependencies

Open your terminal in the project root directory and run:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 2: Set Up MongoDB

1. **Start MongoDB Service:**

   **Windows:**
   ```bash
   # MongoDB should start automatically as a service
   # Or manually start it:
   net start MongoDB
   ```

   **Mac/Linux:**
   ```bash
   # Start MongoDB
   mongod
   ```

2. **Verify MongoDB is running:**
   - Open a new terminal and type: `mongo` or `mongosh`
   - You should see the MongoDB shell

### Step 3: Configure Environment Variables

1. **Create a `.env` file** in the root directory:
   ```bash
   copy .env.example .env
   ```

2. **Edit the `.env` file** with your configuration:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/certificate-management

   # JWT Secret (Change this to a random string)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

   # Email Configuration (Gmail Example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_specific_password

   # Frontend URL
   CLIENT_URL=http://localhost:3000
   ```

### Step 4: Set Up Email Service (Gmail)

To enable email delivery, you need to configure Gmail:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/security
   - Click on "2-Step Verification"
   - Scroll down to "App passwords"
   - Select "Mail" and "Windows Computer" (or your OS)
   - Copy the generated 16-character password
   - Paste it in your `.env` file as `EMAIL_PASSWORD`

**Alternative Email Services:**
- **SendGrid**: Sign up at https://sendgrid.com/ and use their SMTP credentials
- **Mailgun**: Sign up at https://www.mailgun.com/ and use their SMTP credentials

### Step 5: Run the Application

You have two options:

**Option 1: Run Both (Recommended)**
```bash
npm run dev
```
This will start both the backend server (port 5000) and frontend (port 3000).

**Option 2: Run Separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### Step 6: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/health

## 👤 Creating Your First Account

1. Click on **"Register"** in the navbar
2. Fill in your details:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Account Type: Select **"Administrator"** for admin access
3. Click **"Create Account"**
4. You'll be automatically logged in and redirected to the dashboard

## 🎯 Using the System

### As an Administrator:

1. **Create a Certificate Template:**
   - Go to Dashboard → Templates tab
   - Click "Create Template"
   - Fill in template details (title, body text, organization name, etc.)
   - Click "Create Template"

2. **Issue a Certificate:**
   - Go to Dashboard → Certificates tab
   - Click "Issue Certificate"
   - Fill in recipient details:
     - Recipient Name
     - Recipient Email
     - Select Template
     - Course/Achievement Name (optional)
   - Click "Issue Certificate"
   - The certificate will be generated and emailed automatically!

3. **View Analytics:**
   - Go to Dashboard → Overview tab
   - View statistics and trends

### As a User:

1. **View Your Certificates:**
   - After logging in, you'll see all certificates issued to you
   - Use the search bar to find specific certificates

2. **Download Certificates:**
   - Click the "Download PDF" button on any certificate
   - The PDF will be downloaded to your computer

## 🔍 Testing the System

### Test Email Delivery:

1. Create a test template
2. Issue a certificate to your own email
3. Check your inbox for the certificate email
4. Download the PDF attachment

### Test Certificate Generation:

1. Issue a certificate
2. Download it from the dashboard
3. Verify the PDF contains correct information

## ⚠️ Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running: `net start MongoDB` (Windows) or `mongod` (Mac/Linux)
- Check if the connection string in `.env` is correct
- Try: `mongodb://127.0.0.1:27017/certificate-management`

### Email Not Sending

**Error:** Email delivery fails

**Solutions:**
1. Verify Gmail App Password is correct (16 characters, no spaces)
2. Check if 2FA is enabled on your Google account
3. Ensure EMAIL_USER and EMAIL_PASSWORD are set in `.env`
4. Try using a different email service (SendGrid, Mailgun)

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
- Change the PORT in `.env` to a different number (e.g., 5001)
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

### React App Not Starting

**Error:** Various npm errors

**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm start
```

### PDF Generation Error

**Error:** PDF files not being created

**Solution:**
- Ensure the `certificates` folder has write permissions
- Check server logs for specific errors
- Verify PDFKit is installed: `npm list pdfkit`

## 📦 Building for Production

### Backend:

1. Set `NODE_ENV=production` in `.env`
2. Update `MONGODB_URI` to your production database
3. Change `JWT_SECRET` to a strong random string
4. Deploy to a service like Heroku, DigitalOcean, or AWS

### Frontend:

```bash
cd client
npm run build
```

The build folder will contain optimized production files.

## 🔐 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use strong JWT_SECRET** (at least 32 characters)
3. **Enable HTTPS** in production
4. **Use environment-specific configurations**
5. **Regularly update dependencies**: `npm audit fix`
6. **Implement rate limiting** for API endpoints
7. **Use secure email service** with proper authentication

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Nodemailer Documentation](https://nodemailer.com/)

## 🆘 Getting Help

If you encounter issues:

1. Check the console logs for error messages
2. Review this troubleshooting guide
3. Ensure all dependencies are installed correctly
4. Verify environment variables are set properly
5. Check MongoDB is running and accessible

## 🎉 Success!

If you can:
- ✅ Register and login
- ✅ Create templates
- ✅ Issue certificates
- ✅ Receive emails
- ✅ Download PDFs

**Congratulations! Your Certificate Management System is fully operational!** 🚀

---

**Happy Certificate Managing!** 🎓
