import axios from "axios";

/**
 * Loads the chat messages of the user whose id is passed as a parameter.
 *
 * @param userId User id.
 */
export async function loadChatUsers(userId: string): Promise<any> {
  try {
    const data = new FormData();
    data.append("user_from", userId);
    // const dataConfig = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    // };

    return await axios
      .post("http://localhost:4000/direct/msg/list", data)
      .then((res) => {
        return res.data.messages;
      })
      .catch((err1) =>
        console.log(
          `An error occurred listing users in the current user's conversations... ${err1}`
        )
      );
  } catch (err) {
    console.log(
      `An error occurred while loading users from the current user's chats. ${err}`
    );
  }
}

/**
 * Gets the most recent date from a date array passed as a parameter.
 *
 * @param arr Array of dates.
 */
export function getMinDate(arr: Array<Date>): any {
  const arrCopy = arr.slice();
  return arrCopy.reduce((min: any, msg: any) => {
    const time = new Date(msg.createdAt);
    return min < time ? min : time;
  });
}

export async function getUserConversationProfiles(
  userId: string
): Promise<any> {
  try {
    //TODO:
  } catch (err) {
    console.log(
      `Se ha producido un error al listar los usuarios de los chats. ${err}`
    );
  }
}
