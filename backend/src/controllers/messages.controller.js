const msgCtrl = {};

const Message = require("../models/Message/Message");

msgCtrl.addMessage = async (req, res) => {
  const { text, user_from, user_to, image } = req.body;
  console.log(image);

  try {
    const newMessage =
      image !== null && image !== undefined
        ? await new Message({ text, user_from, user_to, image })
        : await new Message({ text, user_from, user_to });

    await newMessage.save((err1, msgSaved) => {
      if (err1) {
        res.status(500).json({
          msg: `Se ha producido un error al añadir el nuevo mensaje. ${err1}`,
        });
      }

      res.status(201).json({
        msgSaved,
        msg: "Mensaje guardado correctamente.",
      });
    });
  } catch (err) {
    console.log(`Se ha producido un error al guardar en el mensaje. ${err}`);
  }
};

msgCtrl.removeMessage = async (req, res) => {
  try {
    const { msgId } = req.params;
    await Message.findOneAndDelete({ _id: msgId }, (err1, messageRes) => {
      if (err1) {
        res.status(500).json({
          msg: `Se ha producido un error al eliminar el mensaje. ${err1}`,
        });
      }
      res.status(201).json({
        msg: "El mensaje se ha eliminado correctamente.",
      });
    });
  } catch (err) {
    console.log(`Se ha producido un error al obtener el mensaje. ${err}`);
  }
};

msgCtrl.getMessage = async (req, res) => {
  try {
    const { msgId } = req.params;
    await Message.findOne({ _id: msgId }, (err1, messageRes) => {
      if (err1) {
        res.status(500).json({
          msg: `Se ha producido un error al obtener el mensaje. ${err1}`,
        });
      }

      if (!messageRes) {
        res.status(404).json({
          msg: "El mensaje no existe.",
        });
      }
      res.status(201).json({
        message: messageRes,
        msg: "El mensaje se ha obtenido correctamente.",
      });
    });
  } catch (err) {
    console.log(`Se ha producido un error al obtener el mensaje. ${err}`);
  }
};

msgCtrl.listMessages = async (req, res) => {
  try {
    const { user_from } = req.body;
    await Message.find(
      { $or: [{ user_from }, { user_to: user_from }] },
      (err1, messagesRes) => {
        if (err1) {
          res.status(500).json({
            msg: `Se ha producido un error al listar los mensajes. ${err1}`,
          });
        }

        if (!messagesRes) {
          res.status(404).json({
            msg: "No hay mensajes.",
          });
        }
        res.status(201).json({
          messages: messagesRes,
          msg: "Mensajes de la conversación obtenidos correctamente.",
        });
      }
    ).sort({ created_at: -1 });
  } catch (err) {
    console.log(
      `Se ha producido un error al listar los mensajes de la conversación.`
    );
  }
};

msgCtrl.listUsersChat = async (req, res) => {
  try {
    const { user_from } = req.body;
    await Message.find(
      { $or: [{ user_from }, { user_to: user_from }] },
      (err1, messagesRes) => {
        if (err1) {
          res.status(500).json({
            msg: `Se ha producido un error al listar los usuarios de los chats. ${err1}`,
          });
        }

        if (!messagesRes) {
          res.status(404).json({
            msg: "El usuario no tiene conversaciones.",
          });
        }

        const filteredArr = messagesRes.reduce(
          (acc, current) =>
            acc.includes(current.user_to)
              ? current.user_to
              : [
                  ...acc,
                  {
                    user_from: current.user_from,
                    user_to: current.user_to,
                  },
                ],
          []
        );

        res.status(201).json({
          users: filteredArr,
          msg: "Usuarios de los chats obtenidos correctamente.",
        });
      }
    );
  } catch (err) {
    console.log(
      `Se ha producido un error al listar los usuarios de las conversaciones. ${err}`
    );
  }
};

msgCtrl.getConversationUsers = async (req, res) => {
  try {
    const { user_id } = req.body;

    await Message.find(
      {
        $or: [{ user_from: user_id }, { user_to: user_id }],
      },
      (err1, users) => {
        if (err1) {
          res.status(500).json({
            msg: `Se ha producido un error al cargar los usuarios. ${err1}`,
          });
        }

        if (!users) {
          res.status(404).json({
            msg: `El usuario no tiene conversaciones.`,
          });
        }

        //TODO: Eliminar los usuarios de las conversaciones duplicados.

        let reduced = users.slice().reduce((acc, msg) => {
          const user = { user_from: msg.user_from, user_to: msg.user_to };
          return acc.includes(user) ? user : [...acc, user];
        }, []);

        res.status(201).json({
          users: reduced,
        });
      }
    );
  } catch (err) {
    console.log(
      `Se ha producido un error al listar los usuarios de las conversaciones del usuario. ${err}`
    );
  }
};

module.exports = msgCtrl;
