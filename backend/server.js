require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy if behind a reverse proxy (like Vercel, Heroku, etc.)
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authLimiter, authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Campus Outcomes MVP is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
