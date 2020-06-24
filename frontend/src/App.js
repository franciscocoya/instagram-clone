import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  //Redirect,
} from "react-router-dom";

//Helpers
import {
  setToken,
  deleteToken,
  //getToken,
  initAxiosInterceptors,
} from "./Helpers/auth-helpers";

/**
 * Components
 */
import SignIn from "./components/Login";
import SignUp from "./components/SignUp";
import UserProfile from "./components/Profiles/UserProfile";
import PersonalProfile from "./components/Profiles/PersonalProfile";
import Post from "./components/Posts/Post";
import UploadPost from "./components/Posts/UploadPost";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Home from "./components/Home/Home";
import Activity from "./components/Activity/Activity";
import Explore from "./components/Explore/Explore";
import SettingsMain from "./components/Settings/SettingsMain";
import Nametag from "./components/Settings/NameTag";
import DirectInbox from "./components/Direct/Direct";
import TagPosts from "./components/Explore/TagPosts";

import Location from "./components/Location/Location";

import Error404 from "./components/Error";

initAxiosInterceptors();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        await axios
          .get("http://localhost:4000/accounts/user/init")
          .then((res) => {
            const userToRet = res.data.user;
            setUser(userToRet);
          })
          .catch((err) =>
            console.log(
              `Se ha producido un error al cargar el usuario en App. ${err}`
            )
          );
      } catch (error) {
        console.log(error);
      }
    }
    loadUser();
  }, []);

  async function login(email, password) {
    try {
      await axios
        .post("http://localhost:4000/accounts/SignIn", {
          email,
          password,
        })
        .then((res) => {
          setUser(res.data.user);
          setToken(res.data.token);
        })
        .catch((err1) =>
          console.log(`An error ocurred while login the user. ${err1}`)
        );
    } catch (err) {
      console.log(`An error ocurred while loging the user. ${err}`);
    }
  }

  async function signUp(user) {
    const { data } = await axios.post(
      "http://localhost:4000/accounts/SignUp",
      user
    );
    setUser(data.user);
    setToken(data.token);
  }

  function logout() {
    setUser(null);
    deleteToken();
    window.location = "/";
  }

  return (
    <Router>
      {/* <Route exact path={"/direct/inbox"} render={(props) => <DirectInbox />} /> */}
      {user ? (
        <LoginRoutes user={user} logout={logout} />
      ) : (
        <LogoutRoutes login={login} signUp={signUp} />
      )}
    </Router>
  );
}

function LoginRoutes({ user, logout }) {
  return (
    <Switch>
      <Route
        exact
        path={"/accounts/activity"}
        render={(props) => <Activity {...props} user={user} />}
      />
      <Route
        exact
        path={"/explore"}
        render={(props) => <Explore {...props} user={user} />}
      />

      <Route
        exact
        path="/explore/locations/:placeId/:place"
        render={(props) => <Location {...props} user={user} />}
      />

      <Route
        exact
        path="/explore/tags/:hashtag"
        render={(props) => <TagPosts {...props} user={user} />}
      />

      <Route
        exact
        path={"/direct/inbox"}
        render={(props) => <DirectInbox {...props} user={user} />}
      />

      <Route
        exact
        path={"/nametag"}
        render={(props) => <Nametag {...props} user={user} />}
      />

      <Route
        exact
        path="/p/upload"
        render={(props) => <UploadPost {...props} user={user} />}
      />

      <Route
        path="/p/:id"
        render={(props) => <Post {...props} user={user} />}
      />

      <Route
        exact
        path="/accounts/password/change"
        render={(props) => (
          <SettingsMain
            {...props}
            user={user}
            enablePass={true}
            enableEdit={false}
          />
        )}
      />

      <Route
        exact
        path="/accounts/password/reset"
        render={(props) => <ResetPassword {...props} user={user} />}
      />

      <Route path="/error/404" component={Error404} />

      <Route
        path="/:username/edit"
        render={(props) => (
          <SettingsMain
            {...props}
            user={user}
            enableEdit={true}
            enablePass={false}
          />
        )}
      />

      <Route
        exact
        path={"/u/:otherUsername"}
        render={(props) => <UserProfile {...props} user={user} />}
      />

      <Route
        path={"/:username/"}
        render={(props) => (
          <PersonalProfile {...props} user={user} logout={logout} />
        )}
        default
      />

      <Route
        exact
        path={"/"}
        render={(props) => <Home {...props} user={user} />}
      />
      {/* <Redirect>
        <Route path="/404" component={Error404} />
      </Redirect> */}
    </Switch>
  );
}

function LogoutRoutes({ login, signUp }) {
  return (
    <Switch>
      <Route
        exact
        path="/accounts/SignIn"
        render={(props) => <SignIn {...props} login={login} />}
        default
      />
      {/* <Route path="/p/upload" render={(props) => <UploadPost {...props} />} /> */}
      <Route
        path="/accounts/SignUp"
        render={(props) => <SignUp {...props} signUp={signUp} />}
      />
      <Route
        exact
        path="/"
        render={(props) => <SignIn {...props} login={login} />}
      />
      {/* <Route path="/" component={SignIn} /> */}
    </Switch>
  );
}

export default App;
