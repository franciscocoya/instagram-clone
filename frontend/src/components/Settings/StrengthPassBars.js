import React from "react";
import { withRouter } from "react-router-dom";

//Static files
import "../../public/css/settings/strengthBars.css";

function StrengthPassBars({ level }) {
  const passwordTypes = {
    TOO_SHORT: "too-short",
    WEAK: "weak",
    FAIR: "fair",
    GOOD: "good",
    STRONG: "strong",
  };

  return (
    <div className="strength-pass-bars">
      <div className="strength-pass-bars__wrapper">
        {level >= 0 && <StrengthBar type={passwordTypes.TOO_SHORT} />}
        {level >= 1 && <StrengthBar type={passwordTypes.WEAK} />}
        {level >= 2 && <StrengthBar type={passwordTypes.FAIR} />}
        {level >= 3 && <StrengthBar type={passwordTypes.GOOD} />}
        {level === 4 && <StrengthBar type={passwordTypes.STRONG} />}
      </div>
    </div>
  );
}

function StrengthBar({ type }) {
  return (
    <span
      className={`strength-bar strength_${type} animated slideInLeft`}
    ></span>
  );
}

export default withRouter(StrengthPassBars);
