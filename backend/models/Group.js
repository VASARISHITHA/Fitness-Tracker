// models/Group.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema({
  groupid:{
    type:Number,
    required:true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  trainer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  trainees: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Group', GroupSchema);
