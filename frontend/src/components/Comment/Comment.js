import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
// import * as moment from "moment";
// import shortformat from "moment-shortformat";
import Moment from "react-moment";
import "moment/locale/es";
import $ from "jquery";

//Queries
import { loadCommentUser } from "../../queries/comment_queries";

//Components
import CommentReplies from "./CommentReplies";

//Static files
import "../../public/css/Comment/comment.css";

function Comment({ description, userId, sendComment }) {
  const [uName, setUname] = useState("");

  const handleLoadUser = async () => {
    const result = await loadCommentUser(userId);
    setUname(result.username);
  };

  useEffect(() => {
    handleLoadUser();
  }, []);

  return (
    <li className="w-100 mp-0 list-style-none">
      <p className="mp-0 w-100">
        <span>{uName}</span>
        {description}
      </p>
    </li>
  );
}

export function AdvanceComment({
  description,
  userId,
  time,
  currentUser,
  commentId,
  setReplyOutputData,
}) {
  const defaultPicURL = process.env.REACT_APP_FB_DEFAULT_PROF_PIC;
  let history = useHistory();
  //--
  const [commentUser, setCommentUser] = useState({
    username: "",
    profile_picture: "",
    id: "",
  });
  const [likesCount, setLikesCount] = useState(0);

  const loadComment = async () => {
    const result = await loadCommentUser(userId);
    setCommentUser({
      username: result.username,
      profile_picture: result.profile_picture,
      id: result._id,
    });
  };

  /**
   * Type '@username' in the comment text field to reply to the specific comment.
   */
  const replyComment = (e) => {
    e.preventDefault();
    const commentUsername = commentUser.username;
    const output = {
      uname: `@${commentUsername}`,
      commentToReply: commentId,
      userId: userId,
    };
    setReplyOutputData(output);
  };

  /**
   * Fill the like when user click.
   * @param {*} e
   */
  const fillHeart = (e) => {
    e.preventDefault();
    const likeId = `#comment-like__${commentId}`;
    const filledHeart =
      "M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z";
    $(`${likeId} > path`).attr("d", filledHeart);
    $(likeId).attr("fill", "#ed4956");
    $(likeId).attr("aria-label", "Ya no me gusta");
  };

  useEffect(() => {
    loadComment();

    return () => {
      setReplyOutputData(null);
    };
  }, []);

  return (
    <li className="list-style-none mp-0">
      <div className="post-description mp-0">
        <div className="cont-img mp-0">
          <img
            className={`profile-img mp-0 ${
              commentUser.id !== currentUser._id ? "cursor-pointer" : ""
            }`}
            src={
              commentUser.profile_picture === "undefined"
                ? defaultPicURL
                : commentUser.profile_picture
            }
            alt={commentUser.username}
            title={
              commentUser.id === currentUser._id
                ? "📌 Por ti"
                : commentUser.username
            }
            onClick={() => {
              if (commentUser.id !== currentUser._id) {
                history.push(`/u/${commentUser.username}`);
              }
            }}
          />
        </div>
        <div className="cont-descripcion mp-0">
          <div
            className={`c-username mp-0 ${
              commentUser.id !== currentUser._id ? "cursor-pointer" : ""
            }`}
          >
            <span
              onClick={() => {
                if (commentUser.id !== currentUser._id) {
                  history.push(`/u/${commentUser.username}`);
                }
              }}
            >
              {commentUser.username}
            </span>
          </div>
          <pre>{description}</pre>
          {/* TODO: Like container__counts */}
          <div className="container-like">
            <span className="mspan-0 timeago-comment">
              <Moment fromNow ago>
                {time}
              </Moment>
            </span>
            <span className="comment-likes-count">{likesCount} Me gusta</span>
            {/* The current user cannot reply to himself */}
            {currentUser._id !== commentUser.id && (
              <button className="bt-comment" onClick={replyComment}>
                Responder
              </button>
            )}
          </div>
        </div>
        <div className="cont-comment-like mp-0">
          <svg
            aria-label="Me gusta"
            id={`comment-like__${commentId}`}
            fill="#8e8e8e"
            height="12"
            viewBox="0 0 48 48"
            width="12"
            onClick={fillHeart}
          >
            <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
          </svg>
        </div>
      </div>

      <CommentReplies
        user={currentUser}
        commentUser={commentUser.id}
        commentId={commentId}
        setReplyOutputData={setReplyOutputData}
      />
    </li>
  );
}

export function AdvanceCommentReply({
  description,
  userId,
  time,
  currentUser,
  commentId,
  commentReplyId,
  setReplyOutputData,
}) {
  const defaultPicURL = process.env.REACT_APP_FB_DEFAULT_PROF_PIC;
  let history = useHistory();
  //--
  const [commentUser, setCommentUser] = useState({
    username: "",
    profile_picture: "",
    id: "",
  });
  const [refresh, setRefresh] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const fillHeart = (e) => {
    e.preventDefault();
    const likeId = `#comment-like__${commentId}`;
    const filledHeart =
      "M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z";
    $(`${likeId} > path`).attr("d", filledHeart);
    $(likeId).attr("fill", "#ed4956");
    $(likeId).attr("aria-label", "Ya no me gusta");
  };

  /**
   * Load the comment data.
   */
  const loadComment = async () => {
    const result = await loadCommentUser(userId);
    setCommentUser({
      username: result.username,
      profile_picture: result.profile_picture,
      id: result._id,
    });
  };

  /**
   * Type '@username' in the comment text field to reply to the specific comment.
   */
  const replyComment = (e) => {
    setRefresh(false);
    e.preventDefault();
    const commentUsername = commentUser.username;
    const output = {
      uname: `@${commentUsername}`,
      commentToReply: commentReplyId,
      userId: userId,
    };
    console.log(output);
    setReplyOutputData(output);
    setRefresh(true);
  };

  useEffect(() => {
    loadComment();
  }, []);

  return (
    <li className="list-style-none advance-comment-reply">
      <div className="post-description-reply mp-0">
        <div className="cont-img cont-img-reply mp-0">
          <img
            className={`profile-img profile-img-reply mp-0 ${
              commentUser.id !== currentUser._id ? "cursor-pointer" : ""
            }`}
            src={
              commentUser.profile_picture === "undefined"
                ? defaultPicURL
                : commentUser.profile_picture
            }
            alt={commentUser.username}
            title={
              commentUser.id === currentUser._id
                ? "📌 Por ti"
                : commentUser.username
            }
            onClick={() => {
              if (commentUser.id !== currentUser._id) {
                history.push(`/u/${commentUser.username}`);
              }
            }}
          />
        </div>
        <div className="cont-reply-description mp-0">
          <div
            className={`c-username mp-0 ${
              commentUser.id !== currentUser._id ? "cursor-pointer" : ""
            }`}
          >
            <span
              onClick={() => {
                if (commentUser.id !== currentUser._id) {
                  history.push(`/u/${commentUser.username}`);
                }
              }}
            >
              {commentUser.username}
            </span>
          </div>
          <pre>{description}</pre>
          <div className="container-like-reply">
            {/* timeAgo ___ x Me gusta ___ Responder */}
            <span className="mspan-0 timeago">
              <Moment fromNow ago>
                {time}
              </Moment>
            </span>
            <span className="comment-likes-count">{likesCount} Me gusta</span>
            {/* The current user cannot reply to himself */}
            {currentUser._id !== commentUser.id && (
              <button className="bt-reply-comment" onClick={replyComment}>
                Responder
              </button>
            )}
          </div>
        </div>
        <div className="cont-comment-reply-like mp-0">
          <div className="cont-comment-reply-like__wrapper">
            <svg
              aria-label="Me gusta"
              id={`comment-like-reply__${commentReplyId}`}
              className="comment-like-reply"
              fill="#8e8e8e"
              height="12"
              viewBox="0 0 48 48"
              width="12"
              onClick={fillHeart}
            >
              <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
            </svg>
          </div>
        </div>
      </div>

      <CommentReplies
        user={currentUser}
        commentUser={commentUser.id}
        commentId={commentReplyId}
        setReplyOutputData={setReplyOutputData}
      />
    </li>
  );
}

export default withRouter(Comment);
