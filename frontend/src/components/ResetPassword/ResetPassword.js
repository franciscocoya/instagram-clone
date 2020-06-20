import React from "react";
import { withRouter, Link } from "react-router-dom";

//Components
import UserNavigation from "../Navigations/UserNavigation";

//Static files
import "../../public/css/ResetPassword/resetPassword.css";

function ResetPassword({ user }) {
  return (
    <div className="reset-password p-relative">
      <UserNavigation user={user} />
      <div className="reset-password__wrapper">
        <span className="coreSpriteLockSmall"></span>
        <h4>¿Tienes problemas para iniciar sesión?</h4>
        <p>
          Ingresa tu nombre de usuario o correo electrónico y te enviaremos un
          enlace para recuperar el acceso a tu cuenta.
        </p>
        <form action="">
          <input type="text" />
          <button type="submit">Enviar enlace de inicio de sesión</button>
        </form>
        {/* Separator */}
        <div className="separator">
          <div className="line"></div>
          <div className="">o</div>
          <div className="line"></div>
        </div>
        <Link to="">Crear cuenta nueva</Link>
      </div>
      <div className="cont-return-login">
        <span>Volver a inicio de sesión</span>
      </div>
    </div>
  );
}

export default withRouter(ResetPassword);
