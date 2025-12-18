import React, { useEffect, useState } from "react";
import "../assets/css/FeaturedList.css"; // ✅ RELATIVE PATH

const FeaturedManager = () => {
  const [events, setEvents] = useState([]);

  const load = async () => {
    const res = await fetch("http://127.0.0.1:5001/api/featured-events");
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id) => {
    await fetch(`http://127.0.0.1:5001/api/featured-events/${id}/toggle`, {
      method: "PATCH",
    });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete featured event?")) return;
    await fetch(`http://127.0.0.1:5001/api/featured-events/${id}`, {
      method: "DELETE",
    });
    load();
  };

  return (
    <div className="featured-card">
      <h3 className="card-title">Featured Events</h3>
      <div className="featured-divider" />

      {events.length === 0 && (
        <div className="featured-empty">No featured events yet.</div>
      )}

      {events.map((e) => (
        <div key={e._id} className="featured-row">
          <div className="featured-info">
            <span className="featured-title">{e.title}</span>
            <span className="featured-date">
              {new Date(e.eventDateTime).toLocaleString()}
            </span>
          </div>

          <div className="featured-actions">
            <button className="featured-btn toggle" onClick={() => toggle(e._id)}>
              {e.isActive ? "Disable" : "Enable"}
            </button>
            <button className="featured-btn delete" onClick={() => remove(e._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedManager;
