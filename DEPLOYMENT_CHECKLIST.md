# Deployment Checklist - Campus Outcomes MVP

## PRE-DEPLOYMENT (Verify all files exist)
- [ ] backend/ folder with all modules
- [ ] frontend/ folder with HTML, CSS, JS
- [ ] package.json with all dependencies
- [ ] .env.example file
- [ ] README.md, SETUP_GUIDE.md
- [ ] All documentation files

## STEP 1: MongoDB Atlas Setup (5 min)
- [ ] Create MongoDB Atlas account at mongodb.com/cloud/atlas
- [ ] Create free cluster (Shared tier)
- [ ] Create database user (username: admin, save password)
- [ ] Get connection string
- [ ] Add /campus-outcomes to database name
- [ ] Connection string format: mongodb+srv://admin:PASSWORD@cluster.mongodb.net/campus-outcomes?retryWrites=true&w=majority

## STEP 2: Render Backend Deployment (12 min)
- [ ] Create Render account at render.com (Sign with GitHub)
- [ ] Select campus-outcomes-mvp repository
- [ ] Create Web Service with:
  - [ ] Name: campus-outcomes-backend
  - [ ] Environment: Node
  - [ ] Build: npm install
  - [ ] Start: npm start
  - [ ] Plan: Free
- [ ] Set Environment Variables:
  - [ ] PORT=5000
  - [ ] NODE_ENV=production
  - [ ] MONGO_URI=[Your MongoDB connection string]
  - [ ] JWT_SECRET=your-super-secret-key-12345
- [ ] Deploy Web Service
- [ ] Wait 10-15 minutes for deployment
- [ ] **SAVE Backend URL**: https://campus-outcomes-backend.onrender.com
- [ ] Test health endpoint: /api/health should return success

## STEP 3: Update Frontend API URL (2 min)
- [ ] Go to GitHub: frontend/js/api.js
- [ ] Click edit (pencil icon)
- [ ] Find: const API_BASE_URL = 'http://localhost:5000/api';
- [ ] Replace with: const API_BASE_URL = 'https://campus-outcomes-backend.onrender.com/api';
- [ ] Commit changes
- [ ] Wait for changes to sync

## STEP 4: Vercel Frontend Deployment (8 min)
- [ ] Create Vercel account at vercel.com (Sign with GitHub)
- [ ] Click Import Project
- [ ] Select campus-outcomes-mvp repository
- [ ] Configuration:
  - [ ] Root Directory: frontend
  - [ ] Framework: HTML
- [ ] Deploy
- [ ] Wait 2-3 minutes
- [ ] **SAVE Frontend URL**: https://campus-outcomes-frontend.vercel.app

## STEP 5: Verification & Testing (3 min)
- [ ] Frontend loads: https://campus-outcomes-frontend.vercel.app
- [ ] Backend health check: https://campus-outcomes-backend.onrender.com/api/health
- [ ] Test API with curl:
  ```
  curl https://campus-outcomes-backend.onrender.com/api/auth/login
  ```
- [ ] Database connection working
- [ ] No CORS errors in console

## POST-DEPLOYMENT
- [ ] Record all deployment URLs
- [ ] Monitor Render/Vercel dashboards
- [ ] Check application logs for errors
- [ ] Test all endpoints
- [ ] Share URLs with stakeholders

## DEPLOYMENT URLS
**Frontend**: https://campus-outcomes-frontend.vercel.app
**Backend**: https://campus-outcomes-backend.onrender.com
**API Endpoint**: https://campus-outcomes-backend.onrender.com/api
**Health Check**: https://campus-outcomes-backend.onrender.com/api/health

## TROUBLESHOOTING

### Backend not responding
- Check Render deployment logs
- Verify MongoDB connection string
- Check all environment variables are set
- Ensure JWT_SECRET is not empty

### Frontend can't connect
- Check console for CORS errors  
- Verify API_BASE_URL in frontend/js/api.js
- Ensure backend is running
- Check if backend URL is correct

### MongoDB connection error
- Verify username and password
- Check database name in connection string
- Ensure IP whitelist allows your IP
- Test connection string in MongoDB Atlas

## TIME ESTIMATE
**Total Deployment Time**: ~30 minutes
- MongoDB Setup: 5 min
- Backend Deploy: 12 min
- Frontend Update: 2 min
- Frontend Deploy: 8 min
- Testing: 3 min

**Status**: ✅ READY FOR DEPLOYMENT
**Updated**: January 22, 2026
