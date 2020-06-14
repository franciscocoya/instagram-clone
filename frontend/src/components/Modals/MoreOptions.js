import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";

import { shortUrl } from "../../queries/url_queries";
import { checkIsFollowing, unfollow } from "../../queries/follow_queries";

//Static files
import "../../public/css/modals/moreOptions.css";

function MoreOptions({
  close,
  openShare,
  ids,
  user,
  initRefreshPost,
  endRefreshPost,
}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [urlCode, setUrlCode] = useState("");
  let history = useHistory();

  const handleCheckFollowing = async () => {
    const result = await checkIsFollowing(ids.userPostId, user._id);
    setIsFollowing(result ? true : false);
  };

  const handleUnfollow = async (e) => {
    e.preventDefault();
    initRefreshPost();
    await unfollow(ids.postId, user._id);
    close();
    endRefreshPost();
  };

  const handleShortUrl = async () => {
    const result = await shortUrl(ids.postId);
    setUrlCode(result);
  };

  useEffect(() => {
    handleShortUrl();
    handleCheckFollowing();
  }, []);

  return (
    <div className="w-moreOptions">
      <div className="close-overlay" onClick={close}></div>
      <div className="modal-options tx-center animated zoomIn">
        <ul className="w-100">
          {isFollowing && (
            <li
              className="list-style-none bold-red b-bottom-1-light"
              onClick={handleUnfollow}
            >
              Dejar de seguir
            </li>
          )}

          <li
            className="list-style-none b-bottom-1-light"
            onClick={() => history.push(`/p/${urlCode}`)}
          >
            Ir a la publicación
          </li>
          <li className="list-style-none b-bottom-1-light" onClick={openShare}>
            Compartir
          </li>
          <li className="list-style-none b-bottom-1-light">Copiar enlace</li>
          <li className="list-style-none b-bottom-1-light">
            Código de inserción
          </li>
          <li className="list-style-none" onClick={close}>
            Cancelar
          </li>
        </ul>
      </div>
    </div>
  );
}

export default withRouter(MoreOptions);
