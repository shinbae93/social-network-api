const lodash = require('lodash');
const { User } = require('../models/_User');
const jwt = require('jsonwebtoken');
//
function UserManager(params) {};
//
UserManager.prototype.findUsers = async function(criteria, more) {
  const users = await User.find();
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
  if (more && more.generateAuthToken === true) {
    const token = await this.generateAuthToken(user._id);
    user.refreshTokens = user.refreshTokens.concat({ token });
    //
    output.token = token;
  };
  //
  await user.save();
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
//
module.exports = { UserManager };
