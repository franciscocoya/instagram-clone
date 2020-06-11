import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import $ from "jquery";

//Components

//Static files
import "../../public/css/UploadPostTools/imageTools.css";

//--Images
import {
  rotateIcon,
  rotateIcon_hover,
  cropIcon,
  cropIcon_hover,
  flipHorizontalIcon,
  flipHorizontalIcon_hover,
  flipVerticalIcon,
  flipVerticalIcon_hover,
  instagramSizeIcon,
  instagramSizeIcon_hover,
  resetIcon,
  resetIcon_hover,
} from "./ImageIcons";

function ImageTools({ setImgParams }) {
  const [activeCropModal, setActiveCropModal] = useState(false);
  const [activeRotateModal, setActiveRotateModal] = useState(false);
  const [activeIcon, setActiveIcon] = useState("");

  //Image params
  const [cropParams, setCropParams] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [rotateDegrees, setRotateDegrees] = useState(0);
  const [isFlipHorizontal, setIsFlipHorizontal] = useState(false);
  const [isFlipVertical, setIsFlipVertical] = useState(false);
  const [isAdjust, setIsAdjust] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleImageParams = () => {
    if (isReset) {
      setImgParams({
        crop: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
        rotateDegrees: 0,
        flipHorizontal: false,
        flipVertical: false,
        adjust: false,
      });
    }
    setImgParams({
      crop: cropParams,
      rotateDegrees,
      flipHorizontal: isFlipHorizontal,
      flipVertical: isFlipVertical,
      adjust: isAdjust,
    });
  };

  useEffect(() => {
    handleImageParams();
  }, [
    cropParams,
    isFlipHorizontal,
    isFlipVertical,
    isAdjust,
    rotateDegrees,
    isReset,
  ]);

  return (
    <div className="image-tools">
      <div className="image-tools__body">
        <CropTool
          setActiveCropModal={() => {
            setActiveCropModal(!activeCropModal);
            setActiveRotateModal(false);
          }}
          setActiveIcon={setActiveIcon}
          activeIcon={activeIcon}
        />
        <RotateTool
          setActiveRotateModal={() => {
            setActiveRotateModal(!activeRotateModal);
            setActiveCropModal(false);
          }}
          setActiveIcon={setActiveIcon}
          activeIcon={activeIcon}
        />
        <FlipHorizontalTool
          setActiveIcon={setActiveIcon}
          activeIcon={activeIcon}
          setIsFlipHorizontal={setIsFlipHorizontal}
          flipHorizontal={isFlipHorizontal}
        />
        <FlipVerticalTool
          setActiveIcon={setActiveIcon}
          activeIcon={activeIcon}
          setIsFlipVertical={setIsFlipVertical}
          flipVertical={isFlipVertical}
        />
        <InstagramSizeTool
          setActiveIcon={setActiveIcon}
          activeIcon={activeIcon}
          setIsAdjust={setIsAdjust}
          adjust={isAdjust}
        />
        <ResetTool
          setActiveIcon={setActiveIcon}
          activeIcon={activeIcon}
          setIsReset={setIsReset}
          reset={isReset}
        />
      </div>

      {/* Tools modals */}
      <div className="image-tools__modals">
        {activeCropModal && (
          <CropToolModal
            setActiveCropModal={setActiveCropModal}
            activeRotateModal={activeRotateModal}
            isActive={activeCropModal}
            setCropParams={setCropParams}
          />
        )}

        {activeRotateModal && (
          <RotateToolModal
            setActiveRotateModal={setActiveRotateModal}
            activeCropModal={activeCropModal}
            isActive={activeRotateModal}
            setRotateDegrees={setRotateDegrees}
          />
        )}
      </div>
    </div>
  );
}

//TOOLS

function CropTool({ setActiveCropModal, setActiveIcon, activeIcon }) {
  const handleClick = (e) => {
    e.preventDefault();
    setActiveCropModal(e);
    setActiveIcon("crop");
  };

  return (
    <div className="crop-tool" onClick={handleClick}>
      <img
        src={activeIcon === "crop" ? cropIcon_hover : cropIcon}
        alt="Recortar Imagen"
        className="normalize-icon-size"
      />
      {activeIcon === "crop" && (
        <span className="animated fadeInUp faster crop-tool-title">
          Recortar
        </span>
      )}
    </div>
  );
}

function RotateTool({
  rotate,
  setActiveRotateModal,
  setActiveIcon,
  activeIcon,
}) {
  const handleClick = (e) => {
    e.preventDefault();
    setActiveRotateModal(e);
    setActiveIcon("rotate");
  };

  return (
    <div className="rotate-tool" onClick={handleClick}>
      <img
        src={activeIcon === "rotate" ? rotateIcon_hover : rotateIcon}
        alt="Girar Imagen"
        className="normalize-icon-size"
      />
      {activeIcon === "rotate" && (
        <span className="animated fadeInUp faster">Girar</span>
      )}
    </div>
  );
}

function FlipHorizontalTool({
  setActiveIcon,
  activeIcon,
  setIsFlipHorizontal,
  flipHorizontal,
}) {
  const handleClick = () => {
    setActiveIcon("flip-horizontal");
    setIsFlipHorizontal(!flipHorizontal);
  };

  return (
    <div className="flip-horizontal-tool" onClick={handleClick}>
      <img
        src={
          activeIcon === "flip-horizontal"
            ? flipHorizontalIcon_hover
            : flipHorizontalIcon
        }
        alt="Voltear imagen horizontalmente"
        className="normalize-icon-size"
      />
      {activeIcon === "flip-horizontal" && (
        <span className="animated fadeInUp faster">Voltear Horizontal</span>
      )}
    </div>
  );
}

function FlipVerticalTool({
  setActiveIcon,
  activeIcon,
  setIsFlipVertical,
  flipVertical,
}) {
  const handleClick = () => {
    setActiveIcon("flip-vertical");
    setIsFlipVertical(!flipVertical);
  };

  return (
    <div className="flip-vertical-tool" onClick={handleClick}>
      <img
        src={
          activeIcon === "flip-vertical"
            ? flipVerticalIcon_hover
            : flipVerticalIcon
        }
        alt="Voltear imagen verticalmente"
        className="normalize-icon-size"
      />
      {activeIcon === "flip-vertical" && (
        <span className="animated fadeInUp faster">Voltear Vertical</span>
      )}
    </div>
  );
}

function InstagramSizeTool({ setActiveIcon, activeIcon, setIsAdjust, adjust }) {
  const handleClick = () => {
    setActiveIcon("adjust");
    setIsAdjust(!adjust);
  };

  return (
    <div className="instagam-size-tool" onClick={handleClick}>
      <img
        src={
          activeIcon === "adjust" ? instagramSizeIcon_hover : instagramSizeIcon
        }
        alt="Ajustar a tamaño de instagram"
        className="normalize-icon-size"
      />
      {activeIcon === "adjust" && (
        <span className="animated fadeInUp faster">Ajustar</span>
      )}
    </div>
  );
}

function ResetTool({ setActiveIcon, activeIcon, setIsReset, reset }) {
  const handleClick = () => {
    setActiveIcon("reset");
    setIsReset(!reset);
  };

  return (
    <div className="reset-image-tool" onClick={handleClick}>
      <img
        src={activeIcon === "reset" ? resetIcon_hover : resetIcon}
        alt="Restablecer valores"
        className="normalize-icon-size"
      />
      {activeIcon === "reset" && <span>Restablecer</span>}
    </div>
  );
}

//MODALS
function CropToolModal({ isActive, activeRotateModal, setCropParams }) {
  const [cropValues, setCropValues] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  /**
   * Check if the input its a number.
   * @param {*} e
   */
  const checkValue = (e) => {
    var evt = e || window.event;

    // Handle paste
    if (evt.type === "paste") {
      key = e.clipboardData.getData("text/plain");
    } else {
      // Handle key press
      var key = evt.keyCode || evt.which;
      key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      evt.returnValue = false;
      if (evt.preventDefault) evt.preventDefault();
    }
  };

  const handleChange = async (e) => {
    var sideName = e.target.id.split("-")[1];
    var value = parseInt(e.target.value) || 0;

    switch (sideName) {
      case "top":
        await setCropValues((prev) => {
          return {
            ...prev,
            top: value,
          };
        });
        break;
      case "bottom":
        await setCropValues((prev) => {
          return {
            ...prev,
            bottom: value,
          };
        });
        break;
      case "left":
        await setCropValues((prev) => {
          return {
            ...prev,
            left: value,
          };
        });
        break;
      case "right":
        await setCropValues((prev) => {
          return {
            ...prev,
            right: value,
          };
        });
        break;
    }
  };

  useEffect(() => {
    setCropParams(cropValues);
  }, [cropValues]);

  return (
    <div
      className={`crop-tool-modal animated ${
        activeRotateModal ? "flipOutX" : "flipInX"
      }`}
    >
      <ul className="mp-0">
        <li className="list-style-none mp-0">
          <label htmlFor="crop-top">Arriba:</label>
          <input
            type="text"
            id="crop-top"
            onKeyPress={checkValue}
            minLength="0"
            maxLength="4"
            value={cropValues.top}
            onChange={handleChange}
          />
          <span>px</span>
        </li>
        <li className="list-style-none mp-0">
          <label htmlFor="crop-bottom">Abajo:</label>
          <input
            type="text"
            id="crop-bottom"
            onKeyPress={checkValue}
            minLength="0"
            maxLength="4"
            value={cropValues.bottom}
            onChange={handleChange}
          />
          <span>px</span>
        </li>
        <li className="list-style-none mp-0">
          <label htmlFor="crop-left">Izquierda:</label>
          <input
            type="text"
            id="crop-left"
            onKeyPress={checkValue}
            minLength="0"
            maxLength="4"
            value={cropValues.left}
            onChange={handleChange}
          />
          <span>px</span>
        </li>
        <li className="list-style-none mp-0">
          <label htmlFor="crop-right">Derecha:</label>
          <input
            type="text"
            id="crop-right"
            onKeyPress={checkValue}
            minLength="0"
            maxLength="4"
            value={cropValues.right}
            onChange={handleChange}
          />
          <span>px</span>
        </li>
      </ul>
    </div>
  );
}

function RotateToolModal({ isActive, activeCropModal, setRotateDegrees }) {
  const [sliderValue, setSliderValue] = useState(0);
  const MIN_VALUE = 0;
  const MAX_VALUE = 360;

  const handleSliderValue = (e) => {
    setSliderValue(e.target.value);
    fillSlider(e.target.value);
    setRotateDegrees(e.target.value);
  };

  const fillSlider = (value) => {
    var slider = $("#rotate-img-value");
    var percentage = (100 * (value - MIN_VALUE)) / (MAX_VALUE - MIN_VALUE);

    var gradient = `linear-gradient(90deg, ${"#d62976"} ${percentage}%, ${"transparent"} ${
      percentage + 0.1
    }%)`;

    slider.css({
      background: gradient,
    });
  };

  return (
    <div
      className={`rotate-tool-modal animated ${
        activeCropModal ? "fadeOutDown" : "fadeInUp"
      }`}
    >
      <input
        type="range"
        min={MIN_VALUE}
        max={MAX_VALUE}
        value={sliderValue}
        step="1"
        id="rotate-img-value"
        onChange={handleSliderValue}
      />
      <span className="rotate-value">{sliderValue} grados</span>
    </div>
  );
}

export default withRouter(ImageTools);
