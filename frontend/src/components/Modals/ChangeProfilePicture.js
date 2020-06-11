import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

//Static files
import "../../public/css/modals/changeProfilePicture.css";

function ModalChangePicture({ user, close, setLoadingPicture, changePicture }) {
  const [currentUser, setCurrentUser] = useState(null);

  /**
   * Change profile picture.
   */
  const changeImage = async (e) => {
    changePicture(e);
  };

  /**
   * Remove the current profile picture.
   * Replace the current picture with default empty picture.
   * @param {*} e
   */
  const removeProfPic = async (e) => {
    e.preventDefault();
    const defaultPic = process.env.FB_DEFAULT_PROF_PIC;
    let newUrlPic = new FormData();
    newUrlPic.append("profile_picture", defaultPic);

    await axios.put(
      `http://localhost:4000/accounts/user/${currentUser._id}`,
      newUrlPic
    );

    setTimeout(() => {
      close();
    }, 100);
  };

  //Effects
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get(`http://localhost:4000/accounts/user/init`);
        console.log(res.data);
        setCurrentUser(res.data.user);
      } catch (err) {
        if (
          err.response &&
          (err.response.status === 404 || err.response.status === 400)
        ) {
          console.log("El perfil no existe");
        } else {
          console.log("Hubo un problema cargando este perfil.");
        }
      }
    }
    loadUser();
  }, []);

  return (
    <div className="w-changePic h-100">
      <div className="close-overlay" onClick={close}></div>
      <div className="modal-changePic tx-center animated zoomIn">
        <ul className="w-100">
          <li className="list-style-none b-bottom-1-light">
            Cambiar foto del perfil
          </li>
          <li className="list-style-none b-bottom-1-light bold-blue">
            <label htmlFor="input-file" className="w-100 upload-photo">
              Subir foto
            </label>
            <input
              type="file"
              id="input-file"
              className="display-none mp-0"
              accept="image/jpeg,image/png"
              onChange={changeImage}
            />
          </li>
          <li
            className="list-style-none b-bottom-1-light bold-red"
            onClick={removeProfPic}
          >
            Eliminar foto actual
          </li>
          <li className="list-style-none b-bottom-1-light" onClick={close}>
            Cancelar
          </li>
        </ul>
      </div>
    </div>
  );
}

export default withRouter(ModalChangePicture);
