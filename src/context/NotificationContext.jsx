import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("eventghar_token");

  const loadNotifications = async () => {
    if (!token) return;
    const res = await fetch("http://localhost:5001/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(await res.json());
  };

  const markRead = async (id) => {
    await fetch(
      `http://localhost:5001/api/notifications/${id}/read`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    loadNotifications();
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, markRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationContext);
