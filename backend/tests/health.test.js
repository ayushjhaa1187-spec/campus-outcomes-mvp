const request = require('supertest');
const express = require('express');
const app = require('../server'); // Assuming your express app is exported from server.js

describe('Health Check Endpoint', () => {
  it('GET /api/health returns 200 and correct status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'Campus Outcomes MVP is running' });
  });
});
