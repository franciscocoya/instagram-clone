import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import $ from "jquery";

//Components
import UserNavigation from "../Navigations/UserNavigation";
import Loader from "../Loader/Loader";

//Static file
import "../../public/css/settings/nametag.css";
import { preventSelection } from "../../public/js/main";
import nametagIllustration from "../../public/assets/img/nametag_ai.png";

function NameTag({ user }) {
  const [currentGradient, setCurrentGradient] = useState(1);
  let gradients = [
    "linear-gradient(to right top, #fd8d32, #a307ba)",

    "linear-gradient(to right top, #fdcb5c, #ed4956)",

    "linear-gradient(to right top, #27c4f5, #a307ba)",

    "linear-gradient(to right top, #54d7ff, #1390cc)",

    "linear-gradient(to right top, #70c050, #27c4f5)",

    "linear-gradient(to right top, #737373, #262626)",
  ];
  const [loading, setLoading] = useState(true);
  const changeBackground = (e) => {
    e.preventDefault();
    e.stopPropagation();
    preventSelection();
    resetGrandientsBorders();
    let currentGradientPos = parseInt(e.target.id.split("-")[1]);

    console.log("current gradient: " + currentGradientPos);
    let gradId = "#grad-" + currentGradientPos;
    $(gradId).addClass("gradient-active");
    let gradientToApply = gradients[currentGradientPos];

    console.log(currentGradientPos);
    console.log(gradientToApply);
    $(".nametag").css({
      backgroundImage: gradientToApply,
    });

    setCurrentGradient(currentGradientPos);
  };

  const changeBackgroundClickCanvas = (e) => {
    e.preventDefault();
    resetGrandientsBorders();
    preventSelection();
    console.log(currentGradient);
    let gradientToApply = gradients[currentGradient];
    let gradId = "#grad-" + currentGradient;
    $(gradId).addClass("gradient-active");
    $(".nametag").css({
      backgroundImage: gradientToApply,
    });
    currentGradient === 5
      ? setCurrentGradient(0)
      : setCurrentGradient(currentGradient + 1);
  };

  const resetGrandientsBorders = () => {
    if ($("#grad-0").hasClass("gradient-active")) {
      $("#grad-0").removeClass("gradient-active");
    }

    if ($("#grad-1").hasClass("gradient-active")) {
      $("#grad-1").removeClass("gradient-active");
    }

    if ($("#grad-2").hasClass("gradient-active")) {
      $("#grad-2").removeClass("gradient-active");
    }

    if ($("#grad-3").hasClass("gradient-active")) {
      $("#grad-3").removeClass("gradient-active");
    }

    if ($("#grad-4").hasClass("gradient-active")) {
      $("#grad-4").removeClass("gradient-active");
    }
    if ($("#grad-5").hasClass("gradient-active")) {
      $("#grad-5").removeClass("gradient-active");
    }
    setCurrentGradient(currentGradient);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="w-nametag h-100">
      {loading ? (
        <Loader />
      ) : (
        <div className="h-100 mp-0 wrapper-nametag">
          <UserNavigation user={user} />
          <div className="nametag">
            <section className="create-nametag">
              <div className="cont-canvas">
                {/* <canvas id="canvas-nametag" width="300" height="300"></canvas> */}
                <div
                  className="canvas-nametag"
                  onClick={changeBackgroundClickCanvas}
                >
                  <img
                    src={nametagIllustration}
                    alt={`nametag ${user.username}`}
                    width="300"
                    height="300"
                  />
                  <h2 className="text-mask">{user.username}</h2>
                </div>
              </div>
              <div className="cont-description-canvas">
                <h2>
                  Las tarjetas de identificación contribuyen a que las personas
                  puedan seguirte rápidamente
                </h2>
                <p>
                  Las personas tienen la opción de escanear tu tarjeta de
                  identificación con la cámara de Instagram para seguirte
                  fácilmente. Descárgala e imprímela, y añádela en tus productos
                  y pósteres, entre otros.
                </p>
                <div className="cont-gradients w-100">
                  <button>
                    <div
                      className="gradient-active"
                      id="grad-0"
                      onClick={changeBackground}
                    ></div>
                  </button>
                  <button>
                    <div onClick={changeBackground} id="grad-1"></div>
                  </button>
                  <button>
                    <div onClick={changeBackground} id="grad-2"></div>
                  </button>
                  <button>
                    <div onClick={changeBackground} id="grad-3"></div>
                  </button>
                  <button>
                    <div onClick={changeBackground} id="grad-4"></div>
                  </button>
                  <button>
                    <div onClick={changeBackground} id="grad-5"></div>
                  </button>
                </div>
                <div className="cont-bt-download-nametag">
                  <button id="bt-download-nametag" className="bt-gray">
                    Descargar tarjeta de identificación
                  </button>
                </div>
              </div>
            </section>
            <section className="print-nametag">
              <h2>
                Imprime una tarjeta de identificación que sea fácil de escanear
              </h2>
              <div className="cont-ideas-nametag">
                <div className="order-identification">
                  <span className="nametagSpriteNT_Contrast"></span>
                  <h4>Crea una tarjeta de identificación ordenada</h4>
                  <p>
                    Evita alterar el diseño de la tarjeta o imprimirla en
                    colores oscuros o estampados.
                  </p>
                </div>
                <div className="paste-nametag">
                  <span className="nametagSpriteNT_Corners"></span>
                  <h4>Pégala en superficies planas</h4>
                  <p>
                    Las cámaras deben poder leer la tarjeta de identificación
                    entera.
                  </p>
                </div>
                <div className="correct-size">
                  <span className="nametagSpriteNT_Pixels"></span>
                  <h4>Encuentra el tamaño adecuado</h4>
                  <p>
                    Imprime copias más pequeñas para escanearlas de cerca y
                    otras más grandes para escanearlas desde lejos.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default withRouter(NameTag);
