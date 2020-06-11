const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      //select: false,
    },
    full_name: {
      type: String,
      required: true,
    },
    profile_picture: {
      type: Schema.Types.Mixed,
      required: false,
      default:
        "https://res.cloudinary.com/kikor211/image/upload/v1586763683/empty-profile-picture_cpur0m.png",
    },
    picFilename: {
      type: String,
      default: "empty-profile-picture.png",
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    website: {
      type: String,
      required: false,
    },
    is_business: {
      type: Boolean,
      required: false,
    },
    count: {
      media: {
        type: Number,
        default: 0,
      },
      follows: {
        type: Number,
        default: 0,
      },
      followed_by: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.encryptPassword = async (password) => {
  //Genera un hash y aplica el algoritmo 10 veces
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hash(password, salt);
  return hash; //Devuelve la contraseña cifrada
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("User", UserSchema);
