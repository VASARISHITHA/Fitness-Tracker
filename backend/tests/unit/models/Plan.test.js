const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Plan = require('../../../models/Plan'); // Adjust the path as necessary

let mongoServer;
jest.setTimeout(30000); // Set a longer timeout for MongoDB operations
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
    }
  });

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});
describe('Plan Model', () => {
    it('should create and save a plan successfully', async () => {
      const validPlan = new Plan({
        planName: 'Morning Routine',
        exerciseType: 'Cardio',
        duration: 30,
        workoutType: 'HIIT',
      });
  
      const savedPlan = await validPlan.save();
  
      expect(savedPlan._id).toBeDefined();
      expect(savedPlan.planName).toBe('Morning Routine');
      expect(savedPlan.exerciseType).toBe('Cardio');
      expect(savedPlan.duration).toBe(30);
      expect(savedPlan.workoutType).toBe('HIIT');
    });
  
    it('should fail to create a plan without required fields', async () => {
      const planWithoutRequiredFields = new Plan({ planName: 'Evening Stretch' });
  
      let err;
      try {
        await planWithoutRequiredFields.save();
      } catch (error) {
        err = error;
      }
  
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.exerciseType).toBeDefined();
      expect(err.errors.duration).toBeDefined();
      expect(err.errors.workoutType).toBeDefined();
    });
  });
  