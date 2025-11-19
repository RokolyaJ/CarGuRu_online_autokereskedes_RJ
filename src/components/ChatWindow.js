import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

export default function ChatWindow({ otherUserId, userName }) {
  const { user, token } = useAuth();
  const { minimizeConversation, closeConversation } = useChat();

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);

  const apiBase = "http://localhost:8080";

  const loadConversation = async () => {
    if (!token || !otherUserId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${apiBase}/api/messages/conversation/${otherUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data || []);
    } catch (e) {
      console.error("Hiba a beszélgetés lekérésénél:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  loadConversation();

  const interval = setInterval(() => {
    loadConversation();
  }, 2000);

  return () => clearInterval(interval);
}, [otherUserId, token]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!msg.trim() || !token || !otherUserId) return;
    try {
      const res = await axios.post(
        `${apiBase}/api/messages/send`,
        msg,
        {
          params: { receiverId: otherUserId },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
        }
      );
      setMessages((prev) => [...prev, res.data]);
      setMsg("");
    } catch (e) {
      console.error("Hiba üzenet küldéskor:", e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={sx.popup}>
      <div style={sx.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={sx.avatar}>{userName?.charAt(0)?.toUpperCase() || "?"}</div>
          <div>
            <div style={{ fontWeight: 600 }}>{userName || "Ismeretlen"}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Üzenetek</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            style={sx.headerBtn}
            title="Minimalizálás"
            onClick={() => minimizeConversation(otherUserId)}
          >
            ▽
          </button>
          <button
            style={sx.headerBtn}
            title="Bezárás"
            onClick={() => closeConversation(otherUserId)}
          >
            ✕
          </button>
        </div>
      </div>

      <div style={sx.messages} ref={scrollRef}>
        {loading ? (
          <div style={{ fontSize: 13, color: "#6b7280" }}>Betöltés...</div>
        ) : messages.length === 0 ? (
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Még nincsenek üzenetek. Írj egyet az eladónak!
          </div>
        ) : (
          messages.map((m) => {
            const fromMe = m.sender?.id === user?.id;
            return (
              <div
                key={m.id}
                style={{
                  ...sx.msgBubble,
                  alignSelf: fromMe ? "flex-end" : "flex-start",
                  background: fromMe ? "#3b82f6" : "#e5e7eb",
                  color: fromMe ? "white" : "black",
                }}
              >
                {m.content}
              </div>
            );
          })
        )}
      </div>

      <div style={sx.inputRow}>
        <textarea
          style={sx.input}
          placeholder="Írj üzenetet..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button style={sx.sendBtn} onClick={sendMessage}>
          Vissza!
        </button>
      </div>
    </div>
  );
}

const sx = {
  popup: {
    position: "fixed",
    bottom: 90,
    right: 20,
    width: 320,
    height: 400,
    background: "white",
    boxShadow: "0 4px 18px rgba(0,0,0,0.3)",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  header: {
    padding: "8px 10px",
    background: "#0f172a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: "999px",
    background: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 700,
  },
  headerBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: 14,
  },
  messages: {
    flex: 1,
    padding: "8px 10px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    overflowY: "auto",
    background: "#f3f4f6",
  },
  msgBubble: {
    maxWidth: "80%",
    padding: "6px 10px",
    borderRadius: 14,
    fontSize: 13,
    lineHeight: 1.4,
  },
  inputRow: {
    padding: 8,
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: 6,
  },
  input: {
    flex: 1,
    resize: "none",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    padding: "6px 8px",
    fontSize: 13,
    outline: "none",
  },
  sendBtn: {
    borderRadius: 10,
    border: "none",
    padding: "6px 10px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
};
