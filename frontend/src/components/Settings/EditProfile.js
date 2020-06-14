import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import axios from "axios";

//Queries
import { updateUser } from "../../queries/user_queries";

//static files
import "../../public/css/settings/editProfile.css";

function EditProfile({ user, showChangePicModal }) {
  let history = useHistory();

  const [username, setUsername] = useState(user.username ? user.username : "");
  const [fullname, setFullname] = useState(
    user.full_name ? user.full_name : ""
  );
  const [email, setEmail] = useState(user.email ? user.email : "");
  const [website, setWebsite] = useState(user.website ? user.website : "");
  const [bio, setBio] = useState(user.bio ? user.bio : "");

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleChangeFullname = (e) => {
    setFullname(e.target.value);
  };
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangeWebsite = (e) => {
    setWebsite(e.target.value);
  };

  const handleChangeBio = (e) => {
    setBio(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(username, email, fullname, bio, website, user._id);
    history.push(`/${user.username}`);
    // const data = new FormData();
    // data.append("username", username);
    // data.append("email", email);
    // data.append("full_name", fullname);
    // data.append("bio", bio);
    // data.append("website", website);

    // await axios
    //   .put(`http://localhost:4000/accounts/user/${user._id}`, data)
    //   .then(() => {
    //     history.push(`/${user.username}`);
    //   });
  };

  return (
    <div className="editProfile p-relative">
      {/* Edit header */}
      <div className="edit-header">
        <img
          src={user.profile_picture}
          alt={user.username}
          title={user.username}
        />
        <div className="cont-info-header">
          <h2 className="tx-gray">{user.username}</h2>
          <p
            className="decoration-none bold mp-0 f-profile w-100"
            onClick={showChangePicModal}
          >
            Cambiar foto de perfil
          </p>
        </div>
      </div>
      {/* Edit body */}
      <form className="editBody" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="fullname" className="bold-black">
            Nombre
          </label>

          <input
            type="text"
            name="fullname"
            placeholder="Nombre"
            autoFocus
            value={fullname}
            onChange={handleChangeFullname}
          />
        </div>
        <div className="form-control">
          <label htmlFor="username" className="bold-black">
            Nombre de usuario
          </label>
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={username}
            onChange={handleChangeUsername}
          />
        </div>
        <div className="form-control">
          <label htmlFor="website" className="bold-black">
            Sitio web
          </label>
          <input
            type="text"
            name="website"
            placeholder="Sitio web"
            value={website}
            onChange={handleChangeWebsite}
          />
        </div>
        <div className="form-control">
          <label htmlFor="email" className="bold-black">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={handleChangeEmail}
          />
        </div>
        <div className="form-control">
          <label htmlFor="bio" className="bold-black">
            Biografía
          </label>
          <textarea
            name="bio"
            value={bio}
            onChange={handleChangeBio}
          ></textarea>
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default withRouter(EditProfile);
