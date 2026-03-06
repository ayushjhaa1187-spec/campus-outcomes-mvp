const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Simple test runner
let testsPassed = 0;
let testsFailed = 0;

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected "${expected}" but got "${actual}"`);
      }
    },
    toEqual(expected) {
      const actualStr = JSON.stringify(actual);
      const expectedStr = JSON.stringify(expected);
      if (actualStr !== expectedStr) {
        throw new Error(`Expected ${expectedStr} but got ${actualStr}`);
      }
    }
  };
}

function createMockFunction() {
  const mock = function(...args) {
    mock.called = true;
    mock.args = args;
    if (mock.impl) return mock.impl(...args);
  };
  mock.called = false;
  mock.args = [];
  mock.mockImplementation = (fn) => { mock.impl = fn; return mock; };
  mock.mockClear = () => { mock.called = false; mock.args = []; };
  return mock;
}

// Setup environment for api.js
const sandbox = {
  localStorage: {
    getItem: createMockFunction(),
    setItem: createMockFunction(),
    _store: {}
  },
  fetch: createMockFunction(),
  console: console
};

// Default localStorage behavior
sandbox.localStorage.getItem.mockImplementation((key) => sandbox.localStorage._store[key] || null);
sandbox.localStorage.setItem.mockImplementation((key, value) => { sandbox.localStorage._store[key] = value; });

// Load api.js into sandbox
const apiCode = fs.readFileSync(path.join(__dirname, 'api.js'), 'utf8');

// The functions in api.js are declared with `const`.
// In a vm context, `const` declarations at the top level are NOT added to the sandbox object.
// So we need to evaluate the code and return the specific functions we need.
const codeToRun = `
${apiCode}

// Return the functions so we can use them in the Node environment
({
  login,
  apiCall
})
`;

vm.createContext(sandbox);
const api = vm.runInContext(codeToRun, sandbox);

// Async Test Runner
async function runTests() {
  console.log(`\n=== Frontend API - login() ===`);

  try {
    // Test 1: should call fetch with correct arguments and save token on success
    sandbox.fetch.mockClear();
    sandbox.localStorage.setItem.mockClear();
    sandbox.localStorage.getItem.mockClear();
    sandbox.localStorage._store = {};

    sandbox.fetch.mockImplementation(async () => {
      return {
        json: async () => ({ token: 'mock_jwt_token', user: { id: 1 } })
      };
    });

    const result = await api.login('test@example.com', 'password123');

    expect(sandbox.fetch.called).toBe(true);
    expect(sandbox.fetch.args[0]).toBe('http://localhost:5000/api/auth/login');
    expect(sandbox.fetch.args[1].method).toBe('POST');
    expect(sandbox.fetch.args[1].headers['Content-Type']).toBe('application/json');
    expect(sandbox.fetch.args[1].body).toBe(JSON.stringify({ email: 'test@example.com', password: 'password123' }));

    expect(sandbox.localStorage.setItem.called).toBe(true);
    expect(sandbox.localStorage.setItem.args[0]).toBe('token');
    expect(sandbox.localStorage.setItem.args[1]).toBe('mock_jwt_token');

    expect(result.token).toBe('mock_jwt_token');

    console.log(`✅ PASS: should call fetch with correct arguments and save token on success`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ FAIL (Test 1):`, error);
    testsFailed++;
  }

  try {
    // Test 2: should call fetch but NOT save token on failure
    sandbox.fetch.mockClear();
    sandbox.localStorage.setItem.mockClear();
    sandbox.localStorage.getItem.mockClear();
    sandbox.localStorage._store = {};

    sandbox.fetch.mockImplementation(async () => {
      return {
        json: async () => ({ error: 'Invalid credentials' })
      };
    });

    const result2 = await api.login('wrong@example.com', 'badpass');

    expect(sandbox.fetch.called).toBe(true);
    expect(sandbox.localStorage.setItem.called).toBe(false);
    expect(result2.error).toBe('Invalid credentials');
    expect(result2.token).toBe(undefined);

    console.log(`✅ PASS: should call fetch but NOT save token on failure`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ FAIL (Test 2):`, error);
    testsFailed++;
  }

  console.log(`\nTest Summary: ${testsPassed} passed, ${testsFailed} failed.`);
  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests();
