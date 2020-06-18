import axios from "axios";

export async function loadReplies(commentId: string): Promise<any> {
  try {
    return await axios
      .get(`http://localhost:4000/p/commentReply/list/${commentId}`)
      .then((res) => {
        return res.data.replies;
      })
      .catch((err1) =>
        console.log(`An error ocurred loading the comment replies... ${err1}`)
      );
  } catch (err) {
    console.log(
      `An error occurred while listing responses to the comment.. ${err}`
    );
  }
}
