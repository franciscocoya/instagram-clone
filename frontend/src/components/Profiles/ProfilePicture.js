import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

//Queries
import { uploadProfileImage } from "../../queries/image_queries";

//Static files
import "../../public/css/Profile/ProfilePicture/profilePicture.css";

function ProfilePicture({ user }) {
  const DEFAULT_PIC = process.env.REACT_APP_FB_DEFAULT_PROF_PIC;
  const DEFAULT_PROFILES_FOLDER = "profiles";

  const [hasProfilePicture, setHasProfilePicture] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [refresh, setRefresh] = useState(false);

  const handleClickImageInput = async (e) => {
    setRefresh(false);
    let raw = e.target.files[0];
    const result = await uploadProfileImage(
      DEFAULT_PROFILES_FOLDER,
      raw.name,
      raw,
      user._id
    );
  };

  useEffect(() => {
    setProfilePicture(
      user.profile_picture === "undefined" ? DEFAULT_PIC : user.profile_picture
    );
  }, [refresh]);

  return (
    <button className="profile-picture">
      <label htmlFor="input-file">
        <img
          src={profilePicture}
          alt={`Foto de perfil de ${user.username}`}
          title="Haz click aquí para cambiar tu foto de perfil"
        />
      </label>
      <input
        type="file"
        id="input-file"
        className="input-img-profile w-100 activate-input"
        accept="image/jpeg, image/png"
        onChange={handleClickImageInput}
      />
    </button>
  );
}

export default withRouter(ProfilePicture);
