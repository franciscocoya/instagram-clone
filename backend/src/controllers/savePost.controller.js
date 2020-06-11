const savePostCtrl = {};

const SavedPost = require("../models/Saved/SavedPost");

savePostCtrl.addSavedPost = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    let newSavedPost = await new SavedPost({
      postId,
      userId,
    });

    let existSaved = await SavedPost.findOne({ postId, userId });

    if (!existSaved) {
      await newSavedPost.save((err1, successSaved) => {
        if (err1) {
          res.status(500).json({
            msg: `Error en el servidor al guardar el post en favoritos. ${err1}`,
          });
        }

        res.status(201).json({
          savedPost: successSaved,
          msg: "Post guardado en favoritos correctamente.",
        });
      });
    } else {
      console.log(`El post ya estaba añadido a favoritos.`);
    }
  } catch (err) {
    console.log(
      `Se ha producido un error al guardar el post en favoritos. ${err}`
    );
  }
};

savePostCtrl.deleteSavedPost = async (req, res) => {
  try {
    const { postSavedId } = req.params;
    await SavedPost.findOneAndDelete(
      { _id: postSavedId },
      (err1, deletedSavedPost) => {
        if (err1) {
          res.status(500).json({
            msg: `Error en el servidor al eliminar el post de favoritos. ${err1}`,
          });
        }

        res.status(201).json({
          msg: `Post eliminado de favoritos correctamente. `,
        });
      }
    );
  } catch (err) {
    console.log(
      `Se ha producido un error al eliminar el post de favoritos. ${err}`
    );
  }
};

savePostCtrl.getSavedPost = async (req, res) => {
  try {
    const { postId } = req.params;
    await SavedPost.findOne({ postId }, (err1, savedPost) => {
      if (err1) {
        res.status(500).json({
          msg: `Error en el servidor al obtener el post de favoritos. ${err1}`,
        });
      }
      res.status(201).json({
        savedPost,
        msg: `Post obtenido correctamente de favoritos.`,
      });
    });
  } catch (err) {
    console.log(
      `Se ha producido un error al obtener el post de favoritos. ${err}`
    );
  }
};

savePostCtrl.listSavedPost = async (req, res) => {
  try {
    const { userId } = req.params;
    await SavedPost.find({ userId }, (err1, list) => {
      if (err1) {
        res.status(500).json({
          msg: `Error en el servidor al listar los posts guardados por el usuario. ${err1}`,
        });
      }

      res.status(201).json({
        savedPosts: list,
        msg: `Posts guardados por el usuario listados correctamente.`,
      });
    }).populate("postId");
  } catch (err) {
    console.log(
      `Se ha producido un error al listar los posts guardados por el usuario. ${err}`
    );
  }
};

module.exports = savePostCtrl;
