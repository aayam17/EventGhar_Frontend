import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/EventDetails.css";
import Navbar from "../components/Navbar";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [tab, setTab] = useState("DETAILS");
  const [selectedTickets, setSelectedTickets] = useState([]);

  // 🔔 Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  // 🔔 Snackbar helper
  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
    setTimeout(() => {
      setSnackbar({ open: false, message: "" });
    }, 3000);
  };

  // 📡 Fetch event
  useEffect(() => {
    fetch(`http://localhost:5001/api/events/${id}`)
      .then((res) => res.json())
      .then(setEvent)
      .catch(() => showSnackbar("Failed to load event details"));
  }, [id]);

  if (!event) return <div className="page-loading">Loading...</div>;

  const eventImage = event.imageSrc.startsWith("http")
    ? event.imageSrc
    : `http://localhost:5001/${event.imageSrc.replace(/\\/g, "/")}`;

  // ➕ Add / Increase ticket
  const handleAddTicket = (ticket) => {
    setSelectedTickets((prev) => {
      const existing = prev.find((t) => t.type === ticket.type);

      if (existing) {
        showSnackbar(`${ticket.type} quantity increased`);
        return prev.map((t) =>
          t.type === ticket.type ? { ...t, qty: t.qty + 1 } : t
        );
      }

      showSnackbar(`${ticket.type} added`);
      return [...prev, { ...ticket, qty: 1 }];
    });
  };

  // ➖ Decrease ticket
  const handleRemoveTicket = (ticket) => {
    setSelectedTickets((prev) => {
      const existing = prev.find((t) => t.type === ticket.type);
      if (!existing) return prev;

      if (existing.qty === 1) {
        showSnackbar(`${ticket.type} removed`);
        return prev.filter((t) => t.type !== ticket.type);
      }

      showSnackbar(`${ticket.type} quantity decreased`);
      return prev.map((t) =>
        t.type === ticket.type ? { ...t, qty: t.qty - 1 } : t
      );
    });
  };

  return (
    <>
      <Navbar />

      <div className="event-details-page">
        {/* LEFT COLUMN */}
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

        {/* RIGHT COLUMN */}
        <div className="event-right-column">
          <h1 className="event-main-title">{event.title}</h1>

          {/* TABS */}
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

          {/* CONTENT */}
          <div className="event-content-box">
            {/* DETAILS TAB */}
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

            {/* TICKETS TAB */}
            {tab === "TICKETS" && (
              <>
                {event.tickets?.map((t, i) => {
                  const selected = selectedTickets.find(
                    (st) => st.type === t.type
                  );

                  return (
                    <div className="ticket-row" key={i}>
                      <span className="ticket-type">{t.type}</span>
                      <span className="ticket-price">NPR {t.price}</span>

                      {!selected ? (
                        <button
                          className="ticket-add-btn"
                          onClick={() => handleAddTicket(t)}
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="ticket-qty-controls">
                          <button onClick={() => handleRemoveTicket(t)}>
                            −
                          </button>
                          <span>{selected.qty}</span>
                          <button onClick={() => handleAddTicket(t)}>
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  className="next-btn"
                  onClick={() => {
                    if (selectedTickets.length === 0) {
                      showSnackbar("Please select at least one ticket");
                      return;
                    }

                    navigate(`/checkout/${event._id}`, {
                      state: { selectedTickets },
                    });
                  }}
                >
                  NEXT
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 🔔 SNACKBAR */}
      {snackbar.open && (
        <div className="snackbar">{snackbar.message}</div>
      )}
    </>
  );
};

export default EventDetails;
