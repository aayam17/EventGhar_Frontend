import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Navbar.css";
import EventGharLogo from "../assets/logo.png";

const Navbar = ({
  searchTerm = "",
  setSearchTerm = () => {},
  onEventsClick,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const user = JSON.parse(localStorage.getItem("eventghar_user"));
  const isLoggedIn = !!localStorage.getItem("eventghar_token");

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Events", path: "/events" },
    { label: "Contact Us", path: "/contact" },
    { label: "My Bookings", path: "/my-bookings" },
  ];

  const handleNav = (e, path) => {
    e.preventDefault();
    navigate(path);
    setOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* LOGO */}
        <img
          src={EventGharLogo}
          alt="Event Ghar Logo"
          className="navbar-logo-img"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

        {/* LINKS */}
        <div className="navbar-links">
          {navLinks.map((link) =>
            link.label === "Events" && onEventsClick ? (
              <a
                key={link.label}
                href="/events"
                className="navbar-link"
                onClick={(e) => {
                  e.preventDefault();
                  onEventsClick();
                }}
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.path}
                className="navbar-link"
                onClick={(e) => handleNav(e, link.path)}
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* ACTIONS */}
        <div className="navbar-actions">
          <input
            type="text"
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

          {/* USER ICON */}
          <div className="navbar-user" ref={dropdownRef}>
            <span
              className="navbar-icon"
              onClick={() => setOpen(!open)}
            >
              👤
            </span>

            {open && (
              <div className="user-dropdown">
                {isLoggedIn ? (
                  <>
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
                  </>
                ) : (
                  <button onClick={() => navigate("/login")}>
                    Login / Sign Up
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
