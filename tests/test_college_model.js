require('dotenv').config();
const mongoose = require('mongoose');
const assert = require('assert');
const { MongoMemoryServer } = require('mongodb-memory-server');
const College = require('../backend/models/College');

async function runTests() {
  console.log('Starting College Model Tests...');
  let mongoServer;

  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to In-Memory Test Database');

    // Ensure indexes are built
    await College.init();

    // Clean up before tests
    await College.deleteMany({});

    // Test Case 1: Valid College Creation
    console.log('Test 1: Create Valid College');
    const validCollege = new College({
      name: 'Test College',
      code: 'TC001',
      location: 'Test City',
      state: 'Test State',
    });
    await validCollege.save();
    assert.strictEqual(validCollege.name, 'Test College');
    assert.strictEqual(validCollege.code, 'TC001');
    console.log('  Passed');

    // Test Case 2: Required Name
    console.log('Test 2: Validation - Name is required');
    const noNameCollege = new College({
      code: 'TC002',
    });
    try {
      await noNameCollege.save();
      assert.fail('Should have thrown a validation error');
    } catch (error) {
      if (error.name === 'AssertionError') throw error;
      assert.strictEqual(error.errors.name.kind, 'required');
      console.log('  Passed');
    }

    // Test Case 3: Required Code
    console.log('Test 3: Validation - Code is required');
    const noCodeCollege = new College({
      name: 'Test College 2',
    });
    try {
      await noCodeCollege.save();
      assert.fail('Should have thrown a validation error');
    } catch (error) {
      if (error.name === 'AssertionError') throw error;
      assert.strictEqual(error.errors.code.kind, 'required');
      console.log('  Passed');
    }

    // Test Case 4: Unique Name
    console.log('Test 4: Constraint - Name must be unique');
    const duplicateNameCollege = new College({
      name: 'Test College', // Same as Test 1
      code: 'TC003',
    });
    try {
      await duplicateNameCollege.save();
      assert.fail('Should have thrown a duplicate key error');
    } catch (error) {
      if (error.name === 'AssertionError') throw error;
      assert.strictEqual(error.code, 11000);
      console.log('  Passed');
    }

    // Test Case 5: Unique Code
    console.log('Test 5: Constraint - Code must be unique');
    const duplicateCodeCollege = new College({
      name: 'Test College 3',
      code: 'TC001', // Same as Test 1
    });
    try {
      await duplicateCodeCollege.save();
      assert.fail('Should have thrown a duplicate key error');
    } catch (error) {
      if (error.name === 'AssertionError') throw error;
      assert.strictEqual(error.code, 11000);
      console.log('  Passed');
    }

    console.log('All tests passed successfully!');

  } catch (error) {
    console.error('Test Failed:', error);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
  }
}

runTests();
