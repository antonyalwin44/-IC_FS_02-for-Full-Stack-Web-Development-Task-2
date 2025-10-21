# 🚀 Vercel Deployment Checklist

Follow these steps in order to deploy your Certificate Management System to Vercel.

## ✅ Pre-Deployment Checklist

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- [ ] Create a free cluster
- [ ] Create database user with password
- [ ] Get connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/certificate-management`)
- [ ] Whitelist all IPs (0.0.0.0/0) in Network Access

### 2. Email Configuration
- [ ] Gmail account with 2FA enabled
- [ ] App password generated (https://myaccount.google.com/apppasswords)
- [ ] App password saved (format: 16 characters)

### 3. GitHub Setup
- [ ] GitHub account created
- [ ] Git installed on your computer

---

## 📝 Step-by-Step Deployment

### Step 1: Initialize Git Repository

Open terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `certificate-management-system` (or your choice)
3. Keep it **Public** or **Private** (your choice)
4. **DO NOT** check "Initialize with README"
5. Click "Create repository"

### Step 3: Push to GitHub

Copy the commands from GitHub and run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values.

### Step 4: Deploy to Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up / Log in (use GitHub account for easy integration)

2. **Import Project**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select your `certificate-management-system` repository
   - Click "Import"

3. **Configure Build Settings**
   - Framework Preset: **Other**
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run vercel-build`
   - Output Directory: `client/build`
   - Install Command: `npm install`

4. **Add Environment Variables**

   Click "Environment Variables" and add these one by one:

   | Name | Value | Example |
   |------|-------|---------|
   | `NODE_ENV` | `production` | production |
   | `MONGODB_URI` | Your MongoDB Atlas connection string | mongodb+srv://user:pass@cluster.mongodb.net/certificate-management |
   | `JWT_SECRET` | Random 64-character string | Use: https://randomkeygen.com/ |
   | `EMAIL_HOST` | `smtp.gmail.com` | smtp.gmail.com |
   | `EMAIL_PORT` | `587` | 587 |
   | `EMAIL_USER` | Your Gmail address | your.email@gmail.com |
   | `EMAIL_PASSWORD` | Your Gmail app password | abcdefghijklmnop |
   | `PORT` | `5000` | 5000 |

   **Note**: Leave `CLIENT_URL` empty for now - we'll add it after deployment.

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes for deployment to complete
   - You'll see "Congratulations!" when done

### Step 5: Update CLIENT_URL

1. Copy your Vercel URL (e.g., `https://certificate-management-system.vercel.app`)
2. Go to your Vercel project → Settings → Environment Variables
3. Add new variable:
   - Name: `CLIENT_URL`
   - Value: Your Vercel URL (the one you just copied)
4. Go to Deployments tab
5. Click "..." on the latest deployment → "Redeploy"

### Step 6: Test Your Deployment

Visit your Vercel URL and test:

- [ ] Homepage loads
- [ ] Can register a new account
- [ ] Can login
- [ ] Admin can create templates
- [ ] Admin can issue certificates
- [ ] Email sending works
- [ ] Certificate download works
- [ ] Delete certificate works

---

## 🐛 Troubleshooting

### Deployment Failed?

**Check Build Logs:**
1. Go to Vercel dashboard
2. Click on your project
3. Click "Deployments"
4. Click on the failed deployment
5. Read the error message

**Common Issues:**

| Error | Solution |
|-------|----------|
| "Cannot find module" | Check all dependencies are in `package.json` |
| "MongoDB connection failed" | Verify MONGODB_URI and IP whitelist (0.0.0.0/0) |
| "Build command failed" | Run `npm run build` locally to test |
| "404 on API routes" | Check `vercel.json` configuration |

### MongoDB Connection Issues?

1. Go to MongoDB Atlas → Network Access
2. Ensure 0.0.0.0/0 is whitelisted
3. Check connection string format
4. Ensure password doesn't have special characters (or URL encode them)

### Email Not Working?

1. Verify EMAIL_USER and EMAIL_PASSWORD are correct
2. Check Gmail 2FA is enabled
3. Regenerate app password if needed
4. Check Vercel logs for email errors

---

## 🔄 Making Updates

After deployment, to update your live site:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your project
3. Deploy the new version
4. Update your live site

---

## 📊 Environment Variables Reference

Copy this template for your environment variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/certificate-management
JWT_SECRET=your_64_character_random_string_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
CLIENT_URL=https://your-app.vercel.app
PORT=5000
```

---

## ✨ Success Indicators

You'll know deployment is successful when:

- ✅ Vercel shows "Deployment Successful"
- ✅ Your app loads at the Vercel URL
- ✅ You can register and login
- ✅ Database operations work (create templates, certificates)
- ✅ Email sending works
- ✅ No errors in browser console
- ✅ No errors in Vercel logs

---

## 📞 Need Help?

1. **Check Vercel Logs**: Project → Deployments → Click deployment → View Function Logs
2. **Check Browser Console**: F12 → Console tab
3. **Review MongoDB Logs**: MongoDB Atlas → Clusters → Metrics
4. **Read Full Guide**: See `VERCEL_DEPLOYMENT_GUIDE.md`

---

## 🎉 You're Done!

Once all checkboxes are complete, your Certificate Management System is live on the internet!

**Share your URL**: `https://your-app.vercel.app`

---

**Time Estimate**: 20-30 minutes for first deployment
