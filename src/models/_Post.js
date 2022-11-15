const mongoose = require('mongoose');
const validator = require('validator');
const lodash = require('lodash');
//
const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  attachments: {
    type: Object,
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  totalLikes: {
    type: Number,
    required: true,
    default: 0
  },
  totalComments: {
    type: Number,
    required: true,
    default: 0
  },
  totalShares: {
    type: Number,
    required: true,
    default: 0
  },
});
// # virtual field
postSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'postId'
});

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId'
});

postSchema.virtual('shares', {
  ref: 'Shares',
  localField: '_id',
  foreignField: 'postId'
});
//
const Post = mongoose.model('Post', postSchema);
//
module.exports = {
  Post
};