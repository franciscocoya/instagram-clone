import axios from "axios";

/**
 * Returns the complete url of the post by passing its id as a parameter.
 *
 * @param {*} postId Post id.
 */
export async function decodeUrl(postId) {
  try {
    return await axios
      .get(`http://localhost:4000/shorten/${postId}`)
      .then((res) => {
        return res.data.shortenedURL.longUrl;
      })
      .catch((err1) =>
        console.log(
          `An error ocurred while getting the post using urlCode. ${err1}`
        )
      );
  } catch (err) {
    console.log(
      `An error occurred decoding the URL associated with the post. ${err}`
    );
  }
}

export async function shortUrl(postId) {
  try {
    const longUrl = `http://localhost:4000/p/${postId}`;
    let data = new FormData();
    data.append("longUrl", longUrl);
    return await axios
      .post(`http://localhost:4000/shorten`, data)
      .then((res) => {
        return res.data.url.urlCode;
      })
      .catch((err1) =>
        console.log(`An error occurred while shortening the URL... ${err1}`)
      );
  } catch (err) {
    console.log(`An error occurred while shortening the post URL. ${err}`);
  }
}
