import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { user, token } = useAuth();

  const [conversations, setConversations] = useState({});
  const [hiddenUsers, setHiddenUsers] = useState(new Set());
  const [lastMessages, setLastMessages] = useState({});
  const processMessages = useCallback(
    (msgs) => {
      const base = {};

      msgs.forEach((m) => {
        const other = m.sender.id === user.id ? m.receiver : m.sender;
        if (!other) return;

        setLastMessages((prev) => {
          if (prev[other.id] === m.id) return prev;
          return { ...prev, [other.id]: m.id };
        });

        if (hiddenUsers.has(other.id)) return;

        if (!base[other.id]) {
          base[other.id] = {
            userId: other.id,
            userName: other.fullName || other.email,
            isOpen: false,
            minimized: true,
            hasUnread: true,
          };
        }
      });

      setConversations((prev) => {
        const merged = { ...base };
        for (const [id, oldConv] of Object.entries(prev)) {
          merged[id] = { ...merged[id], ...oldConv };
        }
        return merged;
      });
    },
    [user, hiddenUsers]
  );

  useEffect(() => {
    if (!user || !token) return;

    let cancelled = false;

    const loadMessages = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/messages/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cancelled) {
          processMessages(res.data || []);
        }
      } catch (e) {
        console.error(" /api/messages/mine hiba:", e);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 8000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user, token, processMessages]);

  const startChatWithUser = useCallback(({ userId, name }) => {
    if (!userId) return;

    setHiddenUsers((prev) => {
      const copy = new Set(prev);
      copy.delete(userId);
      return copy;
    });

    setConversations((prev) => ({
      ...prev,
      [userId]: {
        userId,
        userName: name || "Ismeretlen",
        isOpen: true,
        minimized: false,
        hasUnread: false,
        ...(prev[userId] || {}),
      },
    }));
  }, []);

  const openConversation = useCallback((userId) => {
    setHiddenUsers((prev) => {
      const copy = new Set(prev);
      copy.delete(userId);
      return copy;
    });

    setConversations((prev) => {
      const conv = prev[userId];
      if (!conv) return prev;

      return {
        ...prev,
        [userId]: { ...conv, isOpen: true, minimized: false, hasUnread: false },
      };
    });
  }, []);

  const minimizeConversation = useCallback((userId) => {
    setConversations((prev) => {
      const conv = prev[userId];
      if (!conv) return prev;

      return {
        ...prev,
        [userId]: { ...conv, isOpen: false, minimized: true },
      };
    });
  }, []);

  const closeConversation = useCallback((userId) => {
    setHiddenUsers((prev) => {
      const copy = new Set(prev);
      copy.add(userId);
      return copy;
    });

    setConversations((prev) => {
      const copy = { ...prev };
      delete copy[userId];
      return copy;
    });
  }, []);
  return (
    <ChatContext.Provider
      value={{
        conversations,
        conversationsArray: Object.values(conversations),
        startChatWithUser,
        openConversation,
        minimizeConversation,
        closeConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat csak ChatProvider-en belül használható!");
  return ctx;
}
