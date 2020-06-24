import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";

//Static files
import "../../public/css/Hashtag/hashtag.css";

function Hashtag({ hashtagName }) {
  return (
    <Link
      to={`/explore/tags/${hashtagName}`}
      className="hashtag"
      id={`hash_${hashtagName}`}
    >
      #{hashtagName}
    </Link>
  );
}

export default withRouter(Hashtag);
