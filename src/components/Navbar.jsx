import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Navbar.css";
import EventGharLogo from "../assets/logo.png";

const Navbar = ({
  searchTerm = "",
  setSearchTerm = () => {},
  onEventsClick,
}) => {
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Events", path: "/events" },
    { label: "Contact Us", path: "/contact" },
    { label: "My Bookings", path: "/my-bookings" },
  ];

  const handleNav = (e, path) => {
    e.preventDefault();
    navigate(path);
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

          <span className="navbar-icon">👤</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
