const assert = require('assert');
const mongoose = require('mongoose');
const PlacementData = require('../models/PlacementData');

// Mock data
const mockCollegeId = new mongoose.Types.ObjectId();

async function run() {
  console.log('Testing PlacementData model...');

  // Test Case 1: Valid Status - Placed
  try {
    const doc = new PlacementData({
      collegeId: mockCollegeId,
      status: 'Placed'
    });
    await doc.validate();
    console.log('  ✅ Valid status "Placed" passed validation');
  } catch (err) {
    console.error('  ❌ Valid status "Placed" failed validation:', err.message);
    throw err;
  }

  // Test Case 2: Valid Status - Not Placed
  try {
    const doc = new PlacementData({
      collegeId: mockCollegeId,
      status: 'Not Placed'
    });
    await doc.validate();
    console.log('  ✅ Valid status "Not Placed" passed validation');
  } catch (err) {
    console.error('  ❌ Valid status "Not Placed" failed validation:', err.message);
    throw err;
  }

  // Test Case 3: Valid Status - Pending
  try {
    const doc = new PlacementData({
      collegeId: mockCollegeId,
      status: 'Pending'
    });
    await doc.validate();
    console.log('  ✅ Valid status "Pending" passed validation');
  } catch (err) {
    console.error('  ❌ Valid status "Pending" failed validation:', err.message);
    throw err;
  }

  // Test Case 4: Invalid Status
  try {
    const doc = new PlacementData({
      collegeId: mockCollegeId,
      status: 'Unknown'
    });
    await doc.validate();
    throw new Error('Validation should have failed for invalid status "Unknown"');
  } catch (err) {
    if (err.errors && err.errors.status) {
      console.log('  ✅ Invalid status "Unknown" correctly failed validation');
    } else {
      console.error('  ❌ Invalid status test failed with unexpected error:', err);
      throw err;
    }
  }

  // Test Case 5: Default Status
  try {
    const doc = new PlacementData({
      collegeId: mockCollegeId
    });
    await doc.validate();
    assert.strictEqual(doc.status, 'Pending', 'Default status should be "Pending"');
    console.log('  ✅ Default status is correctly set to "Pending"');
  } catch (err) {
    console.error('  ❌ Default status test failed:', err.message);
    throw err;
  }
}

module.exports = { run };
