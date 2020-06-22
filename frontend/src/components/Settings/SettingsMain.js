import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";

//Queries
import { uploadProfileImage } from "../../queries/image_queries";

//Components
import UserNavigation from "../Navigations/UserNavigation";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import Message from "../Messages/Message";

//Modals
import ChangeProfilePicture from "../Modals/ChangeProfilePicture";
import SearchResults from "../Modals/SearchResults";

//static files
import "../../public/css/settings/settingsMain.css";

function SettingsMain({ user, enablePass, enableEdit }) {
  let history = useHistory();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [showMessage] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showEdit, setShowEdit] = useState(true);
  const [showModalChangePic, setShowModalChangePic] = useState(false);

  const setEditView = (e) => {
    e.preventDefault();
    setShowEdit(true);
    setShowChangePass(false);
    setBorder(true);
    history.push(`/${user.username}/edit`);
  };

  const setBorder = (isEdit) => {
    if (isEdit) {
      const linkEdit = document.querySelector(".link-edit");
      const linkChangePass = document.querySelector(".link-changePass");
      linkChangePass.classList.remove("link-set-active");
      linkEdit.classList.add("link-set-active");
    } else {
      const linkChangePass = document.querySelector(".link-changePass");
      const linkEdit = document.querySelector(".link-edit");
      linkEdit.classList.remove("link-set-active");
      linkChangePass.classList.add("link-set-active");
    }
  };

  const setChangePassView = (e) => {
    e.preventDefault();
    setShowChangePass(true);
    setShowEdit(false);
    setBorder(false);
    history.push("/accounts/password/change");
  };

  /**
   * Change profile picture.
   * @param {*} e
   */
  const changeProfilePic = async (e) => {
    let imgFile = e.target.files[0];

    if (imgFile !== undefined && imgFile !== null) {
      await uploadProfileImage(
        "profiles",
        imgFile.name,
        imgFile,
        user._id,
        setShowModalChangePic.bind(this, false) //Close the modal
      );
    }
  };

  useEffect(() => {}, [user]);

  return (
    <div className="body setting-body">
      {showMessage && <Message />}
      <UserNavigation
        user={user}
        showSuggestions={() => setShowSearchResults(true)}
        closeSuggestions={() => setShowSearchResults(false)}
        resultsArr={setSearchResults}
      />
      {showModalChangePic && (
        <ChangeProfilePicture
          user={user}
          close={() => setShowModalChangePic(false)}
          changePicture={changeProfilePic}
        />
      )}
      {showSearchResults && (
        <SearchResults suggestions={searchResults} user={user} />
      )}
      <div className="cont-center mp-0">
        <div className="container-settings b-1-g bg-white">
          <div className="col-1">
            <p
              className="decoration-none l-settings w-100 mp-0 link-edit link-set-active"
              onClick={setEditView}
            >
              Editar perfil
            </p>
            <p
              className="decoration-none l-settings w-100 mp-0 link-changePass"
              onClick={setChangePassView}
            >
              Cambiar contraseña
            </p>
          </div>

          <div className="col-2">
            {showEdit && enableEdit && (
              <EditProfile
                user={user}
                showChangePicModal={() => setShowModalChangePic(true)}
              />
            )}
            {showChangePass && enablePass && <ChangePassword user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(SettingsMain);
