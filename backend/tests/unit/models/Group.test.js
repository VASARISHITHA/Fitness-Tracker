const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Group = require('../../../models/Group');
const User = require('../../../models/userModel');

let mongoServer;
jest.setTimeout(30000);
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await Group.deleteMany();
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Helper to create test users
const createTestUser = async (overrides = {}) => {
  const user = new User({
    name: 'Test User',
    email: `user${Date.now()}@example.com`,
    password: `pass-${Date.now()}-${Math.random()}`,
    ...overrides,
  });
  return await user.save();
};

describe('Group Model', () => {
  it('should create and save a group successfully', async () => {
    const trainer = await createTestUser({ name: 'Trainer One', email: 'trainer@example.com' });
    const trainee1 = await createTestUser({ name: 'Trainee One', email: 'trainee1@example.com' });
    const trainee2 = await createTestUser({ name: 'Trainee Two', email: 'trainee2@example.com' });

    const group = new Group({
      groupid: 101,
      name: 'Fitness Group',
      trainer: trainer._id,
      trainees: [trainee1._id, trainee2._id],
    });

    const savedGroup = await group.save();

    expect(savedGroup._id).toBeDefined();
    expect(savedGroup.name).toBe('Fitness Group');
    expect(savedGroup.trainer).toEqual(trainer._id);
    expect(savedGroup.trainees).toEqual(expect.arrayContaining([trainee1._id, trainee2._id]));
  });

  it('should fail to create a group without required fields', async () => {
    const group = new Group({ name: 'Incomplete Group' });

    let err;
    try {
      await group.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.groupid).toBeDefined();
    expect(err.errors.trainer).toBeDefined();
  });

  it('should not allow duplicate group names', async () => {
    const trainer = await createTestUser({ name: 'Trainer Two', email: 'trainer2@example.com' });

    const group1 = new Group({
      groupid: 102,
      name: 'Unique Group',
      trainer: trainer._id,
    });
    await group1.save();

    const group2 = new Group({
      groupid: 103,
      name: 'Unique Group', // Duplicate name
      trainer: trainer._id,
    });

    let err;
    try {
      await group2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // MongoDB duplicate key error
  });
});
