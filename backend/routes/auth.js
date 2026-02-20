const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const College = require('../models/College');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, collegeName } = req.body;

    // Check if user already exists
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    let college = await College.findOne({ name: collegeName });
    if (!college) {
      // Create new college
      college = new College({
        name: collegeName,
        code: collegeName.substring(0, 4).toUpperCase() + Math.floor(Math.random() * 1000)
      });
      await college.save();
    }

    const user = new User({ email, password, name, collegeId: college._id });
    await user.save();

    // Add user to college admins if role is admin (default)
    if (user.role === 'admin') {
      college.admins.push(user._id);
      await college.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
