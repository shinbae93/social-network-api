const lodash = require('lodash');
const { User } = require('../models/_User');
const { Post } = require('../models/_Post');
const { Like } = require('../models/_Like');
//
function LikeManager(params) {};
//
LikeManager.prototype.findLikes = async function(criteria, more) {
  const queryObj = {};
  //
  const userIdQuery = criteria.userId;
  if (userIdQuery) {
    queryObj.userId = userIdQuery;
  } 
  //
  const postIdQuery = criteria.postId;
  if (postIdQuery) {
    queryObj.postId = postIdQuery;
  } 
  const likes = await Like.find(queryObj);
  //
  const output = {
    rows: likes,
    count: likes.length
  }
  //
  return output;
};

LikeManager.prototype.getLikeByPost = async function(postId, more) {
  const likes = await Like.find({
    postId
  });
  const output = {};
  //
  output.likes = likes;
  //
  return output;
};

LikeManager.prototype.createLike = async function (likeObj, more) {
  const like = new Like(likeObj);
  //
  const post = await Post.findById(likeObj.postId);
  if (!post) {
    throw new Error(`Not found post with id [${likeObj.postId}]`);
  }
  //
  await Post.findByIdAndUpdate(likeObj.postId, {
    totalLikes: post.totalLikes + 1
  }, { new: true });
  //
  await like.save();
  return like;
};

LikeManager.prototype.deleteLike = async function (likeId, more) {
  const like = await Like.findOneAndDelete(likeId);
  //
  const post = await Post.findById(like.postId);
  if (!post) {
    throw new Error(`Not found post with id [${like.postId}]`);
  }
  //
  await Post.findByIdAndUpdate(like.postId, {
    totalLikes: post.totalLikes - 1
  }, { new: true });
  //
  return like;
};
//
module.exports = { LikeManager };