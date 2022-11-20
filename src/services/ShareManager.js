const lodash = require('lodash');
const { User } = require('../models/_User');
const { Post } = require('../models/_Post');
const { Like } = require('../models/_Like');
const { Comment } = require('../models/_Comment');
const { Share } = require('../models/_Share');
const jwt = require('jsonwebtoken');
//
function ShareManager(params) {}
//
ShareManager.prototype.createShare = async function (shareObj, more) {
  const share = new Share(shareObj);
  const post = await Post.findById(shareObj.postId);
  const newPost = await Post.findByIdAndUpdate(
    shareObj.postId,
    {
      totalShares: post.totalShares + 1
    },
    { new: true }
  );
  const output = {};
  //
  await share.save();
  output.share = share;
  //
  return output;
};

ShareManager.prototype.deleteShare = async function (ShareId, more) {
  const share = await Share.findOneAndDelete(ShareId);
  const post = await Post.findById(share.postId);
  console.log(post);
  const newPost = await Post.findByIdAndUpdate(
    share.postId,
    {
      totalShares: post.totalShares - 1
    },
    { new: true }
  );
  const output = {};
  //
  output.share = share;
  //
  return output;
};

ShareManager.prototype.getShareByPost = async function (postId, more) {
  const shares = await Share.find({
    postId
  });
  const output = {};
  //
  output.shares = shares;
  //
  return output;
};

/* Other services here */
//
module.exports = { ShareManager };
