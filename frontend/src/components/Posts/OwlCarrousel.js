import React, { useState, useEffect } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";

//Components
import ProgressBar from "../Loader/progressBar";

//static files
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../public/css/Post/owlcarousel.css";
import "../../public/css/UploadPostTools/imageTools.css";

//--CSSGram filters
import "../../public/css/partials/cssgram.min.css";

export default function OwlCarrouselDemo({ image, setFilt, imgLoaded }) {
  const [preview, setPreview] = useState("");
  //https://source.unsplash.com/random/480x600
  const [loading, setLoading] = useState(true);

  const [currentFilterView, setCurrentFilterView] = useState(0);

  const checkIsPreview = () => {
    if (imgLoaded) {
      setPreview(image);
    } else {
      setPreview(
        "https://images.unsplash.com/photo-1589803196988-17b417281773?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max"
      );
    }
  };

  const handleFilter = (e) => {
    console.log(e.target.id);
    e.preventDefault();
    setFilt(e);
    let c = null;
    if (e.target.parentNode.parentNode.className === "border-gradient") {
      c = e.target.parentNode.parentNode;
    } else if (
      e.target.parentNode.parentNode.parentNode.className === "border-gradient"
    ) {
      c = e.target.parentNode.parentNode.parentNode;
    }
    let pos = c.id.split("-")[1];
    setCurrentFilterView(pos);
  };

  useEffect(() => {
    setLoading(true);
    checkIsPreview();
    setLoading(false);
  }, [image]);

  return (
    <div className="w-owl">
      {loading ? (
        <ProgressBar />
      ) : (
        <div className="container-fluid">
          <OwlCarousel
            items={3}
            dots={false}
            nav={false}
            loop
            autoWidth={true}
            margin={0}
            startPosition={currentFilterView}
            className="owl-carousel"
          >
            {/* _1977 */}
            <div className="border-gradient" id="f-0" onClick={handleFilter}>
              <div className="filter">
                <figure className="_1977 mp-0">
                  <img src={preview} alt="_1977" />
                </figure>
                <div className="filter-name">
                  <p>_1977</p>
                </div>
              </div>
            </div>
            {/* Aden  */}
            <div className="border-gradient" id="f-1" onClick={handleFilter}>
              <div className="filter">
                <figure className="aden mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>aden</p>
                </div>
              </div>
            </div>
            {/*  amaro*/}
            <div className="border-gradient" id="f-2" onClick={handleFilter}>
              <div className="filter">
                <figure className="amaro mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>amaro</p>
                </div>
              </div>
            </div>
            {/* brannan */}
            <div className="border-gradient" id="f-3" onClick={handleFilter}>
              <div className="filter">
                <figure className="brannan mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>brannan</p>
                </div>
              </div>
            </div>
            {/* brooklyn */}
            <div className="border-gradient" id="f-4" onClick={handleFilter}>
              <div className="filter">
                <figure className="brooklyn mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>brooklyn</p>
                </div>
              </div>
            </div>
            {/* clarendon */}
            <div className="border-gradient" id="f-5" onClick={handleFilter}>
              <div className="filter">
                <figure className="clarendon mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>clarendon</p>
                </div>
              </div>
            </div>
            {/* gingham */}
            <div className="border-gradient" id="f-6" onClick={handleFilter}>
              <div className="filter">
                <figure className="gingham mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>gingham</p>
                </div>
              </div>
            </div>{" "}
            {/* hudson */}
            <div className="border-gradient" id="f-7" onClick={handleFilter}>
              <div className="filter">
                <figure className="hudson mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>hudson</p>
                </div>
              </div>
            </div>
            {/* inkwell */}
            <div className="border-gradient" id="f-8" onClick={handleFilter}>
              <div className="filter">
                <figure className="inkwell mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>inkwell</p>
                </div>
              </div>
            </div>
            {/* kelvin */}
            <div className="border-gradient" id="f-9" onClick={handleFilter}>
              <div className="filter">
                <figure className="kelvin mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>kelvin</p>
                </div>
              </div>
            </div>
            {/* lark */}
            <div className="border-gradient" id="f-10" onClick={handleFilter}>
              <div className="filter">
                <figure className="lark mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>lark</p>
                </div>
              </div>
            </div>
            {/* lofi */}
            <div className="border-gradient" id="f-11" onClick={handleFilter}>
              <div className="filter">
                <figure className="lofi mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>lofi</p>
                </div>
              </div>
            </div>
            {/* mayfair */}
            <div className="border-gradient" id="f-12" onClick={handleFilter}>
              <div className="filter">
                <figure className="mayfair mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>mayfair</p>
                </div>
              </div>
            </div>
            {/* moon */}
            <div className="border-gradient" id="f-13" onClick={handleFilter}>
              <div className="filter">
                <figure className="moon mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>moon</p>
                </div>
              </div>
            </div>
            {/* nashville */}
            <div className="border-gradient" id="f-14" onClick={handleFilter}>
              <div className="filter">
                <figure className="nashville mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>nashville</p>
                </div>
              </div>
            </div>{" "}
            {/* perpetua */}
            <div className="border-gradient" id="f-15" onClick={handleFilter}>
              <div className="filter">
                <figure className="perpetua mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>perpetua</p>
                </div>
              </div>
            </div>
            {/* reyes */}
            <div className="border-gradient" id="f-16" onClick={handleFilter}>
              <div className="filter">
                <figure className="reyes mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>reyes</p>
                </div>
              </div>
            </div>
            {/* rise */}
            <div className="border-gradient" id="f-17" onClick={handleFilter}>
              <div className="filter">
                <figure className="rise mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>rise</p>
                </div>
              </div>
            </div>
            {/* slumber */}
            <div className="border-gradient" id="f-18" onClick={handleFilter}>
              <div className="filter">
                <figure className="slumber mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>slumber</p>
                </div>
              </div>
            </div>
            {/* stinson */}
            <div className="border-gradient" id="f-19" onClick={handleFilter}>
              <div className="filter">
                <figure className="stinson mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>stinson</p>
                </div>
              </div>
            </div>
            {/* toaster */}
            <div className="border-gradient" id="f-20" onClick={handleFilter}>
              <div className="filter">
                <figure className="toaster mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>toaster</p>
                </div>
              </div>
            </div>
            {/* valencia */}
            <div className="border-gradient" id="f-21" onClick={handleFilter}>
              <div className="filter">
                <figure className="valencia mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>valencia</p>
                </div>
              </div>
            </div>
            {/* walden */}
            <div className="border-gradient" id="f-22" onClick={handleFilter}>
              <div className="filter">
                <figure className="walden mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>walden</p>
                </div>
              </div>
            </div>
            {/* willow */}
            <div className="border-gradient" id="f-23" onClick={handleFilter}>
              <div className="filter">
                <figure className="willow mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>willow</p>
                </div>
              </div>
            </div>
            {/* xpro2 */}
            <div className="border-gradient" id="f-24" onClick={handleFilter}>
              <div className="filter">
                <figure className="xpro2 mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>xpro2</p>
                </div>
              </div>
            </div>
            {/* Original - Sin filtros */}
            <div className="border-gradient" id="f-25" onClick={handleFilter}>
              <div className="filter">
                <figure className="mp-0">
                  <img src={preview} alt="" />
                </figure>
                <div className="filter-name">
                  <p>Sin filtro</p>
                  <p className="t-subtitle">Foto Original</p>
                </div>
              </div>
            </div>
          </OwlCarousel>
        </div>
      )}
    </div>
  );
}
