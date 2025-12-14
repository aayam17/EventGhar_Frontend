import React, { useEffect, useState } from "react";
import "../assets/css/EventList.css";

const EventList = ({ onEventChange }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5001/api/events");
      if (!res.ok) {
  const text = await res.text();
  throw new Error(text);
}
const data = await res.json();

      setEvents(data);
      if (onEventChange) onEventChange(data.length);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://127.0.0.1:5001/api/events/${id}`, {
        method: "DELETE",
      });
      fetchEvents();
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <p className="loading-message">Loading events...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (events.length === 0) return <p className="empty-message">No events added yet.</p>;

  return (
    <div className="analytics-card event-list-card">
      <h3 className="card-title">All Events ({events.length})</h3>

      <div className="event-table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Date</th>
              <th>Price</th>
              <th>Packages</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>
                  <img
                    src={event.imageSrc}
                    alt={event.title}
                    style={{ width: "80px", borderRadius: "6px" }}
                  />
                </td>
                <td className="event-title-col">{event.title}</td>
                <td>{event.formattedDate}</td>
                <td>Rs {Number(event.price).toLocaleString()}</td>
                <td>{event.packages || "Standard"}</td>
                <td>
                  <button className="action-btn edit-btn">Edit</button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default EventList;
