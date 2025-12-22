import React, { useEffect, useState } from "react";
import "../assets/css/FeaturedHero.css";

/* ===============================
   COUNTDOWN HELPER
================================ */
const getCountdownTime = (date) => {
  const diff = new Date(date) - new Date();
  if (diff <= 0) return {};

  return {
    Days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    Hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    Minutes: Math.floor((diff / (1000 * 60)) % 60),
    Seconds: Math.floor((diff / 1000) % 60),
  };
};

const FeaturedEventsSlider = () => {
  const [events, setEvents] = useState([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/featured-events")
      .then((res) => res.json())
      .then((data) =>
        setEvents(
          Array.isArray(data)
            ? data.filter((e) => e.isActive)
            : []
        )
      );
  }, []);

  useEffect(() => {
    if (!events.length) return;
    const timer = setInterval(() => {
      setTimeLeft(
        getCountdownTime(events[index].eventDateTime)
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [events, index]);

  if (!events.length) return null;
  const event = events[index];

  return (
    <section className="hero-section-wrapper">
      <img
        src={event.imageSrc}
        alt={event.title}
        className="hero-image-overlay-img"
      />

      <div className="hero-dark-overlay" />

      <div className="hero-container">
        <h2 className="hero-title">{event.title}</h2>

        {event.subtitle && (
          <p className="hero-package-detail">
            {event.subtitle}
          </p>
        )}

        {event.venue && (
          <p className="hero-venue">
            📍 {event.venue}
          </p>
        )}

        {/* COUNTDOWN */}
        {Object.keys(timeLeft).length > 0 && (
          <div className="hero-timer-row">
            {Object.entries(timeLeft).map(([k, v]) => (
              <div key={k} className="hero-timer-box">
                <div className="hero-timer-value">{v}</div>
                <div className="hero-timer-label">{k}</div>
              </div>
            ))}
          </div>
        )}

        {/* INDICATORS */}
        {events.length > 1 && (
          <div className="slider-indicators">
            {events.map((_, i) => (
              <span
                key={i}
                className={`indicator ${
                  i === index ? "active" : ""
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEventsSlider;
