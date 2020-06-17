import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

//Static files
import { showPass, hidePass } from "./icons";
import "../../public/css/settings/showPass.css";

function ShowPassword({ hide, show }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleShow = (e) => {
    e.preventDefault();
    setIsVisible(!isVisible);
    isVisible ? hide() : show();
  };

  useEffect(() => {}, [isVisible]);

  return (
    <span className="show-pass">
      <img
        src={isVisible ? hidePass : showPass}
        alt={isVisible ? "Hide password" : "Show password"}
        title={isVisible ? "Hide password" : "Show password"}
        onClick={handleShow}
      />
    </span>
  );
}

export default withRouter(ShowPassword);
