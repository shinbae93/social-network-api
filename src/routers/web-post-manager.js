const express = require('express');
const lodash = require('lodash');
const router = new express.Router();
const { PostManager } = require('../services/PostManager');
const { auth } = require('../middleware/auth');
const fileUploader = require('../middleware/cloudinary');
//
const PATH = '/api/v1';
//
const postManager = new PostManager();
//
router.post(PATH + '/posts', [auth, fileUploader.array('attachments')], async (req, res) => {
  const PICK_FIELDS = ['content', 'userId'];
  const postObj = lodash.pick(req.body, PICK_FIELDS);
  //
  if (req.files) {
    let attachments = [];
    req.files.forEach(function (el) {
      attachments.push(el.path);
    });
    postObj.attachments = JSON.stringify(attachments);
  }
  //
  try {
    const { post } = await postManager.createPost(postObj);
    //
    res.send(post);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.patch(PATH + '/posts/:id', [auth, fileUploader.array('attachments')], async (req, res) => {
  const id = req.params.id;
  const PICK_FIELDS = ['content'];
  const postObj = lodash.pick(req.body, PICK_FIELDS);
  //
  let attachments = [];
  req.files.forEach(function (el) {
    attachments.push(el.path);
  });
  postObj.attachments = JSON.stringify(attachments);
  // remove old image
  postManager.removeImage(id);
  //
  try {
    const { post } = await postManager.updatePost(id, postObj);
    //
    res.send(post);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/posts', auth, async function (req, res) {
  try {
    const posts = await postManager.findPosts();
    const postsExtra = await postManager.wrapExtraToFindPosts(req.user._id, posts);
    //
    res.send(postsExtra);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/posts/:id', auth, async function (req, res) {
  const postId = req.params.id;
  try {
    const post = await postManager.getPost(postId);
    //
    res.send(post);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/posts/of/me', auth, async function (req, res) {
  const userId = req.user._id;
  try {
    const criteria = {};
    if (userId) {
      lodash.set(criteria, "userId", userId);
    }
    const posts = await postManager.findPosts(criteria);
    const postsExtra = await postManager.wrapExtraToFindPosts(userId, posts);
    //
    res.send(postsExtra);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/posts/of/users/:id', auth, async function (req, res) {
  const userId = req.params.id;
  try {
    const criteria = {};
    if (userId) {
      lodash.set(criteria, "userId", userId);
    }
    const posts = await postManager.findPosts(criteria);
    const postsExtra = await postManager.wrapExtraToFindPosts(req.user._id, posts);
    //
    res.send(postsExtra);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
module.exports = router;
