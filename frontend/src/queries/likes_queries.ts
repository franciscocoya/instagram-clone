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
