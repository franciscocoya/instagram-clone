import axios from "axios";

/**
 * Search the element (user, hashtag, etc) passed as a parameter in the database.
 *
 * @param textSearch User, Hashtag & more.
 * @param userId User id.
 */
export async function search(
  textSearch: string,
  userId: string,
  callback1?: any
): Promise<any> {
  try {
    if (textSearch !== null && textSearch !== undefined) {
      return await axios
        .get(`http://localhost:4000/user/search/${textSearch}`)
        .then((res) => {
          const results = res.data.users;
          const resultsFilt = results.filter((u: any) => u._id !== userId);
          console.log(resultsFilt);
          callback1(resultsFilt);
        })
        .catch((err1) =>
          console.log(
            `An error ocurred while searching for the passed text as parameter . ${err1}`
          )
        );
    } else {
      console.log(`Invalid input.`);
    }
  } catch (err) {
    console.log(`An error ocurred while searching the element. ${err}`);
  }
}
