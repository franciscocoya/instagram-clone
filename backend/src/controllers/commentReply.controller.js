const commentReplyCtrl = {};

const CommentReply = require("../models/Comment/CommentReply");

commentReplyCtrl.addCommentReply = async (req, res) => {
  try {
    const { text, user_id, comment_id } = req.body;
    console.log(req.body);
    let newReply = await new CommentReply({ text, user_id, comment_id });
    await newReply.save((err1, successReplied) => {
      if (err1) {
        res.status(500).json({
          msg: `Se ha producido en el servidor al crear la respuesta al comentario. ${err1}`,
        });
      }

      res.status(201).json({
        commentReply: successReplied,
        msg: "Respuesta al comentario creada correctamente.",
      });
    });
  } catch (err) {
    console.log(
      `Se ha producido un error al crear la respuesta al comentario. ${err}`
    );
  }
};

commentReplyCtrl.deleteCommentReply = async (req, res) => {
  try {
  } catch (err) {
    console.log(
      `Se ha producido un error al borrar la respuesta al comentario. ${err}`
    );
  }
};

commentReplyCtrl.listCommentReplies = async (req, res) => {
  try {
    const { comment_id } = req.params;
    console.log(comment_id);
    await CommentReply.find({ comment_id }, (err1, list) => {
      if (err1) {
        res.status(500).json({
          msg: `Error en el servidor al listar las respuestas al comentario. ${err1}`,
        });
      }

      if (!list) {
        res.status(404).json({
          msg: `No hay respuestas para el comentario ${comment_id}.`,
        });
      }

      res.status(201).json({
        replies: list,
        msg: "Respuestas al comentario listadas correctamente.",
      });
    });
  } catch (err) {
    console.log(
      `Se ha producido un error al listas las respuestas al comentario. ${err}`
    );
  }
};

module.exports = commentReplyCtrl;
