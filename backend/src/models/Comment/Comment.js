const { Schema, model } = require("mongoose");

const CommentSchema = new Schema(
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
    post_id: {
      type: Schema.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Comment", CommentSchema);
