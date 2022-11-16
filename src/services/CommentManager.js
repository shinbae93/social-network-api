const lodash = require('lodash');
const { User } = require('../models/_User');
const { Post } = require('../models/_Post');
const { Like } = require('../models/_Like');
const { Comment } = require('../models/_Comment');
const { Share } = require('../models/_Share');
const jwt = require('jsonwebtoken');
//
function CommentManager(params) {}
//
CommentManager.prototype.createComment = async function (commentObj, more) {
  const comment = new Comment(commentObj);
  const post = await Post.findById(commentObj.postId);
  console.log(post);
  const newpost = await Post.findByIdAndUpdate(
    commentObj.postId,
    {
      totalComments: post.totalComments + 1
    },
    { new: true }
  );
  const output = {};
  //
  await comment.save();
  output.comment = comment;
  //
  return output;
};

CommentManager.prototype.updateComment = async function (updateCommentObj, more) {
  const comment = await Comment.findByIdAndUpdate(
    updateCommentObj.commentId,
    {
      content: updateCommentObj.content
    },
    { new: true }
  );
  const output = {};
  //
  output.comment = comment;
  //
  return output;
};
CommentManager.prototype.deleteComment = async function (commentId, more) {
  console.log(commentId);
  const comment = await Comment.findOneAndDelete(commentId);
  const post = await Post.findById(comment.postId);
  console.log(post);
  const newpost = await Post.findByIdAndUpdate(
    comment.postId,
    {
      totalComments: post.totalComments - 1
    },
    { new: true }
  );
  const output = {};
  //
  output.comment = comment;
  //
  return output;
};

CommentManager.prototype.getCommentByPost = async function (postId, more) {
  const comments = await Comment.find({
    postId
  });
  const output = {};
  //
  output.comments = comments;
  //
  return output;
};

/* Other services here */
//
module.exports = { CommentManager };
