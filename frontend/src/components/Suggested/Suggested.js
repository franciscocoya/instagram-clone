import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import axios from "axios";

//Static files
import "../../public/css/Suggested/suggested.css";
import spinnerLoader from "../../public/assets/img/loading_spinner.gif";

function Suggested({ user, isClosable }) {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSuggestedUsers = async () => {
    try {
      setLoading(true);
      await axios
        .get(`http://localhost:4000/follow/listUsersNotFollow/${user._id}`)
        .then((res) => {
          const users = res.data.usersNotFollowing;
          setSuggestedUsers(users);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(
        `Se ha producido un error al cargar los usuarios recomendados. ${err}`
      );
      setLoading(false);
    }
  };

  const handleFollow = async () => {};

  useEffect(() => {
    getSuggestedUsers();
  }, []);

  return (
    <div className="suggested-container">
      {!isClosable && suggestedUsers.length > 0 ? (
        <>
          {suggestedUsers.map((user) => (
            <UserCard
              key={user._id}
              username={user.username}
              profile_picture={user.profile_picture}
              follow={handleFollow}
              loading={loading}
            />
          ))}
        </>
      ) : (
        <>
          {suggestedUsers.length > 0 && (
            <>
              {suggestedUsers.map((user) => (
                <UserCardRemovable
                  key={user._id}
                  username={user.username}
                  profile_picture={user.profile_picture}
                  follow={handleFollow}
                  loading={loading}
                />
              ))}
            </>
          )}
        </>
      )}
      <span className="coreSpritePagingChevron chevron_left"></span>
      <span className="coreSpritePagingChevron chevron_right"></span>
    </div>
  );
}

function UserCard({ username, profile_picture, follow, loading }) {
  let history = useHistory();
  return (
    <div className="user-card">
      <div className="user-card__profile-picture cusor-pointer">
        {loading ? (
          <img
            src={spinnerLoader}
            alt="cargando..."
            width="10"
            height="10"
            className="loading_image_profile"
          />
        ) : (
          <img
            src={profile_picture}
            alt={username}
            className="cursor-pointer"
            onClick={() => history.push(`/u/${username}`)}
          />
        )}
      </div>
      <p
        className="user-card__username cursor-pointer"
        onClick={() => history.push(`/u/${username}`)}
      >
        {username}
      </p>
      <button className="user-card__bt-follow" onClick={follow}>
        Seguir
      </button>
    </div>
  );
}

function UserCardRemovable({ username, profile_picture, follow, loading }) {
  return (
    <div className="user-card">
      <span className="user-card__close coreSpriteDismissLarge"></span>
      <div className="user-card__profile-picture cusor-pointer">
        {loading ? (
          <img
            src={spinnerLoader}
            alt="cargando..."
            width="10"
            height="10"
            className="loading_image_profile"
          />
        ) : (
          <img src={profile_picture} alt={username} />
        )}
      </div>
      <p className="user-card__username cursor-pointer">{username}</p>
      <button className="user-card__bt-follow" onClick={follow}>
        Seguir
      </button>
    </div>
  );
}

export function HorizontalUserSuggest({
  username,
  profile_picture,
  fullname,
  loggedUser,
  notLink,
  setSuggestionName,
}) {
  let history = useHistory();

  /**
   * Handler of the click event of the security of a user.
   * Clicking from the verticalPost input will return the suggested username.
   * Otherwise, you will be redirected to the suggested user's profile.
   
   * @param {*} e
   */
  const handleClick = (e) => {
    e.preventDefault();
    if (notLink) {
      setSuggestionName(username);
    } else {
      if (username !== loggedUser.username) {
        history.push(`/u/${username}`);
      }
    }
  };

  return (
    <li
      className={`list-style-none horizontal-suggest ${
        username !== loggedUser.username ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="horizontal-suggest__img-user-suggest">
        <img src={profile_picture} alt={username} />
      </div>
      <div className="horizontal-suggest__user-data">
        <p className="mp-0 username-suggested">{username}</p>
        <p className="mp-0 fullname-suggested">{fullname}</p>
      </div>
    </li>
  );
}

export function UserSuggestWithCheckBox({
  username,
  profile_picture,
  fullname,
  loggedUser,
  addUser,
  list,
  isChecked,
}) {
  useEffect(() => {}, [isChecked]);
  return (
    <li
      className={`list-style-none suggest-With-Checkbox ${
        username !== loggedUser.username ? "cursor-pointer" : ""
      }`}
      onClick={() => {
        if (username !== loggedUser.username && !list.includes(username)) {
          addUser();
        }
      }}
    >
      <div className="cont-user-data-sug">
        <div className="suggest-With-Checkbox__img-user-suggest">
          <img src={profile_picture} alt={username} />
        </div>
        <div className="suggest-With-Checkbox__user-data">
          <p className="mp-0 username-suggested">{username}</p>
          <p className="mp-0 fullname-suggested">{fullname}</p>
        </div>
      </div>

      {isChecked ? (
        <span className="glyphsSpriteCircle_check__filled__24__blue_5"></span>
      ) : (
        <span className="glyphsSpriteCircle__outline__24__grey_2"></span>
      )}
    </li>
  );
}

export default withRouter(Suggested);
