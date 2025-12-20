import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/EventDetails.css";
import Navbar from "../components/Navbar";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [tab, setTab] = useState("DETAILS");

  // ✅ NEW: selected tickets state
  const [selectedTickets, setSelectedTickets] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/events/${id}`)
      .then((res) => res.json())
      .then(setEvent)
      .catch(console.error);
  }, [id]);

  if (!event) return <div className="page-loading">Loading...</div>;

  const eventImage = event.imageSrc.startsWith("http")
    ? event.imageSrc
    : `http://localhost:5001/${event.imageSrc.replace(/\\/g, "/")}`;

  // ✅ NEW: add ticket logic
  const handleAddTicket = (ticket) => {
    setSelectedTickets((prev) => {
      const existing = prev.find((t) => t.type === ticket.type);

      if (existing) {
        return prev.map((t) =>
          t.type === ticket.type ? { ...t, qty: t.qty + 1 } : t
        );
      }

      return [...prev, { ...ticket, qty: 1 }];
    });
  };

  return (
    <>
      <Navbar />

      <div className="event-details-page">
        {/* LEFT */}
        <div className="event-left-column">
          <img src={eventImage} alt={event.title} className="event-poster" />

          <button className="organizer-btn">
            {event.organizer?.name || "ORGANIZER"}
          </button>

          {event.venue?.mapEmbedUrl && (
            <div className="map-container">
              <iframe
                src={event.venue.mapEmbedUrl}
                width="100%"
                height="220"
                style={{ border: 0, borderRadius: "10px" }}
                allowFullScreen
                loading="lazy"
                title="Event Location"
              />
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="event-right-column">
          <h1 className="event-main-title">{event.title}</h1>

          <div className="event-tabs">
            <button
              className={tab === "DETAILS" ? "tab active" : "tab"}
              onClick={() => setTab("DETAILS")}
            >
              Details
            </button>
            <button
              className={tab === "TICKETS" ? "tab active" : "tab"}
              onClick={() => setTab("TICKETS")}
            >
              Grab your Ticket
            </button>
          </div>

          <div className="event-content-box">
            {tab === "DETAILS" && (
              <>
                <h2>{event.title}</h2>
                <p>📅 {event.formattedDate}</p>
                {event.time && <p>⏰ {event.time}</p>}
                {event.venue?.name && <p>📍 {event.venue.name}</p>}

                <p className="event-description">{event.description}</p>

                <button className="next-btn" onClick={() => setTab("TICKETS")}>
                  NEXT
                </button>
              </>
            )}

            {tab === "TICKETS" && (
              <>
                {event.tickets?.map((t, i) => (
                  <div className="ticket-row" key={i}>
                    <span className="ticket-type">{t.type}</span>
                    <span className="ticket-price">NPR {t.price}</span>
                    <button
                      className="ticket-add-btn"
                      onClick={() => handleAddTicket(t)}
                    >
                      ADD
                    </button>
                  </div>
                ))}

                <button
                  className="next-btn"
                  disabled={selectedTickets.length === 0}
                  onClick={() =>
                    navigate(`/checkout/${event._id}`, {
                      state: { selectedTickets },
                    })
                  }
                >
                  NEXT
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
