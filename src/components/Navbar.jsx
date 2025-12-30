import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import "../assets/css/Navbar.css";
import EventGharLogo from "../assets/logo.png";

const Navbar = ({ searchTerm = "", setSearchTerm = () => {}, onEventsClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const { notifications, unreadCount, markAsRead } = useNotifications();

  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [active, setActive] = useState("Home");

  const user = JSON.parse(localStorage.getItem("eventghar_user"));
  const isLoggedIn = !!localStorage.getItem("eventghar_token");

  useEffect(() => {
    if (location.pathname === "/") setActive("Home");
    else if (location.pathname === "/contact") setActive("Contact Us");
    else if (location.pathname === "/my-bookings") setActive("My Bookings");
  }, [location.pathname]);

  const handleEventsClick = (e) => {
    e.preventDefault();
    setActive("Events");
    navigate("/");
    setTimeout(() => onEventsClick && onEventsClick(), 120);
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const navLinks = ["Home", "Events", "Contact Us", "My Bookings"];

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        <img
          src={EventGharLogo}
          className="navbar-logo-img"
          onClick={() => navigate("/")}
        />

        <div className="navbar-links">
          {navLinks.map((label) => (
            <a
              key={label}
              href="/"
              className={`navbar-link ${active === label ? "active" : ""}`}
              onClick={(e) => {
                if (label === "Events") return handleEventsClick(e);
                e.preventDefault();
                setActive(label);
                navigate(
                  label === "Home"
                    ? "/"
                    : label === "Contact Us"
                    ? "/contact"
                    : "/my-bookings"
                );
              }}
            >
              {label}
              <span className="nav-underline" />
            </a>
          ))}
        </div>

        <div className="navbar-actions">
          {/* 🔔 NOTIFICATIONS */}
          <div className="navbar-user" ref={dropdownRef}>
            <button
              className="navbar-notification-btn"
              onClick={() => setNotifOpen((p) => !p)}
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {notifOpen && (
              <div className="user-dropdown">
                {notifications.length === 0 && (
                  <p className="user-name">No notifications</p>
                )}

                {notifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => {
                      markAsRead(n._id);
                      navigate(n.link);
                      setNotifOpen(false);
                    }}
                    style={{
                      fontWeight: n.read ? "normal" : "700",
                    }}
                  >
                    {n.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            className="navbar-search-box"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="navbar-host-button"
            onClick={() => navigate("/host")}
          >
            Host an Event
          </button>

          {/* 👤 USER */}
          <div className="navbar-user" ref={dropdownRef}>
            <span className="navbar-icon" onClick={() => setOpen(!open)}>
              👤
            </span>

            {open && (
              <div className="user-dropdown">
                <p className="user-name">{user?.fullName}</p>
                <button onClick={() => navigate("/profile")}>My Profile</button>
                <button onClick={() => navigate("/my-bookings")}>
                  My Bookings
                </button>
                <button
                  className="logout"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                    window.location.reload();
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
