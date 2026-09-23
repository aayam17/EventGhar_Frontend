import { useEffect, useMemo, useState } from "react";
import "../assets/css/AdminRefund.css";
import Toast, { useSnack } from "../components/ui/Toast";
import { api, adminHeaders } from "../lib/api";

/* =====================================================
   REFUND MANAGEMENT
   The admin is the refund controller for each event.
   Every event is non-refundable by default — nothing here
   ever touches tickets across the whole platform. Admin
   picks ONE event (e.g. it got cancelled), flips that
   event's refund eligibility on, and only then do refund
   requests tied to that event's tickets show up to act on.
===================================================== */
const AdminRefund = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("ALL");
  const [pendingCounts, setPendingCounts] = useState({});
  const [refunds, setRefunds] = useState([]);
  const [loadingRefunds, setLoadingRefunds] = useState(true);
  const [savingEligibility, setSavingEligibility] = useState(false);
  const [reasonDraft, setReasonDraft] = useState("");
  const [snack, showSnack] = useSnack();

  const selectedEvent = useMemo(
    () => events.find((e) => e._id === selectedEventId) || null,
    [events, selectedEventId]
  );

  /* ---------- LOAD EVENTS + PER-EVENT PENDING COUNTS ---------- */
  const loadEvents = () => {
    fetch(api("/api/events?all=true"), { headers: adminHeaders(false) })
      .then((res) => res.json())
      .then(setEvents)
      .catch(() => {});
  };

  const loadCounts = () => {
    fetch(api("/api/orders/refunds/summary"), { headers: adminHeaders(false) })
      .then((res) => res.json())
      .then(setPendingCounts)
      .catch(() => {});
  };

  useEffect(() => {
    loadEvents();
    loadCounts();
  }, []);

  /* ---------- LOAD REFUND REQUESTS FOR THE CHOSEN EVENT ---------- */
  const loadRefunds = () => {
    setLoadingRefunds(true);
    const url =
      selectedEventId === "ALL"
        ? api("/api/orders/refunds")
        : api(`/api/orders/refunds?eventId=${selectedEventId}`);

    fetch(url, { headers: adminHeaders(false) })
      .then((res) => res.json())
      .then(setRefunds)
      .catch(() => setRefunds([]))
      .finally(() => setLoadingRefunds(false));
  };

  useEffect(() => {
    loadRefunds();
    // Keep the reason textbox in sync with whichever event is selected
    setReasonDraft(selectedEvent?.refundReason || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId]);

  /* ---------- APPROVE / REJECT ---------- */
  const act = async (id, action) => {
    try {
      const res = await fetch(api(`/api/orders/${id}/refund-action`), {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Action failed");
      showSnack(
        action === "APPROVED" ? "Refund approved" : "Refund rejected",
        "success"
      );
    } catch (err) {
      showSnack(err.message || "Action failed", "error");
    }
    loadRefunds();
    loadCounts();
  };

  /* ---------- TOGGLE PER-EVENT REFUND ELIGIBILITY ---------- */
  const setEligibility = async (isRefundable) => {
    if (!selectedEvent) return;

    if (isRefundable && !reasonDraft.trim()) {
      showSnack('Add a short reason (e.g. "Event cancelled") before enabling refunds.', "warning");
      return;
    }

    setSavingEligibility(true);
    try {
      const res = await fetch(api(`/api/events/${selectedEvent._id}/refund-eligibility`), {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ isRefundable, refundReason: reasonDraft }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();

      setEvents((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
      showSnack(
        isRefundable ? "Refunds enabled for this event" : "Refunds disabled for this event",
        "success"
      );
    } catch {
      showSnack("Failed to update refund eligibility", "error");
    } finally {
      setSavingEligibility(false);
    }
  };

  const eventsWithPending = events.filter((e) => pendingCounts[e._id] > 0);

  return (
    <div className="refund-management">
      <h3 className="card-title" style={{ marginBottom: 4 }}>
        Refund Management
      </h3>
      <p className="refund-subtitle">
        Every event is non-refundable by default. Choose an event below to open
        refunds for it, and only tickets bought for that event are affected.
      </p>

      {/* ---------------- EVENT PICKER ---------------- */}
      <div className="refund-event-picker">
        <label htmlFor="refund-event-select">Event</label>
        <select
          id="refund-event-select"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="ALL">All events (pending refunds)</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.title}
              {pendingCounts[ev._id] ? ` · ${pendingCounts[ev._id]} pending` : ""}
              {ev.isRefundable ? " ✓ refundable" : ""}
            </option>
          ))}
        </select>

        {eventsWithPending.length > 0 && selectedEventId === "ALL" && (
          <div className="refund-quick-jump">
            {eventsWithPending.map((ev) => (
              <button key={ev._id} onClick={() => setSelectedEventId(ev._id)}>
                {ev.title} · {pendingCounts[ev._id]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- SELECTED EVENT: ELIGIBILITY CONTROL ---------------- */}
      {selectedEvent && (
        <div className="refund-eligibility-card">
          <div className="refund-eligibility-head">
            <div>
              <p className="refund-eligibility-title">{selectedEvent.title}</p>
              <span
                className={`refund-status ${
                  selectedEvent.isRefundable ? "APPROVED" : "REJECTED"
                }`}
              >
                {selectedEvent.isRefundable ? "Refundable" : "Not refundable"}
              </span>
            </div>
          </div>

          <label className="refund-reason-label">
            Reason (shown to ticket holders as refund eligibility)
          </label>
          <textarea
            className="input-box"
            rows={2}
            placeholder='e.g. "Event cancelled due to venue issue"'
            value={reasonDraft}
            onChange={(e) => setReasonDraft(e.target.value)}
          />

          <div className="refund-eligibility-actions">
            {!selectedEvent.isRefundable ? (
              <button
                className="approve"
                disabled={savingEligibility}
                onClick={() => setEligibility(true)}
              >
                {savingEligibility ? "Saving..." : "Mark event cancelled → enable refunds"}
              </button>
            ) : (
              <button
                className="reject"
                disabled={savingEligibility}
                onClick={() => setEligibility(false)}
              >
                {savingEligibility ? "Saving..." : "Disable refunds for this event"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ---------------- REFUND REQUESTS (SCOPED TO SELECTION) ---------------- */}
      <h4 className="refund-list-title">
        {selectedEventId === "ALL"
          ? "Pending refund requests: all events"
          : `Pending refund requests: ${selectedEvent?.title || ""}`}
      </h4>

      {loadingRefunds ? (
        <p className="empty-text">Loading...</p>
      ) : refunds.length === 0 ? (
        <p className="empty-text">No pending refund requests here.</p>
      ) : (
        refunds.map((order) => (
          <div key={order._id} className="refund-card">
            <p>
              <strong>{order.user?.name}</strong> · {order.eventTitle}
            </p>
            <p>NPR {Number(order.total).toLocaleString()}</p>
            <span className="refund-status PENDING">Pending</span>

            <div className="refund-actions">
              <button className="approve" onClick={() => act(order._id, "APPROVED")}>
                Approve
              </button>
              <button className="reject" onClick={() => act(order._id, "REJECTED")}>
                Reject
              </button>
            </div>
          </div>
        ))
      )}

      {snack && <Toast message={snack.message} type={snack.type} />}
    </div>
  );
};

export default AdminRefund;
