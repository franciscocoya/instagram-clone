import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import axios from "axios";

//Queries
import { getTotalLikes } from "../../queries/likes_queries";
import { getTotalComments } from "../../queries/comment_queries";
import { shortUrl } from "../../queries/url_queries";

//static files
import "../../public/css/Post/thumbnail.css";

function Thumbnail({ thumb, thumbAlt, postId, filter }) {
  let history = useHistory();
  const [likesCount, setLikesCount] = useState(0); //Total of likes
  const [commentsCount, setCommentsCount] = useState(0); //Total of comments
  const [urlCode, setUrlCode] = useState("");

  /**
   * Total number of likes of the post.
   */
  const handleGetLikes = async () => {
    const result = await getTotalLikes(postId, false);
    setLikesCount(result);
  };

  const handleGetTotalComments = async () => {
    const result = await getTotalComments(postId, false);
    setCommentsCount(result);
  };

  const handleShortUrl = async () => {
    const result = await shortUrl(postId);
    setUrlCode(result);
  };

  useEffect(() => {
    handleShortUrl();
    handleGetTotalComments();
    handleGetLikes();
  }, []);

  return (
    <div
      className="thumbnail mp-0 w-100"
      onClick={() => history.push(`/p/${urlCode}`)}
    >
      <img
        className={`img-thumb ${filter}`}
        src={thumb}
        alt={thumbAlt}
        //onLoad={extractDominantColor}
      />
      <div className="thumb-overlay w-100 h-100 decoration-none">
        <ul className="w-100 mp-0">
          <li className="likes list-style-none mp-0">
            <span className="likes-count mp-0">{likesCount}</span>
            <span className="coreSpriteHeartSmall mp-0"></span>
          </li>
          <li className="comments list-style-none mp-0">
            <span className="comments-count mp-0 ">{commentsCount}</span>
            <span className="coreSpriteSpeechBubbleSmall mp-0"></span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function MasonryThumbnail({ thumb, thumbAlt, postId, filter }) {
  //const [currentUser, setCurrentUser] = useState(user);
  let history = useHistory();

  const [likesCount, setLikesCount] = useState(0); //Total of likes
  const [commentsCount, setCommentsCount] = useState(0); //Total of comments

  const listLikes = async () => {
    try {
      await axios
        .get(`http://localhost:4000/p/likes/${postId}`)
        .then((count) => {
          setLikesCount(count.data.likes);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(`Se ha producido un error al listar los likes. ${err}`);
    }
  };

  const listComments = async () => {
    try {
      await axios
        .get(`http://localhost:4000/comments/c/${postId}`)
        .then((count) => {
          setCommentsCount(count.data.commentsCount);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(`Se ha producido un error al listar los comentarios. ${err}`);
    }
  };

  useEffect(() => {
    listComments();
    listLikes();
  }, []);

  return (
    <div
      className="masonry-thumbnail mp-0 w-100"
      onClick={() => history.push(`/p/${postId}`)}
    >
      <img
        className={`img-thumb-masonry ${filter}`}
        src={thumb}
        alt={thumbAlt}
        //onLoad={extractDominantColor}
      />
      <div className="masonry-thumb-overlay w-100 h-100 decoration-none">
        <ul className="w-100 mp-0">
          <li className="likes list-style-none mp-0">
            <span className="likes-count mp-0">{likesCount}</span>
            <span className="coreSpriteHeartSmall mp-0"></span>
          </li>
          <li className="comments list-style-none mp-0">
            <span className="comments-count mp-0 ">{commentsCount}</span>
            <span className="coreSpriteSpeechBubbleSmall mp-0"></span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default withRouter(Thumbnail);
