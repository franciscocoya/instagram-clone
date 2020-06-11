const mixCtrl = {};

const Post = require("../models/Post/Post");
const Follow = require("../models/Follow/Follow");
const User = require("../models/User/User");
const PostLike = require("../models/Like/PostLike");

mixCtrl.listFollowingPost = async (req, res) => {
  const userId = req.body;
  let arr = [];
  await Post.find(async (err, allPosts) => {
    if (err) {
      res.status(500).json({
        msg: `Se ha producido un error al listar los posts. ${err}`,
      });
    }

    if (!allPosts) {
      res.status(404).json({
        msg: `No hay posts publicados.`,
      });
    }
    try {
      await Promise.all(
        allPosts.map(async (post) => {
          if (post.user_id !== undefined && userId.userId !== undefined) {
            const postUserId = post.user_id;
            await Follow.findOne(
              { follow_by: userId.userId, follow_to: postUserId },
              (err, following) => {
                if (err) {
                  res.status(500).json({
                    msg: `Se ha producido un error al comprobar el follow. ${err}`,
                  });
                }
                if (following) {
                  arr.push(post);
                }
              }
            );
          }
        })
      );
      res.status(201).json({
        followingPosts: arr,
      });
    } catch (err) {
      console.log(
        `Se ha producido un error al listar los posts de los usuarios que sigue el usuario <${userId}>`
      );
    }
  });
};

mixCtrl.listNotFollowingPost = async (req, res) => {
  const { userId } = req.body;
  let arr = [];
  console.log(userId);
  await Post.find({ $nor: [{ user_id: userId }] }, async (err, allPosts) => {
    if (err) {
      res.status(500).json({
        msg: `Se ha producido un error al listar los posts. ${err}`,
      });
    }

    if (!allPosts) {
      res.status(404).json({
        msg: `No hay posts publicados.`,
      });
    }
    try {
      await Promise.all(
        allPosts.map(async (post) => {
          if (
            post.user_id !== undefined &&
            userId !== undefined &&
            post.user_id !== userId
          ) {
            await checkIsFollowing(userId, post.user_id)
              .then((result) => {
                if (!result) {
                  arr.push(post);
                }
              })
              .catch((err) => console.log(err));
          }
        })
      );

      res.status(201).json({
        notFollowingPosts: arr,
        allPosts: allPosts.length,
      });
    } catch (err) {
      console.log(
        `Se ha producido un error al listar los posts de los usuarios que sigue el usuario <${userId}>`
      );
    }
  });
};

const checkIsFollowing = async (currentUserId, id) => {
  const following = await Follow.findOne(
    { follow_by: currentUserId, follow_to: id },
    (err, isFollow) => {
      if (err) {
        console.log(`Se ha producido un error al comprobar el follow. ${err}`);
      }
    }
  );
  return following;
};

mixCtrl.listUsersNotFollow = async (req, res) => {
  const { userId } = req.params;
  await Follow.find({ $nor: [{ follow_by: userId }] }, async (err, total) => {
    if (err) {
      res.status(500).json({
        msg: `Se ha producido un error al contar los follows. ${err}`,
      });
    }
    if (!total) {
      res.status(404).json({
        notFollow: [],
        msg: `No hay follows.`,
      });
    }
    let arrResult = [];
    try {
      await Promise.all(
        total.map(async (follow) => {
          let nfUser = follow.follow_to;
          await User.findOne({ _id: nfUser }, (err2, user) => {
            if (err2) {
              return res.status(500).send({
                msg: `Error en la peticion: ${err2}`,
              });
            }
            if (user) {
              arrResult.push(user);
            }
          });
        })
      );
      res.status(201).json({
        usersNotFollowing: arrResult,
        msg: "Usuarios no seguidos listados correctamente.",
      });
    } catch (err1) {
      console.log(
        `Se ha producido un error al obtener los usuarios no seguidos. ${err1}`
      );
    }
  });
};

/**
 * List of likes given by the current user.
 */
mixCtrl.listPostUserLikes = async (req, res) => {
  try {
    const { userId } = req.params;
    await PostLike.find({ userId }, (err1, listLikes) => {
      if (err1) {
        res.status(500).json({
          msg: `Error en el servidor. No se han podido listar los likes. ${err1}`,
        });
      }

      if (!listLikes) {
        res.status(404).json({
          msg: "El usuario no ha dado like a ningún post",
        });
      }

      res.status(201).json({
        list: listLikes,
      });
    });
  } catch (err) {
    console.log(
      `Se ha producido un error al listar los usuarios que han dado like al post. ${err}`
    );
  }
};

module.exports = mixCtrl;
