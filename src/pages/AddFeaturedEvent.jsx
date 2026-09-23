import React, { useEffect, useState } from "react";
import "../assets/css/AddFeaturedEvent.css";
import { api, adminHeaders } from "../lib/api";

const emptyForm = {
  title: "",
  subtitle: "",
  venue: "",
  eventDateTime: "",
  expiryDate: "",
  isActive: true,
  price: "",
  organizerName: "",
  venueAddress: "",
  description: "",
  generalPrice: "",
  vipPrice: "",
  vvipPrice: "",
};

const toLocalInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const AddFeaturedEvent = ({ onClose, onAdded }) => {
  const [events, setEvents] = useState([]);
  const [sourceEventId, setSourceEventId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [tiers, setTiers] = useState({ GENERAL: false, VIP: false, VVIP: false });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleTier = (tier) => setTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));

  useEffect(() => {
    fetch(api("/api/events?all=true"), { headers: adminHeaders(false) })
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSourceChange = (e) => {
    const id = e.target.value;
    setSourceEventId(id);
    if (!id) return;

    const event = events.find((item) => item._id === id);
    if (!event) return;

    setForm((prev) => ({
      ...prev,
      title: event.title || "",
      subtitle: event.description || prev.subtitle,
      venue: event.venue?.name || event.venue || "",
      venueAddress: event.venue?.address || "",
      eventDateTime: toLocalInput(event.eventDateTime),
      price: event.price ?? "",
      organizerName: event.organizer?.name || "",
      description: event.description || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!sourceEventId && !tiers.GENERAL && !tiers.VIP && !tiers.VVIP) {
      setError("Turn on at least one ticket tier");
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (!sourceEventId) {
      data.set("generalPrice", tiers.GENERAL ? form.generalPrice : "");
      data.set("vipPrice", tiers.VIP ? form.vipPrice : "");
      data.set("vvipPrice", tiers.VVIP ? form.vvipPrice : "");
    }
    if (sourceEventId) data.append("eventId", sourceEventId);
    if (image) data.append("image", image);

    try {
      const res = await fetch(api("/api/featured-events"), {
        method: "POST",
        headers: adminHeaders(false),
        body: data,
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to add featured event");
      }

      onAdded();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add featured event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-featured-form" onSubmit={handleSubmit}>
      <h2>Add Featured Event</h2>
      <p className="add-featured-hint">
        Featured slides open the real event page. Choose an existing trending
        event, or create a new one that will also appear under Trending events.
      </p>

      <select value={sourceEventId} onChange={handleSourceChange}>
        <option value="">Create new event + feature it</option>
        {events.map((event) => (
          <option key={event._id} value={event._id}>
            {event.title}
          </option>
        ))}
      </select>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        required
        onChange={handleChange}
      />
      <input
        name="subtitle"
        placeholder="Subtitle"
        value={form.subtitle}
        required
        onChange={handleChange}
      />
      <input
        name="venue"
        placeholder="Venue"
        value={form.venue}
        required
        onChange={handleChange}
      />
      <input
        name="venueAddress"
        placeholder="Venue address"
        value={form.venueAddress}
        onChange={handleChange}
      />

      <input
        type="datetime-local"
        name="eventDateTime"
        value={form.eventDateTime}
        required
        onChange={handleChange}
      />

      <input
        type="date"
        name="expiryDate"
        value={form.expiryDate}
        onChange={handleChange}
      />

      {!sourceEventId && (
        <>
          <input
            name="price"
            type="number"
            min="0"
            placeholder="Starting price (Rs)"
            value={form.price}
            required
            onChange={handleChange}
          />
          <input
            name="organizerName"
            placeholder="Organizer"
            value={form.organizerName}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Event description (shown on the event page)"
            value={form.description}
            onChange={handleChange}
          />

          <p style={{ fontSize: 13, fontWeight: 600, margin: "12px 0 4px" }}>
            Ticket tiers &mdash; turn on the ones this event sells
          </p>
          {[
            { key: "GENERAL", label: "General", input: "generalPrice" },
            { key: "VIP", label: "VIP", input: "vipPrice" },
            { key: "VVIP", label: "VVIP", input: "vvipPrice" },
          ].map((tier) => (
            <div
              key={tier.key}
              style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0" }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <input
                  type="checkbox"
                  checked={tiers[tier.key]}
                  onChange={() => toggleTier(tier.key)}
                />
                {tier.label}
              </label>
              {tiers[tier.key] && (
                <input
                  name={tier.input}
                  type="number"
                  min="0"
                  placeholder="Price (0 = free)"
                  value={form[tier.input]}
                  onChange={handleChange}
                  style={{ width: 160 }}
                />
              )}
            </div>
          ))}
        </>
      )}

      <input
        type="file"
        accept="image/*"
        required={!sourceEventId}
        onChange={(e) => setImage(e.target.files[0])}
      />

      {error && (
        <p
          role="alert"
          style={{
            margin: "4px 0 12px",
            padding: "10px 12px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            background: "color-mix(in srgb, var(--color-raspberry) 10%, white)",
            color: "var(--color-raspberry-dark)",
          }}
        >
          {error}
        </p>
      )}

      <button disabled={loading}>
        {loading
          ? "Adding..."
          : sourceEventId
            ? "Feature this event"
            : "Add Featured Event"}
      </button>
    </form>
  );
};

export default AddFeaturedEvent;
