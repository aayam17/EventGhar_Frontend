import { useEffect, useState } from "react";
import "../assets/css/CustomerList.css";
import Dialog from "../components/ui/Dialog";
import Toast, { useSnack } from "../components/ui/Toast";
import { api, adminHeaders } from "../lib/api";

const CustomerList = () => {
  const [orders, setOrders] = useState([]);
  const [dialog, setDialog] = useState(null);
  const [snack, showSnack] = useSnack();

  useEffect(() => {
    fetch(api("/api/orders"), { headers: adminHeaders(false) })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to load orders", err);
        setOrders([]);
        showSnack("Couldn't load orders. Try logging in again.", "error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (order) => {
    setDialog({
      title: "Delete this order?",
      description: `${order.user?.name || "This customer"}'s order for "${order.eventTitle}" will be removed permanently. This can't be undone.`,
      tone: "danger",
      confirmLabel: "Delete order",
      onConfirm: async () => {
        const res = await fetch(api(`/api/orders/${order._id}`), {
          method: "DELETE",
          headers: adminHeaders(false),
        });
        if (!res.ok) throw new Error("Couldn't delete the order");
        setOrders((prev) => prev.filter((o) => o._id !== order._id));
        showSnack("Order deleted", "success");
      },
    });
  };

  return (
    <div className="admin-card customer-list-wrapper">
      <h3>Customer Orders</h3>

      {orders.length === 0 && (
        <p className="empty-text">No customer orders yet.</p>
      )}

      {orders.map((order) => {
        const paymentStatus =
          order.refund?.status === "APPROVED"
            ? "REFUNDED"
            : order.used
            ? "TICKET VERIFIED"
            : order.payment?.status || "PENDING";

        const statusClass =
          order.refund?.status === "APPROVED"
            ? "refunded"
            : order.used
            ? "verified"
            : "";

        return (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <strong className="customer-name">
                  {order.user?.name || "Unknown User"}
                </strong>
                <p className="customer-email">
                  {order.user?.email || "Not provided"}
                </p>
              </div>

              <div className="order-actions">
                {/* ✅ SAFE STATUS BADGE */}
                <span className={`order-status ${statusClass}`}>
                  {paymentStatus}
                </span>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(order)}
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="event-title">
              <strong>Event:</strong> {order.eventTitle}
            </p>

            <ul className="ticket-list">
              {order.tickets?.map((t, i) => (
                <li key={i}>
                  {t.type} × {t.qty}
                  <span>NPR {t.price * t.qty}</span>
                </li>
              ))}
            </ul>

            <div className="order-summary">
              <p>Promo: {order.promoCode || "None"}</p>
              <p>Discount: NPR {order.discount || 0}</p>
              <p className="order-total">
                Total: NPR {order.total || 0}
              </p>
            </div>
          </div>
        );
      })}

      {dialog && <Dialog {...dialog} onClose={() => setDialog(null)} />}
      {snack && <Toast message={snack.message} type={snack.type} />}
    </div>
  );
};

export default CustomerList;
