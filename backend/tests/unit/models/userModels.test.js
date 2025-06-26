const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../../models/userModel');

let mongoServer;
jest.setTimeout(30000);
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
    //drop database only if connected
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
    }
  });

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Model Test Suite', () => {
  it('should create and save a user successfully', async () => {
    const validUser = new User({
      name: 'siri',
      email: 'siri2003@gmail.com',
      password: '111222',
      role: 'Trainer',
    });
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe('siri');
    expect(savedUser.email).toBe('siri2003@gmail.com');
    expect(savedUser.password).toBe('111222');
    expect(savedUser.role).toBe('Trainer');
  });

  it('should default role to Trainee if not specified', async () => {
    const userWithoutRole = new User({
      name: 'vasa Rishitha',
      email: 'vasarishitha2003@gmail.com',
      password: '310302',
    });
    const savedUser = await userWithoutRole.save();

    expect(savedUser.role).toBe('Trainee');
  });

  it('should fail to create user without required fields', async () => {
    const userWithoutRequiredField = new User({ name: 'No Email' });
    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it('should fail if role is not Trainer or Trainee', async () => {
    const invalidRoleUser = new User({
      name: 'bhanu',
      email: 'bhanu16@gmail.com',
      password: '162004',
      role: 'Admin',
    });
    let err;
    try {
      await invalidRoleUser.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.role).toBeDefined();
  });
});
