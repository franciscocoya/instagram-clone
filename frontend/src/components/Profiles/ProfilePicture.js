import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import $ from "jquery";

//Queries
import { uploadProfileImage } from "../../queries/image_queries";

//Static files
import "../../public/css/Profile/ProfilePicture/profilePicture.css";

function ProfilePicture({ user, showPictureModal }) {
  const DEFAULT_PIC = process.env.REACT_APP_FB_DEFAULT_PROF_PIC;
  const DEFAULT_PROFILES_FOLDER = "profiles";

  const [hasProfilePicture, setHasProfilePicture] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

  const handleClickImageInput = async (e) => {
    if (hasProfilePicture) {
      e.preventDefault();
      disableInput(true);
      showPictureModal();
    } else {
      disableInput(false);
      let raw = e.target.files[0];
      await uploadProfileImage(
        DEFAULT_PROFILES_FOLDER,
        raw.name,
        raw,
        user._id
      );
    }
  };

  const disableInput = (enabled) => {
    $("#input-file").prop("disabled", enabled);
    enabled ? setHasProfilePicture(true) : setHasProfilePicture(false);
  };

  /**
   *  Check if the current user has a profile picture.
   *
   */
  const checkIsProfilePicture = () => {
    let img = user.profile_picture;
    img !== "undefined" && img !== DEFAULT_PIC
      ? disableInput(true)
      : disableInput(false);
    setProfilePicture(
      user.profile_picture === "undefined" ? DEFAULT_PIC : user.profile_picture
    );
  };

  useEffect(() => {
    checkIsProfilePicture();
  }, [profilePicture]);

  return (
    <button
      className="profile-picture"
      onClick={hasProfilePicture ? handleClickImageInput : null}
    >
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
