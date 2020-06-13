import axios from "axios";

/**
 * Check if the user in session follows the user of the post.
 *
 * @param {*} userId  Post user id.
 * @param {*} currentUserId Current user id.
 */
export async function checkIsFollowing(
  userId: string,
  currentUserId: string
): Promise<any> {
  try {
    const data = new FormData();
    data.append("follow_to", userId);
    data.append("follow_by", currentUserId);

    return await axios
      .post("http://localhost:4000/follow/isFollowing", data)
      .then((res) => {
        return res.data.isFollowing;
      })
      .catch((err1) =>
        console.log(
          `An error occurred while checking the user's follow... ${err1}`
        )
      );
  } catch (err) {
    console.log(`An error occurred while checking the user's follow. ${err}`);
  }
}

/**
 * The current user stops following the user of the post.
 *
 * @param {*} postId Post id.
 * @param {*} currentUserId Current user id.
 */
export async function unfollow(
  postId: string,
  currentUserId: string
): Promise<void> {
  try {
    let resPost = await axios.get(`http://localhost:4000/p/${postId}`);
    let userIdR = resPost.data.postRet.user_id;
    const unFollowData = new FormData();
    unFollowData.append("follow_by", currentUserId);
    unFollowData.append("follow_to", userIdR);
    // const dataConfig = {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    // };
    await axios
      .delete("http://localhost:4000/follow/unfollow", { data: unFollowData })
      .catch((err1) =>
        console.log(`An error occurred while deleting the follow. ${err1}`)
      );
  } catch (err) {
    console.log(`An error occurred while deleting the follow. ${err}`);
  }
}

/**
 * Create the follow between the user in session and the user of the post.
 *
 * @param {*} userId User post id.
 * @param {*} currentUserId Current user id.
 */
export async function follow(
  userId: string,
  currentUserId: string
): Promise<void> {
  try {
    const followData = new FormData();
    followData.append("follow_by", currentUserId);
    followData.append("follow_to", userId);

    await axios
      .post("http://localhost:4000/follow/add", followData)
      .catch((err1) =>
        console.log(`An error ocurred while creating the follow... ${err1}`)
      );
  } catch (err) {
    console.log(`An error occurred while creating the follow. ${err}`);
  }
}
