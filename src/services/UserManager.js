const lodash = require('lodash');
const { User } = require('../models/_User');
const jwt = require('jsonwebtoken');
const vietnameseSlugify = require('vietnamese-slugify');
//
function UserManager(params) {};
//
UserManager.prototype.findUsers = async function(criteria, more) {
  const queryObj = {};
  //
  const nameQuery = criteria.name; 
  if(nameQuery) {
    const slugNameQuery = vietnameseSlugify(nameQuery);
    queryObj.slug = { "$regex": slugNameQuery }
  }
  const users = await User.find(queryObj);
  //
  const output = {
    rows: users,
    count: users.length
  }
  //
  return output;
};

UserManager.prototype.getUser = async function(userId, more) {
  const user = await User.findById(userId);
  //
  if (!user) {
    throw new Error(`Not found user with id [${userId}]!`);
  }
  //
  return user;
};

UserManager.prototype.createUser = async function(userObj, more) {
  const user = new User(userObj);
  const output = {};
  //
  await user.save();
  //
  if (more && more.generateAuthToken === true) {
    const token = await this.generateAuthToken(user._id);
    user.refreshTokens = user.refreshTokens.concat({ token });
    //
    output.token = token;
  };
  //
  output.user = user;
  //
  return output;
};

UserManager.prototype.generateAuthToken = async function(userId, more) {
  const user = await this.getUser(userId);
  const AUTH_KEY = 'social network';
  //
  const token = jwt.sign({
    _id: user._id,
    name: user.name,
    email: user.email
  }, AUTH_KEY, {expiresIn: 864000});
  //
  return token;
};

UserManager.prototype.updateUser = async function(userId, userObj, more) {
  const user = await User.findByIdAndUpdate(userId, userObj, { new: true, runValidators: true });
  //
  if (!user) {
    throw new Error(`Not found user with id [${userId}]!`);
  }
  await user.save();
  //
  return user;
};

UserManager.prototype.deleteUser = async function(userId, more) {
  const user = await User.findByIdAndDelete(userId);
  //
  if (!user) {
    throw new Error(`Not found user with id [${userId}]!`);
  }
  //
  return user;
};
//
module.exports = { UserManager };
