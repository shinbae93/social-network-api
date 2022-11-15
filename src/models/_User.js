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
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email wrong format!")
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  refreshTokens: [{
    token: {
      type: String,
      required: true
    }
  }],
}, {
  timestamps: true
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
// # Methods
const HASH_TIMES = 8;
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to login!');
  }
  //
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login!');
  }
  //
  return user;
}
//
userSchema.methods.toJSON = function () {
  const PICK_FIELDS = ["_id", "name"];
  //
  const user = this;
  const userObject = lodash.pick(user, PICK_FIELDS);
  //
  return userObject;
}
// # Middle-wares
// Hash password
userSchema.pre('save', async function (next) {
  const user = this;
  //
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, HASH_TIMES);
  }
  //
  next();
});
//
const User = mongoose.model('User', userSchema);
//
module.exports = {
  User
};