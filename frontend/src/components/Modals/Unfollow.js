import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

//static files
import "../../public/css/modals/unfollow.css";
import igIcon from "../../public/assets/img/instagram-icon.svg";

function Unfollow({
  postUser,
  currentUser,
  postId,
  close,
  initRefreshPost,
  endRefreshPost,
}) {
  const unfollowPostUser = async (e) => {
    e.preventDefault();
    try {
      initRefreshPost();
      let resPost = await axios.get(`http://localhost:4000/p/${postId}`);
      let userIdR = resPost.data.postRet.user_id;
      const unFollowData = new FormData();
      unFollowData.append("follow_by", currentUser._id);
      unFollowData.append("follow_to", userIdR);
      const config = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios
        .delete(
          "http://localhost:4000/follow/unfollow",
          { data: unFollowData },
          config
        )
        .then((res) => {
          console.log(res.data);
          close();
          endRefreshPost();
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(`Se ha producido un error al enviar el follow. ${err}`);
      endRefreshPost();
    }
  };

  return (
    <div className="w-unfollow">
      <div className="close-overlay" onClick={close}></div>
      <div className="modal-unfollow tx-center animated zoomIn">
        <ul className="w-100">
          <li className="list-style-none  b-bottom-1-light">
            <img src={igIcon} alt="Logo de instagram" />
            <span>¿ Dejar de seguir a @{postUser.username} ?</span>
          </li>
          <li
            className="list-style-none bold-red b-bottom-1-light"
            onClick={unfollowPostUser}
          >
            Dejar de seguir
          </li>
          <li className="list-style-none" onClick={close}>
            Cancelar
          </li>
        </ul>
      </div>
    </div>
  );
}

export default withRouter(Unfollow);
