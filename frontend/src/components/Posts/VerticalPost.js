/**
 * @description Vertical Post view. Same as the Post but horizontal.
 *
 * @author Francisco Coya
 * @version v1.01
 * @see https://github.com/FranciscoCoya
 * @copyright © 2020 Francisco Coya
 */

import React, { useState, useEffect } from "react";
import { withRouter, useHistory, Link } from "react-router-dom";
import Moment from "react-moment";
import "moment/locale/es";
import axios from "axios";
import $ from "jquery";
import Skeleton from "react-loading-skeleton";

//Queries
import { shortUrl } from "../../queries/url_queries";
import {
  commentPost,
  getLastComments,
  getTotalComments,
} from "../../queries/comment_queries";
import { getTotalLikes } from "../../queries/likes_queries";
import { getUserById } from "../../queries/user_queries";
import { checkIsFollowing } from "../../queries/follow_queries";
import { searchMention } from "../../queries/posts_queries";

//Components
import Comment from "../Comment/Comment";
import Like from "../Like/Like";
import LikeCount from "../Like/LikeCount";
import SearchResults from "../Modals/SearchResults";
import Mention from "../Mention/Mention";
import Save from "../Save/Save";

//Static files
import "../../public/css/Post/verticalPost.css";
import "../../public/css/partials/cssgram.min.css";

function VerticalPost({
  setOpenMoreSettings,
  text,
  imgPost,
  postUser,
  countryId,
  place,
  postId,
  timeAgo,
  btKey,
  user,
  filter,
  following,
  notFollowing,
  setCurrent,
}) {
  let history = useHistory();
  const [isLike, setIsLike] = useState(false); //Has the Current User liked the post ?
  const [comment, setComment] = useState("");
  const [commentsArr, setCommentsArr] = useState([]); //Comments list
  const [likesCount, setLikesCount] = useState(1); //Total number of post likes
  const [commentsCount, setCommentsCount] = useState(0); //Total number of post comments
  const [, setTime] = useState(null);
  const [pUser, setPUser] = useState({
    id: "",
    profile_picture: "",
    username: "",
  });
  const [loadingVertPost, setLoadingVertPost] = useState(true); //loading post
  const [commentHasBeenSent, setCommentHasBeenSent] = useState(false); //The comment has been sent ?
  const [descriptionWordsCount, setDescriptionWordsCount] = useState(0);

  const [breakLongDescriptionArr, setBreakLongDescriptionArr] = useState([]);

  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [refreshLikesCount, setRefreshLikesCount] = useState(false);

  //Search results (user mention search)
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchMentionResults, setSearchMentionResults] = useState([]);
  const [suggestedMention, setSuggestedMention] = useState(null);
  const [commentHasBeenChanged, setCommentHasBeenChanged] = useState(false);
  const [urlCode, setUrlCode] = useState("");

  const handleShortUrl = async () => {
    const result = await shortUrl(postId);
    setUrlCode(result);
  };

  /**
   * Same function as @see fillHeart but in this case by double clicking on the post image.
   * @param {*} e
   */
  const showHeartDoubleClick = (e) => {
    e.preventDefault();
    setIsLike(true);
    $(".coreSpriteLikeAnimationHeart").css({
      display: "block",
    });
    $(`.like-${btKey}`).addClass("animated heartBeat");
    $(`.like-${btKey} > path`).attr(
      "d",
      "M35.3 35.6c-9.2 8.2-9.8 8.9-11.3 8.9s-2.1-.7-11.3-8.9C6.5 30.1.5 25.6.5 17.8.5 9.9 6.4 3.5 13.7 3.5 20.8 3.5 24 8.8 24 8.8s3.2-5.3 10.3-5.3c7.3 0 13.2 6.4 13.2 14.3 0 7.8-6.1 12.3-12.2 17.8z"
    );
    $(`.like-${btKey}`).attr("fill", "#ed4956");
    $(`.like-${btKey}`).attr("aria-label", "Ya no me gusta");
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
    $(`#input-comment-${btKey}`).focus();
  };

  /**
   * TODO: Enable the send comment button if the comment field is not empty.
   * @param {*} e
   */
  const enadleAddComentButton = (e) => {
    e.preventDefault();
    let value = e.target.value;
    setComment(value);

    if (value.length > 0) {
      //Check if a user mention
      if (checkIsUserMention(value)) {
        handleSearchMention(value);
        replaceMention();
      }

      $(`#bt-post-comment-${btKey}`).prop("disabled", false);
      $(`#bt-post-comment-${btKey}`).css({
        color: "#0095f6",
        cursor: "pointer",
      });
    } else {
      $(`#bt-post-comment-${btKey}`).prop("disabled", true);
      $(`#bt-post-comment-${btKey}`).css({
        color: "#b2dffc",
        cursor: "default",
      });
    }
  };

  const handleCommentPost = async (e) => {
    e.preventDefault();
    setCommentHasBeenSent(false);
    await commentPost(comment, user._id, postId);
    setCommentHasBeenSent(true);
  };

  const handleGetUserById = async () => {
    const result = await getUserById(postUser);
    setPUser({
      profile_picture: result.profile_picture,
      username: result.username,
      id: result._id,
    });
  };

  const listLikes = async () => {
    const result = await getTotalLikes(postId);
    setLikesCount(result);
  };

  const listComments = async () => {
    const result = await getTotalComments(postId);
    setCommentsCount(result);
  };

  /**
   * Convert the created_at date into valid date.
   */
  const convertDate = () => {
    setTime(new Date(timeAgo.toString()));
  };

  /**
   * Reset the comment input field.
   */
  const resetCommentInput = () => {
    setComment("");
  };

  /**
   * Load a list with the latest comments on the post.
   *
   */
  const loadComments = async () => {
    const result = await getLastComments(postId);
    setCommentsArr(result);
  };

  const handleCheckIsFollowing = async () => {
    const result = checkIsFollowing(postUser, user._id);
    result ? following() : notFollowing();
  };

  /**
   * Method that controls the moreSettings modal.
   * @param {*} e
   */
  const handleMoreSettings = (e) => {
    e.preventDefault();
    setOpenMoreSettings(e);
    setCurrent(e);
  };

  /**
   * Count the post description words.
   */
  const countDescriptionWords = () => {
    let count = 0;
    let descriptionWords = text;
    if (descriptionWords !== null && descriptionWords !== undefined) {
      if (descriptionWords.length === 0) {
        setDescriptionWordsCount(0);
        return 0;
      }

      for (let i = 0; i <= descriptionWords.length; i++) {
        if (descriptionWords.charAt(i) === " ") {
          count++;
        }
      }
      setDescriptionWordsCount(count);
      return count;
    }
    setDescriptionWordsCount(0);
    return 0;
  };

  /**
   * Divide the text of the description if it contains more than 17 words.
   */
  const splitDescription = () => {
    const MAX_WORDS = 17;
    let wordsArr = [];
    let count = countDescriptionWords();
    if (count > MAX_WORDS) {
      wordsArr.push(text.split(" ").slice(0, MAX_WORDS));
      wordsArr.push(text.split(" ").slice(MAX_WORDS + 1, count));
    } else {
      wordsArr.push(text.split(" "));
    }

    setBreakLongDescriptionArr(wordsArr);

    checkMentionComponent(wordsArr);
  };

  const parseMention = (inputText) => {
    let withoutSpaces = inputText.replace("/(\r\n|\n|\r)/gm", "*");
    let arrAux = withoutSpaces.split("*");
    let resultMent = arrAux.filter((tx) => tx.includes("@"));
    return resultMent;
  };

  /**
   * Check that the text passed as a parameter is a mention to a user.
   */
  const checkIsUserMention = (inputText) => {
    try {
      if (inputText !== null && inputText !== undefined) {
        let regExp = new RegExp("[@]{1}[a-zA-Z0-9]+");
        let withoutSpaces = inputText.replace(/(\r\n|\n|\r)/gm, "*");
        let arrAux = withoutSpaces.split("*");
        let resultMent = arrAux.filter((tx) => tx.includes("@"));
        return regExp.test(resultMent[0]);
      }
    } catch (err) {
      console.log(
        `An error occurred while checking the input as user mention. ${err}`
      );
    }
  };

  const handleSearchMention = async (textSearch) => {
    const result = await searchMention(textSearch, user._id);
    setSearchMentionResults(result);
  };

  const replaceMention = () => {
    setCommentHasBeenChanged(false);
    if (suggestedMention !== null && suggestedMention !== undefined) {
      let allComment = comment.split("@");
      let aux = allComment[0];
      let result = aux + "@" + suggestedMention + " ";
      setComment({
        result,
      });
      setCommentHasBeenChanged(true);
    }
  };

  /**
   * Check if there are mentions to users in the description.
   * Create a Mention component in that case.
   *
   * @param {*} text Content of the text of the post description
   */
  const checkMentionComponent = (text) => {
    if (text.length === 1) {
      for (let i = 0; i < text[0].length; i++) {
        if (text[0][i] !== undefined && text[0][i] !== null) {
          if (checkIsUserMention(text[0][i])) {
            let parsedMention1 = parseMention(text[0][i]);
            text[0][i] = `**mention_${parsedMention1[0].split("@")[1]}`;
          }
        }
      }
    } else if (text.length > 1) {
      for (let i = 0; i < text[i].length; i++) {
        for (let j = 0; j < text[i].length; j++) {
          if (checkIsUserMention(text[i][j])) {
            let parsedMention2 = parseMention(text[i][j]);
            text[i][j] = `**mention_${parsedMention2[0].split("@")[1]}`;
          }
        }
      }
    }
  };

  useEffect(() => {
    try {
      handleCheckIsFollowing();
      handleShortUrl();
      setLoadingVertPost(true);
      loadComments();
      handleGetUserById();
      listLikes();
      listComments();
      convertDate();
      resetCommentInput();
      splitDescription();
      setLoadingVertPost(false);

      return () => {
        setRefreshLikesCount(false);
      };
    } catch (err) {
      console.log(`An error ocurred while loading the post... ${err}`);
      setLoadingVertPost(false);
    }
  }, [commentHasBeenSent, suggestedMention, refreshLikesCount]);

  return (
    <div className="postVertical b-1-g">
      {/* POST HEADER */}
      <div className="post-header b-bottom-1-light">
        {/* --USERNAME INFO */}

        <div className="username-info">
          {loadingVertPost ? (
            <Skeleton circle={true} height={40} width={40} />
          ) : (
            <img
              className={`b-1-g ${
                user.id !== pUser.id ? "cursor-pointer" : ""
              }`}
              src={pUser.profile_picture}
              alt={pUser.username}
              loading="lazy"
              onClick={() => {
                if (user.id !== pUser.id) {
                  history.push(`/u/${pUser.username}`);
                }
              }}
            />
          )}

          <div className="cont-info">
            {loadingVertPost ? (
              <Skeleton width={`50%`} />
            ) : (
              <p
                className={`mp-0 ${
                  user.id !== pUser.id ? "cursor-pointer" : ""
                }`}
                onClick={() => {
                  if (user.id !== pUser.id) {
                    history.push(`/u/${pUser.username}`);
                  }
                }}
              >
                {pUser.username}
              </p>
            )}
            <p>
              {loadingVertPost ? (
                <Skeleton width={`30%`} />
              ) : (
                <Link
                  to={`/explore/locations/${countryId}/${place}`}
                  className="location-text"
                >
                  {place}
                </Link>
              )}
            </p>
          </div>
        </div>
        <svg
          aria-label="Más opciones"
          className="moreOptions"
          fill="#262626"
          height="16"
          viewBox="0 0 48 48"
          width="16"
          onClick={handleMoreSettings}
        >
          <circle cx="8" cy="24" r="4.5"></circle>
          <circle cx="24" cy="24" r="4.5"></circle>
          <circle cx="40" cy="24" r="4.5"></circle>
        </svg>
      </div>
      {/* POST BODY */}
      <div className="post-body b-bottom-1-light">
        {/* --POST-IMAGE */}
        <div className="cont-image" onDoubleClick={showHeartDoubleClick}>
          {loadingVertPost ? (
            <Skeleton width={`100%`} height={`600px`} />
          ) : (
            <img
              className={`img-post ${filter}`}
              src={imgPost}
              alt={text}
              loading="lazy"
            />
          )}

          <div className="heart-overlay">
            <span className="coreSpriteLikeAnimationHeart animated zoomIn faster"></span>
          </div>
        </div>
        <div className="wrapper-body">
          {/* --MEDIA */}
          <div className="cont-media">
            <div className="wrapper-media">
              {loadingVertPost ? (
                <Skeleton width={`100%`} height={`50%`} />
              ) : (
                <>
                  <div className="wrapper-media__col1">
                    <Like
                      userId={user._id}
                      postId={postId}
                      refreshCount={() => setRefreshLikesCount(true)}
                    />

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

                  <div className="save-container-v-post">
                    {postUser.id !== user._id && (
                      <Save postId={postId} user={user} />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <LikeCount likesCount={likesCount} refreshCount={refreshLikesCount} />
          {/* --LIST OF COMMENTS */}
          <div className="cont-description">
            <pre>
              {loadingVertPost ? (
                <Skeleton count={1} width={`100px`} />
              ) : (
                <>
                  <span
                    className={`${
                      user.id !== pUser.id ? "cursor-pointer" : ""
                    }`}
                    onClick={() => {
                      if (user.id !== pUser.id) {
                        history.push(`/u/${pUser.username}`);
                      }
                    }}
                  >
                    {pUser.username}
                  </span>
                  {descriptionWordsCount > 17 ? (
                    <pre className="pre-style">
                      {breakLongDescriptionArr[0].map((w, index) => {
                        return w.includes("**") ? (
                          <Mention
                            key={index}
                            username={w.split("_")[1]}
                            user={user}
                          />
                        ) : (
                          w + " "
                        );
                      })}
                      {!showMoreDescription ? (
                        <>
                          <button
                            onClick={() => setShowMoreDescription(true)}
                            className="bt-more-description"
                          >
                            ...más
                          </button>
                        </>
                      ) : (
                        <>
                          {showMoreDescription && (
                            <pre className="pre-style">
                              {breakLongDescriptionArr[1].map((w, index) => {
                                return w.includes("**") ? (
                                  <Mention
                                    key={index}
                                    username={w.split("_")[1]}
                                    user={user}
                                  />
                                ) : (
                                  w + " "
                                );
                              })}
                            </pre>
                          )}
                        </>
                      )}
                    </pre>
                  ) : (
                    <>
                      {breakLongDescriptionArr[0].map((w, index) => {
                        return w.includes("**") ? (
                          <Mention
                            key={index}
                            username={w.split("_")[1]}
                            user={user}
                          />
                        ) : (
                          w + " "
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </pre>
          </div>
          <div className="link-post">
            {loadingVertPost ? (
              <Skeleton count={1} width={`250px`} />
            ) : (
              <>
                {commentsCount > 0 ? (
                  commentsCount > 2 ? (
                    <div
                      className="mp-0"
                      onClick={() => history.push(`/p/${urlCode}`)}
                    >
                      Mostrar los {commentsCount} comentarios
                    </div>
                  ) : (
                    ""
                  )
                ) : (
                  <>No hay comentarios</>
                )}
              </>
            )}
          </div>
          {/* LAST COMMENTS */}
          <ul className="last-comments mp-0 w-100">
            {loadingVertPost ? (
              <Skeleton count={2} width={`200px`} />
            ) : (
              <>
                {commentsArr.map(
                  (c) =>
                    c !== null &&
                    c !== undefined && (
                      <Comment
                        key={c._id}
                        userId={c.user_id}
                        description={c.text}
                        sendComment={commentHasBeenSent}
                      />
                    )
                )}
              </>
            )}
          </ul>
          {/* --TIMEAGO */}
          <p className="timeago">
            {
              // "a minute ago"
              //console.log(Date.now()),
              <Moment fromNow locale="es">
                {timeAgo}
              </Moment>
            }
          </p>
        </div>
      </div>
      {/* fin wrapper-body */}

      {/* POST FOOTER */}
      <div className="post-footer mp-0">
        {/* --ADD A COMMENT */}
        <div className="cont-add-comment mp-0">
          <div className="wrapper-add-comment w-100 mp-0">
            <input
              className="mp-0 input-comment"
              id={`input-comment-${btKey}`}
              type="text"
              placeholder="Añade un comentario..."
              name="addComment"
              onChange={enadleAddComentButton}
              value={comment}
            />
            <button
              className="bt-small-link mp-0"
              id={`bt-post-comment-${btKey}`}
              onClick={handleCommentPost}
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
      {searchMentionResults.length > 0 && (
        <SearchResults
          suggestions={searchMentionResults}
          user={user}
          notLink={true}
          close={() => setSearchMentionResults(false)}
          setSuggestionName={setSuggestedMention}
        />
      )}
    </div>
  );
}

export default withRouter(VerticalPost);
