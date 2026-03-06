const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const College = require('../models/College');
const router = express.Router();

const createRegisterHandler = (User, College, jwt, secret) => async (req, res) => {
  try {
    const { email, password, name, collegeName } = req.body;

    if (!collegeName) {
      throw new Error('College name is required');
    }

    let college = await College.findOne({ name: collegeName });
    if (!college) {
      college = new College({ name: collegeName, code: collegeName.substring(0, 4).toUpperCase() });
      await college.save();
    }
    const user = new User({ email, password, name, collegeId: college._id });
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email }, secret);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createLoginHandler = (User, jwt, secret) => async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, secret);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

router.post('/register', createRegisterHandler(User, College, jwt, process.env.JWT_SECRET));
router.post('/login', createLoginHandler(User, jwt, process.env.JWT_SECRET));

module.exports = router;
module.exports.createRegisterHandler = createRegisterHandler;
module.exports.createLoginHandler = createLoginHandler;
