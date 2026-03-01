const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

// Load environment variables for tests
process.env.JWT_SECRET = 'test-secret';

const authRoutes = require('../routes/auth');
const User = require('../models/User');
const College = require('../models/College');

// Setup express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
  await College.deleteMany({});
});

describe('Auth Routes - Login', () => {
  let testUser;
  let testCollege;
  const password = 'Password123!';

  beforeEach(async () => {
    // Create a mock college
    testCollege = new College({
      name: 'Test University',
      code: 'TEST'
    });
    await testCollege.save();

    // Create a mock user
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: password,
      collegeId: testCollege._id
    });
    await testUser.save();
  });

  it('should successfully login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: password
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user.name).toBe(testUser.name);

    // Verify token is valid
    const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
    expect(decoded.email).toBe(testUser.email);
    expect(decoded.id).toBe(testUser._id.toString());
  });

  it('should fail login with incorrect password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
    expect(response.body).not.toHaveProperty('token');
  });

  it('should fail login with non-existent email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: password
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
    expect(response.body).not.toHaveProperty('token');
  });

  it('should handle missing credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});

    // The current implementation throws a 401 when email is not provided
    expect(response.status).toBe(401);
  });
});
