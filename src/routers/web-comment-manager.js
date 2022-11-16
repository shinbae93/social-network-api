const express = require('express');
const lodash = require('lodash');
const router = new express.Router();
const { Comment } = require('../models/_Comment');
const { CommentManager } = require('../services/CommentManager');
const { auth } = require('../middleware/auth');
//
const PATH = '/api/v1';
//
const commentManager = new CommentManager();

router.post(PATH + '/comments', async (req, res) => {
  const PICK_FIELDS = ['content', 'userId', 'postId'];
  const commentObj = lodash.pick(req.body, PICK_FIELDS);
  //
  try {
    const { comment } = await commentManager.createComment(commentObj);
    //
    res.send(comment);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put(PATH + '/comments', async (req, res) => {
  const PICK_FIELDS = ['content', 'commentId'];
  const updateCommentObj = lodash.pick(req.body, PICK_FIELDS);
  //
  try {
    const { comment } = await commentManager.updateComment(updateCommentObj);
    //
    res.send(comment);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete(PATH + '/comments/:id', async (req, res) => {
  //
  try {
    const { comment } = await commentManager.deleteComment(req.params.id);
    //
    res.send(comment);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
router.get(PATH + '/post/:id/comments', async (req, res) => {
  //
  try {
    const { comments } = await commentManager.getCommentByPost(req.params.id);
    //
    res.send(comments);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
module.exports = router;
