const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const groupRoutes = require('../../../routes/groupRoute');
const User = require('../../../models/userModel');
const Group = require('../../../models/Group');

let mongoServer;
let app;
jest.setTimeout(30000)
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use('/api', groupRoutes);
});

afterEach(async () => {
  await Group.deleteMany();
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Group Routes', () => {
  let trainer;
  let trainee1;
  let trainee2;

  beforeEach(async () => {
    trainer = new User({ name: 'ram', email: 'ram123@gmail.com',password:'123456' });
    trainee1 = new User({ name: 'saradhi', email: 'saradhi123@gmail.com',password:'123455' });
    trainee2 = new User({ name: 'siri', email: 'siri2003@gmail.com',password:'111222' });

    await trainer.save();
    await trainee1.save();
    await trainee2.save();
  });

  it('should create a new group', async () => {
    const res = await request(app)
      .post('/api/group/create')
      .send({
        name: 'Beginner Group-1',
        trainer: trainer._id,
        trainees: [trainee1._id, trainee2._id],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Group created successfully!');
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.name).toBe('Beginner Group-1');
    expect(res.body.data.trainees).toEqual(expect.arrayContaining([trainee1._id.toString(), trainee2._id.toString()]));
  });

  it('should fetch all groups', async () => {
    await new Group({
      groupid: 776,
      name: 'Morning Fitness',
      trainer: trainer._id,
      trainees: [trainee1._id],
    }).save();

    const res = await request(app).get('/api/groups');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Morning Fitness');
  });

  it('should fetch group details with members', async () => {
    const group = await new Group({
      groupid: 141,
      name: 'Morning cardio-1',
      trainer: trainer._id,
      trainees: [trainee1._id, trainee2._id],
    }).save();

    const res = await request(app).get(`/api/group/${group._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Morning cardio-1');
    expect(res.body.trainees).toHaveLength(2);
    expect(res.body.trainees[0].name).toBe('saradhi');
    expect(res.body.trainees[1].name).toBe('siri');
  });

  it('should return 404 for non-existent group', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/group/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Group not found');
  });
  it('should return 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/group/create')
      .send({
        name: '',
        trainer: trainer._id,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Group name and trainer ID are required.');
  });
});
