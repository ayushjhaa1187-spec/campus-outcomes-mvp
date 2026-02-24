const fs = require('fs');
const vm = require('vm');
const path = require('path');

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = value.toString();
  },
  clear: function() {
    this.store = {};
  }
};

// Mock fetch
let fetchCalls = [];
const fetchMock = async (url, options) => {
  fetchCalls.push({ url, options });

  if (url.includes('/auth/register')) {
      const body = JSON.parse(options.body);
      if (body.email === 'error@test.com') {
          return {
              json: async () => ({ error: 'Registration failed' })
          };
      }
      return {
        json: async () => ({ token: 'mock-token-123', user: { email: body.email } })
      };
  }

  return {
    json: async () => ({})
  };
};

// Read the source file
const apiJsPath = path.join(__dirname, '../frontend/js/api.js');
let apiJsContent = fs.readFileSync(apiJsPath, 'utf8');

// Expose functions to the sandbox
// We need to explicitly attach the const functions to the global object (sandbox)
apiJsContent += '\n;this.register = register; this.login = login; this.apiCall = apiCall;';

// Create sandbox
const sandbox = {
  console: console,
  fetch: fetchMock,
  localStorage: localStorageMock,
  window: {},
  module: {},
  exports: {}
};

// Execute the code in the sandbox
vm.createContext(sandbox);
vm.runInContext(apiJsContent, sandbox);

// Test Runner
async function runTests() {
  let passed = 0;
  let failed = 0;

  console.log('Running tests for register()...');

  // Test 1: Successful Registration
  try {
    fetchCalls = [];
    localStorageMock.clear();

    // Call register from the sandbox
    const result = await sandbox.register('test@example.com', 'password123', 'Test User', 'Test College');

    // Assert fetch called correctly
    if (fetchCalls.length !== 1) throw new Error('fetch not called exactly once. Called ' + fetchCalls.length + ' times');
    if (!fetchCalls[0].url.includes('/auth/register')) throw new Error('fetch called with wrong URL: ' + fetchCalls[0].url);
    if (fetchCalls[0].options.method !== 'POST') throw new Error('fetch called with wrong method: ' + fetchCalls[0].options.method);

    const body = JSON.parse(fetchCalls[0].options.body);
    if (body.email !== 'test@example.com') throw new Error('fetch called with wrong email');

    // Assert token stored
    if (localStorageMock.getItem('token') !== 'mock-token-123') throw new Error('Token not stored in localStorage. Value: ' + localStorageMock.getItem('token'));

    console.log('✅ Test 1: Successful Registration passed');
    passed++;
  } catch (error) {
    console.error('❌ Test 1: Successful Registration failed');
    console.error(error);
    failed++;
  }

  // Test 2: Failed Registration
  try {
    fetchCalls = [];
    localStorageMock.clear();

    const result = await sandbox.register('error@test.com', 'password123', 'Error User', 'Error College');

    // Assert fetch called
    if (fetchCalls.length !== 1) throw new Error('fetch not called');

    // Assert token NOT stored
    if (localStorageMock.getItem('token') !== null) throw new Error('Token should not be stored on error');

    // Assert error response
    if (result.error !== 'Registration failed') throw new Error('Error response not returned');

    console.log('✅ Test 2: Failed Registration passed');
    passed++;
  } catch (error) {
    console.error('❌ Test 2: Failed Registration failed');
    console.error(error);
    failed++;
  }

  console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
