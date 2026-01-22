# Vercel Deployment Guide - Campus Outcomes MVP

## SIMPLE ONE-CLICK DEPLOYMENT (Recommended)

Vercel deploys directly from GitHub with **zero configuration required**.

### Step 1: Go to Vercel
Visit: https://vercel.com/import

### Step 2: Import from GitHub
1. Click "Continue with GitHub"
2. Authorize Vercel to access your GitHub account
3. Select: `ayushjhaa1187-spec/campus-outcomes-mvp`

### Step 3: Configure Project
1. **Root Directory**: Leave as default (./)
2. **Framework**: Select "Other"
3. **Build Command**: `npm run build` (or leave empty)
4. **Start Command**: `npm start`
5. Click "Deploy"

### Step 4: Wait for Deployment
Vercel will automatically:
- Build your project
- Deploy frontend and backend
- Generate a live URL

## Your Live Site URL
**After deployment completes, your site will be live at:**
`https://campus-outcomes-mvp.vercel.app`

## Environment Variables (If Needed)
If your app needs MongoDB connection or API keys:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add your keys
5. Redeploy

## Troubleshooting
- **Build fails**: Check that `package.json` has correct scripts
- **App crashes**: Check logs in Vercel Dashboard → Deployments
- **Need to update**: Just push to GitHub, Vercel auto-deploys

## Timeline
- Deployment starts: Immediately after clicking Deploy
- Deployment completes: 2-5 minutes
- Site live and accessible: https://campus-outcomes-mvp.vercel.app

**That's it! No CLI, no Firebase, just GitHub + Vercel = Deployed!**
