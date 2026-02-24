const assert = require('assert');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// Mock helpers
const mockRes = () => {
    const res = {};
    res.statusCode = 200;
    res.body = null;
    res.status = function(code) {
        this.statusCode = code;
        return this;
    };
    res.json = function(data) {
        this.body = data;
        return this;
    };
    return res;
};

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test_secret';

// Test Suite
console.log('Running Auth Middleware Tests...');

try {
    // Test 1: No token provided
    console.log('Test 1: No token provided');
    const req1 = { headers: {} };
    const res1 = mockRes();
    const next1 = () => { throw new Error('next() should not be called'); };

    authMiddleware(req1, res1, next1);

    assert.strictEqual(res1.statusCode, 401, 'Status code should be 401');
    assert.deepStrictEqual(res1.body, { error: 'No token provided' }, 'Should return correct error message');
    console.log('✅ Passed');

    // Test 2: Invalid token
    console.log('Test 2: Invalid token');
    const req2 = { headers: { authorization: 'Bearer invalid_token' } };
    const res2 = mockRes();
    const next2 = () => { throw new Error('next() should not be called'); };

    authMiddleware(req2, res2, next2);

    assert.strictEqual(res2.statusCode, 401, 'Status code should be 401');
    assert.deepStrictEqual(res2.body, { error: 'Invalid token' }, 'Should return "Invalid token" error');
    console.log('✅ Passed');

    // Test 3: Valid token
    console.log('Test 3: Valid token');
    const userPayload = { id: 'user123', email: 'test@example.com' };
    const validToken = jwt.sign(userPayload, process.env.JWT_SECRET);
    const req3 = { headers: { authorization: `Bearer ${validToken}` } };
    const res3 = mockRes();
    let nextCalled = false;
    const next3 = () => { nextCalled = true; };

    authMiddleware(req3, res3, next3);

    assert.strictEqual(nextCalled, true, 'next() should be called');
    assert.deepStrictEqual(req3.user.id, userPayload.id, 'req.user should be populated');
    console.log('✅ Passed');

    console.log('\nAll tests passed successfully!');
} catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
}
