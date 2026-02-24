const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

// Mock process.env
process.env.JWT_SECRET = 'testsecret';

async function test() {
  console.log('Starting test...');

  // Create a dummy user
  // Note: We don't need to save to DB to test the method if we just add it to schema
  // But since we are importing the compiled model, we can just instantiate it.

  const user = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    collegeId: new mongoose.Types.ObjectId()
  });

  // Manually sign (current way)
  const tokenManual = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
  console.log('Manual token generated:', tokenManual);

  // Verify manual token
  const decodedManual = jwt.verify(tokenManual, process.env.JWT_SECRET);
  if (decodedManual.email === user.email) {
    console.log('Manual token verified successfully.');
  } else {
    console.error('Manual token verification failed.');
  }

  // We will test the new method here after implementation
  if (typeof user.generateAuthToken === 'function') {
      const tokenMethod = user.generateAuthToken();
      console.log('Method token generated:', tokenMethod);
      const decodedMethod = jwt.verify(tokenMethod, process.env.JWT_SECRET);
      if (decodedMethod.email === user.email) {
          console.log('Method token verified successfully.');
      } else {
          console.error('Method token verification failed.');
      }
  } else {
      console.log('User.generateAuthToken method not yet implemented.');
  }
}

test().catch(console.error);
