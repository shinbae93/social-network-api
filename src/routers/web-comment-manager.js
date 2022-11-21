const express = require('express');
const lodash = require('lodash');
const router = new express.Router();
const { CommentManager } = require('../services/CommentManager');
const { auth } = require('../middleware/auth');
//
const PATH = '/api/v1';
//
const commentManager = new CommentManager();

router.post(PATH + '/comments', auth, async (req, res) => {
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

router.put(PATH + '/comments/:id', auth, async (req, res) => {
  const commentId = req.params.id;
  const PICK_FIELDS = ['content'];
  const commentObj = lodash.pick(req.body, PICK_FIELDS);
  //
  try {
    const { comment } = await commentManager.updateComment(commentId, commentObj);
    //
    res.send(comment);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete(PATH + '/comments/:id', auth, async (req, res) => {
  const commentId = req.params.id;
  //
  try {
    const { comment } = await commentManager.deleteComment(commentId);
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
