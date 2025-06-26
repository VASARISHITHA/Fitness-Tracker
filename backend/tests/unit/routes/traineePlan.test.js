const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const traineePlanRoutes = require('../../../routes/traineePlan'); // Adjust the path as necessary
const Plan = require('../../../models/Plan');

let mongoServer;
let app;
jest.setTimeout(30000);
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use('/api', traineePlanRoutes);
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Trainee Plans Routes', () => {
  it('should return all plans assigned to a specific trainee (valid traineeId)', async () => {
    const traineeId = new mongoose.Types.ObjectId();
    const plan = await new Plan({
      planName: 'cardio-D1',
      exerciseType: 'jumping jacks',
      duration: 5,
      workoutType: 'cardio',
      assignedTo: [traineeId],
    }).save();

    const res = await request(app)
      .get(`/api/trainee-plans/assigned/${traineeId}`)
      .expect(200);

    expect(res.body).toHaveLength(1);
    expect(res.body[0].planName).toBe('cardio-D1');
    expect(res.body[0].assignedTo).toContain(traineeId.toString());
  });

  it('should return 400 for an invalid trainee ID', async () => {
    const invalidTraineeId = '675fe9819f03ca6bb46639@3';

    const res = await request(app)
      .get(`/api/trainee-plans/assigned/${invalidTraineeId}`)
      .expect(400);

    expect(res.body.error).toBe('Invalid trainee ID');
  });

  it('should return 500 if there is a server error while fetching plans', async () => {
    // Mock a failure in the Plan.find method
    jest.spyOn(Plan, 'find').mockRejectedValueOnce(new Error('Database error'));

    const traineeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/trainee-plans/assigned/${traineeId}`)
      .expect(500);

    expect(res.body.error).toBe('Failed to fetch assigned plans');
  });
});
