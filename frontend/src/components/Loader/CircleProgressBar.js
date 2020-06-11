import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";

//Static files
import "react-circular-progressbar/dist/styles.css";
import "../../public/css/Loader/circleProgressBar/circleProgressBar.css";

function CircleProgressBar({ percentage }) {
  //useEffect(() => {}, []);

  //Instagam gradient colors
  const progressColors = {
    color1: "#405de6",
    color2: "#5851db",
    color3: "#833ab4",
    color4: "#c13584",
    color5: "#e1306c",
    color6: "#fd1d1d",
  };

  /**
   * Change the color of the path when the progress bar advances.
   */
  const changePathColor = (value) => {
    switch (value) {
      case value < 16.6:
        return progressColors.color1;
        break;

      case value >= 16.6 && value < 33.2:
        return progressColors.color2;
        break;

      case value >= 33.2 && value < 49.98:
        return progressColors.color3;
        break;

      case value >= 66.64 && value < 90:
        return progressColors.color5;
        break;

      case value >= 90 && value <= 100:
        return progressColors.color6;
        break;
    }
  };

  useEffect(() => {}, [percentage]);

  return (
    <div className="circle-progress-bar">
      <div className="circle-progress-bar__wrapper">
        <CircularProgressbar
          value={percentage}
          text={""}
          strokeWidth={3}
          styles={{
            // Customize the root svg element
            root: {
              width: "160px",
            },
            // Customize the path, i.e. the "completed progress"
            path: {
              // Path color
              stroke: `${changePathColor(percentage)}`,
              strokeLinecap: "round",
              transition: "stroke-dashoffset 0.6s ease 0s",
              transformOrigin: "center center",
            },
            trail: {
              stroke: "transparent",
            },
          }}
        />
      </div>
    </div>
  );
}

export default withRouter(CircleProgressBar);
