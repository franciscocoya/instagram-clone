import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { HorizontalUserSuggest } from "../Suggested/Suggested";

//Static files
import "../../public/css/SearchResults/searchResults.css";

function SearchResults({
  suggestions,
  user,
  close,
  notLink,
  setSuggestionName,
}) {
  return (
    <div className={`search-results`}>
      <div
        className={`close-search-results mp-0  p-absolute`}
        onClick={close}
      ></div>
      <div className={`search-results__wrapper`}>
        {/* Suggestions list */}
        <ul className="list-suggestions">
          {
            //   suggestions.length > 0 &&
            <>
              {suggestions.length > 0 ? (
                <>
                  {suggestions.map((sg) => (
                    <HorizontalUserSuggest
                      key={sg._id}
                      username={sg.username}
                      fullname={sg.full_name}
                      profile_picture={sg.profile_picture}
                      loggedUser={user}
                      notLink={notLink}
                      setSuggestionName={setSuggestionName}
                    />
                  ))}
                </>
              ) : (
                <li className="search-no-results">
                  No se han encontrado resultados.
                </li>
              )}
            </>
          }
        </ul>
      </div>
    </div>
  );
}

export default withRouter(SearchResults);
