import React, { useState, useEffect, Suspense } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

//Components
import UserNavigation from "../Navigations/UserNavigation";
import Loader from "../Loader/Loader";
import VerticalPost from "../Posts/VerticalPost";

//Modals
import MoreOptions from "../Modals/MoreOptions";
import Share from "../Modals/Share";
import SearchResults from "../Modals/SearchResults";

//Static files
import "../../public/css/Home/home.css";
import instIcon from "../../public/assets/img/instagram-icon.svg";

function Home({ user, match }) {
  let history = useHistory();
  const [loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [posts, setPosts] = useState([]);
  const [, setIsFollowing] = useState(false);
  const [postClicked, setPostClicked] = useState({
    postId: "",
    userPostId: "",
  });
  const [, setLoadingUnfollow] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  function NoPostsHome() {
    return (
      <div className="w__noPost">
        <div className="cont-img-logo">
          <img src={instIcon} alt="" />
        </div>
        <h2>¡ Bienvenido a Instagram !</h2>
        <p>Aquí podrás ver los posts publicados</p>
      </div>
    );
  }

  const loadFollowingPosts = async () => {
    try {
      const data = new FormData();
      data.append("userId", user._id);
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios
        .post("http://localhost:4000/p/list/followingPosts", data, config)
        .then((res) => {
          const result = res.data.followingPosts;
          const orderedData = result.sort(
            (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
          );
          setPosts(orderedData);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(
        `Se ha producido un error al listar los posts de los usuarios seguidos por el usuario. ${err}`
      );
    }
  };

  const getSuggestedUsers = async () => {
    try {
      await axios
        .get(`http://localhost:4000/follow/listUsersNotFollow/${user._id}`)
        .then((res) => {
          const users = res.data.usersNotFollowing;
          //suggest five users
          const firstFiveUsers = users.slice(0, Math.min(5, users.length));
          setSuggestedUsers(firstFiveUsers);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(
        `Se ha producido un error al cargar los usuarios recomendados. ${err}`
      );
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      loadFollowingPosts();
      getSuggestedUsers();
      setLoading(false);
    } catch (err) {
      console.log(`Se ha producido un error al cargar la vista Home. ${err}`);
      setLoading(false);
    }
  }, []);

  return (
    <div className="mp-0 h-100">
      {loading ? (
        <Loader />
      ) : (
        <>
          {posts.length === 0 ? (
            <>
              <UserNavigation
                user={user}
                fillHome={true}
                showSuggestions={() => setShowSearchResults(true)}
                closeSuggestions={() => setShowSearchResults(false)}
                resultsArr={setSearchResults}
              />
              <NoPostsHome />
            </>
          ) : (
            <div className="body-home">
              {/* <UserNavigation user={user} /> */}
              {showSearchResults && (
                <SearchResults
                  suggestions={searchResults}
                  user={user}
                  close={() => setShowSearchResults(false)}
                />
              )}
              <UserNavigation
                {...setSearchResults}
                user={user}
                fillHome={true}
                showSuggestions={() => setShowSearchResults(true)}
                closeSuggestions={() => setShowSearchResults(false)}
                resultsArr={setSearchResults}
              />
              {openSettings && (
                <MoreOptions
                  setOpen={() => setOpenSettings(false)}
                  close={() => setOpenSettings(false)}
                  openShare={() => setOpenShare(true)}
                  ids={postClicked}
                  user={user}
                  initRefreshPost={() => setLoadingUnfollow(true)}
                  endRefreshPost={() => setLoadingUnfollow(false)}
                />
              )}
              {openShare && (
                <Share
                  open={() => {
                    setOpenShare(true);
                    setOpenSettings(false);
                  }}
                  close={() => {
                    setOpenShare(false);
                    setOpenSettings(false);
                  }}
                  postId={postClicked.postId}
                />
              )}

              <div className="home-main-wrapper">
                <div className="wrapper-posts">
                  {posts.map(
                    (p, index) =>
                      p.user_id !== user._id && (
                        <VerticalPost
                          key={p._id}
                          setOpenMoreSettings={() => setOpenSettings(true)}
                          text={p.description}
                          imgPost={p.thumbnail}
                          postUser={p.user_id}
                          countryId={p.place.countryCode}
                          place={p.place.name}
                          postId={p._id}
                          timeAgo={p.createdAt}
                          btKey={index}
                          user={user}
                          filter={p.imgFilter}
                          following={() => setIsFollowing(true)}
                          notFollowing={() => setIsFollowing(false)}
                          setCurrent={() =>
                            setPostClicked({
                              postId: p._id,
                              userPostId: p.user_id,
                            })
                          }
                        />
                      )
                  )}
                  {/* <VerticalPost setOpenMoreSettings={() => setOpenSettings(true)} />
            <VerticalPost setOpenMoreSettings={() => setOpenSettings(true)} />
            <VerticalPost setOpenMoreSettings={() => setOpenSettings(true)} /> */}
                </div>
                {/* SIDEBAR */}
                <div className="sidebar">
                  <div className="sidebar-wrapper-fixed">
                    <div className="sidebar__username-container">
                      <div className="cont-img-suggested-profile">
                        <img
                          src={user.profile_picture}
                          alt={user.username}
                          width="56"
                          height="56"
                          className="suggested-img-profile"
                          onClick={() => history.push(`/${user.username}/`)}
                          loading="lazy"
                        />
                      </div>
                      <div className="cont-username-data">
                        <p
                          className="mp-0"
                          onClick={() => history.push(`/${user.username}/`)}
                        >
                          {user.username}
                        </p>
                        <p className="mp-0">{user.full_name}</p>
                      </div>
                    </div>

                    {/* Suggested */}
                    <Suspense fallback={<div>loading ..</div>}>
                      <div className="sidebar__suggested">
                        <div className="suggested__header">
                          <p>Sugerencias para ti</p>
                          <span>Ver todo</span>
                        </div>
                        <div className="suggested__body">
                          {suggestedUsers.map((u, index) => (
                            <div
                              key={index}
                              className="user-info"
                              loading="lazy"
                            >
                              <div className="user-info__col1">
                                <img
                                  src={u.profile_picture}
                                  alt={u.username}
                                  className="suggested-img-profile"
                                  width="32"
                                  height="32"
                                  onClick={() =>
                                    history.push(`/u/${u.username}`)
                                  }
                                />
                                <div className="col1__data">
                                  <p
                                    className="mp-0"
                                    onClick={() =>
                                      history.push(`/u/${u.username}`)
                                    }
                                  >
                                    {u.username}
                                  </p>
                                  <p className="mp-0">{u.full_name}</p>
                                </div>
                              </div>
                              <div className="user-info__col2">
                                <button className="bt-small-link bt-follow-suggested">
                                  Seguir
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
