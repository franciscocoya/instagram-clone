import axios from "axios";

import { decodeUrl } from "./url_queries";

export async function getUserById(userId: string): Promise<any> {
  try {
    return await axios
      .get(`http://localhost:4000/accounts/user/${userId}`)
      .then((res) => {
        return res.data.user;
      })
      .catch((err1) =>
        console.log(`An error ocurred while getting the user... ${err1}`)
      );
  } catch (err) {
    console.log("An error ocurred while getting the user. " + err);
  }
}

/**
 * Get the user from the post id.
 *
 * @param {*} postId Post id.
 */
export async function getUserByPostId(postId: string): Promise<any> {
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

/**
 * Returns the user given their username passed as parameter.
 *
 * @param username Username.
 */
export async function getUserByUsername(username: string): Promise<any> {
  try {
    return await axios
      .get(`http://localhost:4000/accounts/user/username/${username}`)
      .then((res) => {
        return res.data.user;
      })
      .catch((err1) =>
        console.log(`An error ocurred while loading the profile... ${err1}`)
      );
  } catch (err) {
    console.log(`An error ocurred while loading the profile. ${err}`);
  }
}

/**
 * Returns the suggested users for the current user.
 *
 * @param userId User id.
 */
export async function getSuggestedUsers(userId: string): Promise<any> {
  try {
    return await axios
      .get(`http://localhost:4000/follow/listUsersNotFollow/${userId}`)
      .then((res) => {
        const users = res.data.usersNotFollowing;
        return users.slice(0, Math.min(5, users.length)); //suggest five users
      })
      .catch((err1) =>
        console.log(
          `An error ocurred while loading the suggested users... ${err1}`
        )
      );
  } catch (err) {
    console.log(`An error ocurred while loading the suggested users. ${err}`);
  }
}

/**
 * Check if the current user has follow with the other user whose username is passed as parameter.
 *
 * @param userId User id.
 * @param username Other username.
 */
export async function checkUserType(
  userId: string,
  username: string = ""
): Promise<any> {
  try {
    const otherUser = await getUserByUsername(username);

    const data = new FormData();
    data.append("follow_by", userId);
    data.append("follow_to", otherUser._id);

    return await axios
      .post("http://localhost:4000/follow/isFollowing", data)
      .then((res) => {
        return res.data.isFollowing;
      })
      .catch((err1) =>
        console.log(`An error ocurred while checking the user... ${err1}`)
      );
  } catch (err) {
    console.log(`An error ocurred while checking the user. ${err}`);
  }
}
