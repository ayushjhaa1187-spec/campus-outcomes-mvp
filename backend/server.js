require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const placementRoutes = require('./routes/placements');
const collegeRoutes = require('./routes/colleges');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/colleges', collegeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Campus Outcomes MVP is running' });
});

// Start server only if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
