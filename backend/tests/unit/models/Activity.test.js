const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Activity = require('../../../models/Activity'); // Adjust path as needed
const User = require('../../../models/userModel');   // Ensure User model exists

let mongoServer;
jest.setTimeout(30000);
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Reusable helper to create test users
const createTestUser = async (overrides = {}) => {
  const user = new User({
    name: 'Test User',
    email: `user${Date.now()}@example.com`,
    password: `pass-${Date.now()}-${Math.random()}`,
    ...overrides,
  });
  return await user.save();
};

describe('Activity Model', () => {
  it('should create and save an activity successfully', async () => {
    const user = await createTestUser();

    const activity = new Activity({
      traineeId: user._id,
      date: new Date(),
      activityType: 'Running',
      duration: 30,
      city: 'New York',
      country: 'USA',
    });

    const savedActivity = await activity.save();

    expect(savedActivity._id).toBeDefined();
    expect(savedActivity.activityType).toBe('Running');
    expect(savedActivity.duration).toBe(30);
    expect(savedActivity.city).toBe('New York');
    expect(savedActivity.country).toBe('USA');
    expect(savedActivity.traineeId.toString()).toBe(user._id.toString());
    expect(savedActivity.createdAt).toBeDefined();
  });

  it('should fail to create an activity without required fields', async () => {
    const activity = new Activity({});

    let err;
    try {
      await activity.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.traineeId).toBeDefined();
    expect(err.errors.date).toBeDefined();
    expect(err.errors.activityType).toBeDefined();
    expect(err.errors.duration).toBeDefined();
    expect(err.errors.city).toBeDefined();
    expect(err.errors.country).toBeDefined();
  });

  it('should default createdAt to the current time', async () => {
    const user = await createTestUser();

    const activity = new Activity({
      traineeId: user._id,
      date: new Date(),
      activityType: 'Cycling',
      duration: 45,
      city: 'Berlin',
      country: 'Germany',
    });

    const savedActivity = await activity.save();

    const now = Date.now();
    expect(savedActivity.createdAt).toBeDefined();
    expect(savedActivity.createdAt.getTime()).toBeLessThanOrEqual(now);
  });
});
