import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
//import * as firebase from "firebase";
import { storage } from "../../firebase";

//Components
import UserNavigation from "../Navigations/UserNavigation";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import Message from "../Messages/Message";

//Modals
import ChangeProfilePicture from "../Modals/ChangeProfilePicture";

//static files
import "../../public/css/settings/settingsMain.css";

var firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DB_URL,
  projectId: process.env.PROYECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID,
};

function SettingsMain({ user, setModalPicture, enablePass, enableEdit }) {
  let history = useHistory();
  //--
  const [showMessage] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showEdit, setShowEdit] = useState(true);
  const [currentUser, setCurrentUser] = useState(user);
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

  const setEnableEdit = () => {
    setShowEdit(true);
    setShowChangePass(false);
    setBorder(true);
  };

  const setEnablePass = () => {
    setShowChangePass(true);
    setShowEdit(false);
    setBorder(false);
  };

  /**
   * Change profile picture.
   * TODO: Cambiar CLoudinary por firebase.
   * @param {*} e
   */
  const changeProfilePic = (e) => {
    let imgFile = e.target.files[0];

    if (imgFile !== undefined && imgFile !== null) {
      uploadProfileImage(imgFile);
    }
  };

  /**
   * Upload the user's profile image to firebase.
   */
  const uploadProfileImage = async (img) => {
    try {
      const storageRef = storage.ref(`profiles/${img.name}`);
      const task = storageRef.put(img);
      task.on(
        "state_changed",
        (snapshot) => {
          let percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(percentage);
          //setPicLoadingPercentage(percentage);
        },
        (err) => {
          console.log(err.message);
        },
        () => {
          storageRef.getDownloadURL().then(async (url) => {
            let newUrlPic = new FormData();
            newUrlPic.append("profile_picture", url);

            await axios.put(
              `http://localhost:4000/accounts/user/${user._id}`,
              newUrlPic
            );

            setShowModalChangePic(false);
            window.location.reload(true);
          });
        }
      );
    } catch (err) {
      console.log(
        `Se ha producido un error al subir la imagen de perfil. ${err}`
      );
    }
  };

  useEffect(() => {
    async function loadUser() {
      try {
        enableEdit ? setEnableEdit() : setEnablePass();
        //setLoading(true);
        await axios
          .get(`http://localhost:4000/accounts/user/init`)
          .then((res) => {
            setCurrentUser(res.data.user);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        if (
          err.response &&
          (err.response.status === 404 || err.response.status === 400)
        ) {
          console.log("El perfil no existe");
        } else {
          console.log("Hubo un problema cargando este perfil.");
        }
        //setLoading(false);
      }
    }
    loadUser();
  }, [user]);

  return (
    <div className="body setting-body">
      {showMessage && <Message />}
      <UserNavigation user={currentUser} />
      {showModalChangePic && (
        <ChangeProfilePicture
          user={user}
          close={() => setShowModalChangePic(false)}
          changePicture={changeProfilePic}
        />
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
                user={currentUser}
                showChangePicModal={() => setShowModalChangePic(true)}
              />
            )}
            {showChangePass && enablePass && (
              <ChangePassword user={currentUser} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(SettingsMain);
