const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: false,
  },
  otpExpires: {
    type: Date,
    required: false,
  },
  contact: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;