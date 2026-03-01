const mongoose = require('mongoose');
const connectDB = require('../../config/database');

// Mock mongoose
jest.mock('mongoose');

describe('Database Connection', () => {
  let consoleLogSpy;
  let consoleErrorSpy;
  let processExitSpy;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Set up environment variable
    process.env.MONGO_URI = 'mongodb://localhost:27017/test';

    // Mock console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock process.exit (important so the test runner doesn't exit)
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore mocks
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  it('should successfully connect to the database', async () => {
    // Setup mock connection return value
    const mockConn = {
      connection: {
        host: 'localhost',
      },
    };
    mongoose.connect.mockResolvedValueOnce(mockConn);

    const result = await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB Connected: localhost');
    expect(result).toBe(mockConn);
    expect(processExitSpy).not.toHaveBeenCalled();
  });

  it('should handle connection failure and exit process', async () => {
    // Setup mock rejection
    const errorMessage = 'Connection failed';
    mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error: ${errorMessage}`);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
