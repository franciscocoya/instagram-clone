import axios from "axios";

import { decodeUrl } from "./url_queries";

export async function loadPost(postId) {
  try {
    let ptId = await decodeUrl(postId);
    return await axios
      .get(`http://localhost:4000/p/${ptId.split("/").slice(-1).pop()}`)
      .then((res) => {
        return res.data.postRet;
      })
      .catch((err1) =>
        console.log(`An error ocurred while getting the post. ${err1}`)
      );
  } catch (err) {
    console.log(`There was a problem loading the post. ${err}`);

    //!history.push("/error/404");
  }
}

/**
 * Get the suggested user for the current user.
 *
 * @param {*} userId Current user id.
 */
export async function getSuggestedUsers(userId) {
  try {
    return await axios
      .get(`http://localhost:4000/follow/listUsersNotFollow/${userId}`)
      .then((res) => {
        return res.data.usersNotFollowing;
      })
      .catch((err1) =>
        console.log(
          `An error ocurred(axios) while getting the suggested users. ${err1}`
        )
      );
  } catch (err) {
    console.log(`An error ocurred while getting the suggested users. ${err}`);
  }
}
