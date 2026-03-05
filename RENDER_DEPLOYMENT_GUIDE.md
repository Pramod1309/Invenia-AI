# 🚀 Render Deployment Guide - Full Stack Invenia AI

## 📋 Prerequisites

1. **GitHub Repository** - Push your code to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Node.js Knowledge** - Basic understanding of Node.js/Express

---

## 🗂️ Project Structure Overview

```
Invenia-App/
├── backend/                 # Node.js/Express API
│   ├── src/
│   ├── package.json
│   └── .env.example
├── frontend/               # Expo React Native
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── app.json
├── render.yaml            # Render configuration
└── README.md
```

---

## ⚙️ Configuration Files Created

### 1. `render.yaml` - Main Render Configuration
- ✅ Backend service configuration
- ✅ Frontend static site configuration
- ✅ Environment variables setup
- ✅ Health checks enabled

### 2. Backend Updates
- ✅ CORS configuration for production
- ✅ Persistent database storage for Render
- ✅ Health check endpoint (`/api/health`)
- ✅ Environment variables template

### 3. Frontend Updates
- ✅ Web build script added
- ✅ Environment variable support
- ✅ Production API URL configuration

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for Render deployment"

# Create GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/invenia-app.git
git push -u origin main
```

### Step 2: Deploy Backend on Render

1. **Login to Render Dashboard**
   - Go to [render.com](https://render.com)
   - Click "Sign up" or "Login"

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `invenia-app` repository

3. **Configure Backend Service**
   ```
   Name: invenia-backend
   Environment: Node
   Root Directory: backend
   Build Command: npm install --production
   Start Command: npm start
   Instance Type: Free
   Region: Oregon (or choose nearest)
   ```

4. **Add Environment Variables**
   ```
   NODE_ENV: production
   PORT: 5000
   HOST: 0.0.0.0
   JWT_SECRET: [generate-random-string]
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)

### Step 3: Deploy Frontend on Render

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect the same GitHub repository

2. **Configure Frontend Service**
   ```
   Name: invenia-frontend
   Environment: Static
   Root Directory: frontend
   Build Command: npm install && npm run build:web
   Publish Directory: dist
   Instance Type: Free
   Region: Same as backend
   ```

3. **Add Environment Variables**
   ```
   NODE_ENV: production
   EXPO_PUBLIC_API_URL: https://invenia-backend.onrender.com/api
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment (2-3 minutes)

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings

After your backend is deployed, get the frontend URL and update the CORS configuration:

```javascript
// In backend/src/app.js
const allowedOrigins = [
  'http://localhost:19006',
  'http://localhost:3000',
  'https://invenia-frontend.onrender.com', // Your actual frontend URL
  'exp://172.31.28.27:8081',
];
```

### 2. Test the Deployment

1. **Backend Health Check**
   ```bash
   curl https://invenia-backend.onrender.com/api/health
   ```
   Should return: `{"status":"ok","message":"Invenia AI Backend is running"}`

2. **Frontend Access**
   - Open `https://invenia-frontend.onrender.com`
   - Test all features work properly

3. **API Integration**
   - Test user registration/login
   - Test job creation/management
   - Verify mobile responsiveness

---

## 🌐 Your Live URLs

After successful deployment:

- **Backend API**: `https://invenia-backend.onrender.com`
- **Frontend Web App**: `https://invenia-frontend.onrender.com`
- **API Documentation**: `https://invenia-backend.onrender.com/api/health`

---

## 📱 Mobile App Access

### Option 1: Web App (Recommended)
- Share the frontend URL
- Works on any mobile browser
- No app store approval needed

### Option 2: Expo Development
```bash
cd frontend
expo start
# Scan QR code with Expo Go app
```

---

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check frontend URL in CORS configuration
   - Ensure `EXPO_PUBLIC_API_URL` is correct

2. **Database Issues**
   - Render uses persistent storage automatically
   - Database initializes on first deployment

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies in package.json

4. **Environment Variables**
   - Ensure JWT_SECRET is set
   - Verify API URLs are correct

### Debug Commands

```bash
# Check backend logs
# In Render Dashboard → Backend Service → Logs

# Check frontend build
# In Render Dashboard → Frontend Service → Logs

# Test API endpoints
curl https://invenia-backend.onrender.com/api/health
```

---

## 🔄 Continuous Deployment

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update features"
git push origin main
# Render will automatically redeploy both services
```

---

## 💰 Cost Breakdown

**Free Tier (Current Setup):**
- Backend: Free (750 hours/month)
- Frontend: Free (Static hosting)
- Database: Free (SQLite file-based)
- **Total Cost: $0/month**

**Paid Tier (If needed):**
- Backend: $7/month (Standard)
- Frontend: Free (Static hosting)
- **Total Cost: $7/month**

---

## 🎯 Next Steps

1. **Custom Domain** (Optional)
   - Add custom domain in Render dashboard
   - Update CORS settings accordingly

2. **SSL Certificate** (Automatic)
   - Render provides free SSL certificates
   - All URLs are HTTPS by default

3. **Monitoring** (Optional)
   - Set up Render monitoring alerts
   - Monitor API performance

4. **Scaling** (When needed)
   - Upgrade to Standard plan for better performance
   - Add Redis for session storage

---

## 📞 Support

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **GitHub Issues**: Create issues in your repository

---

## 🎉 Congratulations!

Your Invenia AI full-stack application is now live on Render! 🚀

**What you now have:**
- ✅ Live backend API
- ✅ Live frontend web app
- ✅ Mobile-responsive design
- ✅ Persistent data storage
- ✅ Automatic deployments
- ✅ Free SSL certificates
- ✅ Custom domain support

**Share your live app with users:**
`https://invenia-frontend.onrender.com`

---

*Last updated: March 2026*
