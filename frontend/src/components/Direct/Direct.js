import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
//import io from "socket.io-client";
import { formatDistance, formatDistanceToNowStrict, max, min } from "date-fns";

//Queries
import { loadChatUsers, getMinDate } from "../../queries/direct_queries";
import { getUserById } from "../../queries/user_queries";

//Components
import UserNavigation from "../Navigations/UserNavigation";
import { UserPlaceholder } from "../Placeholders/Placeholders";
import Chat from "./Chat/Chat";
import EmojiPanel from "./Chat/ChatInput/EmojiPanel";
import UserToChat from "./Chat/UserToChat";

//Modals
import NewDirectMessage from "../Modals/NewDirectMessage";
import SuccesfullyCopied from "../Modals/SuccesfullyCopied";
import ImageFullscreenModal from "../Modals/ImageFullscreenModal";
import SearchResults from "../Modals/SearchResults";

//Static files
import "../../public/css/Direct/direct.css";

function NoConversations({ showNewMessageModal }) {
  return (
    <div className="no-conversations">
      <div className="no-conversations__wrapper">
        <span className="glyphsSpriteDirect__outline__96"></span>
        <h2>Tus mensajes</h2>
        <p className="mp-0">
          Envía fotos y mensajes privados a un amigo o grupo.
        </p>
        <button className="bt-enviar-mensaje" onClick={showNewMessageModal}>
          Enviar mensaje
        </button>
      </div>
    </div>
  );
}

function Direct({ user }) {
  //TODO: Show loader when loading conversations
  const [loadingConversations, setLoadingConversations] = useState(false);

  const [messages, setMessages] = useState([]);
  const [usersToChat, setUsersToChat] = useState([]);

  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [showSuccessfullyCopied, setShowSuccessfullyCopied] = useState(false);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [userProfilesArr, setUserProfilesArr] = useState([]);
  const [userChatSelected, setUserChatSelected] = useState({
    id: "",
    username: "",
    profile_picture: "",
  });
  const [chatDate, setChateDate] = useState("");
  //UserToChat
  const [lastChatTime, setLastChatTime] = useState(""); //Get last date to show on userToChat time ago
  const [userToChatText, setUserToChatText] = useState("");

  //--Chat states
  //TODO: Modificar Chat para usar SocketIO
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const ENDPOINT = "localhost:4000";
  let socket;

  /**
   * Show the successfully Copied Modal.
   */
  const showSuccessfullyCopiedModal = () => {
    setShowSuccessfullyCopied(true);
    setTimeout(() => {
      setShowSuccessfullyCopied(false);
    }, 1000);
  };

  /**
   * Show new Direct Chat conversation Modal.
   * @param {*} e
   */
  const handleShowNewChat = (e) => {
    e.preventDefault();
    setShowNewMessageModal(true);
  };

  /**
   * Close the new Direct Chat conversation Modal.
   * @param {*} e
   */
  const handleCloseMsgModal = (e) => {
    e.preventDefault();
    setShowNewMessageModal(false);
  };

  const handleLoadChatUsers = async () => {
    const result = await loadChatUsers(user._id);
    handleMinDate(result);
    handleMaxDate(result);
    setMessages(result);
    modifyUserToChatText(result);
  };

  const handleGetMinDate = (arr) => {
    return getMinDate(arr);
  };

  /**
   * Format date into --> `day of month of year hours:minutes`
   * @param {*} date Date to format
   */
  const formatDate = (date) => {
    var months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const day = date.getDay();
    const month = months[date.getMonth()].toLowerCase();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    const formated = `${day} de ${month} de ${year} ${hour}:${minutes}`;
    return formated;
  };

  /**
   * Handle the methods to format the min date of messages chat (Chat start time).
   * @param {*} arr Array of messages
   */
  const handleMinDate = (arr) => {
    const min = handleGetMinDate(arr);
    const minFormated = formatDate(min);
    setChateDate(minFormated);
  };

  /**
   * Get the max date of messages array.
   * @param {*} arr Array of messages
   */
  const getMaxDate = (arr) => {
    try {
      const dates = arr.map((date) => new Date(date.createdAt));
      return max(dates);
    } catch (err) {
      console.log(
        `Se ha producido un error al obtener la fecha del mensaje más reciente del chat. ${err}`
      );
    }
  };

  /**
   * Format the date of the last chat message.
   * @param {*} date
   */
  const formatMaxDate = (date) => {
    try {
      const formatted = formatDistanceToNowStrict(date);
      const aux = formatDistanceToNowStrict(date);
      const parseDate = aux.split(" ")[1];
      const res =
        translateDate(parseDate) !== "ahora"
          ? "Hace " + aux.split(" ")[0] + " " + translateDate(parseDate)
          : aux.split(" ")[0] + " " + translateDate(parseDate);

      return res;
    } catch (err) {
      console.log(
        `Se ha producido un error al formatear la fecha del mensaje más reciente del chat. ${err}`
      );
    }
  };

  /**
   * TODO: Create a JSON to i18n
   * @param {*} date Date to translate (day, month, year, ...)
   */
  const translateDate = (date) => {
    let result = "";

    switch (date) {
      case "seconds" || "second":
        result = "ahora";
        break;

      case "minute":
        result = "minuto";
        break;

      case "minutes":
        result = "minutos";
        break;

      case "hour":
        result = "hora";
        break;

      case "hours":
        result = "horas";
        break;

      case "day":
        result = "día";
        break;

      case "days":
        result = "días";
        break;

      case "week":
        result = "semana";
        break;

      case "weeks":
        result = "semanas";
        break;

      case "month":
        result = "mes";
        break;

      case "months":
        result = "meses";
        break;

      case "year":
        result = "año";
        break;

      case "years":
        result = "años";
        break;
    }

    return result;
  };

  /**
   * Handle the max date methods.
   * @param {*} arr
   */
  const handleMaxDate = (arr) => {
    const max = getMaxDate(arr);
    const maxFormatted = formatMaxDate(max);
    setLastChatTime(maxFormatted);
  };

  /**
   * TODO:Load user_to by id.
   * @param {*} id Id of user to load user instance.
   */
  const loadUserById = async (id) => {
    const result = await getUserById(id);
    return result;
    // let result = null;
    // try {
    //   await axios
    //     .get(`http://localhost:4000/accounts/user/${id}`)
    //     .then((res) => {
    //       result = res.data.user;
    //     })
    //     .catch((err1) =>
    //       console.log(
    //         `Se ha producido un error en la operacion cargar usuario. ${err1}`
    //       )
    //     );
    //   return result;
    // } catch (err) {
    //   console.log(`Se ha producido un error al cargar el usuario. ${err}`);
    // }
  };

  /**
   * TODO:List of users who chating with current user.
   * @param {*} arr Array of users(username, profile_picture)
   */
  const listUserConversationProfiles = async () => {
    try {
      setLoadingConversations(true);
      const data = new FormData();
      data.append("user_id", user._id);
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios
        .post("http://localhost:4000/direct/msg/getUsers", data, config)
        .then(async (res) => {
          const results = res.data.users;
          console.log(results);
          let resultArr = [];
          let noDupArr = [...new Set(results.slice())];
          noDupArr.map(async (c) => {
            const user_to_object = await loadUserById(
              user._id === c.user_to ? c.user_from : c.user_to
            );

            const userDataMin = {
              id: user_to_object._id,
              username: user_to_object.username,
              profile_picture: user_to_object.profile_picture,
            };

            resultArr.push(userDataMin);
          });

          setUserProfilesArr(resultArr);
          setLoadingConversations(false);
        })
        .catch((err1) =>
          console.log(
            `Se ha producido un error al listar los usuarios de las conversaciones del usuario actual. ${err1}`
          )
        );
    } catch (err) {
      console.log(
        `Se ha producido un error al listar los usuarios de los chats. ${err}`
      );
      setLoadingConversations(false);
    }
  };

  const modifyUserToChatText = (arr) => {
    const max = arr
      .slice()
      .sort((msg1, msg2) => msg1.createdAt - msg2.createdAt);
    const id = max.pop().user_from;
    const text =
      id === user._id ? "Enviaste un mensaje" : "Te envió un mensaje";
    setUserToChatText(text);
  };

  useEffect(() => {
    handleLoadChatUsers();
    listUserConversationProfiles();

    return () => {
      setSelectedEmoji("");
    };
  }, []);

  return (
    <div className="direct-body h-100 p-relative">
      {showNewMessageModal && (
        <NewDirectMessage
          user={user}
          close={handleCloseMsgModal}
          setUsersToChat={setUsersToChat}
        />
      )}
      <Helmet>
        <meta charSet="utf-8" />
        {/* <title>Direct • Instagram</title> */}
        <title>Bandeja de entrada • Direct</title>
      </Helmet>

      {showFullScreenImage && <ImageFullscreenModal image={fullscreenImage} />}

      {showSearchResults && (
        <SearchResults suggestions={searchResults} user={user} />
      )}
      <UserNavigation
        user={user}
        fillDirect={true}
        showSuggestions={() => setShowSearchResults(true)}
        closeSuggestions={() => setShowSearchResults(false)}
        resultsArr={setSearchResults}
      />
      <div className="direct-body__wrapper">
        {/* Users columns */}
        <div className="d-wrapper__col1">
          <div className="col1__header">
            <p className="mp-0">Direct</p>
            <div className="cont-show-suggestions mp-0">
              <svg
                aria-label="Nuevo mensaje"
                className="cursor-pointer"
                fill="#262626"
                height="24"
                viewBox="0 0 44 44"
                width="24"
                onClick={handleShowNewChat}
              >
                <path d="M33.7 44.12H8.5a8.41 8.41 0 01-8.5-8.5v-25.2a8.41 8.41 0 018.5-8.5H23a1.5 1.5 0 010 3H8.5a5.45 5.45 0 00-5.5 5.5v25.2a5.45 5.45 0 005.5 5.5h25.2a5.45 5.45 0 005.5-5.5v-14.5a1.5 1.5 0 013 0v14.5a8.41 8.41 0 01-8.5 8.5z"></path>
                <path d="M17.5 34.82h-6.7a1.5 1.5 0 01-1.5-1.5v-6.7a1.5 1.5 0 01.44-1.06L34.1 1.26a4.45 4.45 0 016.22 0l2.5 2.5a4.45 4.45 0 010 6.22l-24.3 24.4a1.5 1.5 0 01-1.02.44zm-5.2-3h4.58l23.86-24a1.45 1.45 0 000-2l-2.5-2.5a1.45 1.45 0 00-2 0l-24 23.86z"></path>
                <path d="M38.2 14.02a1.51 1.51 0 01-1.1-.44l-6.56-6.56a1.5 1.5 0 012.12-2.12l6.6 6.6a1.49 1.49 0 010 2.12 1.51 1.51 0 01-1.06.4z"></path>
              </svg>
            </div>
          </div>
          <div className="col1__body">
            {loadingConversations ? (
              <>
                <UserPlaceholder />
                <UserPlaceholder />
                <UserPlaceholder />
              </>
            ) : (
              <>
                {userProfilesArr.map((uP, index) => (
                  <UserToChat
                    key={index}
                    username={uP.username}
                    profile_picture={uP.profile_picture}
                    id={uP.id}
                    setUserData={setUserChatSelected}
                    timeAgo={lastChatTime}
                    text={userToChatText}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        {/* Current conversation column */}
        <div className="d-wrapper__col2 p-relative">
          {/* {messages.length === 0 && <NoConversations />} */}
          {userChatSelected.username.length === 0 ||
          userChatSelected === null ? (
            <NoConversations showNewMessageModal={setShowNewMessageModal} />
          ) : (
            <>
              {showEmojiPanel && (
                <EmojiPanel
                  close={() => setShowEmojiPanel(false)}
                  setSelectedEmoji={setSelectedEmoji}
                />
              )}

              <Chat
                setShowEmojiPanel={() => setShowEmojiPanel(true)}
                showCopiedModal={showSuccessfullyCopiedModal}
                selectedEmoji={selectedEmoji}
                setFullscreenImage={setFullscreenImage}
                setShowFullScreenImage={() => setFullscreenImage(true)}
                userSelected={userChatSelected}
                messages={messages}
                user={user}
                startTime={chatDate}
              />
            </>
          )}
        </div>
      </div>
      {/* Show when user click on copy a message button*/}
      {showSuccessfullyCopied && <SuccesfullyCopied />}
    </div>
  );
}

export default withRouter(Direct);
