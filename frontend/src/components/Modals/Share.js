import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  EmailShareButton,
  FacebookShareButton,
  FacebookMessengerShareButton,
  TwitterShareButton,
} from "react-share";
import axios from "axios";

//Static files
import "../../public/css/modals/share.css";

function Share({ close, postId }) {
  const [url, setUrl] = useState("");
  // const copyToClipboard = (e) => {
  //   e.prevetDefault();
  //   try {
  //     //var res = document.execCommand("copy");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const getPostCode = async () => {
    try {
      axios
        .get(`http://localhost:4000/shorten/get/${postId}`)
        .then((res) => {
          setUrl(res.data.shortUrl);
        })
        .catch((err1) => console.log(`Error al obtener el código. ${err1}`));
    } catch (err) {
      console.log(
        `Se ha producido un error al obtener el código del post. ${err}`
      );
    }
  };

  useEffect(() => {
    getPostCode();
  }, []);

  return (
    <div className="w-share">
      <div className="close-overlay" onClick={close}></div>
      <div className="modal-share tx-center animated zoomIn">
        <ul className="w-100">
          <li className="list-style-none b-bottom-1-light">
            <span>Compartir</span>
            <svg
              aria-label="Cerrar"
              className="close-share"
              fill="#262626"
              height="24"
              viewBox="0 0 48 48"
              width="24"
              onClick={close}
            >
              <path
                clipRule="evenodd"
                d="M41.1 9.1l-15 15L41 39c.6.6.6 1.5 0 2.1s-1.5.6-2.1 0L24 26.1l-14.9 15c-.6.6-1.5.6-2.1 0-.6-.6-.6-1.5 0-2.1l14.9-15-15-15c-.6-.6-.6-1.5 0-2.1s1.5-.6 2.1 0l15 15 15-15c.6-.6 1.5-.6 2.1 0 .6.6.6 1.6 0 2.2z"
                fillRule="evenodd"
              ></path>
            </svg>
          </li>
          <li className="list-style-none">
            <span className="glyphsSpriteFacebook_circle__outline__24__grey_9"></span>

            <FacebookShareButton url={url} className="url-share">
              <span>Compartir en Facebook</span>
            </FacebookShareButton>
          </li>
          <li className="list-style-none">
            <span className="glyphsSpriteApp_messenger__outline__24__grey_9"></span>
            <FacebookMessengerShareButton url={url} className="url-share">
              <span>Compartir en Messenger</span>
            </FacebookMessengerShareButton>
          </li>
          <li className="list-style-none">
            <span className="glyphsSpriteApp_twitter__outline__24__grey_9"></span>
            <TwitterShareButton url={url} className="url-share">
              <span>Compartir en Twitter</span>
            </TwitterShareButton>
          </li>
          <li className="list-style-none">
            <span className="glyphsSpriteMail__outline__24__grey_9"></span>
            <EmailShareButton url={url} className="url-share">
              <span>Compartir por correo electrónico</span>
            </EmailShareButton>
          </li>
          <li className="list-style-none">
            <span className="glyphsSpriteLink__outline__24__grey_9"></span>

            <span className="copy-url">Copiar enlace</span>
          </li>
          <li className="list-style-none" onClick={close}>
            <span className="cancel-share">Cancelar</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default withRouter(Share);
