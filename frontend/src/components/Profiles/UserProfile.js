import React, { useState, useEffect } from "react";
import { withRouter, useHistory, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";

//Components
import UserNavigation from "../Navigations/UserNavigation";
import Grid from "../Grid/Grid";
import Loader from "../Loader/Loader";
import Suggested from "../Suggested/Suggested";

//Modals
import BlockUser from "../Modals/BlockUser";
import SearchResults from "../Modals/SearchResults";

//Static files
import "../../public/css/Profile/userProfile.css";

function UserProfile({ match, user }) {
  let history = useHistory();
  const { otherUsername } = match.params;
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showBlockUserModal, setShowBlockUserModal] = useState(false);
  const [followsCount, setFollowsCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const loadUserPosts = async () => {
    await axios
      .get(`http://localhost:4000/accounts/user/username/${otherUsername}`)
      .then(async (userR) => {
        await axios
          .get(`http://localhost:4000/posts/${userR.data.user._id}`)
          .then((res) => {
            let postsResult = res.data.posts;
            setPosts(postsResult);
          })
          .catch((err1) => console.log(err1));
      })
      .catch((err) => console.log(err));
  };

  const loadUser = async () => {
    try {
      setLoading(true);
      await axios
        .get(`http://localhost:4000/accounts/user/username/${otherUsername}`)
        .then((res) => {
          const otherUserRet = res.data.user;
          setOtherUser(otherUserRet);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(`Hubo un problema cargando el perfil. ${err}`);
      setLoading(false);
    }
  };

  const loadFollows = async () => {
    try {
      await axios
        .get(`http://localhost:4000/accounts/user/username/${otherUsername}`)
        .then(async (aux) => {
          const userAux = aux.data.user;
          await axios
            .get(`http://localhost:4000/follow/listFollows/${userAux._id}`)
            .then((res) => {
              const follows = res.data.followsCount;
              setFollowsCount(follows);
            })
            .catch((err) =>
              console.log(
                `Se ha producido un error al listar los follows. ${err}`
              )
            );
        })
        .catch((err) =>
          console.log(`Se ha producido un error al cargar el usuario. ${err}`)
        );
    } catch (err) {
      console.log(
        `Se ha producido un error al cargas los usuarios seguidos por el usuario del perfil. ${err}`
      );
    }
  };

  const loadFollowers = async () => {
    try {
      await axios
        .get(`http://localhost:4000/accounts/user/username/${otherUsername}`)
        .then(async (aux) => {
          const userAux = aux.data.user;
          await axios
            .get(`http://localhost:4000/follow/listFollowedBy/${userAux._id}`)
            .then((res) => {
              const followers = res.data.followersCount;
              setFollowersCount(followers);
            })
            .catch((err2) => console.log(err2));
        })
        .catch((err1) => console.log(err1));
    } catch (err) {
      console.log(
        `Se ha producido un error al cargas los usuarios seguidos por el usuario del perfil. ${err}`
      );
    }
  };

  const checkUserType = async () => {
    try {
      await axios
        .get(`http://localhost:4000/accounts/user/username/${otherUsername}`)
        .then(async (res) => {
          if (res.status === 200 || res.status === 201) {
            const userAux = res.data.user;
            const data = new FormData();
            data.append("follow_by", user._id);
            data.append("follow_to", userAux._id);
            const config = {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            };
            await axios
              .post("http://localhost:4000/follow/isFollowing", data, config)
              .then((res1) => {
                if (res1.status === 200 || res1.status === 201) {
                  const isFl = res1.data.isFollowing;
                  isFl ? setIsFollowing(true) : setIsFollowing(false);
                }
              })
              .catch((err1) => console.log(err1));
          }
        })
        .catch((err2) => console.log(err2));
    } catch (err) {
      console.log(
        `Se ha producido un error al comprobar el tipo de usuario. ${err}`
      );
    }
  };

  const toogleSuggestions = (e) => {
    e.preventDefault();
    setShowSuggestions(!showSuggestions);
  };

  //Effects
  useEffect(() => {
    loadUser();
    loadUserPosts();
    loadFollows();
    loadFollowers();
    checkUserType();
  }, []);

  return (
    <div className="w-userProfile h-100">
      {loading ? (
        <Loader />
      ) : (
        <div className="body user-profile-body">
          <Helmet>
            <meta charSet="utf-8" />
            <title>Instagram Clone • {otherUser.username}</title>
          </Helmet>

          <UserNavigation
            user={user}
            fillHome={false}
            fillExplore={false}
            fillActivity={false}
            fillProfile={false}
            showSuggestions={() => setShowSearchResults(true)}
            closeSuggestions={() => setShowSearchResults(false)}
            resultsArr={setSearchResults}
          />

          {showBlockUserModal && (
            <BlockUser close={setShowBlockUserModal(false)} />
          )}

          {showSearchResults && (
            <SearchResults
              suggestions={searchResults}
              user={user}
              close={() => setShowSearchResults(false)}
            />
          )}

          <div className="header-profile">
            {/* Profile image */}
            <div className="profile-picture">
              <img
                src={otherUser.profile_picture}
                alt={`Foto de perfil de @${otherUser.username}`}
                width="150"
                height="150"
                className="img-user-profile"
              />
            </div>

            {/* User info */}
            <div className="profile-info">
              {/* username */}
              <div className="c-username">
                <div className="username">
                  <h2>{otherUser.username}</h2>
                </div>
                {/* onClick={showEditProfileModal} */}
                {isFollowing ? (
                  <>
                    <button className="bt-unfollow bt-border-gray">
                      <span className="glyphsSpriteFriend_Follow"></span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bt-follow">Seguir</button>
                    <button
                      className="bt-showSuggestions"
                      onClick={toogleSuggestions}
                    >
                      <span className="coreSpriteDropdownArrowWhite"></span>
                    </button>
                  </>
                )}
                <svg
                  aria-label="Opciones"
                  fill="#262626"
                  height="24"
                  viewBox="0 0 48 48"
                  width="24"
                  className="cursor-pointer bt-block-user"
                  onClick={() => setShowBlockUserModal(true)}
                >
                  <circle
                    clipRule="evenodd"
                    cx="8"
                    cy="24"
                    fillRule="evenodd"
                    r="4.5"
                  ></circle>
                  <circle
                    clipRule="evenodd"
                    cx="24"
                    cy="24"
                    fillRule="evenodd"
                    r="4.5"
                  ></circle>
                  <circle
                    clipRule="evenodd"
                    cx="40"
                    cy="24"
                    fillRule="evenodd"
                    r="4.5"
                  ></circle>
                </svg>
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
                    <span>{followsCount}</span> seguidores
                  </p>
                </div>
                <div className="followed_by">
                  <p
                    className="decoration-none l-media"
                    //to="/:username/follows"
                  >
                    <span>{followersCount}</span> seguidos
                  </p>
                </div>
              </div>

              {/* fullname */}
              <div className="fullname mp-0">
                <p className="bold-black">{otherUser.full_name}</p>
              </div>

              {/* bio */}
              <div className="bio mp-0">
                <pre>{otherUser.bio}</pre>
              </div>

              {/* website */}
              <div className="website mp-0">
                <p className="decoration-none web-link">{otherUser.website}</p>
              </div>
            </div>
          </div>
          {/* Fin header-profile */}

          {showSuggestions && (
            <div className="suggested-container mp-0">
              <p>Sugerencias</p>
              <Suggested user={user} isClosable={true} />
            </div>
          )}
          <div className="header-tags"></div>

          <Grid user={otherUser} posts={posts} />
        </div>
      )}
    </div>
  );
}

export default withRouter(UserProfile);
