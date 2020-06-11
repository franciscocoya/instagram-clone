const urlCtrl = {};

const validUrl = require("valid-url");
const shortid = require("shortid");

const Url = require("../models/URL/Url");

urlCtrl.short = async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = process.env.BASE_URL;

  if (!validUrl.isUri(baseUrl)) {
    res.status(404).json({
      msg: "Url no válida.",
    });
  }
  const urlCode = shortid.generate();

  if (validUrl.isUri(longUrl)) {
    try {
      await Url.findOne({ longUrl }, async (err1, urlRet) => {
        if (err1) {
          res.status(500).json({
            msg: `Error en el servidor al comprobar la URL. ${err1}`,
          });
        }

        if (!urlRet) {
          const shortUrl = baseUrl + "/p/" + urlCode;

          let newShortenedUrl = await new Url({
            longUrl,
            shortUrl,
            urlCode,
          });

          await newShortenedUrl.save((err2, successUrlSaved) => {
            if (err2) {
              res.status(500).json({
                msg: `Error en el servidor al guardar la URL acortada. ${err2}`,
              });
            }

            res.status(201).json({
              shortenedURL: successUrlSaved,
              msg: "URL acortada correctamente.",
            });
          });
        } else {
          res.status(201).json({
            url: urlRet,
          });
        }
      });
    } catch (err) {
      console.log(`Se ha producido un error al acortar la url. ${err}`);
    }
  } else {
    res.status(404).json({
      msg: `La URL proporcionada no es válida.`,
    });
  }
};

urlCtrl.get = async (req, res) => {
  const { urlCode } = req.params;
  try {
    await Url.findOne({ urlCode }, (err1, urlRet) => {
      if (err1) {
        res.status(500).json({
          msg: `Error en el servidor al obtener la URL acortada. ${err1}`,
        });
      }
      if (!urlRet) {
        res.status(404).json({
          msg: `La URl pasada como parámetro no existe.`,
        });
      }

      res.status(201).json({
        shortenedURL: urlRet,
        msg: `URL obtenida correctamente.`,
      });
    });
  } catch (err) {
    console.log(`Se ha producido un error al obtener la URL acortada. ${err}`);
  }
};

urlCtrl.getCodeByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const longUrl = `http://localhost:4000/p/${postId}`;
    await Url.findOne({ longUrl }, (err1, code) => {
      if (err1) {
        res.status(500).json({
          msg: `Error en el servidor al obtener el código de la URL.`,
        });
      }
      if (!code) {
        res.status(404).json({
          msg: `No hay código para el post indicado.`,
        });
      }
      res.status(201).json({
        shortUrl: code.shortUrl,
      });
    });
  } catch (err) {
    console.log(
      `Se ha producido un error al obtener el código de la URL del post. ${err}`
    );
  }
};

module.exports = urlCtrl;
