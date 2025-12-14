import React, { useEffect, useState } from "react";
import "/Users/aayambhattarai/EventGhar/frontend/frontend/src/assets/css/FeaturedList.css"

const FeaturedList = () => {
  const [events, setEvents] = useState([]);

  const fetchFeatured = () => {
    fetch("http://127.0.0.1:5001/api/featured-events")
      .then((res) => res.json())
      .then(setEvents);
  };

  useEffect(fetchFeatured, []);

  const toggleActive = async (id, isActive) => {
    await fetch(`http://127.0.0.1:5001/api/featured-events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchFeatured();
  };

  const remove = async (id) => {
    await fetch(`http://127.0.0.1:5001/api/featured-events/${id}`, {
      method: "DELETE",
    });
    fetchFeatured();
  };

  return (
    <div className="analytics-card">
      <h3 className="card-title">Featured Events</h3>

      {events.length === 0 && <p>No featured events</p>}

      {events.map((e) => (
        <div key={e._id} className="event-row">
          <strong>{e.title}</strong>
          <span>{new Date(e.eventDateTime).toLocaleString()}</span>

          <button onClick={() => toggleActive(e._id, e.isActive)}>
            {e.isActive ? "Disable" : "Enable"}
          </button>

          <button onClick={() => remove(e._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default FeaturedList;
