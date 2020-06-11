const { Schema, model } = require("mongoose");

const UrlSchema = new Schema(
  {
    urlCode: {
      type: String,
    },
    longUrl: {
      type: String,
    },
    shortUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Url", UrlSchema);
