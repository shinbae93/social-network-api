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
PostManager.prototype.findPosts = async function(criteria, more) {
  const posts = await Post.find();
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
