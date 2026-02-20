const express = require('express');
const router = express.Router();
const College = require('../models/College');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Get college details for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const college = await College.findById(user.collegeId);
    if (!college) return res.status(404).json({ error: 'College not found' });

    res.json(college);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
