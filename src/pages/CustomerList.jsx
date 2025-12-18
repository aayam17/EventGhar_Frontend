import { useEffect, useState } from "react";
import "../assets/css/CustomerList.css";

const CustomerList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/orders")
      .then(res => res.json())
      .then(setOrders);
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this order?");
    if (!confirm) return;

    try {
      await fetch(`http://localhost:5001/api/orders/${id}`, {
        method: "DELETE",
      });

      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      alert("Failed to delete order");
      console.error(err);
    }
  };

  return (
    <div className="admin-card customer-list-wrapper">
      <h3>Customer Orders</h3>

      {orders.length === 0 && (
        <p className="empty-text">No customer orders yet.</p>
      )}

      {orders.map(order => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <div>
              <strong className="customer-name">{order.user.name}</strong>
              <p className="customer-email">{order.user.email}</p>
            </div>

            <div className="order-actions">
              <span className="order-status">
                {order.payment.status}
              </span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(order._id)}
              >
                Delete
              </button>
            </div>
          </div>

          <p className="event-title">
            <strong>Event:</strong> {order.eventTitle}
          </p>

          <ul className="ticket-list">
            {order.tickets.map((t, i) => (
              <li key={i}>
                {t.type} × {t.qty}
                <span>NPR {t.price * t.qty}</span>
              </li>
            ))}
          </ul>

          <div className="order-summary">
            <p>Promo: {order.promoCode || "None"}</p>
            <p>Discount: NPR {order.discount}</p>
            <p className="order-total">
              Total: NPR {order.total}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerList;
