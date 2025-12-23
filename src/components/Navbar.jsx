import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/css/Navbar.css";
import EventGharLogo from "../assets/logo.png";

const Navbar = ({
  searchTerm = "",
  setSearchTerm = () => {},
  onEventsClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("eventghar_user"));
  const isLoggedIn = !!localStorage.getItem("eventghar_token");

  /* ================= ACTIVE LINK TRACKING ================= */
  useEffect(() => {
    if (location.pathname === "/") setActive("Home");
    else if (location.pathname === "/contact") setActive("Contact Us");
    else if (location.pathname === "/my-bookings") setActive("My Bookings");
  }, [location.pathname]);

  /* ================= EVENTS CLICK ================= */
  const handleEventsClick = (e) => {
    e.preventDefault();
    setActive("Events");
    navigate("/");

    setTimeout(() => {
      if (onEventsClick) onEventsClick();
    }, 120);
  };

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () =>
      document.removeEventListener("mousedown", handleOutside);
  }, []);

  const logout = () => {
    localStorage.clear();
    setOpen(false);
    navigate("/");
    window.location.reload();
  };

  const navLinks = ["Home", "Events", "Contact Us", "My Bookings"];

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* LOGO */}
        <img
          src={EventGharLogo}
          alt="Event Ghar Logo"
          className="navbar-logo-img"
          onClick={() => {
            setActive("Home");
            navigate("/");
          }}
        />

        {/* LINKS */}
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

        {/* ACTIONS */}
        <div className="navbar-actions">
          {/* 🔔 NOTIFICATIONS */}
          <button
            className="navbar-notification-btn"
            aria-label="Notifications"
          >
            🔔
          </button>

          {/* SEARCH */}
          <input
            type="text"
            className="navbar-search-box"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* HOST */}
          <button
            className="navbar-host-button"
            onClick={() => navigate("/host")}
          >
            Host an Event
          </button>

          {/* 👤 USER PROFILE */}
          <div className="navbar-user" ref={dropdownRef}>
            <span
              className="navbar-icon"
              onClick={() => {
                if (!isLoggedIn) return;
                setOpen((prev) => !prev);
              }}
            >
              👤
            </span>

            {open && isLoggedIn && (
              <div className="user-dropdown">
                <p className="user-name">
                  {user?.fullName || "My Account"}
                </p>

                <button onClick={() => navigate("/profile")}>
                  My Profile
                </button>

                <button onClick={() => navigate("/my-bookings")}>
                  My Bookings
                </button>

                <button className="logout" onClick={logout}>
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
