import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

//Queries
import {
  getFeaturePost,
  getPostsByLocation,
} from "../../queries/posts_queries";

//Components
import UserNavigation from "../Navigations/UserNavigation";
import LocationMap from "./LocationMap";
import Grid from "../Grid/Grid";
import SearchResults from "../Modals/SearchResults";

//Static files
import "../../public/css/Location/location.css";

function Location({ user, match }) {
  const { place } = match.params;
  const [posts, setPosts] = useState([]);
  const [featurePost, setFeaturePost] = useState({});

  //Search
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleGetPostsByLocation = async () => {
    const result = await getPostsByLocation(place);
    setPosts(result);
  };

  const handleGetFeaturePost = async () => {
    const result = await getFeaturePost(place);
    setFeaturePost(result);
  };

  useEffect(() => {
    handleGetPostsByLocation();
    handleGetFeaturePost();
  }, []);

  return (
    <div className="location p-relative">
      <UserNavigation
        user={user}
        showSuggestions={() => setShowSearchResults(true)}
        closeSuggestions={() => setShowSearchResults(false)}
        resultsArr={setSearchResults}
      />
      {showSearchResults && (
        <SearchResults
          suggestions={searchResults}
          user={user}
          close={() => setShowSearchResults(false)}
        />
      )}
      <div className="location-wrapper">
        <LocationMap placeName={place} />
        <div className="feature-post-container">
          <div className="img-feature-post-cont">
            <img
              src={featurePost.thumbnail}
              alt=""
              className={`${featurePost.imgFilter} img-feature-post`}
            />
          </div>
          <div className="place-titles">
            <h2>{place}</h2>
          </div>
        </div>
        <h4>Publicaciones destacadas</h4>

        <Grid user={user} isLoggedUser={true} posts={posts} />
      </div>
    </div>
  );
}

export default withRouter(Location);
