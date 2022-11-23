const mongoose = require('mongoose');
const validator = require('validator');
const lodash = require('lodash');
//
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true
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
    }
  },
  {
    timestamps: true
  }
);
//
const Comment = mongoose.model('Comment', commentSchema);
//
commentSchema.methods.toJSON = function () {
  const PICK_FIELDS = ["_id", "userId", "content", "attachments", "createdAt", "updatedAt"];
  //
  const comment = this;
  const commentObject = lodash.pick(comment, PICK_FIELDS);
  //
  return commentObject;
}
//
module.exports = {
  Comment
};
