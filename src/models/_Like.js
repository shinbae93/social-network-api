const mongoose = require('mongoose');
const validator = require('validator');
const lodash = require('lodash');
//
const likeSchema = new mongoose.Schema({
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
}, {
  timestamps: true
});
//
const Like = mongoose.model('Like', likeSchema);
//
module.exports = {
  Like
};