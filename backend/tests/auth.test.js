const request = require('supertest');
const express = require('express');
const app = require('../server');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

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

describe('Auth Endpoints', () => {
  it('should have a register route', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    // We just want to check it's not a 404
    expect(res.statusCode).not.toBe(404);
  });

  it('should have a login route', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    // We just want to check it's not a 404
    expect(res.statusCode).not.toBe(404);
  });
});
