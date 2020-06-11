const { Schema, model } = require("mongoose");

const CommentReplySchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      default: "",
    },

    user_id: {
      type: Schema.ObjectId,
      ref: "User",
    },

    comment_id: {
      type: Schema.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("CommentReply", CommentReplySchema);
