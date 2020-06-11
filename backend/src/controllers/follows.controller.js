const followCtrl = {};

const Follow = require("../models/Follow/Follow");

//follow_to: Represent the user to follow
//follow_by: Represent the current user

//CREATE FOLLOW
followCtrl.follow = async (req, res) => {
  const { follow_to, follow_by } = req.body;

  const alreadyFollowing = await Follow.findOne({ follow_by, follow_to });
  const followByNotEqualsFollowTo = follow_by !== follow_to;

  if (!alreadyFollowing) {
    if (followByNotEqualsFollowTo) {
      const newFollow = new Follow({
        follow_by,
        follow_to,
      });

      await newFollow.save((err, followRet) => {
        if (err) {
          res.status(500).json({
            msg: `Se ha producido un error al crear el follow. ${err}`,
          });
        }

        res.status(201).json({
          follow: followRet,
          msg: `Follow creado correctamente`,
        });
      });
    } else {
      console.log("El usuario no puede seguirse a sí mismo.");
      res.status(201).json({
        msg: "El usuario no puede seguirse a sí mismo.",
      });
    }
  } else {
    console.log("El follow ya existe.");
    res.status(201).json({
      msg: "El follow ya existe.",
    });
  }
};

//UNFOLLOW
followCtrl.unfollow = async (req, res) => {
  const { follow_to, follow_by } = req.body;
  console.log(req.body);
  await Follow.findOneAndDelete(
    {
      follow_by,
      follow_to,
    },
    (err, followDeleted) => {
      if (err) {
        res.status(500).json({
          msg: `Se ha producido un error al eliminar el follow. ${err}`,
        });
      }

      res.status(201).json({
        follow: followDeleted,
        msg: `Follow eliminado correctamente.`,
      });
    }
  );
};

//GET FOLLOW
followCtrl.getFollow = async (req, res) => {
  console.log(req.body);
  const { follow_by, follow_to } = req.body;
  await Follow.findOne(
    { $and: [{ follow_by, follow_to }] },
    (err, following) => {
      if (err) {
        res.status(500).json({
          msg: `Se ha producido un error al comprobar el follow. ${err}`,
        });
      }
      if (!following) {
        res.status(201).json({
          msg: `El usuario ${follow_by} no sigue a ${follow_to}.`,
        });
      } else {
        res.status(201).json({
          following,
          msg: `El usuario ${follow_by} está siguiendo a ${follow_to}.`,
        });
      }
    }
  );
};

//GET ALL FOLLOWS
followCtrl.getAllFollows = async (req, res) => {
  await Follow.find((err, follows) => {
    if (err) {
      res.status(500).json({
        msg: `Se ha producido un error al listar todos los follows. ${err}`,
      });
    }

    // if (!follows) {
    //   res.status(404).json({
    //     msg: `Actualmente no hay follows`,
    //   });
    // }

    res.status(201).json({
      follows,
      msg: `Follows listados correctamente.`,
    });
  }).sort({ created_at: -1 });
};

//LIST FOLLOWS
followCtrl.listFollows = async (req, res) => {
  const { userId } = req.params;
  console.log(req.params);
  await Follow.find({ follow_by: userId }, (err, total) => {
    if (err) {
      res.status(500).json({
        msg: `Se ha producido un error al contar los follows. ${err}`,
      });
    }
    res.status(201).json({
      followsCount: total,
      msg: `Follow contados correctamente.`,
    });
  }).countDocuments();
};

//LIST FOLLOWED_BY
followCtrl.listFollowedBy = async (req, res) => {
  const { userId } = req.params;
  console.log(req.params);
  await Follow.find(
    { follow_to: userId, follow_by: { $ne: userId } },
    (err, total) => {
      if (err) {
        res.status(500).json({
          msg: `Se ha producido un error al contar los followers. ${err}`,
        });
      }

      res.status(201).json({
        followersCount: total,
        msg: `Followers contados correctamente.`,
      });
    }
  ).countDocuments();
};

followCtrl.isFollowing = async (req, res) => {
  const { follow_by, follow_to } = req.body;
  await Follow.findOne(
    { $and: [{ follow_by, follow_to }] },
    (err, following) => {
      if (err) {
        res.status(500).json({
          msg: `Se ha producido un error al comprobar el follow. ${err}`,
        });
      }
      if (following) {
        res.status(201).json({
          isFollowing: true,
          msg: `El usuario ${follow_by} está siguiendo a ${follow_to}.`,
        });
      } else {
        res.status(201).json({
          isFollowing: false,
          msg: `El usuario ${follow_by} no sigue a ${follow_to}.`,
        });
      }
    }
  );
};

module.exports = followCtrl;
