const StepPayment = ({ order, event }) => {
  const handleEsewaPay = async () => {
    if (!order.total || order.total <= 0) {
      alert("Invalid total amount");
      return;
    }

    const res = await fetch("http://localhost:5001/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: event._id,
        eventTitle: event.title,
        user: order.user,
        tickets: order.tickets.filter((t) => t.qty > 0),
        promoCode: order.promoCode,
        discount: order.discount || 0,
        subtotal: order.subtotal,
        total: order.total, // ✅ REAL TOTAL NOW
        payment: { method: "ESEWA", status: "PENDING" },
      }),
    });

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
  };

  return (
    <div className="step-card payment">
      <button className="esewa-btn" onClick={handleEsewaPay}>
        PAY WITH ESEWA
      </button>
    </div>
  );
};

export default StepPayment;
