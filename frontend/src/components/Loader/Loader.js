import React from "react";

//Static files
import "../../public/css/Loader/loading.css";
import instagramIcon from "../../public/assets/img/instagram-icon.svg";
import ProgressBar from "./progressBar";

function Loader() {
  return (
    <div className="loading bg-gris">
      <ProgressBar />
      {/* <div className="cont-loader animated flipInX">
        <img
          src={instagramIcon}
          alt="Instagram icon"
          className="animated infinite pulse"
        />
      </div> */}
    </div>
  );
}

export default Loader;
