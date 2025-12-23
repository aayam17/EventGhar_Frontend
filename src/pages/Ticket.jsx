import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Navbar from "../components/Navbar";
import "../assets/css/Ticket.css";

const Ticket = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showTransfer, setShowTransfer] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");

  const [snackbar, setSnackbar] = useState(null);
  const [busy, setBusy] = useState(false);
  const [exiting, setExiting] = useState(false);

  const ticketRef = useRef(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    fetch(`http://localhost:5001/api/orders/${orderId}`)
      .then((res) => res.json())
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [orderId]);

  /* ================= EXIT + REDIRECT ================= */
  const redirectWithExit = () => {
    setExiting(true);
    setTimeout(() => navigate("/"), 450);
  };

  /* ================= SNACKBAR ================= */
  const notify = (type, text, autoExit = false) => {
    setSnackbar({ type, text });
    setTimeout(() => {
      setSnackbar(null);
      if (autoExit) redirectWithExit();
    }, 1800);
  };

  /* ================= DOWNLOAD ================= */
  const downloadTicket = async () => {
    try {
      setBusy(true);

      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        backgroundColor: "#fff",
      });

      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
      pdf.save("event-ticket.pdf");

      notify("success", "Ticket downloaded", true);
    } catch {
      notify("error", "Download failed");
    } finally {
      setBusy(false);
    }
  };

  /* ================= TRANSFER ================= */
  const transferTicket = async () => {
    if (!newEmail || !newName) {
      notify("warning", "Fill all fields");
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

      setShowTransfer(false);
      notify("success", "Ticket transferred", true);
    } catch {
      notify("error", "Transfer failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="ticket-loading">Loading…</div>;

  return (
    <>
      <Navbar />

      <div className={`ticket-page ${exiting ? "fade-out" : ""}`}>
        <div className="ticket-card" ref={ticketRef}>
          <div className="ticket-header">
            <h2>{order.eventTitle}</h2>
            <span className="success">SUCCESS</span>
          </div>

          <div className="ticket-body">
            <div className="ticket-info">
              <p><strong>ID:</strong> {order._id}</p>
              <p><strong>Name:</strong> {order.user.name}</p>
              <p><strong>Email:</strong> {order.user.email}</p>
              <p><strong>Total:</strong> NPR {order.total}</p>
            </div>

            <div className="ticket-qr">
              <QRCodeCanvas value={order._id} size={160} />
            </div>
          </div>
        </div>

        <div className="ticket-actions">
          <button className="download-btn" disabled={busy} onClick={downloadTicket}>
            {busy ? "PROCESSING…" : "DOWNLOAD"}
          </button>

          <button className="download-btn secondary" disabled={busy} onClick={() => setShowTransfer(true)}>
            TRANSFER
          </button>
        </div>

        {/* 👈 BACK HOME CTA */}
        <button className="back-home" onClick={redirectWithExit}>
          ← Back to Home
        </button>

        {/* MODAL */}
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
        placeholder="Recipient Email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />

      {/* ACTION ROW */}
      <div className="modal-actions">
        {/* 👈 BACK (CLOSE MODAL ONLY) */}
        <button
          className="modal-back"
          type="button"
          onClick={() => {
            setShowTransfer(false);
            setNewName("");
            setNewEmail("");
          }}
        >
          ← Back
        </button>

        {/* SEND */}
        <button
          className="modal-primary"
          disabled={busy}
          onClick={transferTicket}
        >
          {busy ? "SENDING…" : "SEND"}
        </button>
      </div>
    </div>
  </div>
)}


        {/* SNACKBAR */}
        {snackbar && (
          <div className={`snackbar ${snackbar.type}`}>
            <span className="icon">
              {snackbar.type === "success" && "✅"}
              {snackbar.type === "error" && "❌"}
              {snackbar.type === "warning" && "⚠️"}
            </span>
            {snackbar.text}
            <div className="snackbar-bar" />
          </div>
        )}
      </div>
    </>
  );
};

export default Ticket;
