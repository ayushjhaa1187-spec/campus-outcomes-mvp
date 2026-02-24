const { test, describe, beforeEach, afterEach, mock } = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');

// Load the middleware
const authMiddleware = require('../middleware/auth');

describe('Auth Middleware', () => {
    let req, res, next, originalSecret;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: mock.fn(() => res),
            json: mock.fn(),
        };
        next = mock.fn();

        // Ensure JWT_SECRET is set
        originalSecret = process.env.JWT_SECRET; process.env.JWT_SECRET = 'test-secret';
    });

    afterEach(() => {
        process.env.JWT_SECRET = originalSecret; mock.restoreAll();
    });

    test('should return 401 if no authorization header', () => {
        authMiddleware(req, res, next);

        assert.strictEqual(res.status.mock.calls.length, 1);
        assert.strictEqual(res.status.mock.calls[0].arguments[0], 401);
        assert.strictEqual(res.json.mock.calls.length, 1);
        assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], { error: 'No token provided' });
        assert.strictEqual(next.mock.calls.length, 0);
    });

    test('should return 401 if authorization header is malformed (no token)', () => {
        req.headers.authorization = 'Bearer '; // empty token
        authMiddleware(req, res, next);

        assert.strictEqual(res.status.mock.calls.length, 1);
        assert.strictEqual(res.status.mock.calls[0].arguments[0], 401);
        assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], { error: 'No token provided' });
    });

    test('should call next and set req.user if token is valid', () => {
        const payload = { id: '123', email: 'test@example.com' };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        req.headers.authorization = `Bearer ${token}`;

        authMiddleware(req, res, next);

        assert.strictEqual(next.mock.calls.length, 1);
        assert.strictEqual(req.user.id, payload.id);
        assert.strictEqual(req.user.email, payload.email);
    });

    test('should return 401 if token is invalid', () => {
        req.headers.authorization = 'Bearer invalid-token';

        authMiddleware(req, res, next);

        assert.strictEqual(res.status.mock.calls.length, 1);
        assert.strictEqual(res.status.mock.calls[0].arguments[0], 401);
        assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], { error: 'Invalid token' });
    });
});
