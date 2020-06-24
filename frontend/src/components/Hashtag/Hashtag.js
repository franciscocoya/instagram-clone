import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

function Hashtag({ hashtagName }) {
  const handleClick = (e) => {
    e.preventDefault();
    console.log("Click en " + hashtagName);
  };

  return (
    <span
      className="hashtag cursor-pointer"
      id={`hash_${hashtagName}`}
      onClick={handleClick}
    >
      #{hashtagName}
    </span>
  );
}

export default withRouter(Hashtag);
