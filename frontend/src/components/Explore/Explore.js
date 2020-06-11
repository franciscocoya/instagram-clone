import React, { useState, useEffect } from "react";
import axios from "axios";

//Components
import UserNavigation from "../Navigations/UserNavigation";
import Loader from "../Loader/Loader";
import Grid from "../Grid/Grid";
import Suggested from "../Suggested/Suggested";
import SearchResults from "../Modals/SearchResults";

//Static files
import "../../public/css/Explore/explore.css";

function Explore({ user }) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  //const [loadingUnfollow, setLoadingUnfollow] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const loadAllPosts = async () => {
    try {
      const data = new FormData();
      data.append("userId", user._id);
      console.log(user);
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios
        .post("http://localhost:4000/follow/notFollowingPosts", data, config)
        .then((res) => {
          const result = res.data.notFollowingPosts;
          setPosts(result);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(
        `Se ha producido un error al listar los posts de los usuarios seguidos por el usuario. ${err}`
      );
    }
  };

  //--
  useEffect(() => {
    try {
      setLoading(true);
      loadAllPosts();
      setLoading(false);
    } catch (err) {
      console.log(
        `Se ha producido un error al cargar la vista Explore. ${err}`
      );
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="mp-0 h-100">
      {loading ? (
        <Loader />
      ) : (
        <div className="body-explore">
          {/* <UserNavigation user={user} /> */}
          <UserNavigation
            user={user}
            fillExplore={true}
            showSuggestions={() => setShowSearchResults(true)}
            closeSuggestions={() => setShowSearchResults(false)}
            resultsArr={setSearchResults}
          />
          {showSearchResults && (
            <SearchResults suggestions={searchResults} user={user} />
          )}
          <div className="suggested-wrapper">
            <p className="mp-0">Descubrir personas</p>
            <Suggested user={user} isClosable={false} />
          </div>
          <div className="h-100 wrapper-posts">
            <p className="mp-0">Explorar</p>
            <Grid posts={posts} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Explore;
