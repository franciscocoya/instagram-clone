import React, { useEffect, useRef } from "react";
import { Picker } from "emoji-mart";

//Static files
import "../../../../public/css/Direct/ChatInput/EmojiPanel/emojiPanel.css";
import "emoji-mart/css/emoji-mart.css";

export default function EmojiPanel({ close, setSelectedEmoji }) {
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
    <div className="emoji-panel mp-0" ref={wrapperRef}>
      <Picker
        title="Pick your emoji…"
        emoji="point_up"
        showPreview={true}
        i18n={{
          search: "Search",
          clear: "Clear", // Accessible label on "clear" button
          notfound: "No Emoji Found",
          skintext: "Choose your default skin tone",
          categories: {
            search: "Search Results",
            recent: "Frequently Used",
            smileys: "Smileys & Emotion",
            people: "People & Body",
            nature: "Animals & Nature",
            foods: "Food & Drink",
            activity: "Activity",
            places: "Travel & Places",
            objects: "Objects",
            symbols: "Symbols",
            flags: "Flags",
            custom: "Custom",
          },
          categorieslabel: "Emoji categories", // Accessible title for the list of categories
          skintones: {
            1: "Default Skin Tone",
            2: "Light Skin Tone",
            3: "Medium-Light Skin Tone",
            4: "Medium Skin Tone",
            5: "Medium-Dark Skin Tone",
            6: "Dark Skin Tone",
          },
        }}
        onSelect={(e) => {
          console.log(e);
          setSelectedEmoji(e.native);
        }}
      />
    </div>
  );
}
