const express = require('express');
const lodash = require('lodash');
const router = new express.Router();
const { PostManager } = require('../services/PostManager');
const { auth } = require('../middleware/auth');
//
const PATH = '/api/v1';
//
const postManager = new PostManager();
//
router.post(PATH + '/posts', auth, async (req, res) => {
  const PICK_FIELDS = ["content", "attachments", "userId"];
  const postObj = lodash.pick(req.body, PICK_FIELDS);
  //
  try {
    const { post } = await postManager.createPost(postObj);
    //
    res.send(post);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/posts', auth, async function (req, res) {
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