const lodash = require('lodash');
const { User } = require('../models/_User');
const { Post } = require('../models/_Post');
const { CommentManager } = require('./CommentManager');
var cloudinary = require('cloudinary').v2;
//
function PostManager(params) {}
//
PostManager.prototype.createPost = async function (postObj, more) {
  const post = new Post(postObj);
  const output = {};
  //
  await post.save();
  output.post = post;
  //
  return output;
};
//
PostManager.prototype.updatePost = async function (id, postObj, more) {
  const post = await Post.findByIdAndUpdate({ _id: id }, postObj, {
    new: true
  });
  const output = {};
  //
  output.post = post;
  //
  return output;
};
//
PostManager.prototype.findPosts = async function (criteria, more) {
  let posts = await Post.find()
    .sort([['createdAt', -1]])
    .populate('comments');
  //
  const output = {
    rows: posts,
    count: posts.length
  };
  //
  return output;
};
//
PostManager.prototype.removeImage = async function (id, more) {
  let posts = await Post.findById(id);
  //
  if (posts.attachments.length != 0) {
    JSON.parse(posts.attachments).map(el => {
      const string = 'posts/' + el.split('/').pop().split('.')[0];
      cloudinary.uploader.destroy(string, function (error, result) {});
    });
    //
  }
  //
};
//
/* Other services here */
//
module.exports = { PostManager };
