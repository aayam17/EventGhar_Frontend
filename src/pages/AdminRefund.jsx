import { useEffect, useState } from "react";
import "/Users/aayambhattarai/EventGhar/frontend/frontend/src/assets/css/AdminRefund.css";

const AdminRefund = () => {
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/orders/refunds")
      .then(res => res.json())
      .then(setRefunds);
  }, []);

  const act = async (id, action) => {
    await fetch(`http://localhost:5001/api/orders/${id}/refund-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    window.location.reload();
  };

  return (
    <div>
      <h3>Refund Requests</h3>

      {refunds.map(order => (
        <div key={order._id} className="order-card">
          <p><strong>{order.user.name}</strong> – {order.eventTitle}</p>
          <p>NPR {order.total}</p>

          <button onClick={() => act(order._id, "APPROVED")}>
            Approve
          </button>
          <button onClick={() => act(order._id, "REJECTED")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminRefund;
