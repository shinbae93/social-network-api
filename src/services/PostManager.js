const lodash = require('lodash');
const { User } = require('../models/_User');
const { Post } = require('../models/_Post');
const { UserManager } = require('./UserManager');
const { LikeManager } = require('./LikeManager');
const { ShareManager } = require('./ShareManager');
var cloudinary = require('cloudinary').v2;
//
function PostManager(params) {}
const userManager = new UserManager();
const likeManager = new LikeManager();
const shareManager = new ShareManager();
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
  //
  if (!post) {
    throw new Error(`Not found post with id [${id}]!`);
  }
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
    //
    if (more && more.withShare === true) {
      lodash.set(queryObj, "$or", [
        { userId: queryObj.userId }
      ]);
      lodash.unset(queryObj, "userId");
      //
      const shares = await shareManager.getShareByUserId(userId);
      const postIds = []
      for (const item of shares) {
        postIds.push(item.postId);
      }
      queryObj["$or"].push({
        _id: { $in: postIds }
      });
    }
  }
  //
  let posts = await Post.find(queryObj)
    .sort([['createdAt', -1]])
    .populate('comments');
  const count = posts.length;
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
  // pagination
  let page = 0;
  if (more && more.withPagination === true) {
    const DEFAULT_LIMIT = 10;
    page = lodash.get(criteria, "page") || 1;
    const _start = DEFAULT_LIMIT * (page -1);
    const _end = DEFAULT_LIMIT * page;
    posts = lodash.slice(posts, _start, _end);
  }
  //
  const output = {
    count: count,
    page: page,
    rows: posts,
  }
  //
  return output;
};
//
PostManager.prototype.wrapExtraToFindPosts = async function (userId, posts, more) {
  for (let i in posts.rows) {
    if (posts.rows[i].attachments) {
      posts.rows[i].attachments = JSON.parse(posts.rows[i].attachments);
    }
    // isLike
    const like = await likeManager.findLikes({ userId, postId: posts.rows[i]._id });
    posts.rows[i].isLike = like.count === 0 ? false : true;
  }
  //
  return posts;
};
//
PostManager.prototype.getPost = async function (postId, more) {
  let post = await Post.findById(postId)
    .populate('comments');
  //
  if (!post) {
    throw new Error(`Not found post with id [${postId}]!`);
  }
  //
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
  // if (post.attachments) {
  //   post.attachments = JSON.parse(post.attachments);
  // }
  // // isLike
  // const like = await likeManager.findLikes({ userId: post.userId, postId: post._id });
  // post.isLike = like.count === 0 ? false : true;
  // //
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
