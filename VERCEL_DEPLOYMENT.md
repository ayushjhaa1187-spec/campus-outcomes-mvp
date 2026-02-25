# Vercel Deployment Guide - Campus Outcomes MVP

## COMPLETE FULL-STACK DEPLOYMENT (Frontend + Backend)

We have configured the project to deploy entirely on Vercel as a single application. The backend runs as Serverless Functions and the frontend is served statically.

### Step 1: MongoDB Atlas Setup (Prerequisite)
1.  Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a database user and get your connection string.
3.  Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/campus-outcomes?retryWrites=true&w=majority`

### Step 2: Import to Vercel
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import from GitHub: Select `campus-outcomes-mvp`.

### Step 3: Configure Project
Vercel will detect the settings automatically.
- **Framework Preset**: Other (or None)
- **Root Directory**: `./` (Default)
- **Build Command**: Leave default (empty)
- **Output Directory**: Leave default (empty)
- **Install Command**: Leave default (`npm install`)

### Step 4: Environment Variables (CRITICAL)
Expand the **Environment Variables** section and add:
1.  `MONGO_URI`: Your MongoDB connection string.
2.  `JWT_SECRET`: A long random string (e.g., generated via `openssl rand -hex 32`).
3.  `NODE_ENV`: `production`

### Step 5: Deploy
1.  Click **Deploy**.
2.  Wait for the build to complete (usually < 1 minute).
3.  Your app is live!

## Verification
- Visit the URL (e.g., `https://campus-outcomes-mvp.vercel.app`).
- The frontend should load.
- Try `https://campus-outcomes-mvp.vercel.app/api/health` to verify the backend is running.

## Local Development
- Run `npm start`: Starts the backend on port 5000.
- Open `frontend/index.html` (e.g., with Live Server).
- The app automatically detects `localhost` and points API calls to port 5000.
