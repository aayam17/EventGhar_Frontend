import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Ticket as TicketIcon } from "lucide-react";
import Page from "../components/layout/Page";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import Dialog from "../components/ui/Dialog";
import Toast, { useSnack } from "../components/ui/Toast";
import { EventCardSkeleton } from "../components/ui/Skeleton";
import { api, userHeaders } from "../lib/api";

const MyBookings = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [snack, showSnack] = useSnack();
  const [dialog, setDialog] = useState(null);
  const menuRef = useRef(null);

  const refundLabel = (status) => `Refund ${String(status || "pending").toLowerCase()}`;

  useEffect(() => {
    if (!localStorage.getItem("eventghar_token")) {
      setLoading(false);
      return;
    }

    fetch(api("/api/orders/mine"), {
      headers: userHeaders(false),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setOrders(data.filter((o) => o.payment?.status === "PAID")))
      .catch(() => showSnack("Couldn't load your bookings", "error"))
      .finally(() => setLoading(false));
  }, []);

  // Close the open menu on outside click — this is what was missing,
  // which is part of why the dropdown felt broken.
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const requestRefund = (order) => {
    setMenuOpen(null);
    setDialog({
      title: "Request a refund?",
      description: `We'll review your refund request for "${order.eventTitle}". You'll be notified once it's approved or rejected.`,
      confirmLabel: "Request refund",
      onConfirm: () => submitRefund(order._id),
    });
  };

  const submitRefund = async (orderId) => {
    setLoadingId(orderId);
    try {
      const res = await fetch(api(`/api/orders/${orderId}/refund`), {
        method: "POST",
        headers: userHeaders(),
      });
      const data = await res.json();

      if (!res.ok) {
        showSnack(data.message || "This event isn't eligible for refunds.", "error");
        return;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, refund: { requested: true, status: "PENDING" } } : o
        )
      );
      showSnack("Refund request submitted", "success");
    } catch {
      showSnack("Failed to request refund", "error");
    } finally {
      setLoadingId(null);
      setMenuOpen(null);
    }
  };

  return (
    <Page>
      <div className="mx-auto max-w-4xl px-6 py-10 md:px-9">
        <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
          My bookings
        </h1>

        <div className="mt-8 space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
          ) : !localStorage.getItem("eventghar_token") ? (
            <EmptyState
              icon={TicketIcon}
              title="Log in to see your bookings"
              description="Use the Log in button at the top of the page to view your tickets."
            />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={TicketIcon}
              title="No bookings yet"
              description="Once you buy a ticket, it'll show up here."
            />
          ) : (
            orders.map((order) => {
              const ticketCount = order.tickets.reduce((s, t) => s + t.qty, 0);
              const isMenuOpen = menuOpen === order._id;
              const eventRefundable = order.eventId?.isRefundable;

              return (
                <div
                  key={order._id}
                  className="flex items-center justify-between gap-4 border-2 border-ink bg-white p-5 shadow-card"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-semibold text-ink">
                      <button
                        onClick={() => navigate(`/ticket/${order._id}`)}
                        className="truncate text-left hover:underline"
                      >
                        {order.eventTitle}
                      </button>
                    </p>
                    <p className="text-sm text-stone-500">
                      {ticketCount} ticket{ticketCount !== 1 ? "s" : ""}
                    </p>
                    {eventRefundable && !order.refund?.requested && (
                      <p className="mt-1 text-xs font-medium text-marigold-dark">
                        This event was cancelled. You're eligible for a refund.
                      </p>
                    )}
                  </div>

                  <p className="hidden font-display font-semibold text-ink sm:block">
                    NPR {Number(order.total).toLocaleString()}
                  </p>

                  <Badge tone={order.refund?.requested ? "pending" : "available"}>
                    {order.refund?.requested ? refundLabel(order.refund.status) : "Purchased"}
                  </Badge>

                  {/* Menu wrapper needs position:relative + high z-index so the
                      dropdown floats above sibling cards instead of being
                      clipped or drawn underneath them. */}
                  <div className="relative z-10" ref={isMenuOpen ? menuRef : null}>
                    <button
                      onClick={() => setMenuOpen(isMenuOpen ? null : order._id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-ink"
                      aria-label="More actions"
                      aria-expanded={isMenuOpen}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 top-11 z-50 w-60 overflow-hidden border-2 border-ink bg-white py-1.5 shadow-pop">
                        <button
                          onClick={() => navigate(`/ticket/${order._id}`)}
                          className="block w-full px-4 py-2.5 text-left text-sm font-medium text-ink transition hover:bg-stone-100"
                        >
                          View ticket &amp; QR
                        </button>
                        {order.refund?.requested ? (
                          <p className="px-4 py-2.5 text-sm text-stone-500">
                            {refundLabel(order.refund.status)}
                          </p>
                        ) : eventRefundable ? (
                          <button
                            disabled={loadingId === order._id}
                            onClick={() => requestRefund(order)}
                            className="block w-full px-4 py-2.5 text-left text-sm font-medium text-raspberry transition hover:bg-raspberry/10 disabled:opacity-50"
                          >
                            {loadingId === order._id ? "Requesting..." : "Request refund"}
                          </button>
                        ) : (
                          <p className="px-4 py-2.5 text-sm text-stone-400">
                            This ticket isn't refundable
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {dialog && <Dialog {...dialog} onClose={() => setDialog(null)} />}
      {snack && <Toast message={snack.message} type={snack.type} />}
    </Page>
  );
};

export default MyBookings;
