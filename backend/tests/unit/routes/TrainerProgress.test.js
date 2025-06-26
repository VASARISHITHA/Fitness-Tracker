const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const trainerProgressRoute = require('../../../routes/TrainerProgress');
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
  app.use('/api/progress', trainerProgressRoute);
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
    name: 'vamshi',
    email: `vamshi1981@gmail.com`,
    password: '019181',
  });
  return await user.save();
};

const createActivity = async (overrides = {}) => {
  const user = await createUser();
  const activity = new Activity({
    traineeId: user._id,
    date: new Date('2025-05-01'),
    activityType: 'Running',
    duration: 20,
    city: 'Hyderabad',
    country: 'India',
    ...overrides,
  });
  return await activity.save();
};

describe('Trainer Progress Route', () => {
  it('should filter activities by exact date', async () => {
    const activity = await createActivity();
    const date = activity.date.toISOString().split('T')[0];

    const res = await request(app).get(`/api/progress/trainer/filter?date=${date}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].activityType).toBe('Running');
  });

  it('should filter activities by month and year', async () => {
    await createActivity({ date: new Date('2025-05-10') });
    const res = await request(app).get('/api/progress/trainer/filter?month=05&year=2025');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should filter activities by year only', async () => {
    await createActivity({ date: new Date('2025-05-15') });
    const res = await request(app).get('/api/progress/trainer/filter?year=2025');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should filter activities by city (case-insensitive)', async () => {
    await createActivity({ city: 'Hyderabad' });
    const res = await request(app).get('/api/progress/trainer/filter?city=hyderabad');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should filter activities by country (case-insensitive)', async () => {
    await createActivity({ country: 'India' });
    const res = await request(app).get('/api/progress/trainer/filter?country=INDIA');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should filter activities by traineeId', async () => {
    const activity = await createActivity();
    const res = await request(app).get(`/api/progress/trainer/filter?traineeId=${activity.traineeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].traineeId).toBe(activity.traineeId.toString());
  });

  it('should return empty array if no match found', async () => {
    const res = await request(app).get('/api/progress/trainer/filter?city=Nowhere');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return 500 on server error', async () => {
    const originalFind = Activity.find;
    Activity.find = jest.fn().mockImplementation(() => {
      throw new Error('DB failure');
    });
  
    const res = await request(app).get('/api/progress/trainer/filter');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Server error');
  
    Activity.find = originalFind; // Restore original
  });
  
});
