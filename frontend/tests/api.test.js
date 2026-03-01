const { apiCall, API_BASE_URL, login, register, getHealthCheck } = require('../js/api.js');

describe('api.js tests', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    // Mock global fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, message: 'Mock response' }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('apiCall', () => {
    it('should make a GET request to the correct endpoint', async () => {
      const response = await apiCall('/test');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': ''
        }
      });
      expect(response).toEqual({ success: true, message: 'Mock response' });
    });

    it('should make a POST request with correct body', async () => {
      const body = { data: 'test' };
      await apiCall('/test-post', 'POST', body);

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/test-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': ''
        },
        body: JSON.stringify(body)
      });
    });

    it('should include Authorization header if token exists in localStorage', async () => {
      const token = 'fake-jwt-token';
      localStorage.setItem('token', token);

      await apiCall('/auth-test');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/auth-test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    });
  });

  describe('login', () => {
    it('should call apiCall with correct params and set token if successful', async () => {
      const mockToken = 'login-token';
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ token: mockToken }),
        })
      );

      const response = await login('test@test.com', 'password123');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/auth/login`, expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'password123' })
      }));

      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(response).toEqual({ token: mockToken });
    });

    it('should not set token if response does not contain it', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ error: 'Invalid credentials' }),
        })
      );

      await login('test@test.com', 'wrong');

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('register', () => {
    it('should call apiCall with correct params and set token if successful', async () => {
      const mockToken = 'register-token';
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ token: mockToken }),
        })
      );

      const response = await register('new@test.com', 'pass', 'Name', 'College');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/auth/register`, expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'new@test.com', password: 'pass', name: 'Name', collegeName: 'College' })
      }));

      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(response).toEqual({ token: mockToken });
    });
  });

  describe('getHealthCheck', () => {
    it('should call apiCall to /health endpoint', async () => {
      await getHealthCheck();

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/health`, expect.objectContaining({
        method: 'GET'
      }));
    });
  });
});
