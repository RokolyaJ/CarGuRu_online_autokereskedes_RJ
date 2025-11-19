import React from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import ChatWindow from "./ChatWindow";

export default function ChatFloating() {
  const { user } = useAuth();
  const {
    conversationsArray,
    openConversation,
  } = useChat();

  if (!user) return null; 

  if (!conversationsArray.length) return null; 

  return (
    <>
      <div style={sx.iconBar}>
        {conversationsArray.map((c) => (
          <div
            key={c.userId}
            style={sx.icon}
            title={c.userName}
            onClick={() => openConversation(c.userId)}
          >
            {c.userName?.charAt(0)?.toUpperCase() || "?"}
          </div>
        ))}
      </div>
      {conversationsArray
        .filter((c) => c.isOpen)
        .map((c, idx) => (
          <div
            key={c.userId}
            style={{
              position: "fixed",
              bottom: 90,
              right: 20 + idx * 340, 
              zIndex: 9999,
            }}
          >
            <ChatWindow otherUserId={c.userId} userName={c.userName} />
          </div>
        ))}
    </>
  );
}

const sx = {
  iconBar: {
    position: "fixed",
    bottom: 20,

    right: "10%",
    transform: "translateX(50%)",

    display: "flex",
    gap: 12,
    zIndex: 9998,
  },

  icon: {
    width: 44,
    height: 44,
    borderRadius: "999px",
    background: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    fontSize: 18,
  },
};
