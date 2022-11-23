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
    //
    res.send(posts);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
/* Other routers here */
//
module.exports = router;
