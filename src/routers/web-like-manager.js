const express = require('express');
const lodash = require('lodash');
const router = new express.Router();
const { LikeManager } = require('../services/LikeManager');
const { auth } = require('../middleware/auth');
//
const PATH = '/api/v1';
//
const likeManager = new LikeManager();

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
    const { like } = await likeManager.createLike(likeObj);
    //
    res.send(like);
  } catch (error) {
  res.status(400).send({ message: error.message });
  }
});

router.delete(PATH + '/likes/:id', auth, async (req, res) => {
  //
  try {
    const { like } = await likeManager.deleteLike(req.params.id);
    //
    res.send(like);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
module.exports = router;
