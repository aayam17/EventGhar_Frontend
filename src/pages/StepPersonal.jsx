import "../assets/css/StepPersonal.css";

const StepPersonal = ({ order, setOrder, prev, next }) => {
  const handleChange = (e) =>
    setOrder({
      ...order,
      user: { ...order.user, [e.target.name]: e.target.value },
    });

  return (
    <div className="step-card personal-step">
      <div className="personal-grid">
        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email Address" onChange={handleChange} />
        <input name="phone" placeholder="Phone no" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
      </div>

      <div className="actions">
        <button onClick={prev} className="prev-btn">PREVIOUS</button>
        <button onClick={next} className="next-green">NEXT</button>
      </div>
    </div>
  );
};

export default StepPersonal;
