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

  const [snackbar, setSnackbar] = useState("");
  const [busy, setBusy] = useState(false);

  const ticketRef = useRef(null);

  /* ================= LOAD ORDER ================= */
  useEffect(() => {
    fetch(`http://localhost:5001/api/orders/${orderId}`)
      .then((res) => res.json())
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [orderId]);

  /* ================= SNACKBAR ================= */
  const notify = (msg) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(""), 2800);
  };

  /* ================= DOWNLOAD ================= */
  const downloadTicket = async () => {
    try {
      setBusy(true);
      await new Promise((r) => setTimeout(r, 300));

      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
      pdf.save("event-ticket.pdf");

      notify("🎉 Ticket downloaded successfully");
    } catch {
      notify("❌ Failed to download ticket");
    } finally {
      setBusy(false);
    }
  };

  /* ================= TRANSFER ================= */
  const transferTicket = async () => {
    if (!newEmail || !newName) {
      notify("⚠️ Please fill all fields");
      return;
    }

    try {
      setBusy(true);
      const res = await fetch(
        "http://localhost:5001/api/orders/transfer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, newEmail, newName }),
        }
      );

      if (!res.ok) throw new Error();
      notify("🎫 Ticket transferred successfully");
      setShowTransfer(false);
      setNewEmail("");
      setNewName("");
    } catch {
      notify("❌ Transfer failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="ticket-loading">Loading ticket…</div>;

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
          <button
            className="download-btn"
            disabled={busy}
            onClick={downloadTicket}
          >
            {busy ? "PROCESSING…" : "DOWNLOAD"}
          </button>

          <button
            className="download-btn secondary"
            disabled={busy}
            onClick={() => setShowTransfer(true)}
          >
            TRANSFER
          </button>
        </div>

        {/* ================= TRANSFER MODAL ================= */}
        {showTransfer && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Transfer Ticket</h3>

              <input
                placeholder="Recipient Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                placeholder="Registered Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />

              <button disabled={busy} onClick={transferTicket}>
                {busy ? "SENDING…" : "SEND TICKET"}
              </button>
            </div>
          </div>
        )}

        {/* ================= SNACKBAR ================= */}
        {snackbar && <div className="snackbar">{snackbar}</div>}
      </div>
    </>
  );
};

export default Ticket;
