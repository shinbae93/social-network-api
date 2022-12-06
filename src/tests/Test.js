const chai = require("chai");
const chaiHttp = require("chai-http");
const chaiAsPromise = require("chai-as-promised");
const lodash = require('lodash')
require('../models/database/mongoose');
const { UserManager } = require('../services/UserManager');
const { User } = require('../models/_User');
const { dataSample } = require('./Data');
const { describe, it } = require('mocha');
// Assertion style
chai.should();

chai.use(chaiHttp);
chai.use(chaiAsPromise);

const assert = chai.assert;

const userManager = new UserManager();
//
describe('User', function () {
  describe('function getUsers()', function () {
    it('[GUS-001 Get all users]', async () => {
      await importUser();
    });
  });
});

const importUser = async function() {
  await User.deleteMany();
  try {
    for (const userObj of dataSample.users) {
      await User.create(userObj);
      // await userManager.createUser(user);
    }
  } catch (error) {
    console.log(error);
  }
  
};
