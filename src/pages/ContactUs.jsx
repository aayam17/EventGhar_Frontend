import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../assets/css/ContactUs.css";

const ContactUs = () => {
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [snack, setSnack] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = () => {
    setSending(true);
    setSnack("");

    setTimeout(() => {
      setSnack("✅ Message sent successfully. We’ll get back to you soon.");
      setSending(false);
    }, 1200);
  };

  return (
    <>
      <Navbar />

      <div className="contact-wrapper">
        {/* LEFT INFO */}
        <div className="contact-info-card">
          <h2 className="contact-title">Get in touch</h2>
          <p className="contact-sub">
            We’re here to help. Tap a card below to reveal contact details.
          </p>

          <div
            className="contact-info-box clickable"
            role="button"
            aria-label="Reveal phone number"
            onClick={() => {
              setShowPhone(!showPhone);
              setShowEmail(false);
            }}
          >
            <div className="contact-icon phone">📞</div>
            <h4>Call Us</h4>
            {showPhone && (
              <p className="contact-reveal">📱 +977 98XXXXXXX</p>
            )}
          </div>

          <div
            className="contact-info-box clickable"
            role="button"
            aria-label="Reveal email address"
            onClick={() => {
              setShowEmail(!showEmail);
              setShowPhone(false);
            }}
          >
            <div className="contact-icon email">✉️</div>
            <h4>Email Us</h4>
            {showEmail && (
              <p className="contact-reveal">📧 support@eventghar.com</p>
            )}
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="contact-form-card">
          <h3 className="form-title">Send us a message</h3>
          <p className="form-sub">
            Fill out the form and we’ll respond within 24 hours.
          </p>

          <form
            action="https://formspree.io/f/xojaebzr"
            method="POST"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              aria-label="Full name"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              aria-label="Email address"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Contact Number (optional)"
              aria-label="Phone number"
            />

            <textarea
              name="message"
              placeholder="Tell us how we can help you…"
              aria-label="Message"
              required
            />

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={sending}
            >
              {sending ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* SNACKBAR */}
      {snack && <div className="contact-snackbar">{snack}</div>}
    </>
  );
};

export default ContactUs;
