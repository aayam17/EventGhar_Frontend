import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../assets/css/ContactUs.css";

const ContactUs = () => {
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  return (
    <>
      <Navbar />

      <div className="contact-wrapper">
        {/* LEFT INFO CARD */}
        <div className="contact-info-card">
          {/* CALL US */}
          <div
            className="contact-info-box clickable"
            onClick={() => {
              setShowPhone(!showPhone);
              setShowEmail(false);
            }}
          >
            <div className="contact-icon phone">📞</div>
            <h4>Call Us</h4>

            {showPhone && (
              <p className="contact-reveal">📱 1234567</p>
            )}
          </div>

          {/* EMAIL */}
          <div
            className="contact-info-box clickable"
            onClick={() => {
              setShowEmail(!showEmail);
              setShowPhone(false);
            }}
          >
            <div className="contact-icon email">✉️</div>
            <h4>Send Us an Email</h4>

            {showEmail && (
              <p className="contact-reveal">📧 aayam@gmail.com</p>
            )}
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="contact-form-card">
          <form
            action="https://formspree.io/f/xojaebzr"
            method="POST"
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Contact Number"
            />

            <textarea
              name="message"
              placeholder="Enter Input"
              rows="4"
              required
            />

            <button type="submit" className="contact-submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
