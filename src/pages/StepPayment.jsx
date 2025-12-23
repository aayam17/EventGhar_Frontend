import { useState } from "react";
import Auth from "./Auth";
import "../assets/css/StepPayment.css";

const StepPayment = ({ order, event }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = () =>
    !!localStorage.getItem("eventghar_token");

  const handleEsewaPay = () => {
    if (!isLoggedIn()) {
      setShowAuth(true);
      return;
    }
    proceedEsewa();
  };

  const proceedEsewa = async () => {
    if (!order.total || order.total <= 0) {
      alert("Invalid payment amount");
      return;
    }

    try {
      setLoading(true);

      /* ✅ FIX: PROPER USER MAPPING */
      const storedUser = JSON.parse(
        localStorage.getItem("eventghar_user")
      );

      const res = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          eventTitle: event.title,

          /* ✅ CRITICAL FIX */
          user: {
            id: storedUser._id,
            name: storedUser.fullName,
            email: storedUser.email,
            phone: storedUser.phone,
          },

          tickets: order.tickets.filter((t) => t.qty > 0),
          promoCode: order.promoCode,
          discount: order.discount || 0,
          subtotal: order.subtotal,
          total: order.total,
          payment: { method: "ESEWA", status: "PENDING" },
        }),
      });

      if (!res.ok) throw new Error("Order creation failed");

      const savedOrder = await res.json();

      const signRes = await fetch(
        "http://localhost:5001/api/esewa/initiate-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: savedOrder._id }),
        }
      );

      const data = await signRes.json();

      const form = document.createElement("form");
      form.method = "POST";
      form.action =
        "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      Object.entries(data).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      alert("Payment initiation failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (showAuth) {
    return (
      <Auth
        onSuccess={() => {
          setShowAuth(false);
          proceedEsewa();
        }}
      />
    );
  }

  return (
    <div className="step-card payment">
      <button
        className="esewa-btn"
        disabled={loading}
        onClick={handleEsewaPay}
      >
        {loading ? "PROCESSING..." : "PAY WITH ESEWA"}
      </button>
    </div>
  );
};

export default StepPayment;
