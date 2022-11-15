const mongoose = require('mongoose');
const validator = require('validator');
const lodash = require('lodash');
//
const commentSchema = new mongoose.Schema({
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
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  },
});
//
const Comment = mongoose.model('Comment', commentSchema);
//
module.exports = {
  Comment
};