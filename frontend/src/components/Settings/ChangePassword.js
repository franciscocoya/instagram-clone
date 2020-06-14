import React from "react";
import { Link, withRouter } from "react-router-dom";
//import axios from "axios";

//static files
import "../../public/css/settings/changePassword.css";

function ChangePassword({ user }) {
  const defaultPicURL = process.env.REACT_APP_FB_DEFAULT_PROF_PIC;

  const handleChange = (e) => {
    e.target.name = e.target.value;
  };
  return (
    <div className="editProfile">
      {/* Edit header */}
      <div className="edit-header">
        <img
          src={
            user.profile_picture === "undefined"
              ? defaultPicURL
              : user.profile_picture
          }
          alt={user.username}
          title={user.username}
        />
        <div className="cont-info-header">
          <h2 className="tx-gray">{user.username}</h2>
        </div>
      </div>
      {/* Edit body */}
      <form action="" className="editBody">
        <div className="form-control">
          <label htmlFor="oldPassword" className="bold-black">
            Contraseña antigua
          </label>

          <input
            type="password"
            name="oldPassword"
            autoFocus
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="newPassword" className="bold-black">
            Contraseña nueva
          </label>
          <input type="password" name="newPassword" onChange={handleChange} />
        </div>
        <div className="form-control">
          <label htmlFor="confirmNewPassword" className="bold-black">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            name="confirmNewPassword"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Cambiar contraseña</button>
      </form>
      <Link
        to="/accounts/password/reset"
        className="decoration-none bold text-center l-forgot-password"
      >
        ¿Has olvidado la contraseña?
      </Link>
    </div>
  );
}

export default withRouter(ChangePassword);
