// tests/unit/routes/progressRoutes.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const progressRoutes = require('../../../routes/progressRoute');
const Activity = require('../../../models/Activity');
const User = require('../../../models/userModel');

let mongoServer;
let app;

jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = express();
  app.use(express.json());
  app.use('/api/progress', progressRoutes);
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const createUser = async () => {
  const user = new User({
    name: 'harsha',
    email: `harsha145@gmail.com`,
    password: '145145',
  });
  return await user.save();
};

const createActivity = async (userId, overrides = {}) => {
  return await Activity.create({
    traineeId: userId,
    date: new Date(),
    activityType: 'Running',
    duration: 30,
    city: 'hyderabad',
    country: 'India',
    ...overrides,
  });
};

describe('Progress Routes', () => {
  it('should categorize activities by type', async () => {
    const user = await createUser();

    await createActivity(user._id, { activityType: 'Running', duration: 30 });
    await createActivity(user._id, { activityType: 'Cycling', duration: 45 });
    await createActivity(user._id, { activityType: 'Running', duration: 25 });

    const res = await request(app).get(`/api/progress/${user._id}/progress`);
    expect(res.statusCode).toBe(200);
    expect(res.body.activitiesByType).toHaveProperty('running');
    expect(res.body.activitiesByType).toHaveProperty('cycling');
    expect(res.body.activitiesByType.running.length).toBe(2);
    expect(res.body.activitiesByType.cycling.length).toBe(1);
  });

  it('should return empty object if no activities found', async () => {
    const user = await createUser();
    const res = await request(app).get(`/api/progress/${user._id}/progress`);
    expect(res.statusCode).toBe(200);
    expect(res.body.activitiesByType).toEqual({});
  });

  it('should return 500 on server error', async () => {
    const res = await request(app).get('/api/progress/invalid-id/progress');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Failed to fetch progress data');
  });
});
