import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import $ from "jquery";
import * as firebase from "firebase";

//Components
import UserNavigation from "../Navigations/UserNavigation";
import Grid from "../Grid/Grid";
import SettingsMain from "../Settings/SettingsMain";
import Loader from "../Loader/Loader";
import CircleProgressBar from "../Loader/CircleProgressBar";

//Modals
import SettingsModal from "../Modals/Settings";
import ChangeProfilePicture from "../Modals/ChangeProfilePicture";
import SearchResults from "../Modals/SearchResults";

//Static files
import "../../public/css/personalProfile.css";
import "../../public/css/Profile/PersonalProfile/optionsBar.css";

function PersonalProfile({ user, logout, match }) {
  let history = useHistory();
  //--
  const { username } = match.params;

  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile] = useState(false);
  const [showModalChangePic, setShowModalChangePic] = useState(false);
  const [showUploadButton, setShowUploadButon] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCircleProgress, setShowCircleProgress] = useState(false);

  const [loading, setLoading] = useState(true);
  const [picLoadingPercentage, setPicLoadingPercentage] = useState(0);

  const [posts, setPosts] = useState([]);
  const [saves, setSaves] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const options = {
    POSTS: "posts",
    SAVED: "saved",
  };
  const [activeOptionGrid, setActiveOptionGrid] = useState(options.POSTS);

  /**
   * Show dialog to change profile picture.
   */
  const showModalChangPic = () => {
    const isProfPic = user.profile_picture;
    const defaultPicURL = process.env.FB_DEFAULT_PROF_PIC;
    return isProfPic !== defaultPicURL && isProfPic !== undefined
      ? disableInput()
      : false;
  };

  /**
   *Disable the input that displays the window to select a file.
   */
  const disableInput = () => {
    $(".activate-input").prop("disabled", true);
    return true;
  };

  /**
   * Change profile picture.
   * TODO: Cambiar CLoudinary por firebase.
   * @param {*} e
   */
  const changeProfilePic = (e) => {
    if (!showModalChangPic()) {
      let imgFile = e.target.files[0];

      if (imgFile !== undefined && imgFile !== null) {
        uploadProfileImage(imgFile);
      }
    } else {
      setShowModalChangePic(true);
    }
  };

  /**
   * Upload the user's profile image to firebase.
   */
  const uploadProfileImage = async (img) => {
    try {
      setShowCircleProgress(true);
      const storageRef = firebase.storage().ref(`profiles/${img.name}`);
      const task = storageRef.put(img);
      task.on(
        "state_changed",
        (snapshot) => {
          let percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(percentage);
          setPicLoadingPercentage(percentage);
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
          });
        }
      );
      setTimeout(() => {
        setShowCircleProgress(false);
      }, 100);
    } catch (err) {
      console.log(
        `Se ha producido un error al subir la imagen de perfil. ${err}`
      );
    }
  };

  /**
   * Close the changePicture modal and enable the input.
   * @param {} e
   */
  const closeChangeModPic = async () => {
    setShowModalChangePic(false);
    $(".activate-input").prop("disabled", false);
  };

  /**
   * Load the current user's posts.
   */
  const loadUserPosts = async () => {
    const res = await axios.get(`http://localhost:4000/posts/${user._id}`);
    let postsResult = res.data.posts;
    postsResult.length > 0
      ? setShowUploadButon(true)
      : setShowUploadButon(false);
    setPosts(postsResult);
  };

  /**
   * Load user saved posts (favorites).
   */
  const loadSavedPosts = async () => {
    try {
      await axios
        .get(`http://localhost:4000/p/savedPost/get/list/${user._id}`)
        .then(async (res) => {
          let arr = res.data.savedPosts;
          let reduced = await reduceSavedPosts(arr);
          setSaves(reduced);
        })
        .catch((err1) =>
          console.log(
            `Se ha producido un error al cargar los posts favoritos. ${err1}`
          )
        );
    } catch (err) {
      console.log(
        `Se ha producido un error al cargar los posts guardados por el usuario. ${err}`
      );
    }
  };

  /**
   * Reduce an array of saves to an array of posts.
   * @param {*} arr Savedposts array.
   */
  const reduceSavedPosts = (arr) => {
    return arr.slice().reduce((acc, save) => {
      return [...acc, save.postId];
    }, []);
  };

  useEffect(() => {
    setLoading(true);
    loadUserPosts();
    loadSavedPosts();
    setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      setActiveOptionGrid(options.POSTS);
    };
  }, [user.profile_picture]);

  return (
    <div className="w-personalProfile h-100">
      {loading ? (
        <Loader />
      ) : (
        <div className="body personal-profile-body">
          {showModalChangePic && (
            <ChangeProfilePicture
              user={user}
              close={closeChangeModPic}
              changePicture={changeProfilePic}
            />
          )}
          <Helmet>
            <meta charSet="utf-8" />
            <title>Instagram Clone • {user.username}</title>
          </Helmet>

          <UserNavigation
            user={user}
            fillProfile={true}
            showSuggestions={() => setShowSearchResults(true)}
            closeSuggestions={() => setShowSearchResults(false)}
            resultsArr={setSearchResults}
          />
          {/* Dialog para editProfile y changePassword */}
          {showSettings && (
            <SettingsModal
              close={() => setShowSettings(false)}
              closeSession={logout}
            />
          )}

          {/*SettingsMain -> (Edit profile + changePassword) */}
          {showEditProfile && (
            <SettingsMain
              user={user}
              setModalPicture={() => setShowModalChangePic(showModalChangePic)}
            />
          )}
          {showSearchResults && (
            <SearchResults suggestions={searchResults} user={user} />
          )}

          <div className="header-profile">
            <div className="wrapper-profile_pict_progress">
              <CircleProgressBar percentage={picLoadingPercentage} />
              <button className="profile-picture">
                <label htmlFor="input-file">
                  <img
                    src={user.profile_picture}
                    alt="Añade una foto de perfil"
                  />
                </label>
                <input
                  type="file"
                  id="input-file"
                  className="input-img-profile w-100 activate-input"
                  accept="image/jpeg, image/png"
                  onChange={changeProfilePic}
                />
              </button>
            </div>

            {/* User info */}
            <div className="profile-info">
              {/* username */}
              <div className="c-username">
                <div className="username">
                  <h2>{user.username}</h2>
                </div>
                {/* onClick={showEditProfileModal} */}
                <button
                  className="editarPerfil bt-border-gray"
                  onClick={() => history.push(`/${user.username}/edit`)}
                >
                  Editar perfil
                </button>
                <p
                  className="link-settings cursor-pointer"
                  onClick={() => setShowSettings(true)}
                >
                  <svg
                    aria-label="Opciones"
                    fill="#262626"
                    height="24"
                    viewBox="0 0 48 48"
                    width="24"
                  >
                    <path d="M46.7 20.6l-2.1-1.1c-.4-.2-.7-.5-.8-1-.5-1.6-1.1-3.2-1.9-4.7-.2-.4-.3-.8-.1-1.2l.8-2.3c.2-.5 0-1.1-.4-1.5l-2.9-2.9c-.4-.4-1-.5-1.5-.4l-2.3.8c-.4.1-.8.1-1.2-.1-1.4-.8-3-1.5-4.6-1.9-.4-.1-.8-.4-1-.8l-1.1-2.2c-.3-.5-.8-.8-1.3-.8h-4.1c-.6 0-1.1.3-1.3.8l-1.1 2.2c-.2.4-.5.7-1 .8-1.6.5-3.2 1.1-4.6 1.9-.4.2-.8.3-1.2.1l-2.3-.8c-.5-.2-1.1 0-1.5.4L5.9 8.8c-.4.4-.5 1-.4 1.5l.8 2.3c.1.4.1.8-.1 1.2-.8 1.5-1.5 3-1.9 4.7-.1.4-.4.8-.8 1l-2.1 1.1c-.5.3-.8.8-.8 1.3V26c0 .6.3 1.1.8 1.3l2.1 1.1c.4.2.7.5.8 1 .5 1.6 1.1 3.2 1.9 4.7.2.4.3.8.1 1.2l-.8 2.3c-.2.5 0 1.1.4 1.5L8.8 42c.4.4 1 .5 1.5.4l2.3-.8c.4-.1.8-.1 1.2.1 1.4.8 3 1.5 4.6 1.9.4.1.8.4 1 .8l1.1 2.2c.3.5.8.8 1.3.8h4.1c.6 0 1.1-.3 1.3-.8l1.1-2.2c.2-.4.5-.7 1-.8 1.6-.5 3.2-1.1 4.6-1.9.4-.2.8-.3 1.2-.1l2.3.8c.5.2 1.1 0 1.5-.4l2.9-2.9c.4-.4.5-1 .4-1.5l-.8-2.3c-.1-.4-.1-.8.1-1.2.8-1.5 1.5-3 1.9-4.7.1-.4.4-.8.8-1l2.1-1.1c.5-.3.8-.8.8-1.3v-4.1c.4-.5.1-1.1-.4-1.3zM24 41.5c-9.7 0-17.5-7.8-17.5-17.5S14.3 6.5 24 6.5 41.5 14.3 41.5 24 33.7 41.5 24 41.5z"></path>
                  </svg>
                </p>
                {showUploadButton && (
                  <button onClick={() => history.push("/p/upload")}>
                    Subir foto
                  </button>
                )}
              </div>

              {/* media, followed_by, follows */}
              <div className="c-media">
                <div className="media">
                  <p
                    className="decoration-none l-media"
                    //to="/:username/publicaciones"
                  >
                    <span>{posts.length}</span> publicaciones
                  </p>
                </div>
                <div className="follows">
                  <p
                    className="decoration-none l-media"
                    //to="/:username/followed_by"
                  >
                    <span>{user.count.followed_by}</span> seguidores
                  </p>
                </div>
                <div className="followed_by">
                  <p
                    className="decoration-none l-media"
                    //to="/:username/follows"
                  >
                    <span>{user.count.follows}</span> seguidos
                  </p>
                </div>
              </div>

              {/* fullname */}
              <div className="fullname mp-0">
                <p className="bold-black">{user.full_name}</p>
              </div>

              {/* bio */}
              <div className="bio mp-0">
                <pre>{user.bio}</pre>
              </div>

              {/* website */}
              <div className="website mp-0">
                <p className="decoration-none web-link">{user.website}</p>
              </div>
            </div>
          </div>
          {/* Fin header-profile */}
          <div className="header-tags">
            <OptionsBar
              options={options}
              setActiveOptionGrid={setActiveOptionGrid}
            />
          </div>
          <Grid
            user={user}
            posts={activeOptionGrid === options.POSTS ? posts : saves}
            isLoggedUser={true}
            options={options}
            type={activeOptionGrid}
          />
        </div>
      )}
    </div>
  );
}

function OptionsBar({ options, setActiveOptionGrid }) {
  const [activeOption, setActiveOption] = useState(options.POSTS);

  const initBar = () => {
    var postsHeader = $(".options-bar__posts-header");
    var postsSavedHeader = $(".options-bar__posts-saved-header");
    const activeClassName = "header-active";

    switch (activeOption) {
      case options.POSTS:
        if (!postsHeader.hasClass(activeClassName)) {
          postsHeader.addClass(activeClassName);
          postsSavedHeader.removeClass(activeClassName);
        }
        break;

      case options.SAVED:
        if (!postsSavedHeader.hasClass(activeClassName)) {
          postsSavedHeader.addClass(activeClassName);
          postsHeader.removeClass(activeClassName);
        }
        break;
    }
  };

  const handleClickPosts = (e) => {
    e.preventDefault();
    setActiveOption(options.POSTS);
    setActiveOptionGrid(options.POSTS);
  };

  const handleClickPostsHeader = (e) => {
    e.preventDefault();
    setActiveOption(options.SAVED);
    setActiveOptionGrid(options.SAVED);
  };

  useEffect(() => {
    initBar();
  }, [activeOption]);

  return (
    <nav className="options-bar">
      <ul className="options-bar__posts">
        <li
          className="options-bar__posts-header cursor-pointer"
          onClick={handleClickPosts}
        >
          <svg
            aria-label="Publicaciones"
            className="posts-header-icon"
            fill="#262626"
            height="12"
            viewBox="0 0 48 48"
            width="12"
          >
            <path
              clipRule="evenodd"
              d="M45 1.5H3c-.8 0-1.5.7-1.5 1.5v42c0 .8.7 1.5 1.5 1.5h42c.8 0 1.5-.7 1.5-1.5V3c0-.8-.7-1.5-1.5-1.5zm-40.5 3h11v11h-11v-11zm0 14h11v11h-11v-11zm11 25h-11v-11h11v11zm14 0h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11zm14 28h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11z"
              fillRule="evenodd"
            ></path>
          </svg>
          <h4>Publicaciones</h4>
        </li>
        <li
          className="options-bar__posts-saved-header cursor-pointer"
          onClick={handleClickPostsHeader}
        >
          <svg
            aria-label="Guardadas"
            className="posts-saved-header-icon"
            fill="#8e8e8e"
            height="12"
            viewBox="0 0 48 48"
            width="12"
          >
            <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"></path>
          </svg>
          <h4>Guardadas</h4>
        </li>
      </ul>
    </nav>
  );
}

export default withRouter(PersonalProfile);