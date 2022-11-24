const lodash = require('lodash');
const { User } = require('../models/_User');
const { Post } = require('../models/_Post');
const { UserManager } = require('./UserManager');
var cloudinary = require('cloudinary').v2;
//
function PostManager(params) {}
const userManager = new UserManager();
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
  // Build query
  const queryObj = {};
  const userId = lodash.get(criteria, "userId");
  if (userId) {
    lodash.set(queryObj, "userId", userId);
  }
  //
  let posts = await Post.find(queryObj)
    .sort([['createdAt', -1]])
    .populate('comments');
  posts = lodash.map(posts, function(item) {
    return item.toJSON();
  });
  //
  for (let i in posts) {
    let user = await userManager.getUser(posts[i].userId);
    lodash.set(posts[i], "user", user.toJSON());
    //
    for (let j in posts[i].comments) {
      posts[i].comments[j] = posts[i].comments[j].toJSON();
      let commentedUser = await userManager.getUser(posts[i].comments[j].userId);
      lodash.set(posts[i].comments[j], "userName", commentedUser.name);
    }
  }
  //
  const output = {
    rows: posts,
    count: posts.length
  };
  //
  return output;
};
//
PostManager.prototype.getPost = async function (postId, more) {
  let post = await Post.findById(postId)
    .populate('comments');
  post = post.toJSON();
  //
  let user = await userManager.getUser(post.userId);
  lodash.set(post, "user", user.toJSON());
  //
  for (let j in post.comments) {
    post.comments[j] = post.comments[j].toJSON();
    let commentedUser = await userManager.getUser(post.comments[j].userId);
    lodash.set(post.comments[j], "userName", commentedUser.name);
  }
  //
  return post;
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
