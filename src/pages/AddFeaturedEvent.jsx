import React, { useState } from "react";
import "/Users/aayambhattarai/EventGhar/frontend/frontend/src/assets/css/AddFeaturedEvent.css";

const AddFeaturedEvent = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    venue: "",
    eventDateTime: "",
    expiryDate: "",
    isActive: true,
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (image) data.append("image", image);

    try {
      const res = await fetch("http://127.0.0.1:5001/api/featured-events", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Failed to add featured event");

      onAdded();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-featured-form" onSubmit={handleSubmit}>
      <h2>Add Featured Event</h2>

      <input name="title" placeholder="Title" required onChange={handleChange} />
      <input name="subtitle" placeholder="Subtitle" required onChange={handleChange} />
      <input name="venue" placeholder="Venue" required onChange={handleChange} />

      <input
        type="datetime-local"
        name="eventDateTime"
        required
        onChange={handleChange}
      />

      <input
        type="date"
        name="expiryDate"
        onChange={handleChange}
      />

      <input
        type="file"
        accept="image/*"
        required
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button disabled={loading}>
        {loading ? "Adding..." : "Add Featured Event"}
      </button>
    </form>
  );
};

export default AddFeaturedEvent;
