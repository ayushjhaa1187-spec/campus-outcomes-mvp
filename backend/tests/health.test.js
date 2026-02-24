const { test, describe } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../server');

describe('Health Check Endpoint', () => {
  test('GET /api/health returns 200 and correct status', async (t) => {
    // Start the server on an ephemeral port
    const server = http.createServer(app);

    await new Promise((resolve) => {
      server.listen(0, resolve);
    });

    const port = server.address().port;
    const url = `http://localhost:${port}/api/health`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(data, { status: 'Campus Outcomes MVP is running' });
    } finally {
      // Close the server
      server.close();
    }
  });
});
