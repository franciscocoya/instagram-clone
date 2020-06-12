import axios from "axios";

const postCtrl = {};

export async function getSuggestedUsers(userId) {
  try {
    return await axios
      .get(`http://localhost:4000/follow/listUsersNotFollow/${userId}`)
      .then((res) => {
        //const users = res.data.usersNotFollowing;
        return res.data.usersNotFollowing;
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(
      `Se ha producido un error al cargar los usuarios recomendados. ${err}`
    );
  }
}
