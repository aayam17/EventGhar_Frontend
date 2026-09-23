import { useState, useEffect } from "react";
import { Tag } from "lucide-react";
import Button from "../components/ui/Button";
import Toast, { useSnack } from "../components/ui/Toast";
import QtyControl from "../components/ui/QtyControl";
import { api } from "../lib/api";

/* Same rule the server uses in utils/pricing.js, so the number shown here
   matches what the server will actually charge. The server always
   recalculates; this is only a preview. */
const discountFor = (promo, subtotal) => {
  if (!promo) return 0;
  const value = Number(promo.discountValue) || 0;
  if (promo.discountType === "PERCENT") {
    return Math.min(subtotal, Math.round((subtotal * value) / 100));
  }
  return Math.min(subtotal, value);
};

const StepTicket = ({ order, next }) => {
  const [promoCode, setPromoCode] = useState(order.promoCode || "");
  const [promoStatus, setPromoStatus] = useState(order.promo ? "success" : "");
  const [snack, showSnack] = useSnack();

  const increaseQty = (index) => {
    order.setOrder((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t, i) =>
        i === index ? { ...t, qty: Math.min(t.qty + 1, 20) } : t
      ),
    }));
  };

  const decreaseQty = (index) => {
    order.setOrder((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t, i) =>
        i === index && t.qty > 0 ? { ...t, qty: t.qty - 1 } : t
      ),
    }));
  };

  const subtotal = order.tickets.reduce((sum, t) => sum + t.price * t.qty, 0);
  const discount = discountFor(order.promo, subtotal);
  const total = Math.max(subtotal - discount, 0);
  const hasTickets = order.tickets.some((t) => t.qty > 0);

  // Keep the shared order in sync. Discount is derived from the stored promo,
  // so changing quantities after applying a percent code stays correct.
  useEffect(() => {
    order.setOrder((prev) => ({ ...prev, subtotal, discount, total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal, discount, total]);

  const applyPromo = async () => {
    if (!promoCode.trim() || !hasTickets) {
      showSnack("Add tickets before applying a promo code", "warning");
      return;
    }

    try {
      const res = await fetch(api("/api/promos/validate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim() }),
      });

      if (!res.ok) throw new Error();
      const promo = await res.json();

      order.setOrder((prev) => ({
        ...prev,
        promo,
        promoCode: promo.code,
      }));
      setPromoStatus("success");
      showSnack("Promo code applied", "success");
    } catch {
      order.setOrder((prev) => ({
        ...prev,
        promo: null,
        promoCode: null,
        discount: 0,
      }));
      setPromoStatus("error");
      showSnack("That promo code isn't valid", "error");
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
      <div className="space-y-3">
        {order.tickets.map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-ink">{t.type}</p>
              <p className="text-sm text-stone-500">
                {Number(t.price) === 0
                  ? "Free"
                  : `NPR ${Number(t.price).toLocaleString()}`}
              </p>
            </div>
            <QtyControl
              value={t.qty}
              onDec={() => decreaseQty(i)}
              onInc={() => increaseQty(i)}
            />
          </div>
        ))}
      </div>

      {/* PROMO */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700">Promo code</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                setPromoStatus("");
              }}
              placeholder="Enter code"
              className={[
                "w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all",
                promoStatus === "error"
                  ? "border-raspberry"
                  : promoStatus === "success"
                  ? "border-pine"
                  : "border-stone-200 focus:border-marigold-dark focus:ring-4 focus:ring-marigold/15",
              ].join(" ")}
            />
          </div>
          <Button variant="secondary" disabled={!promoCode.trim()} onClick={applyPromo}>
            Apply
          </Button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="space-y-2 border-t border-dashed border-stone-200 pt-4 text-sm">
        {hasTickets &&
          order.tickets.map(
            (t, i) =>
              t.qty > 0 && (
                <div key={i} className="flex justify-between text-stone-600">
                  <span>
                    {t.type} × {t.qty}
                  </span>
                  <span>
                    {t.price === 0
                      ? "Free"
                      : `NPR ${(t.qty * t.price).toLocaleString()}`}
                  </span>
                </div>
              )
          )}
        {discount > 0 && (
          <div className="flex justify-between text-pine-dark">
            <span>Discount</span>
            <span>− NPR {discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-stone-200 pt-2 font-display text-base font-bold text-ink">
          <span>Total</span>
          <span>
            {hasTickets && total === 0 ? "Free" : `NPR ${total.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Only block when nothing is selected. Free events have a total of 0
          and must still be bookable. */}
      <Button className="w-full" disabled={!hasTickets} onClick={next}>
        Continue to personal details
      </Button>

      {snack && <Toast message={snack.message} type={snack.type} />}
    </div>
  );
};

export default StepTicket;
