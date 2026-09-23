import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Dialog from "../components/ui/Dialog";
import EmptyState from "../components/ui/EmptyState";
import Toast, { useSnack } from "../components/ui/Toast";
import Skeleton from "../components/ui/Skeleton";
import { api, adminHeaders } from "../lib/api";

const EventList = ({ onEventChange, onEdit, onAdd }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [snack, showSnack] = useSnack();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(api("/api/events?all=true"), {
        headers: adminHeaders(false),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      const data = await res.json();
      setEvents(data);
      setError("");
      if (onEventChange) onEventChange(data.length);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = (event) => {
    setDialog({
      title: `Delete "${event.title}"?`,
      description: "This removes the event and its listing permanently. This can't be undone.",
      tone: "danger",
      confirmLabel: "Delete event",
      onConfirm: async () => {
        const res = await fetch(api(`/api/events/${event._id}`), {
          method: "DELETE",
          headers: adminHeaders(false),
        });
        if (!res.ok) throw new Error("Failed to delete event");
        showSnack("Event deleted", "success");
        fetchEvents();
      },
    });
  };

  /* Toggle refund eligibility for ONE event only. Every event is
     non-refundable by default; this is how the admin marks a single
     cancelled event so only ITS tickets become refund-eligible —
     nothing else on the platform is touched. Full control (with a
     persistent reason box) lives on the Refund Management tab; this
     is the quick path for when the admin is already looking at the
     events table. */
  const toggleRefundable = (event) => {
    const enabling = !event.isRefundable;

    const applyToggle = async (refundReason) => {
      setSavingId(event._id);
      try {
        const res = await fetch(
          api(`/api/events/${event._id}/refund-eligibility`),
          {
            method: "PATCH",
            headers: adminHeaders(),
            body: JSON.stringify({ isRefundable: enabling, refundReason: refundReason || "" }),
          }
        );
        if (!res.ok) throw new Error("Failed to update refund status");
        const updated = await res.json();
        setEvents((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
        showSnack(
          enabling ? "Refunds enabled for this event" : "Refunds disabled for this event",
          "success"
        );
      } catch (err) {
        showSnack(err.message || "Failed to update refund status", "error");
      } finally {
        setSavingId(null);
      }
    };

    if (enabling) {
      setDialog({
        title: `Mark "${event.title}" as refundable`,
        description: "Every event is non-refundable by default. This enables refund requests for this event only.",
        withInput: true,
        inputLabel: "Reason shown to ticket holders",
        inputDefault: event.refundReason || "Event cancelled",
        confirmLabel: "Enable refunds",
        onConfirm: (reason) => applyToggle(reason),
      });
    } else {
      setDialog({
        title: `Disable refunds for "${event.title}"?`,
        description: "New refund requests for this event will be blocked.",
        tone: "danger",
        confirmLabel: "Disable refunds",
        onConfirm: () => applyToggle(event.refundReason),
      });
    }
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="font-display text-lg font-bold text-ink">
          All events {!loading && `(${events.length})`}
        </h3>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-full bg-raspberry px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-[0_10px_24px_rgba(214,48,74,0.3)] transition hover:bg-raspberry-dark"
        >
          <Plus className="h-3.5 w-3.5" /> New event
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Couldn't load events" description={error} />
      ) : events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Create your first event to see it listed here."
        />
      ) : (
        <div className="-mx-6 overflow-x-auto px-6">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-xs font-semibold uppercase tracking-wide text-stone-400">
                <th className="py-3 pr-4">Event</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Packages</th>
                <th className="py-3 pr-4">Refund</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b border-stone-100 last:border-0">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={event.imageSrc}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-lg border border-stone-200 object-cover"
                      />
                      <span className="font-semibold text-ink">{event.title}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-stone-600">{event.formattedDate}</td>
                  <td className="py-3 pr-4 text-stone-600">
                    Rs {Number(event.price).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-stone-600">{event.packages || "Standard"}</td>
                  <td className="py-3 pr-4">
                    <button
                      disabled={savingId === event._id}
                      onClick={() => toggleRefundable(event)}
                      title={event.refundReason || ""}
                      className={[
                        "rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition disabled:opacity-50",
                        event.isRefundable
                          ? "bg-pine/10 text-pine-dark hover:bg-pine/20"
                          : "bg-stone-100 text-stone-500 hover:bg-stone-200",
                      ].join(" ")}
                    >
                      {savingId === event._id
                        ? "Saving…"
                        : event.isRefundable
                        ? "Refundable"
                        : "Not refundable"}
                    </button>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => onEdit && onEdit(event)}
                        aria-label={`Edit ${event.title}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-ink"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        aria-label={`Delete ${event.title}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition hover:bg-raspberry/10 hover:text-raspberry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dialog && <Dialog {...dialog} onClose={() => setDialog(null)} />}
      {snack && <Toast message={snack.message} type={snack.type} />}
    </div>
  );
};

export default EventList;
