const lodash = require('lodash');
const { User } = require('../models/_User');
const { Post } = require('../models/_Post');
const { Comment } = require('../models/_Comment');
//
function CommentManager(params) {}
//
CommentManager.prototype.createComment = async function (commentObj, more) {
  const comment = new Comment(commentObj);
  //
  const post = await Post.findById(commentObj.postId);
  if (!post) {
    throw new Error(`Not found post with id [${commentObj.postId}]`);
  }
  //
  await Post.findByIdAndUpdate(commentObj.postId, {
    totalComments: post.totalComments + 1
  }, { new: true });
  const output = {};
  //
  await comment.save();
  output.comment = comment;
  //
  return output;
};

CommentManager.prototype.updateComment = async function (commentId, commentObj, more) {
  const comment = await Comment.findByIdAndUpdate(commentId, {
    content: commentObj.content
  }, { new: true });
  const output = {};
  //
  output.comment = comment;
  //
  return output;
};
CommentManager.prototype.deleteComment = async function (commentId, more) {
  const comment = await Comment.findOneAndDelete(commentId);
  //
  const post = await Post.findById(comment.postId);
  if (!post) {
    throw new Error(`Not found post with id [${comment.postId}]`);
  }
  //
  await Post.findByIdAndUpdate(comment.postId, {
    totalComments: post.totalComments - 1
    }, { new: true });
  const output = {};
  //
  output.comment = comment;
  //
  return output;
};

CommentManager.prototype.getCommentByPost = async function (postId, more) {
  const comments = await Comment.find({
    postId
  }).sort([['createdAt', -1]]);
  const output = {};
  //
  output.comments = comments;
  //
  return output;
};

/* Other services here */
//
module.exports = { CommentManager };
