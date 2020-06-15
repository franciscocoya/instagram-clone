/**
 * @description Post view. Show the user, post image, latest comments, etc.
 *
 * @author Francisco Coya
 * @version v1.01
 * @see https://github.com/FranciscoCoya
 * @copyright © 2020 Francisco Coya
 */

import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import Moment from "react-moment";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import $ from "jquery";

//Queries
import { checkIsFollowing, follow } from "../../queries/follow_queries";
import { loadPost } from "../../queries/posts_queries";
import {
  getComments,
  getTotalComments,
  replyComment,
  commentPost,
} from "../../queries/comment_queries";
import { getTotalLikes } from "../../queries/likes_queries";
import { getUserByPostId } from "../../queries/user_queries";

//Components
import { AdvanceComment } from "../Comment/Comment";
import Grid from "../Grid/Grid";
import MoreOptions from "../Modals/MoreOptions";
import Share from "../Modals/Share";
import Like from "../Like/Like";
import LikeCount from "../Like/LikeCount";
import Save from "../Save/Save";

//Modals
import UnfollowModal from "../Modals/Unfollow";

//Static files
import "../../public/css/Post/post.css";
import { preventSelection } from "../../public/js/main";
import LoadingUnfollow from "../../public/assets/img/loading_spinner.gif";

function Post({ onClose, user, match }) {
  let history = useHistory();
  let { id } = match.params;

  const [isLike, setIsLike] = useState(false);
  const [comment, setComment] = useState("");
  const [commentsArr, setCommentsArr] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [, setCommentsCount] = useState(0);
  const [loadingPost, setLoadingPost] = useState(true);
  const [currentPost, setCurrentPost] = useState({
    _id: "",
    user_id: "",
    thumbnail: "",
    description: "",
    place: "",
    createdAt: "",
    filter: "",
  });
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [pUser, setPUser] = useState({});
  const [showGrid, setShowGrid] = useState(true);
  const [commentHasBeenSent, setCommentHasBeenSent] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [sendFollow, setSendFollow] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [postClicked, setPostClicked] = useState({
    postId: "",
    userPostId: "",
  });
  const [refreshCount, setRefreshCount] = useState(false);

  //Comment reply
  const [replyOutputData, setReplyOutputData] = useState(null);

  /**
   * Fill heart when user click like.
   * @param {*} e
   */
  const fillHeart = (e) => {
    e.preventDefault();
    if (!isLike) {
      $(`.like`).addClass("animated heartBeat");
      $(`.like > path`).attr(
        "d",
        "M35.3 35.6c-9.2 8.2-9.8 8.9-11.3 8.9s-2.1-.7-11.3-8.9C6.5 30.1.5 25.6.5 17.8.5 9.9 6.4 3.5 13.7 3.5 20.8 3.5 24 8.8 24 8.8s3.2-5.3 10.3-5.3c7.3 0 13.2 6.4 13.2 14.3 0 7.8-6.1 12.3-12.2 17.8z"
      );
      $(`.like`).attr("fill", "#ed4956");
      $(`.like`).attr("aria-label", "Ya no me gusta");
      //addLike();
    } else {
      $(`.like`).removeClass("animated heartBeat");
      $(`.like > path`).attr(
        "d",
        "M34.3 3.5C27.2 3.5 24 8.8 24 8.8s-3.2-5.3-10.3-5.3C6.4 3.5.5 9.9.5 17.8s6.1 12.4 12.2 17.8c9.2 8.2 9.8 8.9 11.3 8.9s2.1-.7 11.3-8.9c6.2-5.5 12.2-10 12.2-17.8 0-7.9-5.9-14.3-13.2-14.3zm-1 29.8c-5.4 4.8-8.3 7.5-9.3 8.1-1-.7-4.6-3.9-9.3-8.1-5.5-4.9-11.2-9-11.2-15.6 0-6.2 4.6-11.3 10.2-11.3 4.1 0 6.3 2 7.9 4.2 3.6 5.1 1.2 5.1 4.8 0 1.6-2.2 3.8-4.2 7.9-4.2 5.6 0 10.2 5.1 10.2 11.3 0 6.7-5.7 10.8-11.2 15.6z"
      );
      $(`.like`).attr("fill", "#262626");
      $(`.like`).attr("aria-label", "Me gusta");
      //removeLike();
    }

    setIsLike(!isLike);
  };

  /**
   * Same function as @see fillHeart but in this case by double clicking on the post image.
   * @param {*} e
   */
  const showHeartDoubleClick = (e) => {
    e.preventDefault();
    preventSelection();
    $(".coreSpriteLikeAnimationHeart").css({
      display: "block",
    });
    $(`.like`).addClass("animated heartBeat");
    $(".like > path").attr(
      "d",
      "M35.3 35.6c-9.2 8.2-9.8 8.9-11.3 8.9s-2.1-.7-11.3-8.9C6.5 30.1.5 25.6.5 17.8.5 9.9 6.4 3.5 13.7 3.5 20.8 3.5 24 8.8 24 8.8s3.2-5.3 10.3-5.3c7.3 0 13.2 6.4 13.2 14.3 0 7.8-6.1 12.3-12.2 17.8z"
    );
    $(`.like`).attr("fill", "#ed4956");
    $(`.like`).attr("aria-label", "Ya no me gusta");
    setIsLike(true);
    setTimeout(() => {
      $(".coreSpriteLikeAnimationHeart").fadeOut();
    }, 1000);
  };

  /**
   * Focus comment input when user click on the comment icon.
   * @param {*} e
   */
  const clickComment = (e) => {
    e.preventDefault();
    $(`#input-comment`).focus();
  };

  /**
   * Enable the send button when comment input not empty.
   * @param {*} e
   */
  const enadleAddComentButton = (e) => {
    e.preventDefault();

    setComment(e.target.value);
    if (e.target.value.length > 0) {
      $("#bt-post-comment").prop("disabled", false);
      $("#bt-post-comment").css({
        color: "#0095f6",
        cursor: "pointer",
      });
    } else {
      $("#bt-post-comment").prop("disabled", true);
      $("#bt-post-comment").css({
        color: "#b2dffc",
        cursor: "default",
      });
    }
  };

  /**
   * Event handler comment.
   * If the comment is a response then the @see replyCommentPost method will be invoked
   * but if it's a comment to the published post, the @see commentPost method will be invoked.
   * @param {*} e
   */
  const handleSendCommentPost = async (e) => {
    e.preventDefault();
    setCommentHasBeenSent(false);
    let isCommentReply = checkInputIsComment();
    isCommentReply ? await handleReplyComment() : await handleCommentPost();
    setTimeout(() => {
      setCommentHasBeenSent(true);
    }, 200);
    setComment("");
  };

  const handleCommentPost = async () => {
    await commentPost(comment, user._id, currentPost._id);
  };

  const handleReplyComment = async () => {
    await replyComment(comment, replyOutputData.commentToReply, user._id);
    window.location.reload();
  };

  const handleGetUserByPostId = async () => {
    const result = await getUserByPostId(id);
    if (result !== null && result !== undefined) {
      setPUser(result);
    }
  };

  const listLikes = async () => {
    const result = await getTotalLikes(id, true);
    setLikesCount(result);
  };

  const listComments = async () => {
    const result = await getTotalComments(id, true);
    setCommentsCount(result);
  };

  const handleGetComments = async () => {
    const result = await getComments(id);
    setCommentsArr(result);
  };

  /**
   * Load the post list of the users that the user follows.
   */
  const getRelatedPostsByPostUser = async () => {
    const res = await axios.get(
      `http://localhost:4000/posts/related/${pUser._id}`
    );
    setRelatedPosts(res.data.posts);
  };

  /**
   * Check that the current user follows the post user.
   */
  const handleCheckIsFollowing = async () => {
    const postToCheck = await loadPost(id);
    const result = await checkIsFollowing(postToCheck.user_id, user._id);
    setIsFollowing(result);
  };

  const handleLoadPost = async () => {
    const result = await loadPost(id);
    setCurrentPost({
      _id: result._id,
      user_id: result.user_id,
      thumbnail: result.thumbnail,
      description: result.description,
      place: result.place.name,
      createdAt: result.createdAt,
      filter: result.imgFilter,
    });
  };

  /**
   * Check that the comment field is a reply to another comment.
   */
  const checkInputIsComment = () => {
    let commentCopy = comment;
    let aux = commentCopy.split(" ");
    let regExp = new RegExp("[@]{1}[a-zA-Z0-9]+");
    let isUserMention = regExp.test(aux[0]);
    return isUserMention;
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    setSendFollow(true);
    await follow(currentPost.user_id, user._id);

    setTimeout(() => {
      setSendFollow(false);
      setIsFollowing(true);
    }, 500);
  };

  /**
   * Type a @username in comment input field to mention the comment to reply.
   */
  const replyFocusComment = () => {
    if (replyOutputData) {
      const text = replyOutputData.uname + " ";
      setComment(text);
      $("#input-comment").focus();
    }
  };

  const handleShowMoreOptions = (e) => {
    e.preventDefault();
    setPostClicked({
      postId: currentPost._id,
      userPostId: currentPost.user_id,
    });
    setShowMoreOptions(true);
  };

  useEffect(() => {
    setLoadingPost(true);
    handleLoadPost();
    handleGetUserByPostId();
    handleGetComments();
    listLikes();
    listComments();
    handleCheckIsFollowing();
    replyFocusComment();
    setLoadingPost(false);
  }, [commentHasBeenSent, sendFollow, replyOutputData]);

  return (
    <div className="w-post">
      <div className="post-body h-100">
        {showUnfollowModal && (
          <UnfollowModal
            postUser={pUser}
            currentUser={user}
            postId={currentPost._id}
            close={() => setShowUnfollowModal(false)}
            initRefreshPost={() => setSendFollow(true)}
            endRefreshPost={() => setSendFollow(false)}
          />
        )}
        {showMoreOptions && (
          <MoreOptions
            close={() => setShowMoreOptions(false)}
            openShare={() => setOpenShare(true)}
            ids={postClicked}
            user={user}
            initRefreshPost={() => setSendFollow(true)}
            endRefreshPost={() => setSendFollow(false)}
          />
        )}
        {openShare && (
          <Share
            open={() => {
              setOpenShare(true);
              setShowMoreOptions(false);
            }}
            close={() => {
              setOpenShare(false);
              setShowMoreOptions(false);
            }}
          />
        )}

        <div className="post w-100 h-100">
          <div className="post-overlay w-100 h-100">
            {/* Close */}
            <div
              className="close-post w-100"
              onClick={() => {
                history.goBack();
              }}
            >
              <svg
                onClick={onClose}
                aria-label="Cerrar"
                fill="#ffffff"
                height="24"
                viewBox="0 0 48 48"
                width="24"
              >
                <path d="M41.8 9.8L27.5 24l14.2 14.2c.6.6.6 1.5 0 2.1l-1.4 1.4c-.6.6-1.5.6-2.1 0L24 27.5 9.8 41.8c-.6.6-1.5.6-2.1 0l-1.4-1.4c-.6-.6-.6-1.5 0-2.1L20.5 24 6.2 9.8c-.6-.6-.6-1.5 0-2.1l1.4-1.4c.6-.6 1.5-.6 2.1 0L24 20.5 38.3 6.2c.6-.6 1.5-.6 2.1 0l1.4 1.4c.6.6.6 1.6 0 2.2z"></path>
              </svg>
            </div>
            {/* Post */}
            <div className="post-frame h-100">
              <div
                className="p-col-1 mp-0"
                onDoubleClick={showHeartDoubleClick}
              >
                {loadingPost ? (
                  <Skeleton width={`100%`} height={`600px`} />
                ) : (
                  <>
                    <img
                      src={currentPost.thumbnail}
                      alt={currentPost.description}
                      className={currentPost.imgFilter}
                    />
                  </>
                )}
                <div className="heart-overlay-1">
                  <span className="coreSpriteLikeAnimationHeart animated zoomIn faster"></span>
                </div>
              </div>

              <div className="p-col-2 mp-0">
                <div className="post-header b-bottom-1-light mp-0">
                  <div className="p-header-1 mp-0">
                    <div className="cont-img mp-0">
                      {loadingPost ? (
                        <Skeleton
                          circle={true}
                          height={40}
                          width={40}
                          duration={2}
                        />
                      ) : (
                        <>
                          {user._id !== pUser._id ? (
                            <img
                              className={`profile-img cursor-pointer`}
                              src={pUser.profile_picture}
                              alt={pUser.username}
                              onClick={() =>
                                history.push(`/u/${pUser.username}`)
                              }
                            />
                          ) : (
                            <img
                              className={`profile-img`}
                              src={user.profile_picture}
                              alt={user.username}
                              onClick={() =>
                                history.push(`/u/${user.username}`)
                              }
                            />
                          )}
                        </>
                      )}
                    </div>
                    <div className="profile-info mp-0 w-100">
                      <div className="profile-username mp-0 w-100">
                        <p className="mp-0">
                          {loadingPost ? (
                            <Skeleton width={`50%`} />
                          ) : (
                            <span
                              className={`mp-0 ${
                                user._id !== pUser._id ? "cursor-pointer" : ""
                              }`}
                              onClick={() => {
                                if (user._id !== pUser._id) {
                                  history.push(`/u/${pUser.username}`);
                                }
                              }}
                            >
                              {pUser.username}
                            </span>
                          )}
                        </p>

                        {sendFollow ? (
                          <>
                            <div className="mp-0 cont-spinner-loading">
                              <img
                                src={LoadingUnfollow}
                                alt="Cargando..."
                                width="10"
                                height="10"
                                className="loading_spinner"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {user._id !== pUser._id && (
                              <>
                                <span className="mp-0">•</span>
                                {isFollowing ? (
                                  <button
                                    className="bt-small-link"
                                    id="bt-following"
                                    onClick={() => setShowUnfollowModal(true)}
                                  >
                                    Siguiendo
                                  </button>
                                ) : (
                                  <button
                                    className="bt-small-link"
                                    id="bt-follow"
                                    onClick={handleFollow}
                                  >
                                    Seguir
                                  </button>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                      <div className="post-location">
                        <span className="mp-0 bold-black">
                          {loadingPost ? (
                            <Skeleton width={`30%`} />
                          ) : (
                            <>{currentPost.place}</>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-header-2 mp-0">
                    <svg
                      aria-label="Más opciones"
                      fill="#262626"
                      height="16"
                      viewBox="0 0 48 48"
                      width="16"
                      onClick={handleShowMoreOptions}
                    >
                      <circle cx="8" cy="24" r="4.5"></circle>
                      <circle cx="24" cy="24" r="4.5"></circle>
                      <circle cx="40" cy="24" r="4.5"></circle>
                    </svg>
                  </div>
                </div>
                {/* Post body */}
                <div className="post-body b-bottom-1-light">
                  <ul className="mp-0 h-100">
                    <li className="list-style-none mp-0">
                      <div className="post-description mp-0">
                        <div className="cont-img mp-0">
                          {user._id !== pUser._id ? (
                            <img
                              className={`profile-img mp-0 cursor-pointer`}
                              src={pUser.profile_picture}
                              alt={pUser.username}
                              onClick={() => {
                                history.push(`/u/${pUser.username}`);
                              }}
                            />
                          ) : (
                            <img
                              className={`profile-img mp-0`}
                              src={user.profile_picture}
                              alt={user.username}
                              onClick={() => {
                                history.push(`/${user.username}`);
                              }}
                            />
                          )}
                        </div>
                        <div className="cont-descripcion mp-0">
                          <div className="c-username mp-0">
                            <span
                              className={`${
                                user._id !== pUser._id ? "cursor-pointer" : ""
                              }`}
                              onClick={() => {
                                user._id !== pUser._id
                                  ? history.push(`/u/${pUser.username}`)
                                  : history.push(`/${user.username}`);
                              }}
                            >
                              {pUser.username}
                            </span>
                          </div>
                          <pre>{currentPost.description}</pre>
                          <span className="timeago">
                            <Moment fromNow ago>
                              {currentPost.createdAt}
                            </Moment>
                          </span>
                        </div>
                      </div>
                    </li>

                    {commentsArr.map((c) => (
                      <AdvanceComment
                        key={c._id}
                        description={c.text}
                        userId={c.user_id}
                        time={c.createdAt}
                        currentUser={user}
                        commentId={c._id}
                        setReplyOutputData={setReplyOutputData}
                      />
                    ))}
                  </ul>
                </div>

                <div className="cont-media mp-0">
                  {loadingPost ? (
                    <Skeleton width={`100%`} height={`50%`} />
                  ) : (
                    <div className="wrapper-media">
                      <div className="wrapper-media__col1">
                        <Like
                          user={user}
                          postId={currentPost._id}
                          refreshCount={() => setRefreshCount(true)}
                        />
                        {/* Comment button */}
                        <button
                          className="bt-svg bt-comment mp-0"
                          onClick={clickComment}
                        >
                          <svg
                            aria-label="Comentar"
                            fill="#262626"
                            height="24"
                            viewBox="0 0 48 48"
                            width="24"
                          >
                            <path d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"></path>
                          </svg>
                        </button>
                        {/* Share button */}
                        <button className="bt-svg bt-share mp-0">
                          <svg
                            aria-label="Compartir publicación"
                            fill="#262626"
                            height="24"
                            viewBox="0 0 48 48"
                            width="24"
                          >
                            <path d="M46.5 3.5h-45C.6 3.5.2 4.6.8 5.2l16 15.8 5.5 22.8c.2.9 1.4 1 1.8.3L47.4 5c.4-.7-.1-1.5-.9-1.5zm-40.1 3h33.5L19.1 18c-.4.2-.9.1-1.2-.2L6.4 6.5zm17.7 31.8l-4-16.6c-.1-.4.1-.9.5-1.1L41.5 9 24.1 38.3z"></path>
                            <path d="M14.7 48.4l2.9-.7"></path>
                          </svg>
                        </button>
                      </div>

                      {/* TODO: */}
                      {currentPost.user_id !== user._id && (
                        <Save postId={currentPost._id} user={user} />
                      )}
                    </div>
                  )}
                </div>
                {/* fin cont-media */}
                {/* Numero de me gustas del post */}

                <div className="cont-likes mp-0">
                  <span className="mp-0">
                    {loadingPost ? (
                      <Skeleton width={`80%`} />
                    ) : (
                      <LikeCount
                        refreshCount={() => setRefreshCount(true)}
                        likesCount={likesCount}
                      />
                    )}
                  </span>
                </div>

                {/* Fecha de publicacion del post */}
                <div className="cont-post-date b-bottom-1-light mp-0">
                  <span className="mp-0">
                    {loadingPost ? (
                      <Skeleton width={`40%`} />
                    ) : (
                      <Moment fromNow locale="es">
                        {currentPost.createdAt}
                      </Moment>
                    )}
                  </span>
                </div>

                {/* Añadir un comentario */}
                <div className="cont-add-comment mp-0">
                  <div className="wrapper-add-comment w-100 mp-0">
                    <input
                      className="mp-0 w-100 h-100 input-comment"
                      id="input-comment"
                      type="text"
                      placeholder="Añade un comentario..."
                      name="addComment"
                      onChange={enadleAddComentButton}
                      value={comment}
                    />
                    <button
                      className="bt-small-link mp-0"
                      id="bt-post-comment"
                      onClick={handleSendCommentPost}
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
              {/* fin post body */}
            </div>
            {/* fin p-col-2 */}

            <div className="prevNext">
              {/* Previous post*/}
              <span className="coreSpriteLeftPaginationArrow"></span>
              {/* Next post */}
              <span className="coreSpriteLeftPaginationArrow"></span>
            </div>
          </div>
        </div>
      </div>
      {showGrid && <Grid user={user} posts={relatedPosts} />}
    </div>
  );
}

export default withRouter(Post);
