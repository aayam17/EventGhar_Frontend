import React, { useState } from "react";
import "../assets/css/AddEvent.css";

const AddEvent = ({ onClose, onEventAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    formattedDate: "",
    price: "",
    formattedPrice: "",
    packages: "",
    description: "",
    time: "",
    organizerName: "",
    venueName: "",
    venueAddress: "",
    mapEmbedUrl: "",
    fanPitPrice: "",
    vipPrice: "",
    vvipPrice: "",


    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.title || !formData.formattedDate || !formData.price || !formData.image) {
    alert("Please fill all required fields.");
    return;
  }

  const data = new FormData();
  data.append("title", formData.title);
  data.append("formattedDate", formData.formattedDate);
  data.append("price", Number(formData.price));
  data.append("formattedPrice", formData.formattedPrice);
  data.append("packages", formData.packages);
  data.append("image", formData.image);
  data.append("description", formData.description);
data.append("time", formData.time);

data.append(
  "organizer",
  JSON.stringify({ name: formData.organizerName })
);

data.append(
  "venue",
  JSON.stringify({
    name: formData.venueName,
    address: formData.venueAddress,
    mapEmbedUrl: formData.mapEmbedUrl,
  })
);

data.append(
  "tickets",
  JSON.stringify([
    { type: "FAN PIT", price: formData.fanPitPrice },
    { type: "VIP", price: formData.vipPrice },
    { type: "VVIP", price: formData.vvipPrice },
  ])
);

  try {
    const res = await fetch("http://localhost:5001/api/events", {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      const text = await res.text(); // ✅ SAFE
      console.error(text);
      throw new Error("Failed to add event");
    }

    alert("✅ Event added successfully");
    onEventAdded();
    onClose();
  } catch (err) {
    alert(`❌ ${err.message}`);
    console.error(err);
  }
};

  return (
    <div className="add-event-wrapper">
      <h2 className="add-event-title">Add New Event</h2>

      <form onSubmit={handleSubmit} className="add-event-form">
        <input
          name="title"
          placeholder="Event Title"
          className="input-box full"
          onChange={handleChange}
          required
        />

        <input
          name="formattedDate"
          placeholder="Date (e.g. 13 Dec)"
          className="input-box"
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          className="input-box"
          onChange={handleChange}
          required
        />

        <input
          name="formattedPrice"
          placeholder="Formatted Price (optional)"
          className="input-box"
          onChange={handleChange}
        />

        <input
          name="packages"
          placeholder="Packages (VIP, Standard...)"
          className="input-box"
          onChange={handleChange}
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          className="input-box full"
          onChange={handleChange}
          required
        />
        <textarea
  name="description"
  placeholder="Event Description"
  className="input-box full"
  onChange={handleChange}
/>

<input name="time" placeholder="Event Time" className="input-box" onChange={handleChange} />
<input name="organizerName" placeholder="Organizer Name" className="input-box" onChange={handleChange} />
<input name="venueName" placeholder="Venue Name" className="input-box" onChange={handleChange} />
<input name="venueAddress" placeholder="Venue Address" className="input-box full" onChange={handleChange} />
<input name="mapEmbedUrl" placeholder="Google Map Embed URL" className="input-box full" onChange={handleChange} />

<input name="fanPitPrice" placeholder="Fan Pit Price" className="input-box" onChange={handleChange} />
<input name="vipPrice" placeholder="VIP Price" className="input-box" onChange={handleChange} />
<input name="vvipPrice" placeholder="VVIP Price" className="input-box" onChange={handleChange} />


        <button className="add-event-btn">Add Event</button>
      </form>
    </div>
  );
};

export default AddEvent;
