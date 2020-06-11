import React, { useState } from "react";
import { withRouter } from "react-router-dom";

//Components
import MessageTooltip from "./MessageTooltip";

//Static files
import "../../../../public/css/Direct/Chat/Message/message.css";

function Message({
  orientation,
  msgText,
  showCopiedModal,
  type,
  setFullscreenImage,
  setShowFullScreenImage,
  msgImage,
}) {
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [showMessageTooltip, setShowMessageTooltip] = useState(false);

  /**
   * Copy the message clicked.
   */
  const copyMessage = () => {
    if (!navigator.clipboard) {
      console.log("Clipboard no funciona en este navegador");
      return;
    }
    navigator.clipboard.writeText(msgText).then(
      () => {
        setShowMessageTooltip(false);
        showCopiedModal();
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  /**
   * Displays the selected image in full screen.
   * @param {*} e
   */
  const handleImageFullOnClick = (e) => {
    e.preventDefault();
    setFullscreenImage(
      "https://images.unsplash.com/photo-1588153990953-7c681e89682a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max"
    );
    setShowFullScreenImage(e);
  };

  return (
    <div
      className={`direct-message  ${
        orientation === "left" ? "msg-left" : "msg-right"
      }`}
      onMouseLeave={() => setShowMessageOptions(false)}
    >
      {showMessageTooltip && (
        <MessageTooltip
          orientation={orientation}
          close={() => setShowMessageTooltip(false)}
          setCopy={copyMessage}
        />
      )}

      {showMessageOptions && orientation === "right" && (
        <div
          className="wrapper-moreMessageOptions msgmopt__right"
          onClick={() => {
            setShowMessageTooltip(true);
          }}
        >
          <span className="glyphsSpriteMore_horizontal__outline__16__grey_5"></span>
        </div>
      )}
      {type === "text" ? (
        <div
          className={`direct-message__wrapper msg_text ${
            orientation === "right" ? "bg-light" : ""
          }`}
          onMouseOver={() => setShowMessageOptions(true)}
        >
          <p className="mp-0">{msgText}</p>
        </div>
      ) : (
        <div
          className={`direct-message__wrapper msg_image ${
            orientation === "right" ? "bg-light" : ""
          }`}
          onMouseOver={() => setShowMessageOptions(true)}
        >
          <img
            src={msgImage}
            alt=""
            className="img-message-content"
            onClick={handleImageFullOnClick}
          />
        </div>
      )}

      {showMessageOptions && orientation === "left" && (
        <div
          className="wrapper-moreMessageOptions msgmopt__left"
          onClick={() => {
            setShowMessageTooltip(true);
          }}
        >
          <span className="glyphsSpriteMore_horizontal__outline__16__grey_5"></span>
        </div>
      )}
    </div>
  );
}

export default withRouter(Message);
