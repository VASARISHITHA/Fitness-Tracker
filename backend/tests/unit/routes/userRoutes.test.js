const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const userRoutes = require('../../../routes/userRoutes');
const User = require('../../../models/userModel');

let app, mongoServer;

jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use('/api/users', userRoutes);
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /api/users/signup', () => {
  it('should create a new user successfully', async () => {
    const res = await request(app).post('/api/users/signup').send({
      name: 'ram',
      email: 'ram123@gmail.com',
      password: '123456',
      role: 'Trainer',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User created successfully!');
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('name', 'ram');
  });

  it('should fail when missing fields', async () => {
    const res = await request(app).post('/api/users/signup').send({
      name: 'vasa Rishitha',
      password: '310302',
      role: 'Trainee',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'All fields are required');
  });

  it('should not allow duplicate email registration', async () => {
    await request(app).post('/api/users/signup').send({
      name: 'vasa rishitha',
      email: 'vasarishitha2003@gmail.com',
      password: '310302',
      role: 'Trainee',
    });

    const res = await request(app).post('/api/users/signup').send({
      name: 'Rishitha',
      email: 'vasarishitha2003@gmail.com',
      password: '312003',
      role: 'Trainer',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'User already exists');
  });

  it('should return 500 on server error', async () => {
    // Temporarily override User.create to throw an error
    const originalSave = User.prototype.save;
    User.prototype.save = jest.fn().mockRejectedValue(new Error('DB error'));

    const res = await request(app).post('/api/users/signup').send({
      name: 'Broken User',
      email: 'broken@example.com',
      password: 'pass123',
      role: 'Trainer',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Something went wrong!');

    // Restore original behavior
    User.prototype.save = originalSave;
  });
});
