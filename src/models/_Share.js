const mongoose = require('mongoose');
const validator = require('validator');
const lodash = require('lodash');
//
const shareSchema = new mongoose.Schema({
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
const Share = mongoose.model('Share', shareSchema);
//
module.exports = {
  Share
};