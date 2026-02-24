const assert = require('assert');
const mongoose = require('mongoose');
const PlacementData = require('../models/PlacementData');

async function run() {
  console.log('Testing PlacementData model...');

  // Helper to create a valid PlacementData object
  const validData = {
    collegeId: new mongoose.Types.ObjectId(),
    studentId: 'S123',
    name: 'John Doe',
    branch: 'CSE',
    batch: 2023,
    companyName: 'Tech Corp',
    ctcLpa: 10,
    offerType: 'Full Time',
    placementDate: new Date()
  };

  // Test Case 1: Valid - Placed
  try {
    const doc = new PlacementData({ ...validData, status: 'Placed' });
    const err = doc.validateSync();
    assert(!err, err ? err.message : 'Validation failed');
    console.log('  ✔ Valid status "Placed" passed');
  } catch (err) {
    console.error('  ✘ Valid status "Placed" failed:', err.message);
    throw err;
  }

  // Test Case 2: Valid - Not Placed
  try {
    const doc = new PlacementData({ ...validData, status: 'Not Placed' });
    const err = doc.validateSync();
    assert(!err, err ? err.message : 'Validation failed');
    console.log('  ✔ Valid status "Not Placed" passed');
  } catch (err) {
    console.error('  ✘ Valid status "Not Placed" failed:', err.message);
    throw err;
  }

  // Test Case 3: Valid - Pending
  try {
    const doc = new PlacementData({ ...validData, status: 'Pending' });
    const err = doc.validateSync();
    assert(!err, err ? err.message : 'Validation failed');
    console.log('  ✔ Valid status "Pending" passed');
  } catch (err) {
    console.error('  ✘ Valid status "Pending" failed:', err.message);
    throw err;
  }

  // Test Case 4: Invalid Status
  try {
    const doc = new PlacementData({ ...validData, status: 'Unknown' });
    const err = doc.validateSync();
    assert(err, 'Should have returned an error');
    assert(err.errors['status'], 'Should have a validation error for status');
    console.log('  ✔ Invalid status "Unknown" correctly rejected');
  } catch (err) {
    if (err.name === 'AssertionError') {
      console.error('  ✘ Invalid status "Unknown" was accepted (Expected failure)');
      throw err;
    }
    throw err;
  }

  // Test Case 5: Default Value
  try {
    const doc = new PlacementData({ ...validData }); // No status provided
    // Validate first to ensure defaults are applied and valid
    const err = doc.validateSync();
    assert(!err, err ? err.message : 'Validation failed');
    assert.strictEqual(doc.status, 'Pending');
    console.log('  ✔ Default status is "Pending"');
  } catch (err) {
    console.error('  ✘ Default status check failed:', err.message);
    throw err;
  }

  console.log('PlacementData model tests completed successfully.');
}

module.exports = { run };
