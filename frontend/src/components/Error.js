import React from "react";
import { withRouter, Link } from "react-router-dom";

//Components
//import UserNavigation from "./Navigations/UserNavigation";

//Static files
import "../public/css/Error/error404.css";

function Error() {
  return (
    <div className="error">
      {/* <Navigation /> */}
      <div className="error-wrapper">
        <h1>404</h1>
        <h2>Esta página no está disponible.</h2>
        <p>
          Es posible que el enlace que has seguido sea incorrecto o que se haya
          eliminado la página.{" "}
          <Link to="/" className="decoration-none link-redirect-home">
            Volver a Instagram
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default withRouter(Error);
