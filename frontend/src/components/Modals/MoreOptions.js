import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import axios from "axios";

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
  //data = postId
  const [isFollowing, setIsFollowing] = useState(false);
  const [urlCode, setUrlCode] = useState("");
  let history = useHistory();

  const checkIsFollowing = async () => {
    try {
      const formData = new FormData();
      formData.append("follow_to", ids.userPostId);
      formData.append("follow_by", user._id);
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios
        .post("http://localhost:4000/follow/isFollowing", formData, config)
        .then((res) => {
          const follow = res.data.isFollowing;
          follow ? setIsFollowing(true) : setIsFollowing(false);
        })
        .catch((err) => "");
    } catch (err) {
      console.log(`Se ha producido un error al comprobar el follow. ${err}`);
    }
  };

  const handleUnfollow = async (e) => {
    e.preventDefault();
    try {
      initRefreshPost();
      let resPost = await axios.get(`http://localhost:4000/p/${ids.postId}`);
      let userIdR = resPost.data.postRet.user_id;
      const unFollowData = new FormData();
      unFollowData.append("follow_by", user._id);
      unFollowData.append("follow_to", userIdR);
      console.log(user._id);
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
          const data = res.data;
          console.log(data);
          close();
          endRefreshPost();
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(`Se ha producido un error al enviar el follow. ${err}`);
      endRefreshPost();
    }
  };

  const shortURL = async () => {
    try {
      const longUrl = `http://localhost:4000/p/${ids.postId}`;
      let data = new FormData();
      data.append("longUrl", longUrl);
      await axios
        .post(`http://localhost:4000/shorten`, data)
        .then((res) => {
          setUrlCode(res.data.url.urlCode);
        })
        .catch((err1) =>
          console.log(`Se ha producido un error al acortar la URL... ${err1}`)
        );
    } catch (err) {
      console.log(
        `Se ha producido un error al acortar la URL del post. ${err}`
      );
    }
  };

  useEffect(() => {
    shortURL();
    checkIsFollowing();
  });

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
