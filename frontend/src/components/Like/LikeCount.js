/**
 * @description LikeCount. Show the likes count.
 *
 * @author Francisco Coya
 * @version v1.01
 * @see https://github.com/FranciscoCoya
 * @copyright © 2020 Francisco Coya
 */

import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

function LikeCount({ likesCount, refreshCount }) {
  useEffect(() => {}, [refreshCount]);
  return (
    <div className="cont-likes">
      <span>{likesCount} Me gusta</span>
    </div>
  );
}

export default withRouter(LikeCount);
