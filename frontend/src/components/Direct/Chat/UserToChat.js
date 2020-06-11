import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

//Static files
import "../../../public/css/Direct/Chat/userToChat.css";
function UserToChat({
  username,
  profile_picture,
  setUserData,
  id,
  timeAgo,
  text,
}) {
  const handleClick = (e) => {
    e.preventDefault();
    setUserData({ username, profile_picture, id });
  };

  return (
    <div className={`userToChat cursor-pointer`} onClick={handleClick}>
      <img
        src={profile_picture}
        alt={`Foto de perfil de ${username}`}
        className="userToChat__profilePic"
      />
      <div className="userToChat__username-container">
        <span className="chat-username-conv">{username}</span>
        <span className="chat-username-sent-msg">
          {text} · {timeAgo}
        </span>
      </div>
    </div>
  );
}

export default withRouter(UserToChat);
