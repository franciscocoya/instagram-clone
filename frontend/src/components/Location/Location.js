import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

//Components
import UserNavigation from "../Navigations/UserNavigation";
import LocationMap from "./LocationMap";
import Grid from "../Grid/Grid";

//Static files
import "../../public/css/Location/location.css";

function Location({ user, match }) {
  const { place } = match.params;
  const [posts, setPosts] = useState([]);
  const [featurePost, setFeaturePost] = useState({});

  /**
   * Get all posts by location.
   */
  const getPostsByLocation = async () => {
    try {
      await axios
        .get(`http://localhost:4000/posts/place/${place}`)
        .then((res) => {
          setPosts(res.data.posts);
        })
        .catch((err1) => console.log(`Error al obtener los posts. ${err1}`));
    } catch (err) {
      console.log(
        `Se ha producido un error al obtener los posts de la localización. ${err}`
      );
    }
  };

  /**
   * TODO: Get post with more likes, from the place.
   */
  const getFeaturePost = async () => {
    try {
      await axios
        .get(`http://localhost:4000/posts/feature/${place}`)
        .then((res) => {
          setFeaturePost(res.data.post);
        })
        .catch((err1) =>
          console.log(`Error al obtener el post destacado. ${err1}`)
        );
    } catch (err) {
      console.log(
        `Se ha producido un error al obtener el post destacado. ${err}`
      );
    }
  };

  useEffect(() => {
    getPostsByLocation();
    getFeaturePost();
  }, []);

  return (
    <div className="location">
      <UserNavigation user={user} />
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

        <Grid
          user={user}
          isLoggedUser={true}
          posts={posts}
          // options={options}
          // type={activeOptionGrid}
        />
      </div>
    </div>
  );
}

export default withRouter(Location);
