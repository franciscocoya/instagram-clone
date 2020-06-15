const likeCtrl = {};

const PostLike = require("../models/Like/PostLike");

likeCtrl.addLike = async (req, res) => {
  const { postId, userId } = req.body;
  try {
    await PostLike.findOne({ postId, userId }, async (err, existLike) => {
      if (err) {
        res.status(500).json({
          msg: `Error al buscar el like: ${err}`,
        });
      }

      if (!existLike) {
        const newLike = await new PostLike({
          postId,
          userId,
        });
        try {
          await newLike.save((err2, like) => {
            if (err2) {
              res.status(500).json({
                msg: `Error al añadir el like: ${err2}`,
              });
            }
            res.status(201).json({
              msg: "Like añadido correctamente",
              like,
            });
          });
        } catch (err1) {
          console.log(`Se ha producido un error al guardar el like. ${err1}`);
        }
      } else {
        console.log(
          `Ya hay un like del usuario ${userId} en el post ${postId}.`
        );
        res.status(201).json({
          msg: `Ya hay un like del usuario ${userId} en el post ${postId}.`,
        });
      }
    });
  } catch (err) {
    console.log(`Se ha producido un error al añadir el like. ${err}`);
  }
};

likeCtrl.deleteLike = async (req, res) => {
  const { likeId } = req.params;
  await PostLike.findOneAndDelete({ _id: likeId }, (err, likeRemoved) => {
    if (err) {
      res.status(500).json({
        msg: `Error al eliminar el like:  ${err}`,
      });
    }

    res.status(201).json({
      msg: `Like eliminado correctamente`,
    });
  });
};

likeCtrl.getLike = async (req, res) => {
  const { postId, userId } = req.params;
  try {
    await PostLike.findOne({ postId, userId }, (err1, likeRet) => {
      if (err1) {
        res.status(500).json({
          msg: `Error al obtener el like:  ${err1}`,
        });
      }

      if (!likeRet) {
        res.status(404).json({
          msg: "No hay like",
        });
      }

      res.status(201).json({
        like: likeRet,
        msg: "Like mostrado correctamente",
      });
    });
  } catch (err) {
    console.log(`Se ha producido un error al obtener el like. ${err}`);
  }
};

likeCtrl.listLikes = async (req, res) => {
  const { postId } = req.params;
  await PostLike.find({ postId }, (err, likeList) => {
    if (err) {
      res.status(500).json({
        msg: `Error al listar los likes del post ${postId}:  ${err}`,
      });
    }

    if (!likeList) {
      res.status(404).json({
        msg: `No existen likes para el post ${postId}:  ${err}`,
      });
    }
    res.status(201).json({
      likes: likeList.length,
      msg: `Likes del post ${postId} listados correctamente`,
    });
  });
};

module.exports = likeCtrl;
