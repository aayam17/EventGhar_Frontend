import { useState, useEffect } from "react";
import "../assets/css/AdminPromo.css";
import Dialog from "../components/ui/Dialog";
import Toast, { useSnack } from "../components/ui/Toast";
import { api, adminHeaders } from "../lib/api";

const smallBtn = {
  padding: "6px 12px",
  fontSize: 12,
  marginLeft: 8,
};

const AdminPromo = () => {
  const [form, setForm] = useState({
    code: "",
    discountType: "FLAT",
    discountValue: "",
  });

  const [promos, setPromos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [snack, showSnack] = useSnack();

  const fetchPromos = async () => {
    try {
      const res = await fetch(api("/api/promos"), { headers: adminHeaders(false) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPromos(Array.isArray(data) ? data : []);
    } catch {
      showSnack("Couldn't load promo codes", "error");
    }
  };

  useEffect(() => {
    fetchPromos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (!form.code.trim() || !form.discountValue) {
      showSnack("Please fill all fields", "warning");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(api("/api/promos"), {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't create promo code");

      showSnack("Promo code created", "success");
      setForm({ code: "", discountType: "FLAT", discountValue: "" });
      fetchPromos();
    } catch (err) {
      showSnack(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (promo) => {
    try {
      const res = await fetch(api(`/api/promos/${promo._id}/toggle`), {
        method: "PATCH",
        headers: adminHeaders(false),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setPromos((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      showSnack(
        updated.isActive ? `${updated.code} is now active` : `${updated.code} switched off`,
        "success"
      );
    } catch {
      showSnack("Couldn't update the promo code", "error");
    }
  };

  const remove = (promo) => {
    setDialog({
      title: `Delete ${promo.code}?`,
      description:
        "Customers will no longer be able to use this code. Orders that already used it are not affected.",
      tone: "danger",
      confirmLabel: "Delete code",
      onConfirm: async () => {
        const res = await fetch(api(`/api/promos/${promo._id}`), {
          method: "DELETE",
          headers: adminHeaders(false),
        });
        if (!res.ok) throw new Error("Couldn't delete the promo code");
        setPromos((prev) => prev.filter((p) => p._id !== promo._id));
        showSnack("Promo code deleted", "success");
      },
    });
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
            setForm({ ...form, code: e.target.value.toUpperCase() })
          }
        />

        <select
          value={form.discountType}
          onChange={(e) =>
            setForm({ ...form, discountType: e.target.value })
          }
        >
          <option value="FLAT">Flat Discount (Rs)</option>
          <option value="PERCENT">Percentage (%)</option>
        </select>

        <input
          type="number"
          min="1"
          max={form.discountType === "PERCENT" ? 100 : undefined}
          placeholder={
            form.discountType === "PERCENT" ? "Percent off (1 to 100)" : "Rupees off"
          }
          value={form.discountValue}
          onChange={(e) =>
            setForm({ ...form, discountValue: e.target.value })
          }
        />

        <button onClick={submit} disabled={saving}>
          {saving ? "Creating..." : "Create"}
        </button>
      </div>

      {/* RIGHT – PROMO LIST */}
      <div className="admin-card promo-list-card">
        <h3>Promo Codes</h3>

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

            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                className={`promo-status ${
                  p.isActive ? "active" : "inactive"
                }`}
              >
                {p.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
              <button
                style={{ ...smallBtn, background: "var(--color-ink)" }}
                onClick={() => toggle(p)}
              >
                {p.isActive ? "Turn off" : "Turn on"}
              </button>
              <button style={smallBtn} onClick={() => remove(p)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {dialog && <Dialog {...dialog} onClose={() => setDialog(null)} />}
      {snack && <Toast message={snack.message} type={snack.type} />}
    </div>
  );
};

export default AdminPromo;
