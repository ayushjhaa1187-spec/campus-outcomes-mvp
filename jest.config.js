module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/frontend/tests/**/*.test.js', '**/backend/tests/**/*.test.js']
};
