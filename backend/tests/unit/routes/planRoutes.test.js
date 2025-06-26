const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const planRoutes = require('../../../routes/planRoute');
const Plan = require('../../../models/Plan');

let mongoServer;
let app;
jest.setTimeout(30000)
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use('/api', planRoutes);
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

describe('Plan Routes', () => {
  it('should create a new plan', async () => {
    const res = await request(app).post('/api/plans').send({
      planName: 'HIIT-H3',
      exerciseType: 'jump squats',
      duration: 20,
      workoutType: 'HIIT',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.plan).toHaveProperty('_id');
    expect(res.body.plan.planName).toBe('HIIT-H3');
  });

  it('should fetch all plans', async () => {
    await new Plan({
      planName: 'cardio-D1',
      exerciseType: 'swimming',
      duration: 15,
      workoutType: 'cardio',
    }).save();

    const res = await request(app).get('/api/plans');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should assign a plan to a trainee', async () => {
    const plan = await new Plan({
      planName: 'Fitness',
      exerciseType: 'Yoga',
      duration: 20,
      workoutType: 'strength',
    }).save();

    const traineeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/trainee-plans/assign/${plan._id}`)
      .send({ traineeId });

    expect(res.statusCode).toBe(200);
    expect(res.body.plan.assignedTo).toContain(traineeId.toString());
  });

  it('should return 404 when assigning to a nonexistent plan', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/trainee-plans/assign/${fakeId}`)
      .send({ traineeId: new mongoose.Types.ObjectId() });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Plan not found');
  });

  it('should return 400 if plan is already assigned to trainee', async () => {
    const traineeId = new mongoose.Types.ObjectId();
    const plan = await new Plan({
      planName: 'cardio-D1',
      exerciseType: 'jumping jacks',
      duration: 5,
      workoutType: 'cardio',
      assignedTo: [traineeId],
    }).save();

    const res = await request(app)
      .put(`/api/trainee-plans/assign/${plan._id}`)
      .send({ traineeId });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('This plan is already assigned to another trainee');
  });
});
