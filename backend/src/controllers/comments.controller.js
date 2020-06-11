const commentCtrl = {};

const Comment = require("../models/Comment/Comment");

commentCtrl.addComment = async (req, res) => {
  const { text, user_id, post_id } = req.body;

  const newComment = await new Comment({
    text,
    user_id,
    post_id,
  });

  await newComment.save((err, commentAdded) => {
    if (err) {
      res.status(500).json({
        msg: `Error al añadir el comentario: ${err}`,
      });
    }

    res.status(201).json({
      msg: "Comentario añadido correctamente",
      comment: commentAdded,
    });
  });
};

commentCtrl.updateComment = async (req, res) => {
  const commentId = req.params.commentId;
  const updateComment = req.body;

  await Comment.findByIdAndUpdate(
    commentId,
    updateComment,
    (err, commentUpdated) => {
      if (err) {
        res.status(500).json({
          msg: `Error al actualizar el comentario: ${err}`,
        });
      }

      res.status(201).json({
        commentUpdated,
        msg: "Comentario actualizado correctamente",
      });
    }
  );
};

commentCtrl.deleteComment = async (req, res) => {
  const commentId = req.params.commentId;

  await Comment.findByIdAndDelete(commentId, (err, commentDeleted) => {
    if (err) {
      res.status(500).json({
        msg: `Error al eliminar el comentario: ${err}`,
      });
    }

    res.status(201).json({
      msg: "Comentario eliminado correctamente",
    });
  });
};

commentCtrl.getComment = async (req, res) => {
  const commentId = req.params.commentId;

  await Comment.findById(commentId, (err, commentRet) => {
    if (err) {
      res.status(500).json({
        msg: `Error al obtener el comentario: ${err}`,
      });
    }

    if (!commentRet) {
      res.status(404).json({
        msg: "El comentario solicitado no existe",
      });
    }
    res.status(201).json({
      commentRet,
      msg: "Comentario listado correctamente",
    });
  });
};

commentCtrl.listComments = async (req, res) => {
  const { postId } = req.params;
  await Comment.find({ post_id: postId }, (err, comments) => {
    if (err) {
      res.status(500).json({
        msg: `Error al listar los comentarios: ${err}`,
      });
    }

    if (!comments) {
      res.status(201).json({
        comments: [],
        msg: "No hay comentarios publicados para el post",
      });
    }
    res.status(201).json({
      comments,
      msg: "Comentarios listados correctamente",
    });
  });
  //.sort({ created_at: 1 })
};

commentCtrl.countComments = async (req, res) => {
  const { postId } = req.params;
  await Comment.find({ post_id: postId }, (err, comments) => {
    if (err) {
      res.status(500).json({
        msg: `Error al listar los comentarios: ${err}`,
      });
    }

    if (!comments) {
      res.status(404).json({
        msg: "No hay comentarios publicados",
      });
    }

    res.status(201).json({
      commentsCount: comments.length,
    });
  });
};

//List last two comments
commentCtrl.listLastTwoComments = async (req, res) => {
  const { postId } = req.params;
  await Comment.find({ post_id: postId }, (err, comments) => {
    if (err) {
      res.status(500).json({
        msg: `Error al listar los comentarios: ${err}`,
      });
    }

    if (!comments) {
      res.status(404).json({
        msg: "No hay comentarios publicados para el post",
      });
    }

    res.status(201).json({
      comments,
      msg: "Comentarios listados correctamente",
    });
  })
    .sort({ created_at: -1 })
    .limit(2);
};

module.exports = commentCtrl;
