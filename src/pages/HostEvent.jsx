import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../assets/css/HostEvent.css";

/* ================= LOCAL DATE FORMATTER ================= */
/* Prevents timezone bugs (DO NOT use toISOString) */
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const HostEvent = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    eventName: "",
    eventDate: "",
    companyName: "",
    companyAddress: "",
    details: "",
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

  /* ================= DATE RANGE (CALENDAR SAFE) ================= */
  // Yesterday (allowed)
  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatLocalDate(d);
  })();

  // Today + 6 months (max)
  const maxDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return formatLocalDate(d);
  })();

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Character limit (UX + prevention)
    if (name === "details" && value.length > 300) return;

    setForm({ ...form, [name]: value });
  };

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => setSnackbar({ show: false }), 3000);
  };

  const submit = async (e) => {
    e.preventDefault();

    /* ---------- REQUIRED FIELD CHECK ---------- */
    if (!form.fullName || !form.email || !form.eventName || !form.eventDate) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    /* ---------- HARD DATE GUARD (FRONTEND) ---------- */
    const selected = new Date(form.eventDate);
    const min = new Date(minDate);
    const max = new Date(maxDate);

    if (selected < min || selected > max) {
      showSnackbar(
        "Event date must be between yesterday and the next 6 months",
        "error"
      );
      return;
    }

    /* ---------- SUBMIT ---------- */
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:5001/api/host-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        showSnackbar(data.error || "Submission failed", "error");
        return;
      }

      showSnackbar("🎉 Event request submitted successfully!");

      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        eventName: "",
        eventDate: "",
        companyName: "",
        companyAddress: "",
        details: "",
      });
    } catch (err) {
      showSnackbar("❌ Network error. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="host-wrapper">
        <h2>Host an Event</h2>
        <form className="host-form" onSubmit={submit}>
          {/* PERSONAL INFO */}
          <div className="form-group">
            <label>Full Name *</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+977 98XXXXXXXX"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>

          {/* EVENT INFO */}
          <div className="form-group">
            <label>Event Name *</label>
            <input
              name="eventName"
              value={form.eventName}
              onChange={handleChange}
              placeholder="Concert, Festival, Meetup..."
              required
            />
          </div>

          <div className="form-group">
            <label>Event Date *</label>
            <input
              name="eventDate"
              type="date"
              value={form.eventDate}
              min={minDate}
              max={maxDate}
              onChange={handleChange}
              onKeyDown={(e) => e.preventDefault()} // 🚫 block typing
              onPaste={(e) => e.preventDefault()}   // 🚫 block paste
              required
            />
            <small className="helper-text">
              Calendar only — manual input disabled
            </small>
          </div>

          {/* ORGANIZER */}
          <div className="form-group">
            <label>Company / Organizer Name</label>
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          <div className="form-group">
            <label>Company Address</label>
            <input
              name="companyAddress"
              value={form.companyAddress}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          {/* DETAILS */}
          <div className="form-group full">
            <label>Event Details</label>
            <textarea
              name="details"
              rows="5"
              value={form.details}
              onChange={handleChange}
              placeholder="Max 300 characters"
            />
            <span className="char-counter">
              {form.details.length}/300
            </span>
          </div>

          <button className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>

      {/* SNACKBAR */}
      {snackbar.show && (
        <div className={`snackbar ${snackbar.type}`}>
          {snackbar.message}
        </div>
      )}
    </>
  );
};

export default HostEvent;
