const mongoose = require('mongoose');
const connectDB = require('./database');

jest.mock('mongoose');

describe('Database Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MONGO_URI = 'mongodb://localhost:27017/testdb';
  });

  afterEach(() => {
    delete process.env.MONGO_URI;
  });

  it('should connect to the database successfully', async () => {
    const mockConnection = { connection: { host: 'localhost' } };
    mongoose.connect.mockResolvedValueOnce(mockConnection);

    console.log = jest.fn();

    const result = await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/testdb');
    expect(console.log).toHaveBeenCalledWith('MongoDB Connected: localhost');
    expect(result).toBe(mockConnection);
  });

  it('should throw an error if the database connection fails', async () => {
    const errorMessage = 'Connection failed';
    mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));

    console.error = jest.fn();

    await expect(connectDB()).rejects.toThrow(errorMessage);
    expect(console.error).toHaveBeenCalledWith(`Error: ${errorMessage}`);
  });
});
