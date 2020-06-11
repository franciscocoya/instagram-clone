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
            msg: `Error al registrar el usuario: ${err}`,
          });
        }
        return res.status(200).json({
          user,
          token: service.createToken(user),
        });
      });
    } else {
      res.json({
        message: "El nombre de usuario " + username + " ya está cogido",
      });
    }
  } else {
    res.json({
      message: "Ya hay registrado una cuenta con el email: " + email,
    });
  }
}

async function signIn(req, res) {
  const { email, password } = req.body;
  await User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(500).json({ msg: err });
    }
    if (!user) {
      return res.status(404).json({ msg: "El usuario no existe" });
    }

    req.user = user;

    bcrypt.compare(password, user.password, async (err, valid) => {
      if (!valid) {
        return res.status(404).json({
          msg: "El usuario con email < " + user.email + " > no existe ",
        });
      }

      res.status(200).json({
        user: user,
        msg: "Te has logeado correctamente",
        token: await service.createToken(user),
      });
    });
  });
}

function isAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).json({ msg: "Acceso restringido" });
  }

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
}

module.exports = {
  signIn,
  signUp,
  isAuth,
};
