const mockSchema = {
  pre: jest.fn(),
  methods: {},
};

const mockMongoose = {
  Schema: jest.fn(function() { return mockSchema; }),
  model: jest.fn((name, schema) => ({ name, schema })),
  Types: {
    ObjectId: jest.fn(),
  },
};
mockMongoose.Schema.Types = {
  ObjectId: jest.fn(),
};

jest.mock('mongoose', () => mockMongoose, { virtual: true });

const mockBcrypt = {
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
};

jest.mock('bcryptjs', () => mockBcrypt, { virtual: true });

const User = require('../models/User');

describe('User Model Pre-save Hook', () => {
  let saveHook;

  beforeAll(() => {
    // Find the 'save' hook from the mockSchema.pre calls
    const saveCall = mockSchema.pre.mock.calls.find(call => call[0] === 'save');
    if (!saveCall) {
      throw new Error('Save hook not found');
    }
    saveHook = saveCall[1];
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should hash the password when it is modified', async () => {
    const next = jest.fn();
    const mockUser = {
      password: 'plainPassword',
      isModified: jest.fn().mockReturnValue(true),
    };

    mockBcrypt.genSalt.mockResolvedValue('salt10');
    mockBcrypt.hash.mockResolvedValue('hashedPassword');

    await saveHook.call(mockUser, next);

    expect(mockUser.isModified).toHaveBeenCalledWith('password');
    expect(mockBcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(mockBcrypt.hash).toHaveBeenCalledWith('plainPassword', 'salt10');
    expect(mockUser.password).toBe('hashedPassword');
    expect(next).toHaveBeenCalled();
  });

  it('should not hash the password when it is not modified', async () => {
    const next = jest.fn();
    const mockUser = {
      password: 'plainPassword',
      isModified: jest.fn().mockReturnValue(false),
    };

    await saveHook.call(mockUser, next);

    expect(mockUser.isModified).toHaveBeenCalledWith('password');
    expect(mockBcrypt.genSalt).not.toHaveBeenCalled();
    expect(mockBcrypt.hash).not.toHaveBeenCalled();
    expect(mockUser.password).toBe('plainPassword');
    expect(next).toHaveBeenCalled();
  });
});
