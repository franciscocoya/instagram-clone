import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { toArray } from "react-emoji-render";
import axios from "axios";
//import * as firebase from "firebase";

//Static files
import "../../../../public/css/Direct/ChatInput/chatInput.css";

import { storage } from "../../../../firebase";

//firebase.initializeApp(firebaseConfig);

function ChatInput({
  setShowEmojiPanel,
  selectedEmoji,
  user,
  userToChat,
  refresh,
}) {
  const [inputValue, setInputValue] = useState("");
  const [showSendButton, setShowSendButton] = useState(false);
  const [image, setImage] = useState({
    url: "",
    raw: null,
  });

  /**
   * Add the selected emoji in emoji-mart panel into input text.
   */
  const addSelectedEmojiToInput = () => {
    if (
      selectedEmoji !== null &&
      selectedEmoji != "" &&
      selectedEmoji !== undefined
    ) {
      setInputValue(inputValue + selectedEmoji);
    }
  };

  /**
   * Handle de text input and call to @see parseEmojis
   * @param {*} e
   */
  const handleInput = (e) => {
    parseEmojis(e);
    showButton(checkValue(inputValue));
    console.log(inputValue);
  };

  /**
   * Display the send button when the value of the input not empty or invalid.
   * @param {*} condition Condition to show the button.
   */
  const showButton = (condition) => {
    condition ? setShowSendButton(true) : setShowSendButton(false);
  };

  /**
   * Check that the value passed as a parameter is valid
   * @param {*} value Value to check.
   */
  const checkValue = (value) => {
    return (
      value !== null && value !== undefined && value.length > 0 && value !== ""
    );
  };

  /**
   * Handle the enter event.
   * @param {*} e
   */
  const handleInputOnEnter = (e) => {
    if (!e) {
      e.preventDefault();
    }
    if (e.keyCode === 13) {
      handleAddMessage();
    }
  };

  /**
   * Parse emoticons like :) or :-) into emoji icon.
   * @param {*} e
   */
  const parseEmojis = (e) => {
    const emojisArray = toArray(e.target.value);
    const newValue = emojisArray.reduce((previous, current) => {
      if (typeof current === "string") {
        return previous + current;
      }
      return previous + current.props.children;
    }, "");
    setInputValue(newValue);
  };

  /**
   * Save the new message on database and refresh the chat.
   */
  const handleAddMessage = async (e, type) => {
    e.preventDefault();
    try {
      switch (type) {
        case "text":
          await addTextMessage();
          break;

        case "image":
          await addImageMessage();
          break;
      }
      refresh();
    } catch (err) {
      console.log(
        `Se ha producido un error al enviar el mensaje introducido en el input. ${err}`
      );
    }
  };

  /**
   * Send a text message.
   */
  const addTextMessage = async () => {
    try {
      const data = new FormData();
      data.append("user_from", user._id);
      data.append("user_to", userToChat);
      data.append("text", inputValue);

      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      await axios
        .post("http://localhost:4000/direct/msg/add", data, config)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err1) =>
          console.log(`Se ha producido un error al añadir el texto. ${err1}`)
        );
    } catch (err) {
      console.log(
        `Se ha producido un error al enviar el mensaje de tipo texto introducido en el input. ${err}`
      );
    }
  };

  /**
   * Convert the selected image file into a url. Then, upload to cloudinary.
   * @param {*} e
   */
  const handleImageInput = async (e) => {
    let imgFile = e.target.files[0];
    let url = URL.createObjectURL(imgFile);
    setImage({
      url: url,
      raw: imgFile,
    });

    addImageMessage(imgFile);
  };

  const sendImageData = async () => {};

  /**
   * TODO: Send an image message.
   */
  const addImageMessage = async (img) => {
    //try {
    //const storageRef = firebase.storage().ref(`messages_img/${img.name}`);
    //   console.log(storageRef);
    //   const task = storageRef.put(img);
    //   task.on(
    //     "state_changed",
    //     (snapshot) => {
    //       let percentage =
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //       console.log(percentage);
    //     },
    //     (err) => {
    //       console.log(err.message);
    //     },
    //     () => {
    //       storageRef.getDownloadURL().then(async (url) => {
    //         console.log(url);
    //         setImage({
    //           url,
    //         });
    //         const data = new FormData();
    //         data.append("user_from", user._id);
    //         data.append("user_to", userToChat);
    //         const config = {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/x-www-form-urlencoded",
    //           },
    //         };
    //         data.append("image", url);
    //         await axios
    //           .post("http://localhost:4000/direct/msg/add", data, config)
    //           .then((res) => {
    //             console.log(res.data);
    //             refresh();
    //           })
    //           .catch((err1) =>
    //             console.log(
    //               `Se ha producido un error al añadir la imagen. ${err1}`
    //             )
    //           );
    //       });
    //     }
    //   );
    // } catch (err) {
    //   console.log(
    //     `Se ha producido un error al enviar el mensaje de tipo imagen introducido en el input. ${err}`
    //   );
    // }
  };

  /**
   * TODO: BORRAR
   */
  // const printURl = (filename, ext) => {
  //   const storageProfiles = firebase.storage().ref(`posts/${filename}.${ext}`);
  //   storageProfiles.getDownloadURL().then((url) => console.log(url));
  // };

  useEffect(() => {
    addSelectedEmojiToInput();
    //printURl("post_31", "jpg");
  }, [selectedEmoji]);

  return (
    <div className="chat-message-input">
      <div className="container-emoji">
        <svg
          aria-label="Emoji"
          className="emoji cursor-pointer"
          fill="#262626"
          height="24"
          viewBox="0 0 48 48"
          width="24"
          onClick={setShowEmojiPanel}
        >
          <path d="M24 48C10.8 48 0 37.2 0 24S10.8 0 24 0s24 10.8 24 24-10.8 24-24 24zm0-45C12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21S35.6 3 24 3z"></path>
          <path d="M34.9 24c0-1.4-1.1-2.5-2.5-2.5s-2.5 1.1-2.5 2.5 1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5zm-21.8 0c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5zM24 37.3c-5.2 0-8-3.5-8.2-3.7-.5-.6-.4-1.6.2-2.1.6-.5 1.6-.4 2.1.2.1.1 2.1 2.5 5.8 2.5 3.7 0 5.8-2.5 5.8-2.5.5-.6 1.5-.7 2.1-.2.6.5.7 1.5.2 2.1 0 .2-2.8 3.7-8 3.7z"></path>
        </svg>
      </div>
      <div className="container-msg-input-text">
        <input
          type="text"
          placeholder="Enviar mensaje..."
          className="input-msg-direct-chat"
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleInputOnEnter}
        />
      </div>
      {showSendButton ? (
        <button
          className="bt-send-msg bt-small-link"
          onClick={(e) => handleAddMessage(e, "text")}
        >
          Enviar
        </button>
      ) : (
        <div className="container-mediaLike">
          <div className="cont-media-input-img">
            <label htmlFor="input-msg-media">
              <svg
                aria-label="Agregar foto o video"
                className="media-icon"
                fill="#262626"
                height="24"
                viewBox="0 0 48 48"
                width="24"
              >
                <path d="M38.5 0h-29C4.3 0 0 4.3 0 9.5v29C0 43.7 4.3 48 9.5 48h29c5.2 0 9.5-4.3 9.5-9.5v-29C48 4.3 43.7 0 38.5 0zM45 38.5c0 3.6-2.9 6.5-6.5 6.5h-29c-3.3 0-6-2.5-6.4-5.6l8.3-8.3c.1-.1.3-.2.4-.2.1 0 .2 0 .4.2l6.3 6.3c1.4 1.4 3.6 1.4 5 0L35.9 25c.2-.2.6-.2.8 0l8.3 8.3v5.2zm0-9.4l-6.2-6.2c-1.3-1.3-3.7-1.3-5 0L21.3 35.3c-.1.1-.3.2-.4.2-.1 0-.2 0-.4-.2L14.2 29c-1.3-1.3-3.7-1.3-5 0L3 35.2V9.5C3 5.9 5.9 3 9.5 3h29C42.1 3 45 5.9 45 9.5v19.6zM11.8 8.2c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5-1.6-3.5-3.5-3.5z"></path>
              </svg>
            </label>
            <input
              type="file"
              id="input-msg-media"
              accept="image/jpeg, image/png"
              onChange={handleImageInput}
            />
          </div>

          <div className="cont-like-message mp-0">
            <svg
              aria-label="Me gusta"
              className="msg-like-icon"
              fill="#262626"
              height="24"
              viewBox="0 0 48 48"
              width="24"
            >
              <path
                clipRule="evenodd"
                d="M34.3 3.5C27.2 3.5 24 8.8 24 8.8s-3.2-5.3-10.3-5.3C6.4 3.5.5 9.9.5 17.8s6.1 12.4 12.2 17.8c9.2 8.2 9.8 8.9 11.3 8.9s2.1-.7 11.3-8.9c6.2-5.5 12.2-10 12.2-17.8 0-7.9-5.9-14.3-13.2-14.3zm-1 29.8c-5.4 4.8-8.3 7.5-9.3 8.1-1-.7-4.6-3.9-9.3-8.1-5.5-4.9-11.2-9-11.2-15.6 0-6.2 4.6-11.3 10.2-11.3 4.1 0 6.3 2 7.9 4.2 3.6 5.1 1.2 5.1 4.8 0 1.6-2.2 3.8-4.2 7.9-4.2 5.6 0 10.2 5.1 10.2 11.3 0 6.7-5.7 10.8-11.2 15.6z"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default withRouter(ChatInput);
