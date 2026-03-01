const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');
const User = require('../models/User');
const College = require('../models/College');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Define JWT_SECRET for tests
process.env.JWT_SECRET = 'test_secret';

describe('Auth Registration API', () => {
  it('should successfully register a new user and create a new college', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        collegeName: 'Test College'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
    expect(res.body.user).toHaveProperty('name', 'Test User');

    // Verify college was created
    const college = await College.findOne({ name: 'Test College' });
    expect(college).toBeTruthy();
    expect(college.code).toBe('TEST');

    // Verify user was created
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeTruthy();
    expect(user.collegeId.toString()).toBe(college._id.toString());
  });

  it('should successfully register a new user with an existing college', async () => {
    // Create college first
    const college = new College({ name: 'Existing College', code: 'EXIS' });
    await college.save();

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        collegeName: 'Existing College'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');

    // Verify user was created and linked to the existing college
    const user = await User.findOne({ email: 'newuser@example.com' });
    expect(user).toBeTruthy();
    expect(user.collegeId.toString()).toBe(college._id.toString());

    // Ensure no duplicate college was created
    const collegesCount = await College.countDocuments({ name: 'Existing College' });
    expect(collegesCount).toBe(1);
  });

  it('should return error for missing required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'incomplete@example.com',
        // Missing password, name, collegeName
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return error for duplicate email registration', async () => {
    // Register first user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'First User',
        collegeName: 'Some College'
      });

    // Try to register second user with same email
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'duplicate@example.com',
        password: 'password456',
        name: 'Second User',
        collegeName: 'Another College'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
});
