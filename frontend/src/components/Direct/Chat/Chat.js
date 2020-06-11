import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

//Components
import ChatInput from "./ChatInput/ChatInput";
import Message from "./Message/Message";

//Static files
import "../../../public/css/Direct/Chat/chat.css";

function Chat({
  setShowEmojiPanel,
  showCopiedModal,
  selectedEmoji,
  setFullscreenImage,
  setShowFullScreenImage,
  userSelected,
  messages,
  user,
  startTime,
}) {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {}, [refresh]);

  return (
    <div className="chat">
      <div className="chat__header b-bottom-1-light">
        <div className="chat-header-wrapper">
          <div className="container-currentUser-chat">
            {messages.length > 0 && (
              <>
                <img src={userSelected.profile_picture} alt="" />
                <p className="currentUser-chat">{userSelected.username}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="chat__body mp-0">
        <ChatBody
          showCopiedModal={showCopiedModal}
          setFullscreenImage={setFullscreenImage}
          setShowFullScreenImage={setShowFullScreenImage}
          messages={messages}
          user={user}
          startTime={startTime}
        />
      </div>
      <div className="chat__footer mp-0 w-100">
        <ChatInput
          setShowEmojiPanel={setShowEmojiPanel}
          selectedEmoji={selectedEmoji}
          user={user}
          userToChat={userSelected.id}
          refresh={() => setRefresh(true)}
        />
      </div>
    </div>
  );
}

function ChatBody({
  showCopiedModal,
  setFullscreenImage,
  setShowFullScreenImage,
  messages,
  user,
  startTime,
}) {
  return (
    <div className="chat-body p-relative">
      <span className="direct-chat-time">{startTime}</span>
      <div className="chat-body__messages w-100">
        {messages.map((msg, index) => (
          <Message
            key={index}
            orientation={msg.user_from === user._id ? "right" : "left"}
            msgText={msg.text}
            showCopiedModal={showCopiedModal}
            type={
              msg.image !== null && msg.image !== undefined ? "image" : "text"
            }
            msgImage={
              msg.image !== undefined && msg.image !== null ? msg.image : null
            }
          />
        ))}
      </div>
    </div>
  );
}

export default withRouter(Chat);
