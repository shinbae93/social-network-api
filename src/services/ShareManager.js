const lodash = require('lodash');
const { User } = require('../models/_User');
const { Post } = require('../models/_Post');
const { Share } = require('../models/_Share');
//
function ShareManager(params) {}
//
ShareManager.prototype.createShare = async function (shareObj, more) {
  const share = new Share(shareObj);
  //
  const post = await Post.findById(shareObj.postId);
  if (!post) {
    throw new Error(`Not found post with id [${shareObj.postId}]`);
  }
  await Post.findByIdAndUpdate(shareObj.postId, {
    totalShares: post.totalShares + 1
  }, { new: true });
  const output = {};
  //
  await share.save();
  output.share = share;
  //
  return output;
};

ShareManager.prototype.deleteShare = async function (shareId, more) {
  const share = await Share.findOneAndDelete(shareId);
  //
  const post = await Post.findById(share.postId);
  if (!post) {
    throw new Error(`Not found post with id [${share.postId}]`);
  }
  await Post.findByIdAndUpdate(share.postId, {
    totalShares: post.totalShares - 1
  }, { new: true });
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
