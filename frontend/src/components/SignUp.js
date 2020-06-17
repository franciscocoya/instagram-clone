import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "react-external-link";
import { Helmet } from "react-helmet";

//Queries
import { closeSession } from "../queries/user_queries";

//Static files
import "../public/css/signUp.css";

function SignUp({ signUp, showError }) {
  const [user, setUser] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
  });

  function handleInputChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signUp(user);
    } catch (err) {
      console.log(`An error ocurred while register the user... ${err}`);
    }
  };

  useEffect(() => {
    closeSession();
  }, []);

  return (
    <div className="body p-2 flex-row b-signUp">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Instagram Clone • SignUp</title>
      </Helmet>
      <div className="container-r">
        <div className="box">
          <div className="header-l">
            <span className="header-l coreSpriteLoggedOutWordmark tx-center"></span>
            <h2 className="t-2">
              Regístrate para ver fotos y vídeos de tus amigos
            </h2>
          </div>
          <div className="box-body">
            <button className="mp-0">
              <ExternalLink
                className="link tx-button flex-row"
                href="https://www.facebook.com/login.php?skip_api_login=1&api_key=124024574287414&kid_directed_site=0&app_id=124024574287414&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Foauth%3Fclient_id%3D124024574287414%26redirect_uri%3Dhttps%253A%252F%252Fwww.instagram.com%252Faccounts%252Fsignup%252F%26state%3D%257B%2522fbLoginKey%2522%253A%25225r1x7013q5mup1mmer6ezlgaur1g5mo85fqjrufz3ui0p19j0y09%2522%252C%2522fbLoginReturnURL%2522%253A%2522%252F%2522%257D%26scope%3Demail%26response_type%3Dcode%252Cgranted_scopes%26locale%3Des_ES%26ret%3Dlogin%26fbapp_pres%3D0%26logger_id%3Db1929886-9ca0-46a8-9ae6-04684c450024&cancel_url=https%3A%2F%2Fwww.instagram.com%2Faccounts%2Fsignup%2F%3Ferror%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%26state%3D%257B%2522fbLoginKey%2522%253A%25225r1x7013q5mup1mmer6ezlgaur1g5mo85fqjrufz3ui0p19j0y09%2522%252C%2522fbLoginReturnURL%2522%253A%2522%252F%2522%257D%23_%3D_&display=page&locale=es_ES&pl_dbl=0"
              >
                <p className="coreSpriteFacebookIconInverted mx-05"></p>
                <p className="mp-0 bold-white">Iniciar sesión con Facebook</p>
              </ExternalLink>
            </button>

            <div className="separator">
              <div className="line"></div>
              <div className="">o</div>
              <div className="line"></div>
            </div>

            {/* SignUp FORM */}
            <form onSubmit={handleSubmit} className="form-register">
              {/* email */}
              <input
                type="email"
                className=""
                placeholder="Correo electrónico"
                name="email"
                autoFocus
                minLength="3"
                maxLength="50"
                onChange={handleInputChange}
                value={user.email}
              />

              {/* fullname */}
              <input
                type="text"
                className=""
                placeholder="Nombre completo"
                name="full_name"
                minLength="1"
                maxLength="30"
                onChange={handleInputChange}
                value={user.full_name}
              />

              {/* username */}
              <input
                type="text"
                className=""
                placeholder="Nombre de usuario"
                name="username"
                minLength="1"
                maxLength="30"
                onChange={handleInputChange}
                value={user.username}
              />

              {/* password */}
              <input
                type="password"
                className=""
                placeholder="Contraseña"
                name="password"
                minLength="3"
                maxLength="30"
                onChange={handleInputChange}
                value={user.password}
              />

              <button type="submit">Siguiente</button>
            </form>
            <p className="tx-s-gris">
              Al registrarte, aceptas nuestras Condiciones. Obtén más
              información sobre cómo recopilamos, usamos y compartimos tu
              información en la Política de datos, así como el uso que hacemos
              de las cookies y tecnologías similares en nuestra
              <ExternalLink
                className="link bold"
                href="https://help.instagram.com/1896641480634370?ref=ig"
              >
                Política de Cookies.
              </ExternalLink>
            </p>
          </div>
        </div>
        {/* box 2 */}
        <div className="box">
          <p>
            ¿Tienes una cuenta?
            <Link className="link bold" to="/accounts/SignIn">
              Entrar
            </Link>
          </p>
        </div>
        <div className="download-container">
          <p>Descarga la aplicación</p>
          <div className="icons-download mp-0">
            <ExternalLink
              className="coreSpriteAppStoreButton mx-05 decoration-none text-transparent"
              href="https://apps.apple.com/app/instagram/id389801252?vt=lo"
            ></ExternalLink>
            <ExternalLink
              className="coreSpriteGooglePlayButton mx-05 decoration-none text-transparent"
              href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=utm_source%3Dinstagramweb%26utm_campaign%3DloginPage%26ig_mid%3D730C1025-68A2-4197-AC92-1261CAA040E1%26utm_content%3Dlo%26utm_medium%3Dbadge"
            ></ExternalLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
