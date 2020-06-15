const userCtrl = {};
const bcrypt = require("bcryptjs");

const User = require("../models/User/User");

userCtrl.getUser = async (req, res) => {
  const id = req.params.userId;

  await User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).send({
        msg: `Error en la peticion: ${err}`,
      });
    }
    if (!user) {
      return res.status(404).send({
        msg: "El usuario no existe",
      });
    }

    res.status(201).send({
      user,
    });
  });
};

userCtrl.getUserByUsername = async (req, res) => {
  const { otherUsername } = req.params;
  console.log(req.params);
  await User.findOne({ username: otherUsername }, (err, user) => {
    if (err) {
      return res.status(500).send({
        msg: `Error en la peticion: ${err}`,
      });
    }
    res.status(201).send({
      user,
      msg: "Usuario obtenido correctamente.",
    });
  });
};

userCtrl.listUsers = async (req, res) => {
  await User.find((err, users) => {
    if (err) {
      res.status(500).json({
        msg: `Error en la peticion`,
      });
    }

    if (!users) {
      res.status(404).json({
        msg: "No hay usuarios",
      });
    }

    res.status(201).send({
      users,
    });
  });
};

userCtrl.updateUser = async (req, res) => {
  const id = req.params.userId;
  const update = req.body;

  await User.findByIdAndUpdate(id, update, (err, userUpdated) => {
    if (err) {
      res.status(500).json({
        msg: `Error al actualizar el usuario: ${err}`,
      });
    }

    res.status(201).json({
      userUpdated,
      msg: "Usuario actualizado correctamente",
    });
  });
};

userCtrl.deleteUser = async (req, res) => {
  const id = req.params.userId;
  console.log(id);

  await User.findByIdAndDelete(id, (err, userDeleted) => {
    if (err) {
      res.status(500).json({
        msg: `Error al actualizar el usuario: ${err}`,
      });
    }

    res.status(201).json({
      userDeleted,
      msg: "Usuario eliminado correctamente",
    });
  });
};

userCtrl.changePass = async (req, res) => {
  const { oldPassword, newPassword, user } = req.body;
  console.log(req.body);

  const salt = await bcrypt.genSalt(10);
  const hashNewPassword = await bcrypt.hash(oldPassword, salt);

  await User.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { password: hashNewPassword } }
  );
};

//--

userCtrl.getUserJWT = async (req, res) => {
  console.log("loading getUserJWT...");
  let { username } = req.params;
  console.log("username: " + username);
  await User.findOne({ username }, (err, user) => {
    if (err) {
      return res.status(500).send({
        msg: `Error en la peticion: ${err}`,
      });
    }
    if (!user) {
      return res.status(404).send({
        msg: "El usuario no existe",
      });
    }

    res.status(201).send({
      msg: "Datos del usuario correctos !",
      user,
    });
    console.log(user);
  });
};

userCtrl.getUserInitialization = async (req, res) => {
  console.log("Inicializando linea(132) getUserInitialization...");
  const id = req.user;
  await User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).send({
        msg: `Error en la peticion: ${err}`,
      });
    }
    if (!user) {
      return res.status(404).send({
        msg: "El usuario no existe",
      });
    }

    res.status(201).send({
      msg: "Datos del usuario correctos !",
      user,
    });
  });
};

userCtrl.initUser = async (req, res) => {
  res.status(201).json({
    user: req.user,
  });
};

userCtrl.searchByPartialText = async (req, res) => {
  const { textToSearch } = req.params;
  if (textToSearch !== null && textToSearch !== undefined) {
    try {
      await User.find(
        {
          $or: [
            { username: { $regex: textToSearch, $options: "i" } },
            { full_name: { $regex: textToSearch, $options: "i" } },
          ],
        },
        (err, result) => {
          if (err) {
            res.status(500).json({
              msg: `Se ha producido un error en la búsqueda. ${err}`,
            });
          }
          res.status(201).json({
            users: result,
            msg: `Búsqueda realizada correctamente !`,
          });
        }
      );
    } catch (err1) {
      console.log(
        `Se ha producido un error al realizar la búsqueda de los usuarios. ${err1}`
      );
    }
  } else {
    console.log("La entrada de texto no es válida.");
  }
};

module.exports = userCtrl;
