/**
 * @description Activity view. Show other posts that the user does not follow and suggestions.
 *
 * @author Francisco Coya
 * @version v1.01
 * @see https://github.com/FranciscoCoya
 * @copyright © 2020 Francisco Coya
 */

import React, { useState } from "react";
import { withRouter } from "react-router-dom";

//Components
import UserNavigation from "../Navigations/UserNavigation";

//Modals
import SearchResults from "../Modals/SearchResults";

//Static files
import "../../public/css/Activity/activity.css";

function NoActivity() {
  return (
    <div className="no-activity">
      <div className="cont-no-activity">
        <span className="coreSpriteActivityHeart"></span>
        <p>Actividad en tus publicaciones</p>
        <p>
          Aquí verás si a alguien le gusta una de tus publicaciones o la
          comenta.
        </p>
      </div>
    </div>
  );
}

function Activity({ user }) {
  const [isActivity] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="body-activity">
      <UserNavigation
        user={user}
        fillHome={false}
        fillExplore={false}
        fillActivity={true}
        fillProfile={false}
        showSuggestions={() => setShowSearchResults(true)}
        closeSuggestions={() => setShowSearchResults(false)}
        resultsArr={setSearchResults}
      />
      {isActivity && (
        <div className="">
          {showSearchResults && (
            <SearchResults suggestions={searchResults} user={user} />
          )}
          ACTIVITY
          {user.username}
        </div>
      )}

      {/* Si no hay actividad en la cuenta*/}
      {!isActivity && <NoActivity />}
    </div>
  );
}

export default withRouter(Activity);
