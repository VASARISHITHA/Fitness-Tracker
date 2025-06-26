const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const activityRoute = require('../../../routes/activityRoute');
const Activity = require('../../../models/Activity');
const User = require('../../../models/userModel');

let mongoServer;
let app;

jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use('/api/activity', activityRoute);
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Helper to create test users
const createTestUser = async () => {
  const user = new User({
    name: 'ramani',
    email: `ramani2002@gmail.com`,
    password: '250702',
  });
  return await user.save();
};

describe('Activity Routes', () => {
  it('should successfully post a new activity', async () => {
    const user = await createTestUser();
    const res = await request(app)
      .post('/api/activity/update')
      .send({
        traineeId: user._id,
        date: '2025-05-01',
        activityType: 'Swimming',
        duration: 25,
        city: 'hyderabad',
        country: 'India',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Activity updated successfully');
    expect(res.body.activity).toHaveProperty('_id');
    expect(res.body.activity.activityType).toBe('Swimming');
  });

  it('should return 400 if any field is missing', async () => {
    const res = await request(app)
      .post('/api/activity/update')
      .send({
        date: '2025-05-01',
        activityType: 'Running',
        duration: 30,
        city: 'delhi',
        country: '',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('All fields are required');
  });

  it('should return 500 if save fails (invalid ObjectId)', async () => {
    const res = await request(app)
      .post('/api/activity/update')
      .send({
        traineeId: '681096c43622c5927d425#26',
        date: '2025-05-01',
        activityType: 'Running',
        duration: 20,
        city: 'hyderabad',
        country: 'india',
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Failed to update activity');
  });
});
