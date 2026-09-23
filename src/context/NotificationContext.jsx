import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, userHeaders } from "../lib/api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = useCallback(async () => {
    const token = localStorage.getItem("eventghar_token");
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      const res = await fetch(api("/api/notifications"), {
        headers: userHeaders(false),
      });
      if (!res.ok) return setNotifications([]);
      setNotifications(await res.json());
    } catch {
      setNotifications([]);
    }
  }, []);

  const markAsRead = async (id) => {
    const token = localStorage.getItem("eventghar_token");
    if (!token) return;

    try {
      await fetch(api(`/api/notifications/${id}/read`), {
        method: "POST",
        headers: userHeaders(false),
      });
    } finally {
      loadNotifications();
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("eventghar_token");
    if (!token) return;

    try {
      await fetch(api("/api/notifications/read-all"), {
        method: "POST",
        headers: userHeaders(false),
      });
    } finally {
      loadNotifications();
    }
  };

  useEffect(() => {
    loadNotifications();
    // Pick up notifications shortly after login/logout without a full refresh
    const interval = setInterval(loadNotifications, 30000);
    window.addEventListener("storage", loadNotifications);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", loadNotifications);
    };
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, refresh: loadNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
