const fs = require('fs');
const vm = require('vm');
const path = require('path');

const apiJsPath = path.join(__dirname, '../frontend/js/api.js');
// Append assignment to expose functions to the sandbox
const apiJsContent = fs.readFileSync(apiJsPath, 'utf8') +
    '\nthis.register = register;';

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: function(key) { return this.store[key] || null; },
    setItem: function(key, value) { this.store[key] = value.toString(); },
    clear: function() { this.store = {}; }
};

// Mock fetch
let fetchCalls = [];
const fetchMock = async (url, options) => {
    fetchCalls.push({ url, options });
    // Default response, can be overridden by tests
    if (url.includes('/auth/register')) {
        const body = JSON.parse(options.body);
        if (body.email === 'test@example.com') {
             return {
                json: async () => ({ token: 'mock-token', user: { name: body.name } })
            };
        } else {
             return {
                json: async () => ({ error: 'Registration failed' })
            };
        }
    }
    return {
        json: async () => ({})
    };
};

// Setup context
const sandbox = {
    fetch: fetchMock,
    localStorage: localStorageMock,
    console: console,
    window: {}, // Add window just in case
};

// Create script
const script = new vm.Script(apiJsContent);
const context = new vm.createContext(sandbox);
script.runInContext(context);

// Helper for assertions
function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ PASS: ${message}`);
    }
}

async function runTests() {
    console.log('Running tests for register function...');

    // Test 1: Successful Registration
    console.log('\nTest 1: Successful Registration');
    fetchCalls = []; // Reset calls
    localStorageMock.clear(); // Reset storage

    // Now we can access register from the sandbox
    const result1 = await sandbox.register('test@example.com', 'password123', 'Test User', 'Test College');

    assert(fetchCalls.length === 1, 'Fetch should be called once');
    assert(fetchCalls[0].url === 'http://localhost:5000/api/auth/register', 'URL should be correct');
    assert(fetchCalls[0].options.method === 'POST', 'Method should be POST');
    const body1 = JSON.parse(fetchCalls[0].options.body);
    assert(body1.email === 'test@example.com', 'Email in body should be correct');
    assert(body1.collegeName === 'Test College', 'College name in body should be correct');
    assert(localStorageMock.getItem('token') === 'mock-token', 'Token should be stored in localStorage');
    assert(result1.token === 'mock-token', 'Result should contain token');

    // Test 2: Failed Registration
    console.log('\nTest 2: Failed Registration');
    fetchCalls = [];
    localStorageMock.clear();

    const result2 = await sandbox.register('fail@example.com', 'password123', 'Test User', 'Test College');

    assert(fetchCalls.length === 1, 'Fetch should be called once');
    assert(localStorageMock.getItem('token') === null, 'Token should not be stored on failure');
    assert(result2.error === 'Registration failed', 'Result should contain error');

    console.log('\nAll tests passed!');
}

runTests().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
});
