import { useState, useEffect } from "react";
import "../assets/css/AdminPromo.css";

const AdminPromo = () => {
  const [form, setForm] = useState({
    code: "",
    discountType: "FLAT",
    discountValue: "",
  });

  const [promos, setPromos] = useState([]);

  // 🔹 Fetch existing promo codes
  const fetchPromos = async () => {
    const res = await fetch("http://localhost:5001/api/promos");
    const data = await res.json();
    setPromos(data);
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const submit = async () => {
    if (!form.code || !form.discountValue) {
      alert("Please fill all fields");
      return;
    }

    await fetch("http://localhost:5001/api/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Promo Created");

    setForm({
      code: "",
      discountType: "FLAT",
      discountValue: "",
    });

    fetchPromos(); // ✅ refresh list
  };

  return (
    <div className="admin-promo-layout">

      {/* LEFT – CREATE PROMO */}
      <div className="admin-card">
        <h3>Create Promo Code</h3>

        <input
          placeholder="PROMO CODE"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value })
          }
        />

        <select
          value={form.discountType}
          onChange={(e) =>
            setForm({ ...form, discountType: e.target.value })
          }
        >
          <option value="FLAT">Flat Discount</option>
          <option value="PERCENT">Percentage</option>
        </select>

        <input
          placeholder="Discount Value"
          value={form.discountValue}
          onChange={(e) =>
            setForm({ ...form, discountValue: e.target.value })
          }
        />

        <button onClick={submit}>Create</button>
      </div>

      {/* RIGHT – PROMO LIST */}
      <div className="admin-card promo-list-card">
        <h3>Active Promo Codes</h3>

        {promos.length === 0 && (
          <p className="empty-text">No promo codes yet</p>
        )}

        {promos.map((p) => (
          <div key={p._id} className="promo-item">
            <div>
              <strong>{p.code}</strong>
              <span className="promo-type">
                {p.discountType === "FLAT"
                  ? `Rs ${p.discountValue}`
                  : `${p.discountValue}%`}
              </span>
            </div>

            <span
              className={`promo-status ${
                p.isActive ? "active" : "inactive"
              }`}
            >
              {p.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPromo;
