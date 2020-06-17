"use strict";

const bcrypt = require("bcryptjs");

const User = require("../models/User/User");
const service = require("../services/index");

async function signUp(req, res) {
  const {
    username,
    password,
    email,
    full_name,
    profile_picture,
    bio,
    website,
    is_business,
    count: media,
    count: follows,
    count: followed_by,
  } = req.body;

  try {
    const existEmail = await User.findOne({ email: email });
    const existUsername = await User.findOne({ username: username });

    if (!existEmail) {
      if (!existUsername) {
        const user = new User({
          username,
          password,
          email,
          full_name,
          profile_picture,
          bio,
          website,
          is_business,
          count: media,
          count: follows,
          count: followed_by,
        });

        user.password = await user.encryptPassword(password);

        await user.save((err) => {
          if (err) {
            res.status(500).json({
              msg: `Server error occurred registering user... ${err}`,
            });
          }
          return res.status(200).json({
            user,
            token: service.createToken(user),
          });
        });
      } else {
        res.json({
          msg: "The username " + username + " is already taken.",
        });
      }
    } else {
      res.json({
        msg: `You have already registered an account with the email < ${email} >`,
      });
    }
  } catch (err) {
    console.log(`An error ocurred while registering the user. ${err}`);
  }
}

async function signIn(req, res) {
  const { email, password } = req.body;
  try {
    await User.findOne({ email }, async (err1, user) => {
      if (err1) {
        res.status(500).json({
          msg: `An error occurred while logging in the user... ${err1}`,
        });
      }
      if (!user) {
        res.status(404).json({ msg: "User does not exist." });
      }

      req.user = user;

      await bcrypt.compare(password, user.password, async (err2, valid) => {
        if (err2) {
          res.status(500).json({
            msg: `A server error ocurred while checking the password. ${err2}`,
          });
        }

        if (!valid) {
          res.status(404).json({
            msg: "El usuario con email < " + user.email + " > no existe ",
          });
        }

        let filtUser = new User({
          _id: user._id,
          username: user.username,
          full_name: user.full_name,
          email: user.email,
          profile_picture: user.profile_picture,
          bio: user.bio,
          website: user.website,
          count: {
            media: user.count.media,
            follows: user.count.follows,
            followed_by: user.count.followed_by,
          },
        });

        res.status(201).json({
          user: filtUser,
          msg: "Te has logeado correctamente",
          token: await service.createToken(user),
        });
      });
    }).select("+password");
  } catch (err) {
    console.log(`An error ocurred while logging the user. ${err}`);
  }
}

//Middleware isAuth
function isAuth(req, res, next) {
  if (!req.headers.authorization) {
    res.status(403).json({
      msg: "Unauthorized access for people not registered in the application.",
    });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    service
      .decodeToken(token)
      .then((response) => {
        req.user = response;
        next();
      })
      .catch((response) => {
        res.status(response.status);
      });
  } catch (err) {
    console.log(`An error occurred while checking user authenticity`);
  }
}

module.exports = {
  signIn,
  signUp,
  isAuth,
};
