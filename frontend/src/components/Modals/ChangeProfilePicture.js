import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

//Queries
import { uploadProfileImage } from "../../queries/image_queries";

//Static files
import "../../public/css/modals/changeProfilePicture.css";

function ModalChangePicture({ user, close, setLoadingPicture }) {
  const defaultPicURL = process.env.REACT_APP_FB_DEFAULT_PROF_PIC;
  /**
   * Change profile picture.
   */

  const changeImage = async (e) => {
    const img = e.target.files[0];
    await uploadProfileImage("profiles", img.name, img, user._id);
  };

  /**
   * Remove the current profile picture.
   * Replace the current picture with default empty picture.
   * @param {*} e
   */
  const removeProfPic = async (e) => {
    e.preventDefault();
    const defaultPic = process.env.REACT_APP_FB_DEFAULT_PROF_PIC;
    console.log(defaultPic);
    let newUrlPic = new FormData();
    newUrlPic.append("profile_picture", defaultPic);

    await axios.put(
      `http://localhost:4000/accounts/user/${user._id}`,
      newUrlPic
    );

    setTimeout(() => {
      close();
    }, 100);
  };

  //Effects
  //useEffect(() => {}, []);

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
