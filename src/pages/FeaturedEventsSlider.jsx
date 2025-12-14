import React, { useEffect, useState } from "react";

const FeaturedEventsSlider = () => {
  const [events, setEvents] = useState([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/featured-events")
      .then(res => res.json())
      .then(setEvents);
  }, []);

  useEffect(() => {
    if (!events.length) return;
    const timer = setInterval(() => {
      setTimeLeft(getCountdownTime(events[index].eventDateTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [events, index]);

  if (!events.length) return null;
  const event = events[index];

  return (
    <section className="hero-section-wrapper">
      <img src={event.imageSrc} className="hero-image-overlay-img" />

      <div className="hero-container">
        <h2 className="hero-title">{event.title}</h2>
        <p className="hero-package-detail">{event.subtitle}</p>
        <p>{event.venue}</p>

        <div className="hero-timer-row">
          {Object.entries(timeLeft).map(([k,v])=>(
            <div key={k} className="hero-timer-box">
              <div className="hero-timer-value">{v}</div>
              <div className="hero-timer-label">{k}</div>
            </div>
          ))}
        </div>

        <div className="hero-button-row">
          <button className="hero-view-details-button">VIEW DETAILS</button>
          <button className="hero-buy-ticket-button" disabled>
            BUY TICKET
          </button>
        </div>

        <div className="slider-indicators">
          {events.map((_,i)=>(
            <span key={i}
              className={`indicator ${i===index?"active":""}`}
              onClick={()=>setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventsSlider;
