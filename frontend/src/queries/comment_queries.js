import axios from "axios";

import { decodeUrl } from "./url_queries";

/**
 * Load all the comments of the post to show.
 * The post id is passed as a parameter.
 *
 * @param {*} postId Post id.
 */
export async function getComments(postId) {
  try {
    let ptUrl = await decodeUrl(postId);
    return await axios
      .get(`http://localhost:4000/comments/${ptUrl.split("/").slice(-1).pop()}`)
      .then((res) => {
        return res.data.comments;
      })
      .catch((err1) =>
        console.log(
          `An error occurred while loading the post comments. ${err1}`
        )
      );
  } catch (err) {
    console.log(`An error occurred while getting comments on the post. ${err}`);
  }
}

/**
 * Return the total number of likes for the post.
 *
 * @param {*} postId Post id.
 */
export async function getTotalComments(postId) {
  try {
    let ptUrl = await decodeUrl(postId);
    return await axios
      .get(
        `http://localhost:4000/comments/c/${ptUrl.split("/").slice(-1).pop()}`
      )
      .then((res) => {
        return res.data.commentsCount;
      })
      .catch((err1) =>
        console.log(
          `An error occurred when counting the comments of the post. ${err1}`
        )
      );
  } catch (err) {
    console.log(`An error occurred while listing comments.${err}`);
  }
}

/**
 *** REPLIES ***
 */

/**
 * Reply to a selected comment.
 * The content of the comment, the id of the comment to reply and the id of the user in session
 * are passed as a parameter.
 *
 * @param {*} comment Content of the comment.
 * @param {*} commentId Id of comment to reply.
 * @param {*} currentUserId Current user id.
 */
export async function replyComment(comment, commentId, currentUserId) {
  try {
    let splittedComment = comment.split(" ").slice(1);

    let data = new FormData();
    data.append("text", splittedComment);
    data.append("user_id", currentUserId);
    data.append("comment_id", commentId);

    await axios
      .post("http://localhost:4000/p/commentReply/addReply", data)
      .catch((err1) =>
        console.log(
          `An error occurred while saving the response to the comment ${commentId}. ${err1}`
        )
      );
  } catch (err) {
    console.log(`An error occurred while replying to the comment. ${err}`);
  }
}

export async function commentPost(comment, currentUserId, postId) {
  try {
    let data = new FormData();
    data.append("user_id", currentUserId);
    data.append("post_id", postId);
    data.append("text", comment);

    await axios
      .post("http://localhost:4000/p/comment/add", data)
      .catch((err1) =>
        console.log(`An error occurred while creating the comment... ${err1}`)
      );
  } catch (err) {
    console.log(`An error occurred while creating the comment. ${err}`);
  }
}
