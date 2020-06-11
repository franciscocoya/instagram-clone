"use strict";

const jwt = require("jwt-simple");
const moment = require("moment");

function createToken(user) {
  const payload = {
    sub: user._id,
    //Fecha creacion token
    iat: moment().unix(),
    //Fecha expiración token
    exp: moment().add(14, "days").unix(),
  };

  return jwt.encode(payload, process.env.SECRET_TOKEN);
}

function decodeToken(token) {
  const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, process.env.SECRET_TOKEN);

      if (payload.exp <= moment().unix()) {
        return reject({
          status: 401,
          msg: "El token ha expirado",
        });
      }

      resolve(payload.sub);
    } catch (err) {
      reject({
        status: 500,
        msg: "Invalid Token",
      });
    }
  });

  return decoded;
}

module.exports = {
  createToken,
  decodeToken,
};
