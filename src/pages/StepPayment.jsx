import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Auth from "./Auth";
import Button from "../components/ui/Button";
import { api, userHeaders } from "../lib/api";

const StepPayment = ({ order, event, prev }) => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = () => !!localStorage.getItem("eventghar_token");
  const isFree = Number(order.total || 0) === 0;

  const handlePay = () => {
    if (!isLoggedIn()) {
      setShowAuth(true);
      return;
    }
    proceed();
  };

  const proceed = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = JSON.parse(localStorage.getItem("eventghar_user") || "{}");
      const entered = order.user || {};

      // Prices and totals are NOT sent. The server rebuilds them from the
      // event's real ticket prices and the promo code.
      const res = await fetch(api("/api/orders"), {
        method: "POST",
        headers: userHeaders(),
        body: JSON.stringify({
          eventId: event._id,
          user: {
            name: entered.name || storedUser.fullName,
            email: entered.email || storedUser.email,
            phone: entered.phone || storedUser.phone,
          },
          tickets: order.tickets
            .filter((t) => t.qty > 0)
            .map((t) => ({ type: t.type, qty: t.qty })),
          promoCode: order.promoCode || undefined,
        }),
      });

      const savedOrder = await res.json();
      if (!res.ok) throw new Error(savedOrder.message || "Order creation failed");

      if (savedOrder.payment?.status === "PAID") {
        navigate(`/ticket/${savedOrder._id}`);
        return;
      }

      const signRes = await fetch(api("/api/esewa/initiate-payment"), {
        method: "POST",
        headers: userHeaders(),
        body: JSON.stringify({ orderId: savedOrder._id }),
      });
      const data = await signRes.json();
      if (!signRes.ok) throw new Error(data.message || "Payment initiation failed");

      const form = document.createElement("form");
      form.method = "POST";
      form.action =
        data.form_url || "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      Object.entries(data).forEach(([k, v]) => {
        if (k === "form_url") return;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err.message || "Payment initiation failed. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  if (showAuth) {
    return (
      <Auth
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          setShowAuth(false);
          proceed();
        }}
      />
    );
  }

  const ticketLines = order.tickets.filter((t) => t.qty > 0);

  return (
    <div className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
      <h3 className="font-display text-lg font-semibold text-ink">
        Review &amp; pay
      </h3>

      <div className="space-y-2 rounded-xl bg-stone-50 p-4 text-sm">
        {ticketLines.map((t, i) => (
          <div key={i} className="flex justify-between text-stone-600">
            <span>
              {t.type} × {t.qty}
            </span>
            <span>
              {t.price === 0 ? "Free" : `NPR ${(t.qty * t.price).toLocaleString()}`}
            </span>
          </div>
        ))}
        {order.discount > 0 && (
          <div className="flex justify-between text-pine-dark">
            <span>Discount</span>
            <span>− NPR {order.discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-stone-200 pt-2 font-display text-base font-bold text-ink">
          <span>Total due</span>
          <span>
            {isFree ? "Free" : `NPR ${Number(order.total || 0).toLocaleString()}`}
          </span>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-raspberry/10 px-3 py-2 text-sm font-medium text-raspberry-dark">
          {error}
        </p>
      )}

      <Button
        className="w-full"
        variant="primary"
        size="lg"
        loading={loading}
        onClick={handlePay}
      >
        {loading
          ? isFree
            ? "Reserving your spot..."
            : "Redirecting to eSewa..."
          : isFree
            ? "Reserve free tickets"
            : "Pay with eSewa"}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-stone-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        {isFree
          ? "No payment needed for this event"
          : "You'll be redirected to eSewa's secure payment page"}
      </p>

      <button
        onClick={prev}
        className="mx-auto block text-sm font-medium text-stone-500 hover:text-ink"
      >
        Back to personal details
      </button>
    </div>
  );
};

export default StepPayment;
