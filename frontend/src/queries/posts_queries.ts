import axios from "axios";

import { decodeUrl } from "./url_queries";

/**
 * Load the post whose id is passed as a parameter.
 *
 * @param {*} postId Post id.
 */
export async function loadPost(postId: string): Promise<any> {
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
  }
}

/**
 * Get the suggested user for the current user.
 *
 * @param {*} userId Current user id.
 */
export async function getSuggestedUsers(userId: string): Promise<any> {
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

/**
 * Returns all user posts followed by the user, that is, with follow.
 *
 * @param userId User id.
 */
export async function getNotFollowingPosts(userId: string): Promise<any> {
  try {
    const data = new FormData();
    data.append("userId", userId);
    return await axios
      .post("http://localhost:4000/follow/notFollowingPosts", data)
      .then((res) => {
        return res.data.notFollowingPosts;
      })
      .catch((err1) =>
        console.log(
          `An error occurred listing user posts followed by user... ${err1}`
        )
      );
  } catch (err) {
    console.log(
      `An error occurred listing user posts followed by user. ${err}`
    );
  }
}

/**
 * Get posts from users followed by the user in session.
 *
 * @param userId User id.
 */
export async function getFollowingPosts(userId: string): Promise<any> {
  try {
    const data = new FormData();
    data.append("userId", userId);
    return await axios
      .post("http://localhost:4000/p/list/followingPosts", data)
      .then((res) => {
        return res.data.followingPosts.sort(
          (a: any, b: any): any => b.createdAt - a.createdAt
        );
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(
      `Se ha producido un error al listar los posts de los usuarios seguidos por el usuario. ${err}`
    );
  }
}

/**
 *** LOCATION ***
 */

/**
 * Get the featured post associated with the location passed as a parameter.
 *
 * @param {*} place The place to get the feature post.
 */
export async function getFeaturePost(place: string): Promise<any> {
  try {
    return await axios
      .get(`http://localhost:4000/posts/feature/${place}`)
      .then((res) => {
        return res.data.post;
      })
      .catch((err1) =>
        console.log(`An error occurred while getting featured post... ${err1}`)
      );
  } catch (err) {
    console.log(`An error occurred while getting featured post. ${err}`);
  }
}

/**
 * Gets all the posts associated with the location passed as a parameter.
 *
 * @param {*} place Place where the posts are located
 */
export async function getPostsByLocation(place: string): Promise<any> {
  try {
    return await axios
      .get(`http://localhost:4000/posts/place/${place}`)
      .then((res) => {
        return res.data.posts;
      })
      .catch((err1) =>
        console.log(`An error ocurred while getting the posts... ${err1}`)
      );
  } catch (err) {
    console.log(`An error ocurred while getting the location posts. ${err}`);
  }
}

/**
 *** MENTION & HASHTAG***
 */

export async function searchMention(
  textSearch: string,
  userId: string
): Promise<any> {
  try {
    if (textSearch !== null && textSearch !== undefined) {
      let textFilt = textSearch.split("@")[1];
      return await axios
        .get(`http://localhost:4000/user/search/${textFilt}`)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            const results = res.data.users;
            return results.filter((u: any): any => u._id !== userId);
          }
        })
        .catch((err1) =>
          console.log(`An ocurred ocurred while getting the results... ${err1}`)
        );
    } else {
      console.log(`Invalid, undefined or null input...`);
    }
  } catch (err) {
    console.log(`An error ocurred while searching < ${textSearch} >. ${err}`);
  }
}