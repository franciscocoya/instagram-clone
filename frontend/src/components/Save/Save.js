import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

//Static files
import "../../public/css/SavePost/savePost.css";

function Save({ postId, user }) {
  const [isSaved, setIsSaved] = useState(false);
  const [postSaved, setPostSaved] = useState(null);

  /**
   * TODO: Save the post in the favorites of the current user.
   */
  const savePost = async (e) => {
    e.preventDefault();
    try {
      let data = new FormData();
      data.append("postId", postId);
      data.append("userId", user._id);

      await axios
        .post(`http://localhost:4000/p/savedPost/add`, data)
        .then((res) => {
          console.log(res.data);
          const savedPost = res.data.savedPost;
          setPostSaved(savedPost);
          setIsSaved(true);
        })
        .catch((err1) =>
          console.log(`Se ha producido un error al guardar el post. ${err1}`)
        );
    } catch (err) {
      console.log(
        `Se ha producido un error al guardar el post en favoritos. ${err}`
      );
    }
  };

  /**
   * TODO: Check if the current post is in the current user's favorites list.
   */
  const checkIsSaved = async () => {
    try {
      await axios
        .get(`http://localhost:4000/p/savedPost/get/${postId}`)
        .then((res) => {
          const isSavedRet = res.data.savedPost;
          setIsSaved(isSavedRet !== null ? true : false);
          setPostSaved(res.data.savedPost);
          return isSavedRet !== null ? true : false;
        })
        .catch((err1) =>
          console.log(`Se ha producido un error al comprobar el post. ${err1}`)
        );
    } catch (err) {
      console.log(
        `Se ha producido un error al comprobar el post en favoritos. ${err}`
      );
    }
  };

  /**
   * TODO: Delete the post from the current user's favorite posts.
   */
  const deleteSavePost = async (e) => {
    e.preventDefault();
    try {
      console.log(postSaved);
      await axios
        .delete(`http://localhost:4000/p/savedPost/delete/${postSaved._id}`)
        .then((res) => {
          setIsSaved(false);
        })
        .catch((err1) =>
          console.log(
            `Se ha producido un error al eliminar el post guardado. ${err1}`
          )
        );
    } catch (err) {
      console.log(
        `Se ha producido un error al eliminar el post de favoritos. ${err}`
      );
    }
  };

  useEffect(() => {
    checkIsSaved();
  }, [isSaved]);

  return (
    <div className="save-post">
      {isSaved ? (
        <svg
          aria-label="Eliminar"
          className="save-post-icon"
          fill="#262626"
          height="24"
          viewBox="0 0 48 48"
          width="24"
          onClick={deleteSavePost}
        >
          <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 28.9 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1z"></path>
        </svg>
      ) : (
        <svg
          aria-label="Guardar"
          className="save-post-icon"
          fill="#262626"
          height="24"
          viewBox="0 0 48 48"
          width="24"
          onClick={savePost}
        >
          <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"></path>
        </svg>
      )}
    </div>
  );
}

export default withRouter(Save);
