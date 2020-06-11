import React, { useEffect } from "react";

//Static files
import "../../public/css/modals/imageFullscreenModal.css";

export default function ImageFullscreenModal({ image }) {
  useEffect(() => {
    console.log(image);
  }, []);
  return (
    <div className="imgFull-modal">
      <div className="imgFull-modal__wrapper">
        <div className="close-img-full"></div>
        <img src={image} alt="" className="img-msg-full" />
      </div>
    </div>
  );
}
