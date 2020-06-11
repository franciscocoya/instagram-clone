import React from "react"; // ,{ useState, useEffect }
import {
  withRouter,
  //, useHistory
} from "react-router-dom";
//import axios from "axios";

//Static files
import "../../public/css/modals/blockUser.css";

function BlockUser({ close }) {
  // const [isFollowing, setIsFollowing] = useState(false);
  // let history = useHistory();

  //const reportUser = async () => {};

  //   useEffect(() => {
  //     try {
  //     } catch (err) {
  //       console.log(`Se ha producido un error al cargar moreSettings. ${err}`);
  //     }
  //   });

  return (
    <div className="w-blockUser">
      <div className="close-overlay" onClick={close}></div>
      <div className="modal-block-user tx-center animated zoomIn">
        <ul className="w-100">
          <li className="list-style-none bold-red b-bottom-1-light">
            Bloquear a este usuario
          </li>
          <li className="list-style-none" onClick={close}>
            Cancelar
          </li>
        </ul>
      </div>
    </div>
  );
}

export default withRouter(BlockUser);
