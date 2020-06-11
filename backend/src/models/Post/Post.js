const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    thumbnail: {
      type: String,
      default: "",
      required: true,
    },
    description: {
      type: String,
      default: "",
      required: false,
    },
    user_id: {
      type: Schema.ObjectId,
      ref: "User",
    },
    imgFilter: {
      type: String,
      enum: [
        "_1977",
        "aden",
        "amaro",
        "brannan",
        "brooklyn",
        "clarendon",
        "gingham",
        "hudson",
        "inkwell",
        "kelvin",
        "lark",
        "lofi",
        "mayfair",
        "moon",
        "nashville",
        "perpetua",
        "reyes",
        "rise",
        "slumber",
        "stinson",
        "toaster",
        "valencia",
        "walden",
        "willow",
        "xpro2",
      ],
      required: false,
    },
    place: {
      name: {
        type: String,
        default: "",
        required: false,
      },
      countryCode: {
        type: String,
        default: "",
        required: false,
      },
      flag: {
        type: String,
        default: "",
        required: false,
      },
      location: {
        lat: {
          type: Number,
          default: 0,
          required: false,
        },
        lng: {
          type: Number,
          default: 0,
          required: false,
        },
      },
    },
    tags: {
      type: Array,
      default: [],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", PostSchema);
