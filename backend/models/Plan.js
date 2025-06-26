// models/Plan.js
const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  exerciseType: { type: String, required: true },
  duration: { type: Number, required: true },  // Duration in minutes
  workoutType: { type: String, required: true },
  assignedTo: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' ,default:[]},
  createdAt: { type: Date, default: Date.now }
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
