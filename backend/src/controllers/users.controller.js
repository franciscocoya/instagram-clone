const userCtrl = {};
const bcrypt = require("bcryptjs");

const User = require("../models/User/User");

userCtrl.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findOne({ _id: userId }, (err1, user) => {
      if (err1) {
        return res.status(500).json({
          msg: `A server-side error ocurred getting the user... ${err1}`,
        });
      }
      if (!user) {
        return res.status(404).json({
          msg: "Th user does not exist.",
        });
      }

      res.status(201).json({
        user,
      });
    });
  } catch (err) {
    console.log(`An error ocurred while getting the user. ${err}`);
  }
};

userCtrl.getUserByUsername = async (req, res) => {
  try {
    const { otherUsername } = req.params;
    await User.findOne({ username: otherUsername }, (err1, user) => {
      if (err1) {
        res.status(500).send({
          msg: `Server-side error ocurred getting the user: ${err}`,
        });
      }
      res.status(201).send({
        user,
      });
    });
  } catch (err) {
    console.log(
      `An error ocurred while getting the user from their username. ${err}`
    );
  }
};

userCtrl.checkValidPass = async (req, res) => {
  const { userId, pass } = req.params;

  try {
    await User.findOne({ _id: userId }, async (err1, result) => {
      if (err1) {
        res.status(500).json({
          msg: `A server error ocurred while checking the pass. ${err1}`,
        });
      }

      const originalPass = result.password;
      await bcrypt.compare(pass, originalPass, (err2, valid) => {
        if (err2) {
          res.status(500).json({
            msg: `Server error while checking the pass. ${err2}`,
          });
        }
        if (!valid) {
          res.status(404).json({
            isValid: false,
          });
        } else {
          res.status(201).json({
            isValid: true,
          });
        }
      });
    }).select("+password");
  } catch (err) {
    console.log(`An error ocurred while checking the password... ${err}`);
  }
};

userCtrl.listUsers = async (req, res) => {
  try {
    await User.find((err1, users) => {
      if (err1) {
        res.status(500).json({
          msg: `A server-side error occurred listing users`,
        });
      }

      if (!users) {
        res.status(404).json({
          msg: "There are no users to list",
        });
      }

      res.status(201).send({
        users,
      });
    });
  } catch (err) {
    console.log(`An error ocurred while listing the users. ${err}`);
  }
};

userCtrl.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const update = req.body;

    await User.findOneAndUpdate(userId, update, (err1, userUpdated) => {
      if (err1) {
        res.status(500).json({
          msg: `Server-side error ocurred updating the user: ${err1}`,
        });
      }

      res.status(201).json({
        userUpdated,
      });
    });
  } catch (err) {
    console.log(`An error ocurred updating the user. ${err}`);
  }
};

userCtrl.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findOneAndDelete(userId, (err1, userDeleted) => {
      if (err1) {
        res.status(500).json({
          msg: `Server-side error ocurred deleting the user. ${err1}`,
        });
      }

      res.status(201).json({
        userDeleted,
      });
    });
  } catch (err) {
    console.log(`An error ocurred while deleting the user. ${err}`);
  }
};

userCtrl.changePass = async (req, res) => {
  try {
    const { newPass, userId } = req.params;
    console.log(req.params);

    const salt = await bcrypt.genSalt(10);
    await bcrypt.hash(newPass, salt, async (err1, hash) => {
      if (err1) {
        res.status(500).json({
          msg: `An error ocurred while hashing the password... ${err1}`,
        });
      }
      await User.findOneAndUpdate(
        userId,
        { password: hash },
        (err2, updated) => {
          if (err2) {
            res.status(500).json({
              msg: `A server error ocurred while updating the password... ${err2}`,
            });
          }
          res.status(201).json({
            updated,
            msg: `Password successfully updated`,
          });
        }
      );
    });
  } catch (err) {
    console.log(`An error ocurred while updating the password. ${err}`);
  }
};

userCtrl.getUserJWT = async (req, res) => {
  try {
    const { username } = req.params;
    await User.findOne({ username }, (err1, user) => {
      if (err1) {
        return res.status(500).send({
          msg: `Server-side error ocurred getting the user: ${err1}`,
        });
      }
      if (!user) {
        return res.status(404).send({
          msg: "The user does not exist.",
        });
      }

      res.status(201).send({
        user,
      });
    });
  } catch (err) {
    console.log(`An error ocurred while getting the user by jwt. ${err}`);
  }
};

userCtrl.getUserInitialization = async (req, res) => {
  try {
    const id = req.user;
    await User.findById(id, (err1, user) => {
      if (err1) {
        return res.status(500).send({
          msg: `Error en la peticion: ${err1}`,
        });
      }
      if (!user) {
        return res.status(404).send({
          msg: "The user does not exist.",
        });
      }

      res.status(201).send({
        user,
      });
    });
  } catch (err) {
    console.log(`An error occurred while initializing the app. ${err}`);
  }
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
              msg: `Server-side error ocurred searching the text. ${err}`,
            });
          }
          res.status(201).json({
            users: result,
          });
        }
      );
    } catch (err1) {
      console.log(`An error occurred while searching for users. ${err1}`);
    }
  } else {
    console.log("Invalid text input.");
  }
};

module.exports = userCtrl;
