import React, { useEffect, useState } from "react";
import "/Users/aayambhattarai/EventGhar/frontend/frontend/src/assets/css/OrganizerRequests.css";
/* ---------------- MODAL ---------------- */
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

const OrganizerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    const res = await fetch("http://127.0.0.1:5001/api/host-requests");
    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`http://127.0.0.1:5001/api/host-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <>
      <div className="analytics-card">
        <h3 className="card-title">Organizer Event Requests</h3>

        {requests.length === 0 && <p>No requests yet.</p>}

        {requests.map((r) => (
          <div key={r._id} className="organizer-card">
            <div className="organizer-info">
              <h4>{r.eventName}</h4>
              <p>{r.fullName} • {r.email}</p>

              <span className={`status-badge ${r.status}`}>
                {r.status}
              </span>
            </div>

            <div className="organizer-actions">
              <button
                className="btn view"
                onClick={() => setSelected(r)}
              >
                View Details
              </button>

              <button
                className="btn approve"
                onClick={() => updateStatus(r._id, "approved")}
              >
                Approve
              </button>

              <button
                className="btn reject"
                onClick={() => updateStatus(r._id, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILS MODAL */}
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="details-wrapper">
            <h3>{selected.eventName}</h3>

            <div className="details-grid">
              <div><strong>Organizer:</strong> {selected.fullName}</div>
              <div><strong>Email:</strong> {selected.email}</div>
              <div><strong>Phone:</strong> {selected.phone}</div>
              <div><strong>Event Date:</strong> {selected.eventDate}</div>
              <div><strong>Company:</strong> {selected.companyName}</div>
              <div><strong>Company Address:</strong> {selected.companyAddress}</div>
            </div>

            <div className="details-box">
              <strong>Event Details</strong>
              <p>{selected.details || "No additional details provided."}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default OrganizerRequests;
