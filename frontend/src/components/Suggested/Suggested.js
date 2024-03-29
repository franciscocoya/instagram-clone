/**
 * @description Suggested component. Show the suggested users to the current user.
 *  · UserCard.
 *    _ User profile picture.
 *    _ Username.
 *    _ Follow button.
 *
 *  · UserCardRemovable.
 *    Same components as UserCard plus a button to remove the suggestion.
 *
 *  · HorizontalUserSuggest.
 *    _ User profile picture.
 *    _ Username.
 *    _ Fullname.
 *
 *  · UserSuggestionWithCheckBox.
 *    Same components as HorizontalUserSuggest plus a checkbox to see that the
 *    suggestion has already been selected.
 *
 * @author Francisco Coya
 * @version v1.01
 * @see https://github.com/FranciscoCoya
 * @copyright © 2020 Francisco Coya
 */

import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { getSuggestedUsers } from "../../queries/posts_queries";

//Static files
import "../../public/css/Suggested/suggested.css";
import spinnerLoader from "../../public/assets/img/loading_spinner.gif";

function Suggested({ user, isClosable }) {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSuggestedUsers = async () => {
    setLoading(true);
    const result = await getSuggestedUsers(user._id);
    setSuggestedUsers(result);
    setLoading(false);
  };

  const handleFollow = async () => {};

  useEffect(() => {
    handleSuggestedUsers();
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
