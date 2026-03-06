const { test, describe } = require('node:test');
const assert = require('node:assert');
const { createRegisterHandler } = require('../routes/auth');

const createRes = () => {
    return {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        }
    };
};

describe('Auth Registration Tests', () => {

    test('Happy Path: Should register user with existing college', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                collegeName: 'Test College'
            }
        };
        const res = createRes();

        const existingCollege = { _id: 'college123', name: 'Test College' };

        const CollegeMock = class {
            constructor(data) { Object.assign(this, data); }
            save() { return Promise.resolve(this); }
        };
        CollegeMock.findOne = async () => existingCollege;

        const UserMock = class {
            constructor(data) {
                this.email = data.email;
                this._id = 'user123';
            }
            save() { return Promise.resolve(this); }
        };

        const jwtMock = {
            sign: () => 'fake-token'
        };

        const handler = createRegisterHandler(UserMock, CollegeMock, jwtMock, 'secret');
        await handler(req, res);

        assert.strictEqual(res.statusCode, 200);
        assert.ok(res.body.token);
        assert.strictEqual(res.body.user.email, 'test@example.com');
    });

    test('Happy Path: Should register user and create new college', async () => {
        const req = {
            body: {
                email: 'test2@example.com',
                password: 'password123',
                name: 'Test User 2',
                collegeName: 'New College'
            }
        };
        const res = createRes();

        const CollegeMock = class {
            constructor(data) {
                Object.assign(this, data);
                this._id = 'newCollegeId';
            }
            save() { return Promise.resolve(this); }
        };
        CollegeMock.findOne = async () => null;

        const UserMock = class {
            constructor(data) {
                this.email = data.email;
                this._id = 'user123';
            }
            save() { return Promise.resolve(this); }
        };

        const jwtMock = {
            sign: () => 'fake-token'
        };

        const handler = createRegisterHandler(UserMock, CollegeMock, jwtMock, 'secret');
        await handler(req, res);

        assert.strictEqual(res.statusCode, 200);
    });

    test('Edge Case: Should handle missing collegeName gracefully', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            }
        };
        const res = createRes();

        // This mock ensures findOne returns null (simulating no college found for undefined name)
        const CollegeMock = class {
            constructor(data) { Object.assign(this, data); }
            save() { return Promise.resolve(this); }
        };
        CollegeMock.findOne = async () => null;

        const handler = createRegisterHandler({}, CollegeMock, {}, 'secret');
        await handler(req, res);

        assert.strictEqual(res.statusCode, 400);
        assert.ok(res.body.error);
    });

    test('Edge Case: Should handle missing other required fields', async () => {
        const req = {
            body: {
                password: 'password123',
                name: 'Test User',
                collegeName: 'Test College'
            }
        };
        const res = createRes();

        const CollegeMock = class {
            constructor(data) { Object.assign(this, data); }
            save() { return Promise.resolve(this); }
        };
        CollegeMock.findOne = async () => ({ _id: 'col1', name: 'Test College' });

        const UserMock = class {
            constructor(data) { }
            save() { return Promise.reject(new Error('User validation failed')); }
        };

        const handler = createRegisterHandler(UserMock, CollegeMock, {}, 'secret');
        await handler(req, res);

        assert.strictEqual(res.statusCode, 400);
        assert.match(res.body.error, /User validation failed/);
    });
});
