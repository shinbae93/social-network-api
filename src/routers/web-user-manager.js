const express = require('express');
const lodash = require('lodash');
const router = new express.Router();
const { User } = require('../models/_User');
const { UserManager } = require('../services/UserManager');
//
const PATH = '/api/v1';
//
const userManager = new UserManager();
//
router.get(PATH + '/users', async function (req, res) {
  try {
    const users = await userManager.findUsers();
    //
    res.send(users);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/* Other routers here */
//
module.exports = router;