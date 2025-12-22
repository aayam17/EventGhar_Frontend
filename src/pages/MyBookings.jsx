import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../assets/css/MyBookings.css";

const MyBookings = () => {
  const [orders, setOrders] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [snackbar, setSnackbar] = useState("");

  /* ================= FETCH BOOKINGS ================= */
  useEffect(() => {
    fetch("http://localhost:5001/api/orders")
      .then((res) => res.json())
      .then((data) =>
        setOrders(data.filter((o) => o.payment?.status === "PAID"))
      );
  }, []);

  /* ================= SNACKBAR ================= */
  const showSnackbar = (msg) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(""), 3000);
  };

  /* ================= REFUND ================= */
  const requestRefund = async (orderId) => {
    const confirm = window.confirm(
      "Are you sure you want to request a refund?"
    );
    if (!confirm) return;

    setLoadingId(orderId);

    try {
      await fetch(
        `http://localhost:5001/api/orders/${orderId}/refund`,
        { method: "POST" }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                refund: { requested: true, status: "pending" },
              }
            : o
        )
      );

      showSnackbar("Refund request submitted");
    } catch {
      showSnackbar("Failed to request refund");
    } finally {
      setLoadingId(null);
      setMenuOpen(null);
    }
  };

  return (
    <>
      <Navbar />

      <div className="my-bookings-container">
        <h2>My Bookings</h2>

        {orders.length === 0 && (
          <p className="empty-state">
            You haven’t booked any events yet.
          </p>
        )}

        {orders.map((order) => (
          <div key={order._id} className="booking-row">
            {/* EVENT */}
            <div className="event-info">
              <strong>{order.eventTitle}</strong>
              <span className="ticket-count">
                {order.tickets.reduce((s, t) => s + t.qty, 0)} tickets
              </span>
            </div>

            {/* PRICE */}
            <div className="price">
              NPR {order.total}
            </div>

            {/* STATUS */}
            <div className="status success">
              Purchased
            </div>

            {/* ACTIONS */}
            <div className="actions">
              <button
                className="dots"
                onClick={() =>
                  setMenuOpen(
                    menuOpen === order._id ? null : order._id
                  )
                }
                aria-label="More actions"
              >
                ⋮
              </button>

              {menuOpen === order._id && (
                <div className="dropdown">
                  {!order.refund?.requested && (
                    <button
                      disabled={loadingId === order._id}
                      onClick={() => requestRefund(order._id)}
                    >
                      {loadingId === order._id
                        ? "Requesting..."
                        : "Request Refund"}
                    </button>
                  )}

                  {order.refund?.requested && (
                    <span
                      className={`refund ${order.refund.status}`}
                    >
                      Refund {order.refund.status}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SNACKBAR */}
      {snackbar && (
        <div className="snackbar">{snackbar}</div>
      )}
    </>
  );
};

export default MyBookings;
