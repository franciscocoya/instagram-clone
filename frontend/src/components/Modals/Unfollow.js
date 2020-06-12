import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

//Queries
import { unfollow } from "../../queries/follow_queries";

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
    initRefreshPost();
    await unfollow(postId, currentUser._id);
    endRefreshPost();
    close(); //Close the unfollow modal
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
