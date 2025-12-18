import React from "react";
import "../assets/css/Navbar.css";
import EventGharLogo from "../assets/logo.png";

const Navbar = ({
  searchTerm = "",
  setSearchTerm = () => {},
  onEventsClick,
}) => {
  const navLinks = ["Home", "Events", "Contact Us", "My Bookings"];

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* LOGO */}
        <img
          src={EventGharLogo}
          alt="Event Ghar Logo"
          className="navbar-logo-img"
        />

        {/* LINKS */}
        <div className="navbar-links">
          {navLinks.map((link) =>
            link === "Events" && onEventsClick ? (
              <a
                key={link}
                href="#"
                className="navbar-link"
                onClick={(e) => {
                  e.preventDefault();
                  onEventsClick();
                }}
              >
                {link}
              </a>
            ) : (
              <a key={link} href="#" className="navbar-link">
                {link}
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
            onClick={() => window.location.href = "/host"}
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
