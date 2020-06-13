import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

function Hashtag({ hashtagName }) {
  const handleClick = (e) => {
    e.preventDefault();
  };

  return (
    <span className="hashtag" id={`hash_${hashtagName}`} onClick={handleClick}>
      #{hashtagName}
    </span>
  );
}

export default withRouter(Hashtag);
