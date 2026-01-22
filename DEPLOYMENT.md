# Campus Outcomes MVP - Deployment Guide

## Overview
This guide walks through deploying the Campus Placement & NIRF Analytics Platform MVP on cloud platforms.

## Backend Deployment (Render.com)

### Steps
1. **Fork/Push repository to GitHub**
   - Ensure all code is pushed to https://github.com/ayushjhaa1187-spec/campus-outcomes-mvp

2. **Create Render account**
   - Go to render.com and sign up
   - Connect GitHub account

3. **Create new Web Service**
   - Click "New +" → "Web Service"
   - Select the campus-outcomes-mvp repository
   - Name: campus-outcomes-mvp-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Set Environment Variables**
   - Click "Environment"
   - Add variables:
     - PORT: 5000
     - NODE_ENV: production
     - MONGO_URI: mongodb+srv://user:pass@cluster.mongodb.net/campus-outcomes
     - JWT_SECRET: your-super-secret-jwt-key-change-in-production

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Get your backend URL (e.g., https://campus-outcomes-mvp-backend.onrender.com)

## Frontend Deployment (Vercel)

### Steps
1. **Create Vercel Account**
   - Go to vercel.com
   - Sign up with GitHub

2. **Deploy Frontend**
   - Import GitHub project
   - Set root directory: `frontend`
   - No build command needed for static HTML

3. **Update API URL**
   - Edit `frontend/js/api.js`
   - Change `API_BASE_URL` to your Render backend URL

## MongoDB Setup (MongoDB Atlas)

1. Go to mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user with password
4. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/database-name`
5. Use this as MONGO_URI in Render

## Verify Deployment

- Backend: `https://your-backend.onrender.com/api/health`
- Frontend: `https://your-frontend.vercel.app`

## Notes
- First Render deployment takes 10-15 minutes
- Free tier has limitations; consider upgrading for production
- Keep JWT_SECRET secure and change regularly
- Enable HTTPS on both services
