import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

import { AdvanceCommentReply } from "./Comment";

//Static files
import "../../public/css/Comment/CommentReply/commentReply.css";

function CommentReplies({ commentId, user, commentUser, setReplyOutputData }) {
  const [replies, setReplies] = useState([]);
  const [hideReplies, setHideReplies] = useState(true);

  /**
   * Show or hide replies when user click on show replies button.
   */
  const handleClickShowReplies = (e) => {
    e.preventDefault();
    setHideReplies(!hideReplies);
  };

  /**
   * List of all replies to the comment.
   */
  const loadReplies = async () => {
    try {
      axios
        .get(`http://localhost:4000/p/commentReply/list/${commentId}`)
        .then((res) => {
          setReplies(res.data.replies);
        })
        .catch((err) =>
          console.log(`Error al cargar las respuestas al comentario. ${err}`)
        );
    } catch (err) {
      console.log(
        `Se ha producido un error al listas las respuestas al comentario - Cliente. ${err}`
      );
    }
  };

  useEffect(() => {
    loadReplies();
  }, []);

  return (
    <>
      {replies.length > 0 && (
        <ul className="replies-container">
          <button className="bt-show-replies" onClick={handleClickShowReplies}>
            <span>
              {!hideReplies
                ? "Ocultar respuestas"
                : `Ver respuestas (${replies.length})`}
            </span>
          </button>
          {/* TODO: Mostrar respuestas al comentario */}
          {!hideReplies && (
            <div className="replies">
              {replies.map((r, index) => (
                <AdvanceCommentReply
                  key={index}
                  description={r.text}
                  userId={r.user_id}
                  currentUser={user}
                  commentId={r.comment_id}
                  commentReplyId={r._id}
                  setReplyOutputData={setReplyOutputData}
                />
              ))}
            </div>
          )}
        </ul>
      )}
    </>
  );
}

export default withRouter(CommentReplies);
