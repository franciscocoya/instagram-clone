const { Schema, model } = require("mongoose");

const FollowSchema = new Schema(
  {
    follow_by: {
      type: Schema.ObjectId,
      ref: "User",
    },

    follow_to: {
      type: Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Follow", FollowSchema);
