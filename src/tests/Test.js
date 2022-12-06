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
  describe('function findUsers()', function () {
    it('[FUS-001] Find all users', async () => {
      // import 5 users
      await importUser();
      //
      const users = await userManager.findUsers();
      //
      assert.equal(users.count, 5);
    });
    //
    it('[FUS-002] Find users by name', async () => {
      // import 5 users
      await importUser();
      //
      const QUERY = {
        name: "Tran"
      }
      const users = await userManager.findUsers(QUERY);
      //
      assert.equal(users.count, 1);
      assert.equal(users.rows[0].name, "Tran Tan A");
    });
  });
  //
  describe('function getUser()', function () {
    it('[GUS-001] Get a user with defined id', async () => {
      // import 5 users
      await importUser();
      //
      const USER_ID = "638f3e18a812d5ddd888af29";
      let user = await userManager.getUser(USER_ID);
      user = lodash.pick(user.toJSON(), ["name", "email"]); 
      //
      const EXPECTED = {
        email: "a@gmail.com",
        name: "Tran Tan A"
      }
      assert.deepEqual(user, EXPECTED);
    });
    //
    it('[GUS-002] Get a user with undefined id, will throw error', async () => {
      // import 5 users
      await importUser();
      //
      const USER_ID = "638f3e18a812d5ddd888af28";
      //
      await assert.isRejected(userManager.getUser(USER_ID), "Not found user with id [638f3e18a812d5ddd888af28]!");
    });
  });
  //
  describe('function createUser()', function () {
    it('[CUS-001] Create a user with available data will ok', async () => {
      // import 5 users
      await importUser();
      //
      const USER_OBJ = {
        "name": "Le Minh Tri",
        "email": "tri@gmail.com",
        "password": "123456"
      };
      let { user } = await userManager.createUser(USER_OBJ);
      user = lodash.pick(user.toJSON(), ["name", "email"]); 
      //
      const EXPECTED = {
        email: "tri@gmail.com",
        name: "Le Minh Tri"
      }
      assert.deepEqual(user, EXPECTED);
    });
    //
    it('[CUS-002] Create a user with missing field will throw error', async () => {
      // import 5 users
      await importUser();
      //
      const USER_OBJ = {
        "name": "Le Minh Tri",
        "password": "123456"
      };
      await assert.isRejected(userManager.createUser(USER_OBJ), "User validation failed: email: Path `email` is required");
    });
    //
    it('[CUS-003] Create a user with duplicated field [email] will throw error', async () => {
      // import 5 users
      await importUser();
      //
      const USER_OBJ = {
        "name": "Le Minh Tri",
        "email": "a@gmail.com",
        "password": "123456"
      };
      await assert.isRejected(userManager.createUser(USER_OBJ), "E11000 duplicate key error collection: social-network-test.users index: email_1 dup key: { email: \"a@gmail.com\" }");
    });
  });
  //
  describe('function updateUser()', function () {
    it('[UUS-001] Update a user with undefined [id] will throw error', async () => {
      // import 5 users
      await importUser();
      //
      const USER_OBJ = {
        "name": "Le Minh Tri"
      };
      const USER_ID = "638f3e18a812d5ddd888af28";
      await assert.isRejected(userManager.updateUser(USER_ID, USER_OBJ), "Not found user with id [638f3e18a812d5ddd888af28]!");
    });
    //
    it('[UUS-002] Update a user with defined [id] will oke', async () => {
      // import 5 users
      await importUser();
      //
      const USER_OBJ = {
        "name": "Le Minh Tri"
      };
      const USER_ID = "638f3e18a812d5ddd888af29";
      //
      const oldUser = await userManager.getUser(USER_ID);
      assert.deepEqual(oldUser.name, "Tran Tan A");
      //
      await userManager.updateUser(USER_ID, USER_OBJ);
      //
      const newUser = await userManager.getUser(USER_ID);
      assert.deepEqual(newUser.name, "Le Minh Tri");
    });
    //
    it('[UUS-003] Update a user with duplicated [email] will throw error', async () => {
      // import 5 users
      await importUser();
      //
      const USER_OBJ = {
        "name": "Le Minh Tri",
        "email": "b@gmail.com",
      };
      const USER_ID = "638f3e18a812d5ddd888af29";
      await assert.isRejected(userManager.updateUser(USER_ID, USER_OBJ), "E11000 duplicate key error collection: social-network-test.users index: email_1 dup key: { email: \"b@gmail.com\" }");
    });
  });
  //
  describe('function deleteUser()', function () {
    it('[DUS-001] Delete a user with defined id', async () => {
      // import 5 users
      await importUser();
      //
      const USER_ID = "638f3e18a812d5ddd888af29";
      //
      let users = await userManager.findUsers();
      assert.deepEqual(users.count, 5);
      //
      await userManager.deleteUser(USER_ID);
      //
      users = await userManager.findUsers();
      assert.deepEqual(users.count, 4);
    });
    //
    it('[DUS-002] Delete a user with undefined id, will throw error', async () => {
      // import 5 users
      await importUser();
      //
      const USER_ID = "638f3e18a812d5ddd888af28";
      //
      await assert.isRejected(userManager.deleteUser(USER_ID), "Not found user with id [638f3e18a812d5ddd888af28]!");
    });
  });
});

const importUser = async function() {
  await User.deleteMany();
  try {
    for (const userObj of dataSample.users) {
      await User.create(userObj);
    }
  } catch (error) {
    console.log(error);
  }
  
};
