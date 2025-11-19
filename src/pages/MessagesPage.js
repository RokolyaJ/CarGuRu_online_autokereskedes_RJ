import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export default function MessagesPage() {
  const { user, token } = useAuth();

  const [loadingList, setLoadingList] = useState(true);
  const [loadingConv, setLoadingConv] = useState(false);

  const [conversations, setConversations] = useState([]); 
  const [activeUserId, setActiveUserId] = useState(null);
  const [messages, setMessages] = useState([]);          
  const [input, setInput] = useState("");
  const [error, setError] = useState("");


  const meId = user?.id;
const activeUser = conversations.find(c => c.user.id === activeUserId)?.user || null;


  const loadConversations = async () => {
    if (!token || !user) return;

    try {
      setError("");
      setLoadingList(true);

      const res = await api.get("/api/messages/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const msgs = res.data || [];
      const map = new Map();

      msgs.forEach((m) => {
        const other = m.sender.id === meId ? m.receiver : m.sender;
        const existing = map.get(other.id);

        if (
          !existing ||
          new Date(m.timestamp) > new Date(existing.lastMessage.timestamp)
        ) {
          map.set(other.id, { user: other, lastMessage: m });
        }
      });

      const list = Array.from(map.values()).sort(
        (a, b) =>
          new Date(b.lastMessage.timestamp) -
          new Date(a.lastMessage.timestamp)
      );

setConversations(prev => {
  const prevIds = prev.map(p => p.user.id).join(",");
  const newIds = list.map(p => p.user.id).join(",");

  if (prevIds === newIds) return prev; 

  return list;
});


      

    } catch (err) {
      console.error("Hiba az üzenet listánál:", err);
      setError("Nem sikerült betölteni az üzeneteket.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (!token || !user) return;

    loadConversations();

    const interval = setInterval(loadConversations, 2000);

    return () => clearInterval(interval);
  }, [token, user]);

  const loadActiveConversation = async () => {
if (!activeUserId || !token || !user) return;

    try {
      setError("");
      setLoadingConv(true);

      const res = await api.get(`/api/messages/conversation/${activeUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages(res.data || []);
    } catch (err) {
      console.error("Hiba a beszélgetés lekérésénél:", err);
      setError("Nem sikerült betölteni a beszélgetést.");
    } finally {
      setLoadingConv(false);
    }
  };
useEffect(() => {
  if (conversations.length > 0 && activeUserId === null) {
    setActiveUserId(conversations[0].user.id);
  }
}, [conversations]);

  useEffect(() => {
    if (!activeUserId || !token || !user) return;

    loadActiveConversation();

    const interval = setInterval(loadActiveConversation, 2000);
    return () => clearInterval(interval);
}, [activeUserId, token, user]);

  const handleSend = async () => {
    if (!input.trim() || !activeUser) return;

    try {
      const res = await api.post(
        "/api/messages/send",
        input,
        {
params: { receiverId: activeUserId },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
        }
      );
      setMessages((prev) => [...prev, res.data]);
      setInput("");
      loadActiveConversation();
      loadConversations();
    } catch (err) {
      console.error("Hiba küldésnél:", err);
      setError("Nem sikerült elküldeni az üzenetet.");
    }
  };

  return (
    <div style={sx.page}>
      <h1 style={sx.title}>Üzeneteim</h1>

      {error && <div style={sx.error}>{error}</div>}

      <div style={sx.layout}>
        <div style={sx.sidebar}>
          <div style={sx.sidebarHeader}>Beszélgetések</div>

          {loadingList && <div style={sx.info}>Betöltés...</div>}

          {!loadingList && conversations.length === 0 && (
            <div style={sx.info}>
              Még nincs egyetlen beszélgetésed sem.
            </div>
          )}

          {!loadingList &&
            conversations.map(({ user: partner, lastMessage }) => (
              <button
                key={partner.id}
                style={{
                  ...sx.partnerItem,
                  backgroundColor:
                    activeUser?.id === partner.id ? "#e0f2fe" : "transparent",
                }}
                onClick={() => setActiveUserId(partner.id)}

              >
                <div style={sx.avatar}>
                  {partner.fullName?.charAt(0)?.toUpperCase() ||
                    partner.email?.charAt(0)?.toUpperCase() ||
                    "?"}
                </div>
                <div style={sx.partnerText}>
                  <div style={sx.partnerName}>
                    {partner.fullName || partner.email}
                  </div>
                  <div style={sx.lastMessage}>
                    {lastMessage.content.slice(0, 40)}
                    {lastMessage.content.length > 40 ? "…" : ""}
                  </div>
                </div>
              </button>
            ))}
        </div>
        <div style={sx.chatArea}>
          {!activeUser && (
            <div style={sx.info}>
              Válassz egy beszélgetést a bal oldali listából.
            </div>
          )}

          {activeUser && (
            <>
              <div style={sx.chatHeader}>
                <div style={sx.chatHeaderLeft}>
                  <div style={sx.avatarBig}>
                    {activeUser.fullName?.charAt(0)?.toUpperCase() ||
                      activeUser.email?.charAt(0)?.toUpperCase() ||
                      "?"}
                  </div>
                  <div>
                    <div style={sx.chatName}>
                      {activeUser.fullName || activeUser.email}
                    </div>
                    <div style={sx.chatSub}>Beszélgetés</div>
                  </div>
                </div>
              </div>

              <div style={sx.messagesBox}>
                {loadingConv ? (
                  <div style={sx.info}>Beszélgetés betöltése...</div>
                ) : messages.length === 0 ? (
                  <div style={sx.info}>
                    Még nincs üzenet ebben a beszélgetésben. Írj elsőként!
                  </div>
                ) : (
                  messages.map((m) => {
                    const mine = m.sender.id === meId;
                    return (
                      <div
                        key={m.id}
                        style={{
                          ...sx.msgRow,
                          justifyContent: mine ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            ...sx.msgBubble,
                            backgroundColor: mine ? "#2563eb" : "#e5e7eb",
                            color: mine ? "white" : "black",
                          }}
                        >
                          {m.content}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={sx.inputRow}>
                <input
                  style={sx.input}
                  placeholder="Írj üzenetet..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button style={sx.sendBtn} onClick={handleSend}>
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
const sx = {
  page: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "90px 20px 40px",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#0f172a",
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 16,
  },
  error: {
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "8px 12px",
    borderRadius: 8,
    marginBottom: 12,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 16,
    minHeight: 480,
  },
  info: {
    padding: 16,
    color: "#6b7280",
    fontSize: 14,
  },
  sidebar: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
  },
  sidebarHeader: {
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: 700,
    fontSize: 14,
    background: "#f9fafb",
  },
  partnerItem: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: "none",
    borderBottom: "1px solid #e5e7eb",
    padding: "8px 10px",
    cursor: "pointer",
    textAlign: "left",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: "#1d4ed8",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 16,
  },
  partnerText: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  partnerName: {
    fontSize: 14,
    fontWeight: 600,
  },
  lastMessage: {
    fontSize: 12,
    color: "#6b7280",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },

  chatArea: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    padding: "10px 14px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#0f172a",
    color: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  chatHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatarBig: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    backgroundColor: "#1d4ed8",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
  },
  chatName: {
    fontSize: 15,
    fontWeight: 700,
  },
  chatSub: {
    fontSize: 12,
    opacity: 0.8,
  },
  messagesBox: {
    flex: 1,
    padding: "12px 14px",
    overflowY: "auto",
    background: "#f3f4f6",
  },
  msgRow: {
    display: "flex",
    marginBottom: 6,
  },
  msgBubble: {
    maxWidth: "65%",
    padding: "8px 10px",
    borderRadius: 16,
    fontSize: 14,
  },
  inputRow: {
    padding: "8px 10px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: 8,
    background: "white",
  },
  input: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    fontSize: 14,
    outline: "none",
  },
  sendBtn: {
    borderRadius: 999,
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: 16,
  },
};
