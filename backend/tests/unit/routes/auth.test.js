const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRoutes = require('../../../routes/auth');
const User = require('../../../models/userModel');

let app, mongoServer;
const JWT_SECRET = 'Rishitha'; // Replace or load from .env if needed

jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());

  // Mock JWT secret
  process.env.JWT_SECRET = JWT_SECRET;

  app.use('/api/auth', authRoutes);
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /api/auth/login', () => {
  it('should log in a user and return a token', async () => {
    const hashedPassword = await bcrypt.hash('mypassword', 10);
    const user = await User.create({
      name: 'vasa Rishitha',
      email: 'vasarishitha2003@gmail.com',
      password:'$2b$10$iRRP9gMY0quo3LLk2s6amug9OjR6t6z5cHq2cMWSfL.fTFQeFnc9G',
      role: 'Trainee',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'vasarishitha2003@gmail.com',
      password: '310302',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(user.email);
  });

  it('should return 404 if user not found', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'anitha2003@gmail.com',
      password: '101981',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });

  it('should return 400 for incorrect password', async () => {
    const hashedPassword = await bcrypt.hash('correctpass', 10);
    await User.create({
      name: 'siri',
      email: 'siri2003@gmail.com',
      password: hashedPassword,
      role: 'Trainer',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'siri2003@gmail.com',
      password: '123123',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('should return 500 on server error', async () => {
    const findOneSpy = jest.spyOn(User, 'findOne').mockRejectedValue(new Error('DB error'));

    const res = await request(app).post('/api/auth/login').send({
      email: 'saradhi123@gmail.com',
      password: '123455',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Server error');

    findOneSpy.mockRestore();
  });
});
