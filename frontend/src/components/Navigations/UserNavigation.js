/**
 * @description UserNavigation component.
 *    · Instagram logo - Redirects to Home view.
 *    · Search bar - Search Users, Hashtags, etc.
 *    · Navigation icons:
 *        _ Home.
 *        _ Direct.
 *        _ Explore.
 *        _ Activity.
 *        _ Personal Profile.
 *
 * @author Francisco Coya
 * @version v1.01
 * @see https://github.com/FranciscoCoya
 * @copyright © 2020 Francisco Coya
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";

//Queries
import { search } from "../../queries/search_queries";

//static files
import "../../public/css/userNavigation.css";
import { styleSearch } from "../../public/js/main";

function UserNavigation({
  user,
  fillHome,
  fillDirect,
  fillActivity,
  fillExplore,
  fillProfile,
  showSuggestions,
  closeSuggestions,
  resultsArr,
}) {
  const defaultPicURL = process.env.REACT_APP_FB_DEFAULT_PROF_PIC;

  const [, setEnableHome] = useState(false);
  const [, setEnableExplore] = useState(false);
  const [, setEnableActivity] = useState(false);
  const [, setEnableProfile] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const fillIcon = () => {
    if (fillHome) {
      enableIcons(true, false, false, false); //HOME
    } else if (fillActivity) {
      enableIcons(false, true, false, false); //ACTIVITY
    } else if (fillExplore) {
      enableIcons(false, false, true, false); //EXPLORE
    } else {
      enableIcons(false, false, false, true); //HOME
    }
  };

  function enableIcons(home, activity, explore, profile) {
    setEnableHome(home);
    setEnableActivity(activity);
    setEnableExplore(explore);
    setEnableProfile(profile);
  }

  const handleShowSuggestionsModal = (e) => {
    if (e.target.value.length > 0) {
      showSuggestions(e);
    } else {
      closeSuggestions(e);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    handleShowSuggestionsModal(e);
    setSearchValue(e.target.value);
    await handleSearchChange(e);
  };

  //TODO:
  const handleSearchChange = async (e) => {
    await search(e.target.value, user._id, resultsArr);
    // setSearchResults(result);
    // resultsArr(result);
  };

  useEffect(() => {
    styleSearch();
    fillIcon();
  }, []);

  return (
    <nav className="navBar mp-0 bg-white w-100">
      {/* Instagram Nav Logo */}
      <Link to="/" className="nav-logo-link">
        <div className="logo-nav coreSpriteMobileNavTypeLogo"></div>
      </Link>
      <div className="search p-relative">
        <div className="showCloseSearch"></div>
        <div className="cont-search bg-gris b-1-g">
          <span className="coreSpriteSearchIcon"></span>
          <span className="coreSpriteSearchClear"></span>
          <input
            type="text"
            placeholder="Buscar"
            autoCapitalize="none"
            className="input-transparent"
            id="mainSearch"
            name="search"
            value={searchValue}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="bts-nav">
        {/* Home */}
        <Link to="/" className="link-home">
          <div className="mp-0">
            <svg
              aria-label="Inicio"
              className={fillHome ? "home-active" : "home"}
              fill="#262626"
              height="22"
              viewBox="0 0 48 48"
              width="22"
            >
              <path
                d={
                  fillHome
                    ? "M45.5 48H30.1c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2.1-4.6-4.6-4.6s-4.6 2.1-4.6 4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.6-.6 2.1 0l21.5 21.5c.3.3.4.7.4 1.1v23.5c.1.8-.6 1.5-1.4 1.5z"
                    : "M45.3 48H30c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2-4.6-4.6-4.6s-4.6 2-4.6 4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.5-.6 2.1 0l21.5 21.5c.4.4.6 1.1.3 1.6 0 .1-.1.1-.1.2v22.8c.1.8-.6 1.5-1.4 1.5zm-13.8-3h12.3V23.4L24 3.6l-20 20V45h12.3V34.2c0-4.3 3.3-7.6 7.6-7.6s7.6 3.3 7.6 7.6V45z"
                }
              ></path>
            </svg>
          </div>
        </Link>

        {/* Direct */}
        <Link to="/direct/inbox" className="link-explore">
          <div className="mp-0">
            <svg
              aria-label="Direct"
              fill="#262626"
              height="22"
              viewBox="0 0 48 48"
              width="22"
            >
              {fillDirect ? (
                <path d="M46.5 3.5h-45C.6 3.5.2 4.6.8 5.2l13.2 13c.6.6 1.5.7 2.2.4l16.5-7.5c.5-.2 1 0 1.3.5.2.4 0 .9-.3 1.2l-15.1 9.8c-.7.5-1.1 1.3-.9 2.2l4.6 19.1c.2.9 1.4 1.1 1.8.3L47.4 5c.4-.7-.1-1.5-.9-1.5z"></path>
              ) : (
                <>
                  <path d="M46.5 3.5h-45C.6 3.5.2 4.6.8 5.2l16 15.8 5.5 22.8c.2.9 1.4 1 1.8.3L47.4 5c.4-.7-.1-1.5-.9-1.5zm-40.1 3h33.5L19.1 18c-.4.2-.9.1-1.2-.2L6.4 6.5zm17.7 31.8l-4-16.6c-.1-.4.1-.9.5-1.1L41.5 9 24.1 38.3z"></path>
                  <path d="M14.7 48.4l2.9-.7"></path>
                </>
              )}
            </svg>
          </div>
        </Link>

        {/* Explore */}
        <Link to="/explore" className="link-explore">
          <div className="mp-0">
            {/* Explore active */}
            <svg
              aria-label="Buscar personas"
              className={"explore"}
              fill="#262626"
              height="22"
              viewBox="0 0 48 48"
              width="22"
            >
              <path
                d={
                  fillExplore
                    ? "M24 47.5C11 47.5.5 37 .5 24S11 .5 24 .5 47.5 11 47.5 24 37 47.5 24 47.5zm4.4-20.3c-.3.5-.7.9-1.2 1.2l-14.8 8.1c-.3.1-.6.1-.8-.1-.2-.2-.3-.5-.1-.8l8.1-14.8c.3-.5.7-.9 1.2-1.2l14.8-8.1c.3-.1.6-.1.8.1.2.2.3.5.1.8l-8.1 14.8zm-6.2-5L17.9 30l7.8-4.3-3.5-3.5z"
                    : "M24 .5C37 .5 47.5 11 47.5 24S37 47.5 24 47.5.5 37 .5 24 11 .5 24 .5zm0 44c11.3 0 20.5-9.2 20.5-20.5S35.3 3.5 24 3.5 3.5 12.7 3.5 24 12.7 44.5 24 44.5zm-4.4-23.7c.3-.5.7-.9 1.2-1.2l14.8-8.1c.3-.1.6-.1.8.1.2.2.3.5.1.8l-8.1 14.8c-.3.5-.7.9-1.2 1.2l-14.8 8.1c-.3.1-.6.1-.8-.1-.2-.2-.3-.5-.1-.8l8.1-14.8zm6.2 5l4.3-7.8-7.8 4.3 3.5 3.5z"
                }
                fillRule={fillExplore ? "evenodd" : null}
              ></path>
            </svg>
          </div>
        </Link>

        {/* Activity */}
        <Link to="/accounts/activity" className="link-activity">
          <div className="mp-0">
            <svg
              aria-label="Sección de actividades"
              className={`${fillActivity ? "activity-active" : "activity"}`}
              fill="#262626"
              height="22"
              viewBox="0 0 48 48"
              width="22"
            >
              <path
                d={
                  fillActivity
                    ? "M35.3 35.6c-9.2 8.2-9.8 8.9-11.3 8.9s-2.1-.7-11.3-8.9C6.5 30.1.5 25.6.5 17.8.5 9.9 6.4 3.5 13.7 3.5 20.8 3.5 24 8.8 24 8.8s3.2-5.3 10.3-5.3c7.3 0 13.2 6.4 13.2 14.3 0 7.8-6.1 12.3-12.2 17.8z"
                    : "M34.3 3.5C27.2 3.5 24 8.8 24 8.8s-3.2-5.3-10.3-5.3C6.4 3.5.5 9.9.5 17.8s6.1 12.4 12.2 17.8c9.2 8.2 9.8 8.9 11.3 8.9s2.1-.7 11.3-8.9c6.2-5.5 12.2-10 12.2-17.8 0-7.9-5.9-14.3-13.2-14.3zm-1 29.8c-5.4 4.8-8.3 7.5-9.3 8.1-1-.7-4.6-3.9-9.3-8.1-5.5-4.9-11.2-9-11.2-15.6 0-6.2 4.6-11.3 10.2-11.3 4.1 0 6.3 2 7.9 4.2 3.6 5.1 1.2 5.1 4.8 0 1.6-2.2 3.8-4.2 7.9-4.2 5.6 0 10.2 5.1 10.2 11.3 0 6.7-5.7 10.8-11.2 15.6z"
                }
              ></path>
            </svg>
          </div>
        </Link>

        {/* Profile */}
        <Link to={`/${user.username}/`} className="link-profile">
          <img
            className={`${
              fillProfile ? "img-profile-nav-border" : "img-profile-nav"
            }`}
            src={
              user.profile_picture === "undefined"
                ? defaultPicURL
                : user.profile_picture
            }
            alt={user.username}
            title={user.username}
          />
        </Link>
      </div>
    </nav>
  );
}

export default withRouter(UserNavigation);
