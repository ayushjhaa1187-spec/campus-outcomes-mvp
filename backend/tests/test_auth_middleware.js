const assert = require('assert');
const jwt = require('jsonwebtoken');

// Set environment variable for JWT secret BEFORE requiring middleware
process.env.JWT_SECRET = 'test_secret';

const authMiddleware = require('../middleware/auth');

// Mock req, res, next
const mockRes = () => {
  const res = {};
  res.statusCode = 0;
  res.body = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

// Test 1: No token provided
console.log('Test 1: No token provided');
const req1 = { headers: {} };
const res1 = mockRes();
const next1 = () => {};

authMiddleware(req1, res1, next1);
assert.strictEqual(res1.statusCode, 401);
assert.deepStrictEqual(res1.body, { error: 'No token provided' });
console.log('Passed');

// Test 2: Invalid token
console.log('Test 2: Invalid token');
const req2 = { headers: { authorization: 'Bearer invalid_token' } };
const res2 = mockRes();
const next2 = () => {};

// Mock jwt.verify to throw an error (or rely on jsonwebtoken throwing "jwt malformed" or similar)
authMiddleware(req2, res2, next2);
assert.strictEqual(res2.statusCode, 401);
assert.deepStrictEqual(res2.body, { error: 'Invalid token' });
console.log('Passed');

// Test 3: Valid token
console.log('Test 3: Valid token');
const validToken = jwt.sign({ id: 'user123' }, process.env.JWT_SECRET);
const req3 = { headers: { authorization: `Bearer ${validToken}` } };
const res3 = mockRes();
let nextCalled = false;
const next3 = () => { nextCalled = true; };

authMiddleware(req3, res3, next3);
assert.strictEqual(nextCalled, true);
assert.strictEqual(req3.user.id, 'user123');
console.log('Passed');

console.log('All tests passed!');
