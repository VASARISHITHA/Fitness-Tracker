// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true ,unique:true},
  role: { type: String, enum:['Trainer','Trainee'],default: 'Trainee' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
