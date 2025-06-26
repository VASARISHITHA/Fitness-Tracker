const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  traineeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  activityType: { type: String, required: true },
  duration: { type: Number, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);
