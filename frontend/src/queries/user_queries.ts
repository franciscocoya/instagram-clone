import axios from "axios";

import { decodeUrl } from "./url_queries";

/**
 * Returns a user by passing their id as a parameter.
 *
 * @param userId User id.
 */
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
 * Check if the password passed as parameter is valid.
 *
 * @param userId User id.
 * @param oldPass Old password.
 */
export async function checkOldPasswordValid(
  userId: string,
  oldPass: string
): Promise<any> {
  //let validPass = await getUserPassByUserId(userId);
  try {
    return await axios
      .get(`http://localhost:4000/accounts/user/checkP/${userId}/${oldPass}`)
      .then((res) => {
        return res.data.isValid;
      })
      .catch((err1) => {});
  } catch (err) {
    console.log(`An error ocurred checking the user's password. ${err}`);
  }
}

/**
 * Update the user data passed as a parameter.
 *
 * @param username Username.
 * @param email Email.
 * @param fullname Fullname.
 * @param bio Biography.
 * @param website Website.
 * @param userId User id.
 */
export async function updateUser(
  username: string = "",
  email: string = "",
  fullname: string = "",
  bio: string = "",
  website: string = "",
  userId: string
): Promise<any> {
  try {
    const data = new FormData();

    data.append("username", username);
    data.append("email", email);
    data.append("fullname", fullname);
    data.append("bio", bio);
    data.append("website", website);

    console.log(username, email, fullname, bio, website, userId);

    await axios
      .put(`http://localhost:4000/accounts/user/${userId}`, data)
      .catch((err1) =>
        console.log(`An error ocurred while updating the user... ${err1}`)
      );
  } catch (err) {
    console.log(`An error ocurred while updating the user data. ${err}`);
  }
}

/**
 * Change the password of the user, whose id is passed as parameter,
 * with the new password passed as parameter.
 *
 * @param newPass new Password.
 * @param userId User id.
 * @param callback Callback to executes after update.
 */
export async function changeUserPass(
  newPass: string,
  userId: string
  //callback?: any
): Promise<any> {
  try {
    await axios
      .patch(`/accounts/user/changePass/${newPass}/${userId}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err1) =>
        console.log(`An error ocurred while updating the pass... ${err1}`)
      );
  } catch (err) {
    console.log(`An error ocurred while updating the user password. ${err}`);
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

export function closeSession(): void {
  localStorage.removeItem("INSTAGRAM_TOKEN");
}
