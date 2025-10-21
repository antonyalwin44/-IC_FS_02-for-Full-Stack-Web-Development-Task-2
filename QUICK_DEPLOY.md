# ⚡ Quick Deploy to Vercel - 5 Minutes

## 🎯 What You Need

1. **MongoDB Atlas** account (free) - https://mongodb.com/cloud/atlas
2. **GitHub** account (free) - https://github.com
3. **Vercel** account (free) - https://vercel.com
4. **Gmail** with app password

---

## 🚀 Deploy in 5 Steps

### 1️⃣ Setup MongoDB (2 minutes)

```
1. Go to mongodb.com/cloud/atlas
2. Sign up → Create FREE cluster
3. Create database user (save password!)
4. Network Access → Add IP → "Allow from Anywhere" (0.0.0.0/0)
5. Connect → Get connection string
   Example: mongodb+srv://user:pass@cluster.mongodb.net/certificate-management
```

### 2️⃣ Push to GitHub (1 minute)

```bash
# In your project folder:
git init
git add .
git commit -m "Deploy to Vercel"

# Create repo at github.com/new, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 3️⃣ Deploy to Vercel (1 minute)

```
1. Go to vercel.com → Sign up with GitHub
2. "Add New Project" → Import your repository
3. Framework: Other
4. Build Command: npm run vercel-build
5. Output Directory: client/build
```

### 4️⃣ Add Environment Variables (1 minute)

In Vercel, add these variables:

```
NODE_ENV=production
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<random_64_char_string>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your_email@gmail.com>
EMAIL_PASSWORD=<your_gmail_app_password>
PORT=5000
```

Get JWT Secret: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")

### 5️⃣ Deploy & Update URL (30 seconds)

```
1. Click "Deploy" → Wait 2-3 minutes
2. Copy your Vercel URL (e.g., https://your-app.vercel.app)
3. Settings → Environment Variables → Add:
   CLIENT_URL=<your_vercel_url>
4. Deployments → "..." → Redeploy
```

---

## ✅ Done!

Your app is now live at: `https://your-app.vercel.app`

Test it:
- Register account ✓
- Create template ✓
- Issue certificate ✓
- Send email ✓

---

## 🆘 Quick Fixes

**Build Failed?**
- Check Vercel logs
- Verify all environment variables are set

**MongoDB Error?**
- Check connection string
- Verify IP whitelist (0.0.0.0/0)

**Email Not Working?**
- Use Gmail app password (not regular password)
- Enable 2FA on Gmail first

---

## 📚 Detailed Guides

- Full guide: `VERCEL_DEPLOYMENT_GUIDE.md`
- Step-by-step: `DEPLOYMENT_CHECKLIST.md`

---

**Total Time**: ~5 minutes
**Cost**: $0 (all free tiers)
