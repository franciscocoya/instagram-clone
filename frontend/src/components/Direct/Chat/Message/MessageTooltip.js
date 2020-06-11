import React, { useEffect, useRef } from "react";

//Static files
import "../../../../public/css/Direct/Chat/Message/messageTooltip.css";

export default function MessageTooltip({
  setLike,
  setCopy,
  setRemove,
  orientation,
  close,
}) {
  const wrapperRef = useRef(null);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          close();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  //Close tooltip when use click outside
  useOutsideAlerter(wrapperRef);

  return (
    <div
      ref={wrapperRef}
      className={`msgTooltip ${
        orientation === "left" ? "msg_tooltip_left" : "msg_tooltip_right"
      }`}
    >
      <span className="cursor-pointer link-msg-like" onClick={setLike}>
        Me gusta
      </span>
      <span className="cursor-pointer link-msg-copy" onClick={setCopy}>
        Copiar
      </span>
      <span className="cursor-pointer link-msg-remove" onClick={setRemove}>
        Anular envío
      </span>
    </div>
  );
}
