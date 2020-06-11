/**
 * @description Like. Show the like.
 *
 * @author Francisco Coya
 * @version v1.01
 * @see https://github.com/FranciscoCoya
 * @copyright © 2020 Francisco Coya
 */

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

//Static files
import "../../public/css/Post/verticalPost.css";

function Like({ userId, postId, refreshCount }) {
  const [isLike, setIsLike] = useState(false);
  const [currentLike, setCurrentLike] = useState(null);
  const [userLikes, setUserLikes] = useState([]);

  const handleClickLike = () => {
    !isLike ? addLike() : removeLike();
    setIsLike(!isLike);
  };

  const handleLike = (e) => {
    e.preventDefault();
    handleClickLike();
  };

  /**
   * Add a like to post.
   */
  const addLike = async () => {
    try {
      const data = new FormData();
      data.append("postId", postId);
      data.append("userId", userId);
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios
        .post("http://localhost:4000/p/like/add", data, config)
        .then((res) => {
          console.log(res.data);
          refreshCount();
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(`Se ha producido un error al añadir el like. ${err}`);
    }
  };

  /**
   * Remove the post like.
   */
  const removeLike = async () => {
    const data = new FormData();
    data.append("id", currentLike._id);
    try {
      await axios
        .delete("http://localhost:4000/p/like/remove", data)
        .then((res) => {
          const newList = userLikes
            .slice()
            .filter((like) => like._id !== currentLike._id);

          console.log(newList);
          setUserLikes(newList);
          refreshCount();
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(`Se ha producido un error al eliminar el like. ${err}`);
    }
  };

  /**
   * Check if the current user has liked the post.
   */
  const checkLike = async () => {
    try {
      axios
        .get(`http://localhost:4000/user/p/likes/${userId}`)
        .then((res) => {
          let likesArr = res.data.list;
          setUserLikes(likesArr);

          let filtered = likesArr
            .slice()
            .filter(
              (like) => like.userId === userId && like.postId === postId
            )[0];
          setCurrentLike(filtered);

          let reduced = likesArr.reduce((acc, like) => {
            return [...acc, like.postId];
          }, []);

          setIsLike(reduced.includes(postId));
        })
        .catch((err1) =>
          console.log(
            `Se ha producido un error al obtener los likes del usuario. ${err1}`
          )
        );
    } catch (err) {
      console.log(`Se ha producido un error al comprobar el like. ${err}`);
    }
  };

  useEffect(() => {
    checkLike();
  }, []);

  return (
    <button className="bt-svg bt-like mp-0" onClick={handleLike}>
      {isLike ? (
        <svg
          aria-label="Ya no me gusta"
          fill="#ed4956"
          height="24"
          viewBox="0 0 48 48"
          width="24"
        >
          <path
            clipRule="evenodd"
            d="M35.3 35.6c-9.2 8.2-9.8 8.9-11.3 8.9s-2.1-.7-11.3-8.9C6.5 30.1.5 25.6.5 17.8.5 9.9 6.4 3.5 13.7 3.5 20.8 3.5 24 8.8 24 8.8s3.2-5.3 10.3-5.3c7.3 0 13.2 6.4 13.2 14.3 0 7.8-6.1 12.3-12.2 17.8z"
            fillRule="evenodd"
          ></path>
        </svg>
      ) : (
        <svg
          aria-label="Me gusta"
          fill="#262626"
          height="24"
          viewBox="0 0 48 48"
          width="24"
        >
          <path d="M34.3 3.5C27.2 3.5 24 8.8 24 8.8s-3.2-5.3-10.3-5.3C6.4 3.5.5 9.9.5 17.8s6.1 12.4 12.2 17.8c9.2 8.2 9.8 8.9 11.3 8.9s2.1-.7 11.3-8.9c6.2-5.5 12.2-10 12.2-17.8 0-7.9-5.9-14.3-13.2-14.3zm-1 29.8c-5.4 4.8-8.3 7.5-9.3 8.1-1-.7-4.6-3.9-9.3-8.1-5.5-4.9-11.2-9-11.2-15.6 0-6.2 4.6-11.3 10.2-11.3 4.1 0 6.3 2 7.9 4.2 3.6 5.1 1.2 5.1 4.8 0 1.6-2.2 3.8-4.2 7.9-4.2 5.6 0 10.2 5.1 10.2 11.3 0 6.7-5.7 10.8-11.2 15.6z"></path>
        </svg>
      )}
    </button>
  );
}

export default withRouter(Like);
