import axios from "axios";

import { decodeUrl } from "./url_queries";

/**
 * Get the user from the post id.
 *
 * @param {*} postId Post id.
 */
export async function getUserByPostId(postId) {
  try {
    let ptId = await decodeUrl(postId);
    let resPost = await axios.get(
      `http://localhost:4000/p/${ptId.split("/").slice(-1).pop()}`
    );
    let userIdR = resPost.data.postRet.user_id;
    return await axios
      .get(`http://localhost:4000/accounts/user/${userIdR}`)
      .then((res) => {
        return res.data.user;
      })
      .catch((err1) => {
        console.log(`An error occurred while loading the post user... ${err1}`);
      });
  } catch (err) {
    console.log(`An error occurred while loading the post user. ${err}`);
  }
}
