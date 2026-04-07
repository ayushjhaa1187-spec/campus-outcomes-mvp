const mongoose = require('mongoose');
const connectDB = require('../../config/database');

jest.mock('mongoose');

describe('Database Connection', () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.MONGO_URI = 'mongodb://localhost:27017/test';

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    delete process.env.MONGO_URI;
  });

  it('should successfully connect to the database', async () => {
    const mockConnection = {
      connection: {
        host: 'localhost'
      }
    };
    mongoose.connect.mockResolvedValueOnce(mockConnection);

    const result = await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(consoleLogSpy).toHaveBeenCalledWith(`MongoDB Connected: ${mockConnection.connection.host}`);
    expect(result).toBe(mockConnection);
  });

  it('should handle connection failure and throw error', async () => {
    const errorMessage = 'Connection failed';
    mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));

    await expect(connectDB()).rejects.toThrow(errorMessage);

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error: ${errorMessage}`);
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
