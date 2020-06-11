import React from "react";
import { withRouter, useHistory } from "react-router-dom";

//Static files
import "../../public/css/modals/settings.css";

function Settings({ close, closeSession }) {
  let history = useHistory();
  return (
    <div className="w-settings">
      <div className="close-overlay" onClick={close}></div>
      <div className="modal-settings tx-center animated zoomIn">
        <ul className="w-100">
          <li
            className="list-style-none b-bottom-1-light"
            onClick={() => history.push("/accounts/password/change")}
          >
            Cambiar contraseña
          </li>
          <li
            className="list-style-none b-bottom-1-light"
            onClick={() => history.push("/nametag")}
          >
            Tarjeta de identificación
          </li>
          <li
            className="list-style-none b-bottom-1-light"
            onClick={closeSession}
          >
            Cerrar sesión
          </li>
          <li className="list-style-none" onClick={close}>
            Cancelar
          </li>
        </ul>
      </div>
    </div>
  );
}

export default withRouter(Settings);
//export default Settings;
