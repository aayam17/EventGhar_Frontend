import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Dashboard.css";
import Navbar from "../components/Navbar";

/* =====================================================
   COUNTDOWN HELPER
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
   FEATURED EVENTS SLIDER
===================================================== */
const FeaturedEventsSlider = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/featured-events")
      .then((res) => res.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    if (!events.length) return;

    const updateTimer = () =>
      setTimeLeft(getCountdownTime(events[currentIndex].eventDateTime));

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [events, currentIndex]);

  useEffect(() => {
    if (events.length <= 1) return;
    const autoSlide = setInterval(
      () => setCurrentIndex((i) => (i + 1) % events.length),
      6000
    );
    return () => clearInterval(autoSlide);
  }, [events]);

  if (!events.length || !timeLeft) return null;
  const event = events[currentIndex];

  return (
    <section className="hero-section-wrapper">
      <img src={event.imageSrc} alt={event.title} className="hero-image-overlay-img" />
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">{event.title}</h1>
          <p className="hero-package-detail">{event.subtitle}</p>
          <p className="hero-info-text-location">{event.venue}</p>

          <div className="hero-timer-row">
            {Object.entries(timeLeft).map(([label, value]) => (
              <div key={label} className="hero-timer-box">
                <div className="hero-timer-value">{value}</div>
                <div className="hero-timer-label">{label}</div>
              </div>
            ))}
          </div>

          <div className="hero-button-row">
            <button className="hero-view-details-button">VIEW DETAILS</button>
            <button className="hero-buy-ticket-button" disabled>BUY TICKET</button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================
   EVENT CARD
===================================================== */
const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const isExpired = new Date(event.eventDateTime) < new Date();

  return (
    <div className="event-card-container">
      <div className="image-wrapper">
        <img src={event.imageSrc} alt={event.title} className="event-card-image" />
      </div>

      <div className="card-details">
        <p className="event-card-title">{event.title}</p>

        <div className="date-price-row">
          <span>🗓 {event.formattedDate}</span>
          <span>Rs {event.price.toLocaleString()}</span>
        </div>

        <p className="package-info">
          Packages: {event.packages || "Standard"}
        </p>

        <button
          className="buy-button"
          disabled={isExpired}
          onClick={() => navigate(`/events/${event._id}`)}
        >
          {isExpired ? "EXPIRED" : "BUY"}
        </button>
      </div>
    </div>
  );
};

/* =====================================================
   TRENDING EVENTS
===================================================== */
const TrendingEvents = React.forwardRef(
  ({ searchTerm, priceRange, setPriceRange, showSnack }, ref) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
      fetch("http://127.0.0.1:5001/api/events")
        .then((res) => res.json())
        .then(setEvents)
        .catch(() => setEvents([]));
    }, []);

    const filteredEvents = events.filter((event) => {
      const matchSearch =
        searchTerm.length < 3 ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPrice =
        event.price >= priceRange[0] &&
        event.price <= priceRange[1];

      return matchSearch && matchPrice;
    });

    return (
      <section ref={ref} className="trending-events-section">
        <div className="trending-header">
          <h2 className="trending-title">Trending Events</h2>

          <div className="price-filter">
            <span className="price-label">
              Max Price: <strong>Rs {priceRange[1]}</strong>
            </span>

            <input
              type="range"
              min="0"
              max="2000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceRange([0, val]);
                showSnack(`Showing events under Rs ${val}`, "info");
              }}
              className="price-slider"
            />
          </div>
        </div>

        <div className="events-grid">
          {filteredEvents.length === 0 && (
            <div className="empty-state">
              <h3>No events found 😕</h3>
              <p>Try adjusting your search or price range</p>
            </div>
          )}

          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>
    );
  }
);

/* =====================================================
   MAIN DASHBOARD
===================================================== */
const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [snack, setSnack] = useState(null);
  const trendingRef = useRef(null);

  const showSnack = (message, type = "info") => {
    setSnack({ message, type });
    setTimeout(() => setSnack(null), 3500);
  };

  useEffect(() => {
    if (searchTerm && searchTerm.length < 3) {
      showSnack("Type at least 3 characters to search", "warning");
    }
  }, [searchTerm]);

  const handleEventsClick = () => {
    trendingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app-container">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEventsClick={handleEventsClick}
      />

      <main className="main-content">
        <FeaturedEventsSlider />
        <TrendingEvents
          ref={trendingRef}
          searchTerm={searchTerm}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          showSnack={showSnack}
        />
      </main>

      {snack && (
        <div className={`snackbar ${snack.type}`}>
          {snack.message}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
