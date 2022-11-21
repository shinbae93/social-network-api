const lodash = require('lodash');
const { User } = require('../models/_User');
const { Post } = require('../models/_Post');
const { Like } = require('../models/_Like');
const { Comment } = require('../models/_Comment');
const { Share } = require('../models/_Share');
const jwt = require('jsonwebtoken');
//
function PostManager(params) {};
//
PostManager.prototype.createPost = async function(postObj, more) {
  const post = new Post(postObj);
  const output = {};
  //
  await post.save();
  output.post = post;
  //
  return output;
};
//
PostManager.prototype.findPosts = async function(criteria, more) {
  const posts = await Post.find().sort([['createdAt', -1]]);
  //
  const output = {
    rows: posts,
    count: posts.length
  }
  //
  return output;
};

/* Other services here */
//
module.exports = { PostManager };
