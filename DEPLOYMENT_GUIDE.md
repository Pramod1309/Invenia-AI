# 🚀 Deployment Guide - Live Demo Setup

## Option 1: Vercel + Railway (Recommended)

### Step 1: Frontend Deployment (Vercel)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy Frontend**
```bash
cd frontend
vercel --prod
```

4. **Configure vercel.json** (create this file in frontend folder)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Step 2: Backend Deployment (Railway)

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Railway Project**
```bash
cd backend
railway init
```

4. **Deploy Backend**
```bash
railway up
```

5. **Set Environment Variables**
```bash
railway variables set JWT_SECRET=your-super-secret-jwt-key-here
railway variables set NODE_ENV=production
```

### Step 3: Update Frontend API URL

Update `frontend/constants/api.ts`:
```typescript
const API_BASE_URL = __DEV__ 
  ? (Platform.OS === 'web' ? 'http://localhost:5000/api' : getLocalIP())
  : 'https://your-backend-url.railway.app/api'; // Replace with your Railway URL
```

---

## Option 2: Netlify + Render (Alternative)

### Frontend (Netlify)
1. Push code to GitHub
2. Connect Netlify to GitHub repository
3. Deploy automatically

### Backend (Render)
1. Push code to GitHub
2. Connect Render to GitHub repository
3. Deploy automatically

---

## Option 3: Glitch (Easiest for Quick Demo)

### Backend on Glitch
1. Go to [glitch.com](https://glitch.com)
2. Click "New Project" → "Import from GitHub"
3. Enter your backend repository URL
4. Glitch will deploy automatically

### Frontend on Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your frontend build folder
3. Get instant live URL

---

## Option 4: Replit (All-in-One Solution)

### Complete App on Replit
1. Go to [replit.com](https://replit.com)
2. Create new Replit with Node.js template
3. Upload both frontend and backend folders
4. Configure Replit to run both servers
5. Get instant shareable link

---

## 🎯 **Quick Start - Choose This Option**

### **Fastest Way (15 minutes):**

1. **Backend on Railway** (5 minutes)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
cd backend
railway login
railway init
railway up
```

2. **Frontend on Vercel** (5 minutes)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

3. **Update API URL** (5 minutes)
- Get your Railway URL from Railway dashboard
- Update `frontend/constants/api.ts`
- Redeploy frontend

---

## 📱 **Mobile Testing**

### **Expo Go App Testing**
1. Install Expo Go on mobile devices
2. Share your Expo development URL
3. Users can scan QR code and test

### **Web Testing**
- Share your Vercel/Netlify URL
- Anyone can access from any browser
- Works on desktop and mobile browsers

---

## 🔧 **Production Checklist**

### **Backend Preparation**
- [ ] Set production JWT_SECRET
- [ ] Enable CORS for your frontend domain
- [ ] Add error handling for production
- [ ] Set up proper logging

### **Frontend Preparation**
- [ ] Update API URLs to production
- [ ] Remove development console logs
- [ ] Optimize bundle size
- [ ] Test on mobile devices

---

## 🌐 **What You'll Get**

### **Live URLs**
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **Mobile**: Works on any device browser

### **User Access**
- Share single link for frontend
- No installation required
- Works on desktop, tablet, mobile
- Real-time multi-user testing

---

## 🎉 **Next Steps**

1. **Choose your deployment option** (I recommend Option 1)
2. **Deploy backend first** (Railway)
3. **Deploy frontend** (Vercel)
4. **Test the live app**
5. **Share the link with users**

**🚀 Your app will be live and shareable within 30 minutes!**
