import React, { useEffect, useState } from "react";
import "../assets/css/FeaturedList.css";
import Dialog from "../components/ui/Dialog";
import Toast, { useSnack } from "../components/ui/Toast";
import { api, adminHeaders } from "../lib/api";

const FeaturedManager = ({ onAdd }) => {
  const [events, setEvents] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [snack, showSnack] = useSnack();

  const load = async () => {
    try {
      const res = await fetch(api("/api/featured-events?all=true"), {
        headers: adminHeaders(false),
      });
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
      showSnack("Couldn't load featured events", "error");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async (id) => {
    setLoadingId(id);
    try {
      const res = await fetch(api(`/api/featured-events/${id}/toggle`), {
        method: "PATCH",
        headers: adminHeaders(false),
      });
      if (!res.ok) throw new Error();
    } catch {
      showSnack("Couldn't update the featured event", "error");
    }
    setLoadingId(null);
    load();
  };

  const remove = (event) => {
    setDialog({
      title: `Remove "${event.title}" from featured?`,
      description:
        "It stops showing on the homepage banner. The event itself and its tickets are not deleted.",
      tone: "danger",
      confirmLabel: "Remove",
      onConfirm: async () => {
        setLoadingId(event._id);
        try {
          const res = await fetch(api(`/api/featured-events/${event._id}`), {
            method: "DELETE",
            headers: adminHeaders(false),
          });
          if (!res.ok) throw new Error("Couldn't remove the featured event");
          showSnack("Removed from featured", "success");
        } finally {
          setLoadingId(null);
        }
        load();
      },
    });
  };

  return (
    <div className="featured-card">
      <div className="card-header-row">
        <h3 className="card-title">Featured Events</h3>
        <button className="new-event-btn" onClick={onAdd}>
          + New Featured Event
        </button>
      </div>
      <div className="featured-divider" />

      {events.length === 0 && (
        <div className="featured-empty">
          No featured events yet.
        </div>
      )}

      {events.map((e) => (
        <div key={e._id} className="featured-row">
          {e.imageSrc && (
            <div className="featured-thumb">
              <img src={e.imageSrc} alt={e.title} />
            </div>
          )}

          <div className="featured-info">
            <span className="featured-title">{e.title}</span>
            <span className="featured-date">
              {new Date(e.eventDateTime).toLocaleString()}
              {e.eventId ? " · Linked to trending event" : ""}
              {e.isActive === false ? " · Disabled (hidden from homepage)" : ""}
            </span>
          </div>

          <div className="featured-actions">
            <button
              className="featured-btn toggle"
              disabled={loadingId === e._id}
              onClick={() => toggle(e._id)}
            >
              {e.isActive ? "Disable" : "Enable"}
            </button>

            <button
              className="featured-btn delete"
              disabled={loadingId === e._id}
              onClick={() => remove(e)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {dialog && <Dialog {...dialog} onClose={() => setDialog(null)} />}
      {snack && <Toast message={snack.message} type={snack.type} />}
    </div>
  );
};

export default FeaturedManager;
