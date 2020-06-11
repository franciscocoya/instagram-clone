import React, { Component } from "react";

import "../../public/css/messages/message.css";

export default class Message extends Component {
  render() {
    let showMessage = (
      <div className="message">
        <div className="text">{this.props.message}</div>
        <div className="close mp-0">x</div>
      </div>
    );

    if (!this.props.show) {
      showMessage = null;
    }
    return <div>{showMessage}</div>;
  }
}
