import React from "react";
import { withRouter, useHistory } from "react-router-dom";
import axios from "axios";

//Static files
import "../../public/css/Mention/mention.css";

function Mention({ username, user }) {
  let history = useHistory();

  const handleClick = (e) => {
    e.preventDefault();
    checkUserExists();
  };

  const checkUserExists = async () => {
    try {
      await axios
        .get(`http://localhost:4000/accounts/user/username/${username}`)
        .then(async (res) => {
          let userRet = res.data.user;
          console.log(userRet, user);
          if (userRet._id === user._id) {
            history.push(`/${user.username}/`);
          } else if (userRet !== null && userRet !== undefined) {
            history.push(`/u/${username}`);
          } else {
            history.push("/error/404");
          }
        })
        .catch((err1) => {
          console.log(
            `Se ha producido un error en la consulta del username. ${err1}`
          );
          history.push("/error/404");
        });
    } catch (err) {
      console.log(
        `Se ha producido un error al comprobar el usuario de la mencion. ${err}`
      );
      history.push("/error/404");
    }
  };

  return (
    <span className="mention" id={`mention_${username}`} onClick={handleClick}>
      @{username}
    </span>
  );
}

export default withRouter(Mention);
