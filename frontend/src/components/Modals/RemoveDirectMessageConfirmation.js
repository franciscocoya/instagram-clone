import React from "react";
import { withRouter } from "react-router-dom";

function RemoveDirectMessageConfirmation() {
  return (
    <div className="confirm-remove-direct-message">
      <div className="confirm-remove-direct-message__close"></div>
      <div className="confirm-remove-direct-message__body">
        <ul className="list-style-none">
          <li>
            <span>¿Anular el envío del mensaje?</span>
            <p className="mp-0">
              Se anulas el envío, se eliminará el mensaje. Es posible que
              algunas personas ya lo hayan visto.
            </p>
          </li>
          <li className="bold-red">Anular envío</li>
          <li>Cancelar</li>
        </ul>
      </div>
    </div>
  );
  ç;
}

export default withRouter(RemoveDirectMessageConfirmation);
