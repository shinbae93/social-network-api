const express = require('express');
const lodash = require('lodash');
const router = new express.Router();
const { PostManager } = require('../services/PostManager');
//
const PATH = '/api/v1';
//
const postManager = new PostManager();
//
router.get(PATH + '/posts', async function (req, res) {
  try {
    const posts = await postManager.findPosts();
    //
    res.send(posts);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/* Other routers here */
//
module.exports = router;