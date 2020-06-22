import React, { useState, useEffect } from "react";
import { withRouter, useHistory, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";

//Queries
import { getUserByUsername, checkUserType } from "../../queries/user_queries";
import { getPostsByUsername } from "../../queries/posts_queries";
import {
  getFollowsCount,
  getFollowersCount,
} from "../../queries/follow_queries";

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
    const result = await getPostsByUsername(otherUsername);
    setPosts(result);
  };

  const loadUser = async () => {
    setLoading(true);
    const result = await getUserByUsername(otherUsername);
    setOtherUser(result);
    setLoading(false);
  };

  const loadFollows = async () => {
    const result = await getFollowsCount(otherUsername);
    setFollowsCount(result);
  };

  const loadFollowers = async () => {
    const result = await getFollowersCount(otherUsername);
    setFollowersCount(result);
  };

  const handleCheckUserType = async () => {
    const result = await checkUserType(user._id, otherUsername);
    setIsFollowing(result);
  };

  const toogleSuggestions = (e) => {
    e.preventDefault();
    setShowSuggestions(!showSuggestions);
  };

  useEffect(() => {
    loadUser();
    loadUserPosts();
    loadFollows();
    loadFollowers();
    handleCheckUserType();
  }, [otherUsername]);

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
