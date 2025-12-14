import React, { useState, useEffect } from "react";
import "../assets/css/Dashboard.css";

/* ---------------- ASSETS ---------------- */
import EventGharLogo from "../assets/logo.png";
import FooterImage from "../assets/footer.png";

/* =====================================================
   COUNTDOWN HELPER (SAFE)
===================================================== */
const getCountdownTime = (targetDate) => {
  const diff = +new Date(targetDate) - +new Date();

  if (isNaN(diff) || diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

/* =====================================================
   NAVBAR
===================================================== */
const Navbar = () => (
  <nav className="navbar-container">
    <img src={EventGharLogo} className="navbar-logo-img" alt="logo" />

    <div className="navbar-links">
      {["Home", "Events", "Contact Us", "My Bookings"].map((link) => (
        <a key={link} href="#" className="navbar-link">
          {link}
        </a>
      ))}
    </div>

    <div className="navbar-actions">
      <input className="navbar-search-box" placeholder="Search here" />
      <button className="navbar-host-button">Host an Event</button>
      <span className="navbar-icon user-icon">👤</span>
    </div>
  </nav>
);

/* =====================================================
   FEATURED EVENTS SLIDER (ROBUST & SAFE)
===================================================== */
const FeaturedEventsSlider = () => {
  const [events, setEvents] = useState([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  /* FETCH FEATURED EVENTS */
  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/featured-events")
      .then((res) => res.json())
      .then((data) => {
        // Extra frontend safety (auto-hide expired)
        const now = new Date();
        const valid = data.filter(
          (e) =>
            !e.expiryDate || new Date(e.expiryDate) > now
        );
        setEvents(valid);
      })
      .catch(() => setEvents([]));
  }, []);

  /* COUNTDOWN TIMER */
  useEffect(() => {
    if (!events.length) return;

    const updateTimer = () =>
      setTimeLeft(
        getCountdownTime(events[index].eventDateTime)
      );

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [events, index]);

  /* AUTO SLIDE */
  useEffect(() => {
    if (events.length <= 1) return;

    const auto = setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length);
    }, 6000);

    return () => clearInterval(auto);
  }, [events]);

  if (!events.length || !timeLeft) return null;

  const event = events[index];

  return (
    <div className="hero-section-wrapper">
      <img
        src={event.imageSrc}
        className="hero-image-overlay-img"
        alt={event.title}
      />

      <div className="hero-container">
        <div className="hero-content">
          <h2 className="hero-title">{event.title}</h2>
          <p className="hero-package-detail">{event.subtitle}</p>
          <p className="hero-info-text-location">{event.venue}</p>

          <div className="hero-timer-row">
            {Object.entries(timeLeft).map(([key, val]) => (
              <div key={key} className="hero-timer-box">
                <div className="hero-timer-value">{val}</div>
                <div className="hero-timer-label">{key}</div>
              </div>
            ))}
          </div>

          <div className="hero-button-row">
            <button className="hero-view-details-button">
              VIEW DETAILS
            </button>
            <button className="hero-buy-ticket-button" disabled>
              BUY TICKET
            </button>
          </div>
        </div>

        <div className="slider-indicators">
          {events.map((_, i) => (
            <span
              key={i}
              className={`indicator ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* =====================================================
   EVENT CARD (TRENDING)
===================================================== */
const EventCard = ({ event }) => (
  <div className="event-card-container">
    <div className="image-wrapper">
      <img
        src={event.imageSrc}
        alt={event.title}
        className="event-card-image"
      />
    </div>

    <div className="card-details">
      <p className="event-card-title">{event.title}</p>

      <div className="date-price-row">
        <span className="date-text">🗓 {event.formattedDate}</span>
        <span className="price-text">
          Rs {event.price.toLocaleString()}
        </span>
      </div>

      <p className="package-info">
        Packages: {event.packages || "Standard"}
      </p>

      <button className="buy-button">BUY</button>
    </div>
  </div>
);

/* =====================================================
   TRENDING EVENTS
===================================================== */
const TrendingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/events")
      .then((res) => res.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  return (
    <section className="trending-events-section">
      <div className="trending-header">
        <h2 className="trending-title">Trending Events</h2>
      </div>

      <div className="events-grid">
        {events.length === 0 && <p>No events added yet.</p>}
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </section>
  );
};

/* =====================================================
   FOOTER
===================================================== */
const Footer = () => (
  <footer className="footer-image-container">
    <img src={FooterImage} className="footer-image" alt="footer" />
  </footer>
);

/* =====================================================
   ADMIN SWITCH
===================================================== */
const AdminSwitchButton = () => (
  <a href="/admin" className="admin-switch-btn-link">
    <button className="admin-switch-btn">🔑 Admin Panel</button>
  </a>
);

/* =====================================================
   MAIN DASHBOARD EXPORT
===================================================== */
const Dashboard = () => (
  <div className="app-container">
    <Navbar />

    <main className="main-content">
      {/* 🔥 FEATURED EVENTS (ABOVE TRENDING) */}
      <FeaturedEventsSlider />

      {/* 🔥 TRENDING EVENTS */}
      <TrendingEvents />
    </main>

    <Footer />
    <AdminSwitchButton />
  </div>
);

export default Dashboard;
