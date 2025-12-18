import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../assets/css/HostEvent.css";

const HostEvent = () => {
  const [form, setForm] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:5001/api/host-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("✅ Event request submitted for review");
  };

  return (
    <>
      <Navbar />
      <div className="host-wrapper">
        <h2>Host an Event</h2>

        <form className="host-form" onSubmit={submit}>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} />
          <input name="email" placeholder="Email Address" onChange={handleChange} />
          <input name="phone" placeholder="Phone no" onChange={handleChange} />
          <input name="address" placeholder="Address" onChange={handleChange} />

          <input name="eventName" placeholder="Event Name" onChange={handleChange} />
          <input name="eventDate" type="date" onChange={handleChange} />

          <input name="companyName" placeholder="Company Name" onChange={handleChange} />
          <input name="companyAddress" placeholder="Company Address" onChange={handleChange} />

          <textarea
            name="details"
            placeholder="Details"
            rows="5"
            onChange={handleChange}
          />

          <button className="submit-btn">Submit</button>
        </form>
      </div>
    </>
  );
};

export default HostEvent;
