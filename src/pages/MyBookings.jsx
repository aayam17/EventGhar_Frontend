import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../assets/css/MyBookings.css";

const MyBookings = () => {
  const [orders, setOrders] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/orders")
      .then(res => res.json())
      .then(data =>
        setOrders(data.filter(o => o.payment?.status === "PAID"))
      );
  }, []);

  const requestRefund = async (id) => {
    await fetch(`http://localhost:5001/api/orders/${id}/refund`, {
      method: "POST",
    });
    window.location.reload();
  };

  return (
    <>
      <Navbar />
      <div className="my-bookings-container">
        <h2>My Bookings</h2>

        {orders.map(order => (
          <div key={order._id} className="booking-row">
            <div className="event-info">
              <strong>{order.eventTitle}</strong>
            </div>

            <div>NPR {order.total}</div>
            <div>{order.tickets.reduce((s, t) => s + t.qty, 0)}x</div>

            <div className="status">Purchased</div>

            <div className="actions">
              <span
                className="dots"
                onClick={() =>
                  setMenuOpen(menuOpen === order._id ? null : order._id)
                }
              >
                ⋮
              </span>

              {menuOpen === order._id && (
                <div className="dropdown">
                  {!order.refund?.requested && (
                    <button onClick={() => requestRefund(order._id)}>
                      Request Refund
                    </button>
                  )}

                  {order.refund?.requested && (
                    <span className={`refund ${order.refund.status}`}>
                      {order.refund.status}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyBookings;
