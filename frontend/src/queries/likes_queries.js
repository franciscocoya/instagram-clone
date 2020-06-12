import axios from "axios";

import { decodeUrl } from "./url_queries";

/**
 * Set the number of likes of the post.
 *
 * @param {*} postId Post id.
 */
export async function getTotalLikes(postId) {
  try {
    let ptId = await decodeUrl(postId);
    return await axios
      .get(`http://localhost:4000/p/likes/${ptId.split("/").slice(-1).pop()}`)
      .then((res) => {
        return res.data.likes;
      })
      .catch((err1) =>
        console.log(
          `Se ha producido un error al contar los likes del post. ${err1}`
        )
      );
  } catch (err) {
    console.log(`Se ha producido un error al listar los likes.${err}`);
  }
}
