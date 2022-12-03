const express = require('express');
const lodash = require('lodash');
const router = new express.Router();
const { LikeManager } = require('../services/LikeManager');
const { PostManager } = require('../services/PostManager');
const { auth } = require('../middleware/auth');
//
const PATH = '/api/v1';
//
const likeManager = new LikeManager();
const postManager = new PostManager();

router.get(PATH + '/post/:id/likes', async (req, res) => {
  //
  try {
    const { likes } = await likeManager.getCommentByPost(req.params.id);
    //
    res.send(likes);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post(PATH + '/likes', auth, async (req, res) => {
  const PICK_FIELDS = ['userId', 'postId'];
  const likeObj = lodash.pick(req.body, PICK_FIELDS);
  //
  try {
    let result = {};
    //
    const like = await likeManager.findLikes(req.body);
    if(like.count > 0) {
      const likeDeleted = await likeManager.deleteLike(like._id);
      const post = await postManager.getPost(likeDeleted.postId);
      result = {
        action: "delete",
        totalLikes: post.totalLikes
      }
    } else {
      const likeCreated = await likeManager.createLike(likeObj);
      const post = await postManager.getPost(likeCreated.postId);
      result = {
        action: "create",
        totalLikes: post.totalLikes
      }
    }
    //
    res.send(result);
  } catch (error) {
  res.status(400).send({ message: error.message });
  }
});
//
module.exports = router;
