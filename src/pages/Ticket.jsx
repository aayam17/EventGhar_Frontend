import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Navbar from "../components/Navbar";
import "../assets/css/Ticket.css";

const Ticket = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTransfer, setShowTransfer] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const ticketRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:5001/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      });
  }, [orderId]);

  const downloadTicket = async () => {
    const canvas = await html2canvas(ticketRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "px", "a4");
    pdf.addImage(imgData, "PNG", 20, 20);
    pdf.save("event-ticket.pdf");
  };

  const transferTicket = async () => {
    await fetch("http://localhost:5001/api/orders/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        newEmail,
        newName,
      }),
    });

    alert("🎫 Ticket transferred & emailed successfully!");
    setShowTransfer(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="ticket-page">
        <div className="ticket-card" ref={ticketRef}>
          <div className="ticket-header">
            <h2>{order.eventTitle}</h2>
            <span className="success">SUCCESS</span>
          </div>

          <div className="ticket-body">
            <div className="ticket-info">
              <p><strong>Ticket ID:</strong> {order._id}</p>
              <p><strong>Name:</strong> {order.user.name}</p>
              <p><strong>Email:</strong> {order.user.email}</p>
              <p><strong>Total Paid:</strong> NPR {order.total}</p>
            </div>

            <div className="ticket-qr">
              <p>SCAN QR AT ENTRY</p>
              <QRCodeCanvas value={order._id} size={160} />
            </div>
          </div>
        </div>

        <div className="ticket-actions">
          <button className="download-btn" onClick={downloadTicket}>
            DOWNLOAD
          </button>
          <button className="download-btn" onClick={() => setShowTransfer(true)}>
            TRANSFER
          </button>
        </div>

        {/* 🔁 TRANSFER MODAL */}
        {showTransfer && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Transfer Ticket</h3>
              <input
                placeholder="New Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                placeholder="New Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button onClick={transferTicket}>SEND TICKET</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Ticket;
