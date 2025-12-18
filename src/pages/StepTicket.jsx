import "../assets/css/StepTicket.css";
import { useState } from "react";

const StepTicket = ({ order, next }) => {
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState("");

  // BUY TICKET (INCREMENT QTY)
  const handleBuy = (index) => {
    order.setOrder((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t, i) =>
        i === index ? { ...t, qty: t.qty + 1 } : t
      ),
    }));
  };

  // SUBTOTAL
  const subtotal = order.tickets.reduce(
    (sum, t) => sum + t.price * t.qty,
    0
  );

  // APPLY PROMO (PERSIST TO ORDER STATE)
  const applyPromo = async () => {
    if (!promoCode || subtotal === 0) return;

    try {
      const res = await fetch("http://localhost:5001/api/promos/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });

      if (!res.ok) throw new Error();

      const promo = await res.json();

      const discountAmount =
        promo.discountType === "FLAT"
          ? promo.discountValue
          : (subtotal * promo.discountValue) / 100;

      order.setOrder((prev) => ({
        ...prev,
        promoCode,
        discount: discountAmount,
      }));

      setPromoStatus("success");
    } catch {
      order.setOrder((prev) => ({
        ...prev,
        promoCode: null,
        discount: 0,
      }));
      setPromoStatus("error");
    }
  };

  const total = Math.max(subtotal - (order.discount || 0), 0);

  return (
    <div className="step-card">
      {/* BUY ROW */}
      {order.tickets.map((t, i) => (
        <div className="ticket-buy-row" key={i}>
          <span className="ticket-name">{t.type}</span>
          <span className="ticket-price">NPR {t.price}</span>
          <button className="ticket-buy-btn" onClick={() => handleBuy(i)}>
            BUY
          </button>
        </div>
      ))}

      {/* SUMMARY */}
      {order.tickets.map(
        (t, i) =>
          t.qty > 0 && (
            <div className="summary-box" key={i}>
              <span>NPR {t.price}</span>
              <span>X{t.qty}</span>
              <span>{t.price * t.qty}.00</span>
            </div>
          )
      )}

      {/* PROMO */}
      <div className="promo">
        <label>Got a promo code ?</label>

        <div className="promo-input-wrapper">
          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="XXXXXXXX"
            className={
              promoStatus === "success"
                ? "promo-success"
                : promoStatus === "error"
                ? "promo-error"
                : ""
            }
          />
          <button className="promo-apply-btn" onClick={applyPromo}>
            APPLY
          </button>
        </div>

        {promoStatus === "success" && (
          <p className="promo-text success">Promo applied 🎉</p>
        )}
        {promoStatus === "error" && (
          <p className="promo-text error">Invalid promo ❌</p>
        )}
      </div>

      {/* TOTAL */}
      <div className="summary-box total">
        <strong>Total</strong>
        <strong>NPR {total}</strong>
      </div>

      <button className="next-green" disabled={total === 0} onClick={next}>
        NEXT
      </button>
    </div>
  );
};

export default StepTicket;
