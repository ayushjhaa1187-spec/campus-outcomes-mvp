const express = require('express');
const router = express.Router();
const PlacementData = require('../models/PlacementData');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Get all placements for the user's college
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get collegeId from user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const placements = await PlacementData.find({ collegeId: user.collegeId }).sort({ placementDate: -1 });
    res.json(placements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new placement record
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newPlacement = new PlacementData({
      collegeId: user.collegeId,
      ...req.body
    });

    await newPlacement.save();
    res.status(201).json(newPlacement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a placement record
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const placement = await PlacementData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!placement) return res.status(404).json({ error: 'Placement record not found' });
    res.json(placement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a placement record
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const placement = await PlacementData.findByIdAndDelete(req.params.id);
    if (!placement) return res.status(404).json({ error: 'Placement record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
