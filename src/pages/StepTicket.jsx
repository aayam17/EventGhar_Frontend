import "../assets/css/StepTicket.css";
import { useState, useEffect } from "react";

const StepTicket = ({ order, next }) => {
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState("");
  const [snackbar, setSnackbar] = useState("");

  /* ================= SNACKBAR ================= */
  const showSnackbar = (msg) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(""), 2500);
  };

  /* ================= QTY CONTROLS ================= */
  const increaseQty = (index) => {
    order.setOrder((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t, i) =>
        i === index ? { ...t, qty: t.qty + 1 } : t
      ),
    }));
    showSnackbar("Ticket added");
  };

  const decreaseQty = (index) => {
    order.setOrder((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t, i) =>
        i === index && t.qty > 0 ? { ...t, qty: t.qty - 1 } : t
      ),
    }));
    showSnackbar("Ticket removed");
  };

  /* ================= TOTALS ================= */
  const subtotal = order.tickets.reduce(
    (sum, t) => sum + t.price * t.qty,
    0
  );

  const total = Math.max(subtotal - (order.discount || 0), 0);

  useEffect(() => {
    order.setOrder((prev) => ({
      ...prev,
      subtotal,
      total,
    }));
  }, [subtotal, total]);

  /* ================= PROMO ================= */
  const applyPromo = async () => {
    if (!promoCode || subtotal === 0) {
      showSnackbar("Add tickets before applying promo");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5001/api/promos/validate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: promoCode }),
        }
      );

      if (!res.ok) throw new Error();

      const promo = await res.json();

      const discount =
        promo.discountType === "FLAT"
          ? promo.discountValue
          : (subtotal * promo.discountValue) / 100;

      order.setOrder((prev) => ({
        ...prev,
        promoCode,
        discount,
      }));

      setPromoStatus("success");
      showSnackbar("Promo applied 🎉");
    } catch {
      order.setOrder((prev) => ({
        ...prev,
        promoCode: null,
        discount: 0,
      }));
      setPromoStatus("error");
      showSnackbar("Invalid promo code");
    }
  };

  return (
    <div className="step-card">
      {/* TICKET LIST */}
      {order.tickets.map((t, i) => (
        <div className="ticket-buy-row" key={i}>
          <span className="ticket-name">{t.type}</span>
          <span className="ticket-price">NPR {t.price}</span>

          <div className="ticket-qty-controls">
            <button
              onClick={() => decreaseQty(i)}
              disabled={t.qty === 0}
            >
              −
            </button>
            <span>{t.qty}</span>
            <button onClick={() => increaseQty(i)}>+</button>
          </div>
        </div>
      ))}

      {/* SUMMARY */}
      {order.tickets.some((t) => t.qty > 0) &&
        order.tickets.map(
          (t, i) =>
            t.qty > 0 && (
              <div className="summary-box" key={i}>
                <span>{t.type}</span>
                <span>{t.qty} × {t.price}</span>
                <span>{t.qty * t.price}</span>
              </div>
            )
        )}

      {/* PROMO */}
      <div className="promo">
        <label>Promo Code</label>

        <div className="promo-input-wrapper">
          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="XXXXXXXX"
            className={promoStatus}
          />

          <button
            className="promo-apply-btn"
            disabled={!promoCode}
            onClick={applyPromo}
          >
            APPLY
          </button>
        </div>
      </div>

      {/* TOTAL */}
      <div className="summary-box total">
        <strong>Total</strong>
        <strong>NPR {total}</strong>
      </div>

      <button
        className="next-green"
        disabled={total === 0}
        onClick={next}
      >
        NEXT
      </button>

      {snackbar && <div className="snackbar">{snackbar}</div>}
    </div>
  );
};

export default StepTicket;
