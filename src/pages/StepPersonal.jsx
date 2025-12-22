import "../assets/css/StepPersonal.css";
import { useState } from "react";

const StepPersonal = ({ order, setOrder, prev, next }) => {
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setOrder({
      ...order,
      user: { ...order.user, [e.target.name]: e.target.value },
    });

  const validateAndNext = () => {
    const { name, email, phone } = order.user || {};

    if (!name || !email || !phone) {
      setError("Please fill all required fields");
      return;
    }

    setError("");
    next();
  };

  return (
    <div className="step-card personal-step">
      <div className="personal-grid">
        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
        />
        <input name="phone" placeholder="Phone No" onChange={handleChange} />
        <input
          name="address"
          placeholder="Address (optional)"
          onChange={handleChange}
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="actions">
        <button onClick={prev} className="prev-btn">
          PREVIOUS
        </button>
        <button onClick={validateAndNext} className="next-green">
          NEXT
        </button>
      </div>
    </div>
  );
};

export default StepPersonal;
