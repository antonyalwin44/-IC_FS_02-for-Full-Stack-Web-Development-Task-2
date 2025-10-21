# 🚀 Vercel Deployment Guide

## Overview

This guide will help you deploy the Certificate Management System to Vercel. Since this is a full-stack application with both frontend (React) and backend (Node.js/Express), we'll deploy them separately.

## Architecture

- **Frontend**: Deployed on Vercel (React app)
- **Backend**: Deployed on Vercel as Serverless Functions
- **Database**: MongoDB Atlas (cloud database)

---

## Prerequisites

Before you begin:
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] GitHub account (to connect your repository)
- [ ] MongoDB Atlas account (for cloud database)

---

## Step 1: Prepare MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (free tier is sufficient)

### 1.2 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Replace `<password>` with your actual password
5. Add database name: `mongodb+srv://username:password@cluster.mongodb.net/certificate-management`

### 1.3 Whitelist IP Addresses
1. Go to Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

---

## Step 2: Prepare Your Code for Vercel

### 2.1 Create Vercel Configuration

Create `vercel.json` in the root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/build/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2.2 Update package.json

Add build script for Vercel:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "nodemon server/index.js",
    "client": "cd client && npm start",
    "build": "cd client && npm run build",
    "install-all": "npm install && cd client && npm install",
    "vercel-build": "npm install && cd client && npm install && npm run build"
  }
}
```

### 2.3 Update Server for Serverless

The server needs to be compatible with Vercel's serverless functions. Update `server/index.js`:

```javascript
// Add at the end of server/index.js
module.exports = app;
```

---

## Step 3: Push to GitHub

### 3.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Prepare for Vercel deployment"
```

### 3.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository
3. Don't initialize with README (we already have code)

### 3.3 Push Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Vercel

### 4.1 Import Project
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select the repository you just created

### 4.2 Configure Project
- **Framework Preset**: Other
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `client/build`

### 4.3 Add Environment Variables

Click "Environment Variables" and add:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
CLIENT_URL=https://your-app-name.vercel.app
PORT=5000
```

**Important**: 
- Use your MongoDB Atlas connection string
- Generate a strong JWT secret (random 64-character string)
- Use your Gmail app password
- CLIENT_URL will be your Vercel domain (you'll update this after first deploy)

### 4.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete (2-5 minutes)
3. You'll get a URL like: `https://your-app-name.vercel.app`

---

## Step 5: Update Environment Variables

After first deployment:

1. Go to your Vercel project settings
2. Update `CLIENT_URL` with your actual Vercel URL
3. Redeploy (Vercel → Deployments → Click "..." → Redeploy)

---

## Alternative: Deploy Backend Separately

If you face issues with the combined deployment, deploy separately:

### Option A: Backend on Render.com

1. Go to https://render.com
2. Create new "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Environment Variables**: Add all from above
5. Deploy

### Option B: Backend on Railway.app

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select repository
4. Add environment variables
5. Deploy

Then update frontend's API calls to point to your backend URL.

---

## Step 6: Update Frontend API URL

If backend is deployed separately, update `client/src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.com/api';
```

Add to Vercel environment variables:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## Step 7: Test Your Deployment

1. Visit your Vercel URL
2. Register a new admin account
3. Create a template
4. Issue a certificate
5. Test email sending
6. Test certificate download

---

## Troubleshooting

### Issue: "Cannot find module"
**Solution**: Make sure all dependencies are in `package.json`, not just `devDependencies`

### Issue: MongoDB connection fails
**Solution**: 
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Verify connection string is correct
- Ensure password doesn't contain special characters (or URL encode them)

### Issue: Email not sending
**Solution**:
- Verify EMAIL_USER and EMAIL_PASSWORD are set
- Check Gmail app password is correct
- Ensure 2FA is enabled on Gmail

### Issue: 404 on API routes
**Solution**:
- Check `vercel.json` routes configuration
- Ensure server/index.js exports the app
- Verify API routes start with `/api`

### Issue: Build fails
**Solution**:
- Run `npm run build` locally first
- Check build logs in Vercel dashboard
- Ensure all dependencies are installed

---

## Environment Variables Checklist

Make sure these are set in Vercel:

- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` (MongoDB Atlas connection string)
- [ ] `JWT_SECRET` (strong random string)
- [ ] `EMAIL_HOST=smtp.gmail.com`
- [ ] `EMAIL_PORT=587`
- [ ] `EMAIL_USER` (your Gmail)
- [ ] `EMAIL_PASSWORD` (Gmail app password)
- [ ] `CLIENT_URL` (your Vercel URL)
- [ ] `PORT=5000`

---

## Custom Domain (Optional)

To add a custom domain:

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as instructed
5. Wait for SSL certificate (automatic)

---

## Continuous Deployment

Once set up, every push to your main branch will:
1. Automatically trigger a new deployment
2. Build and deploy your app
3. Update your live site

To deploy:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

## Cost Estimate

- **Vercel**: Free tier (sufficient for most projects)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0/month for hobby projects

Upgrade if you need:
- More traffic (Vercel Pro: $20/month)
- More storage (MongoDB: starts at $9/month)

---

## Security Checklist

Before going live:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Enable MongoDB IP whitelist
- [ ] Use environment variables (never commit secrets)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set secure CORS policy
- [ ] Rate limit API endpoints
- [ ] Validate all user inputs

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Review MongoDB Atlas logs
4. Test API endpoints with Postman
5. Check this guide's troubleshooting section

---

## Quick Deploy Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Connection string obtained
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] CLIENT_URL updated
- [ ] App tested and working

---

**You're ready to deploy! Follow the steps above and your Certificate Management System will be live on the internet! 🚀**
