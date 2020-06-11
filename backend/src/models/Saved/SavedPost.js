const { Schema, model } = require("mongoose");

const SavedPostSchema = new Schema(
  {
    postId: {
      type: Schema.ObjectId,
      ref: "Post",
      unique: true,
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

module.exports = model("SavedPost", SavedPostSchema);
