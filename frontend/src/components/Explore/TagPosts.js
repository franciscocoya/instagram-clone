import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";

//Queries

//Static files

//Components
import UserNavigation from "../Navigations/UserNavigation";
import Grid from "../Grid/Grid";
import SearchResults from "../Modals/SearchResults";

function TagPosts({ match, user }) {
  const { hashtag } = match.params;
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="tag-posts">
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
    </div>
  );
}

export default withRouter(TagPosts);
