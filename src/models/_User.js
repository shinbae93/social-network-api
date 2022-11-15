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
// # virtual field
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'userId'
});

userSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'userId'
});

userSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'userId'
});

userSchema.virtual('shares', {
  ref: 'Share',
  localField: '_id',
  foreignField: 'userId'
});
//
const User = mongoose.model('User', userSchema);
//
module.exports = {
  User
};