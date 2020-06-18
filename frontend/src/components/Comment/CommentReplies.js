import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

//Queries
import { loadReplies } from "../../queries/replies_queries";

//Components
import { AdvanceCommentReply } from "./Comment";

//Static files
import "../../public/css/Comment/CommentReply/commentReply.css";

function CommentReplies({ commentId, user, setReplyOutputData }) {
  const [replies, setReplies] = useState([]);
  const [hideReplies, setHideReplies] = useState(true);

  /**
   * Show or hide replies when user click on show replies button.
   */
  const handleClickShowReplies = (e) => {
    e.preventDefault();
    setHideReplies(!hideReplies);
  };

  const handleLoadReplies = async () => {
    const result = await loadReplies(commentId);
    setReplies(result);
  };

  useEffect(() => {
    handleLoadReplies();
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
