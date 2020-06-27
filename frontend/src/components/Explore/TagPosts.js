import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";

//Queries

//Static files
import "../../public/css/Explore/TagPosts/tagPosts.css";

//Components
import UserNavigation from "../Navigations/UserNavigation";
import Grid from "../Grid/Grid";
import SearchResults from "../Modals/SearchResults";

function TagPosts({ match, user }) {
  const { hashtag } = match.params;
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="tag-posts p-relative">
      <Helmet>
        <meta charSet="utf-8" />
        <title>#{hashtag} hashtag on Instagram Clone • Photos and Videos</title>
      </Helmet>
      <UserNavigation
        user={user}
        resultsArr={setSearchResults}
        showSuggestions={() => setShowSearchResults(true)}
        closeSuggestions={() => setShowSearchResults(false)}
      />
      {showSearchResults && (
        <SearchResults
          suggestions={searchResults}
          user={user}
          close={() => setShowSearchResults(false)}
        />
      )}

      <div className="tag-posts__wrapper">
        <div className="tag-posts__wrapper__1">
          <div className="tag-posts__wrapper-col1">
            <img
              src="https://images.unsplash.com/photo-1591026579168-631c26671b2a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max"
              alt=""
              className="feature-img-tag"
            />
          </div>
          <div className="tag-posts__wrapper-col2">
            <h2 className="hashtag-title-name">#{hashtag}</h2>
            <p className="hashtag-count">
              <span>12000</span> publicaciones
            </p>
            {/* <button id="bt-follow-hashtag">Seguir</button> */}
          </div>
        </div>
        {/* Grid with the hashtag posts */}
        <div className="container-feature-posts">
          <h4>Publicaciones destacadas</h4>
        </div>

        {/* <Grid /> */}
      </div>
    </div>
  );
}

export default withRouter(TagPosts);
