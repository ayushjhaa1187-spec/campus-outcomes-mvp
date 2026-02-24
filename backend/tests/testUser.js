const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function runTests() {
  console.log('Starting User model tests...');
  let hasError = false;

  try {
    // Setup
    const plainPassword = 'securePassword123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Create user instance (no DB connection needed for this test)
    const user = new User({
      name: 'Test User',
      email: 'test@test.com',
      password: hashedPassword,
      collegeId: new mongoose.Types.ObjectId()
    });

    console.log('User instance created with hashed password.');

    // Test 1: Correct Password
    try {
      const isMatch = await user.comparePassword(plainPassword);
      assert.strictEqual(isMatch, true, 'Password should match');
      console.log('✅ comparePassword returns true for correct password');
    } catch (e) {
      console.error('❌ Failed: comparePassword with correct password', e);
      hasError = true;
    }

    // Test 2: Incorrect Password
    try {
      const isMatch = await user.comparePassword('wrongPassword');
      assert.strictEqual(isMatch, false, 'Password should not match');
      console.log('✅ comparePassword returns false for incorrect password');
    } catch (e) {
      console.error('❌ Failed: comparePassword with incorrect password', e);
      hasError = true;
    }

    // Test 3: Empty Password
    try {
        const isMatch = await user.comparePassword('');
        assert.strictEqual(isMatch, false, 'Empty password should not match');
        console.log('✅ comparePassword returns false for empty password');
    } catch (e) {
        console.error('❌ Failed: comparePassword with empty password', e);
        hasError = true;
    }

  } catch (err) {
    console.error('❌ Unexpected error during test setup:', err);
    hasError = true;
  }

  if (hasError) {
    console.error('Some tests failed.');
    process.exit(1);
  } else {
    console.log('All tests passed successfully.');
    process.exit(0);
  }
}

runTests();
