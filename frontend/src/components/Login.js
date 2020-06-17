import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { ExternalLink } from "react-external-link";
import { Helmet } from "react-helmet";

//Components

//Static files
import "../public/css/login.css";
import phones from "../public/assets/img/phones.png";

function Login({ login }) {
  const [emailYPassword, setEmailYPassword] = useState({
    email: "",
    password: "",
  });

  function handleInputChange(e) {
    setEmailYPassword({
      ...emailYPassword,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(emailYPassword.email, emailYPassword.password);
    } catch (err) {
      console.log(`An error ocurred while loging... ${err}`);
    }
  };

  return (
    <div className="body flex-row b-signIn h-100 w-100">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Instagram Clone • SignIn</title>
      </Helmet>
      <div className="container mp-0">
        {/* Phones */}
        <div className="col-1">
          <img src={phones} alt="Phones" />
        </div>

        {/* Form Sign In */}
        <div className="col-2">
          {/* Container log-in */}
          <div className="log-container box ">
            <div className="header-l">
              <span className="log-header coreSpriteLoggedOutWordmark"></span>
            </div>

            {/* Register Form */}
            <form className="form-signin" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                autoFocus
                value={emailYPassword.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                onChange={handleInputChange}
                value={emailYPassword.password}
                required
              />
              <button type="submit">Iniciar sesión</button>
            </form>

            {/* Separator */}
            <div className="separator">
              <div className="line"></div>
              <div className="">o</div>
              <div className="line"></div>
            </div>

            {/* Forgot Password */}
            <div className="forgot-password">
              <div className="flex-row-between">
                <p className="coreSpriteFacebookIcon mx-05"></p>
                <ExternalLink
                  className="link"
                  href="https://www.facebook.com/login.php?skip_api_login=1&api_key=124024574287414&kid_directed_site=0&app_id=124024574287414&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Foauth%3Fclient_id%3D124024574287414%26redirect_uri%3Dhttps%253A%252F%252Fwww.instagram.com%252Faccounts%252Fsignup%252F%26state%3D%257B%2522fbLoginKey%2522%253A%25225r1x7013q5mup1mmer6ezlgaur1g5mo85fqjrufz3ui0p19j0y09%2522%252C%2522fbLoginReturnURL%2522%253A%2522%252F%2522%257D%26scope%3Demail%26response_type%3Dcode%252Cgranted_scopes%26locale%3Des_ES%26ret%3Dlogin%26fbapp_pres%3D0%26logger_id%3Db1929886-9ca0-46a8-9ae6-04684c450024&cancel_url=https%3A%2F%2Fwww.instagram.com%2Faccounts%2Fsignup%2F%3Ferror%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%26state%3D%257B%2522fbLoginKey%2522%253A%25225r1x7013q5mup1mmer6ezlgaur1g5mo85fqjrufz3ui0p19j0y09%2522%252C%2522fbLoginReturnURL%2522%253A%2522%252F%2522%257D%23_%3D_&display=page&locale=es_ES&pl_dbl=0"
                >
                  Iniciar sesión con Facebook
                </ExternalLink>
              </div>
              <p>
                <Link className="link" to="/accounts/password/reset">
                  ¿Has olvidado la contraseña?
                </Link>
              </p>
            </div>
          </div>

          {/* Container Register */}
          <div className="register-container box">
            <p>
              ¿No tienes una cuenta?
              <Link className="link bold" to="/accounts/SignUp">
                Regístrate
              </Link>
            </p>
          </div>

          {/* Container Download */}
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
    </div>
  );
}

export default withRouter(Login);
