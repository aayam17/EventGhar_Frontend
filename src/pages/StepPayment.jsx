import { useState } from "react";

const StepPayment = ({ order, event, prev }) => {
  const [loading, setLoading] = useState(false);

  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);

      // GUARD: User info required
      if (!order.user?.name || !order.user?.email) {
        alert("Please fill personal details before payment.");
        return;
      }

      const subtotal = order.tickets.reduce(
        (sum, t) => sum + t.price * t.qty,
        0
      );

      const finalOrder = {
        eventId: event._id,
        eventTitle: event.title,

        user: order.user,

        tickets: order.tickets.filter((t) => t.qty > 0),

        promoCode: order.promoCode || null,
        discount: order.discount || 0,

        subtotal,
        total: subtotal - (order.discount || 0),

        payment: {
          method: "ESEWA",
          status: "PAID",
          transactionId: "TXN-" + Date.now(),
        },
      };

      const res = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalOrder),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("ORDER API ERROR:", text);
        throw new Error(text);
      }

      alert("Payment Successful 🎉\nCheck Admin → Customer section");
    } catch (err) {
      console.error(err);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step-card payment">
      <button
        className="esewa-btn"
        onClick={handlePaymentSuccess}
        disabled={loading}
      >
        {loading ? "PROCESSING..." : "PAY WITH ESEWA"}
      </button>

      <div className="actions">
        <button className="prev-btn" onClick={prev} disabled={loading}>
          PREVIOUS
        </button>
      </div>
    </div>
  );
};

export default StepPayment;
