const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const lodash = require('lodash');
//
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
});
//
const User = mongoose.model('User', userSchema);
//
module.exports = {
  User
};