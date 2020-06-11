const { Schema, model } = require("mongoose");

const PostLikeSchema = new Schema(
  {
    postId: {
      type: Schema.ObjectId,
      ref: "Post",
    },

    userId: {
      type: Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("PostLike", PostLikeSchema);
