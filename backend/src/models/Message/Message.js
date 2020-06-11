const { Schema, model } = require("mongoose");

const MessageSchema = new Schema(
  {
    text: {
      type: String,
      default: "",
    },
    user_from: {
      type: Schema.ObjectId,
      ref: "User",
    },
    user_to: {
      type: Schema.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Message", MessageSchema);
