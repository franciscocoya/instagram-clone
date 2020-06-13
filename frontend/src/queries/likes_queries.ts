import axios from "axios";

import { decodeUrl } from "./url_queries";

/**
 * Set the number of likes of the post.
 *
 * @param {*} postId Post id.
 */
export async function getTotalLikes(
  postId: string,
  isPost: boolean
): Promise<any> {
  try {
    let ptId, param;
    if (isPost) {
      ptId = await decodeUrl(postId);
      param = ptId.split("/").slice(-1).pop();
    } else {
      param = postId;
    }
    return await axios
      .get(`http://localhost:4000/p/likes/${param}`)
      .then((res) => {
        return res.data.likes;
      })
      .catch((err1) =>
        console.log(
          `An error occurred when counting the likes of the post... ${err1}`
        )
      );
  } catch (err) {
    console.log(
      `An error occurred when counting the likes of the post. ${err}`
    );
  }
}

/**
 * POST LIKES
 */

/**
 * Create a new like of the current user for the post whose id is passed as a parameter.
 *
 * @param userId User id.
 * @param postId Post id. Post to like by the user
 */
export async function addPostLike(
  userId: string,
  postId: string
): Promise<any> {
  try {
    const data = new FormData();
    data.append("postId", postId);
    data.append("userId", userId);

    return await axios
      .post("http://localhost:4000/p/like/add", data)
      .then((res) => {
        return res.data.like;
      })
      .catch((err1) =>
        console.log(`An error ocurred while creating the like... ${err1}`)
      );
  } catch (err) {
    console.log(`An error ocurred while creating the like. ${err}`);
  }
}

/**
 * Delete the current user's like to the post whose parameter is passed as parameter.
 *
 * @param likeId Like id to remove.
 */
export async function removePostLike(likeId: string): Promise<void> {
  const data = new FormData();
  data.append("id", likeId);
  try {
    await axios
      .delete(`http://localhost:4000/p/like/remove/${likeId}`)
      .catch((err1) =>
        console.log(`An error ocurred while deleting the like... ${err1}`)
      );
  } catch (err) {
    console.log(`An error ocurred while deleting the like. ${err}`);
  }
}

/**
 * Check if the current user has liked the post.
 *
 * @param userId User id.
 * @param postId Post id.
 */
export async function checkIsLike(
  userId: string,
  postId: string
): Promise<any> {
  try {
    return await axios
      .get(`http://localhost:4000/user/p/likes/${userId}`)
      .then((res) => {
        let likesArr = res.data.list;

        let filtered = likesArr
          .slice()
          .filter(
            (like: any): boolean =>
              like.userId === userId && like.postId === postId
          )[0];

        let reduced = likesArr.reduce((acc: any, like: any) => {
          return [...acc, like.postId];
        }, []);

        return {
          isLike: reduced.includes(postId),
          currentLike: filtered,
        };
      })
      .catch((err1) =>
        console.log(
          `Se ha producido un error al obtener los likes del usuario. ${err1}`
        )
      );
  } catch (err) {
    console.log(`Se ha producido un error al comprobar el like. ${err}`);
  }
}
