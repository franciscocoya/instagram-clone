import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

//Components
import { UserSuggestWithCheckBox } from "../Suggested/Suggested";
import UserChip from "../Direct/UserSelectedChip";

//Static files
import "../../public/css/modals/newDirectMessage.css";

function NewDirectMessage({ user, close, setUsersToChat }) {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [selectedUsersArr, setSelectedUsersArr] = useState([]);
  const [showUserChip, setShowUserChip] = useState(true);
  const [refreshModal, setRefreshModal] = useState(false);
  const [selectedChipHasBeenDeleted, setSelectedChipHasBeenDeleted] = useState(
    false
  );

  const search = async (e) => {
    e.preventDefault();
    try {
      const textSearch = e.target.value;
      if (
        textSearch !== null &&
        textSearch !== undefined &&
        textSearch.length > 0
      ) {
        await axios
          .get(`http://localhost:4000/user/search/${textSearch}`)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              const results = res.data.users;
              const resultsFilt = results.filter((u) => u._id !== user._id);
              setSuggestedUsers(resultsFilt);
            }
          })
          .catch((err1) =>
            console.log(
              `Se ha producido un error al realizar la consulta. ${err1}`
            )
          );
      } else {
        console.log(`La entrada no es válida. Undefined o null`);
        setSuggestedUsers([]);
      }
    } catch (err) {
      console.log(
        `Se ha producido un error al buscar < ${e.target.value} >. ${err}`
      );
    }
  };

  const nextToChat = (e) => {
    e.preventDefault();
    setUsersToChat(suggestedUsers);
    close(e);
  };

  return (
    <div className="newMessage-modal">
      <div className="close-message-modal" onClick={close}></div>
      <div className="newMessage-wrapper animated zoomIn">
        <div className="newMessage-wrapper__header">
          <div className="cont-close-message-header">
            <svg
              aria-label="Cerrar"
              className="cursor-pointer"
              fill="#262626"
              height="18"
              viewBox="0 0 48 48"
              width="18"
              onClick={close}
            >
              <path
                clipRule="evenodd"
                d="M41.8 9.8L27.5 24l14.2 14.2c.6.6.6 1.5 0 2.1l-1.4 1.4c-.6.6-1.5.6-2.1 0L24 27.5 9.8 41.8c-.6.6-1.5.6-2.1 0l-1.4-1.4c-.6-.6-.6-1.5 0-2.1L20.5 24 6.2 9.8c-.6-.6-.6-1.5 0-2.1l1.4-1.4c.6-.6 1.5-.6 2.1 0L24 20.5 38.3 6.2c.6-.6 1.5-.6 2.1 0l1.4 1.4c.6.6.6 1.6 0 2.2z"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <p className="mp-0">Nuevo mensaje</p>
          <button
            className={`${
              selectedUsersArr.length > 0
                ? "bt-small-link"
                : "bt-small-link-disable"
            }`}
            onClick={nextToChat}
          >
            Siguiente
          </button>
        </div>
        <div className="newMessage-wrapper__body">
          <div className="messageDestination-container">
            <label htmlFor="input-destination-msg">Para:</label>
            <div className="wrapper-input-chips">
              <div className="chips-container">
                {selectedUsersArr.map((su, index) => (
                  <UserChip
                    key={index}
                    username={su.username}
                    close={() => {
                      setRefreshModal(false);
                      setShowUserChip(false);
                      setSelectedUsersArr(
                        selectedUsersArr.filter((u) => u._id !== su._id)
                      );
                      setRefreshModal(true);
                      setSelectedChipHasBeenDeleted(true);
                    }}
                  />
                ))}
              </div>
              <input
                type="text"
                placeholder="Busca..."
                id="input-destination-msg"
                name="dest-msg"
                onChange={search}
              />
            </div>
          </div>
          <div className="suggestions-container">
            {suggestedUsers.length > 0 ? (
              <ul className="list-msg-suggestions">
                {suggestedUsers.map((su) => (
                  <UserSuggestWithCheckBox
                    key={su._id}
                    username={su.username}
                    profile_picture={su.profile_picture}
                    fullname={su.full_name}
                    loggedUser={user}
                    addUser={() => {
                      setRefreshModal(false);
                      selectedUsersArr.push(su);
                      setRefreshModal(true);
                    }}
                    list={selectedUsersArr}
                    isChecked={selectedUsersArr.includes(su)}
                  />
                ))}
              </ul>
            ) : (
              <div className="cont-no-msg-results">
                <p className="mp-0">Sugerencias</p>
                <p>No se ha encontrado ninguna cuenta.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(NewDirectMessage);
