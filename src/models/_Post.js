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
}, {
  timestamps: true
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
// # Methods
postSchema.methods.toJSON = function () {
  const PICK_FIELDS = ["_id", "userId", "content", "attachments", "totalLikes", "totalComments", "totalShares", "comments", "createdAt", "updatedAt"];
  //
  const user = this;
  const userObject = lodash.pick(user, PICK_FIELDS);
  //
  return userObject;
}
//
const Post = mongoose.model('Post', postSchema);
//
module.exports = {
  Post
};