# Campus Outcomes MVP - Complete Setup Guide

## Project Structure

Create the following folder and file structure:

```
campus-outcomes-mvp/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── College.js
│   │   ├── User.js
│   │   └── PlacementData.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── reports.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   ├── csvParser.js
│   │   ├── nirfCalculator.js
│   │   └── reportGenerator.js
│   └── server.js
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   ├── dashboard.js
│   │   └── api.js
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   └── upload.html
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Step 1: Clone and Setup

```bash
git clone https://github.com/ayushjhaa1187-spec/campus-outcomes-mvp.git
cd campus-outcomes-mvp
npm install
```

## Step 2: Create .env file

Copy `.env.example` and create `.env`:

```bash
cp .env.example .env
```

Fill in your environment variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/campus-outcomes
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
```

## Step 3: Start MongoDB

Make sure MongoDB is running:
```bash
mongod
```

Or use MongoDB Atlas (cloud) and update MONGO_URI.

## Step 4: Run the Application

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Step 5: Access the Application

- Frontend: Open `frontend/index.html` in browser (or use Live Server)
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register college admin
- `POST /api/auth/login` - Login

### Upload
- `POST /api/upload/csv` - Upload placement CSV (requires auth)

### Reports
- `GET /api/reports/dashboard` - Get dashboard metrics
- `GET /api/reports/nirf` - Get NIRF summary
- `GET /api/reports/download` - Download PDF/Excel

## CSV Format

Your placement CSV should have these columns:

```csv
student_id,name,branch,batch,company_name,ctc_lpa,offer_type,placement_date,status
2021001,John Doe,CSE,2021,TCS,7.5,Full-Time,2025-01-10,Placed
2021002,Jane Smith,ECE,2021,Infosys,8.2,Full-Time,2025-01-12,Placed
```

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT
- **CSV Parsing**: csv-parser
- **Reports**: ExcelJS, PDFKit
- **Frontend**: Vanilla HTML/CSS/JavaScript

## Next Steps for Development

1. Create all backend files (models, routes, utils)
2. Create frontend pages (HTML/CSS/JS)
3. Test CSV upload functionality
4. Test report generation
5. Deploy to cloud (Render/Railway for backend, Vercel for frontend)

## Common Issues

### Port already in use
```bash
lsof -i :5000
kill -9 <PID>
```

### MongoDB connection error
- Check if MongoDB is running
- Verify MONGO_URI in .env
- Check MongoDB logs

---

**Author**: AYUSH KUMAR JHA  
**Date**: January 2026  
**Purpose**: NIRF Placement Analytics MVP
