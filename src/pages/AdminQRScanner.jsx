import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./AdminQRScanner.css";

const AdminQRScanner = () => {
  const scannerRef = useRef(null);

  const [mode, setMode] = useState(null); // null | "camera" | "file"
  const [status, setStatus] = useState(null); // success | error
  const [order, setOrder] = useState(null);

  /* 🔊 Beep sound */
  const beep = () => {
    const audio = new Audio("/beep.mp3"); // put beep.mp3 in /public
    audio.play();
  };

  /* ===============================
     VERIFY TICKET
  ================================ */
  const verifyTicket = async (ticketId) => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/orders/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketId }),
        }
      );

      const data = await res.json();

      if (data.valid) {
        beep(); // 🔊
        setStatus("success");
        setOrder(data.order);

        // 📸 Auto-close camera
        if (scannerRef.current) {
          await scannerRef.current.stop();
          await scannerRef.current.clear();
          scannerRef.current = null;
        }
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  /* ===============================
     CAMERA MODE (MANUAL INIT)
  ================================ */
  const startCamera = async () => {
    setStatus(null);
    setOrder(null);
    setMode("camera");

    setTimeout(async () => {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => verifyTicket(decodedText),
        () => {}
      );
    }, 0);
  };

  /* ===============================
     FILE UPLOAD MODE
  ================================ */
  const handleFileScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const scanner = new Html5Qrcode("qr-file-reader");

    try {
      const decodedText = await scanner.scanFile(file, true);
      verifyTicket(decodedText);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="qr-admin-container">
      <div className="qr-admin-card">

        {/* MODE SELECTION */}
        {!mode && (
          <div className="qr-mode-select">
            <h3 className="qr-title">🎫 Verify Ticket</h3>
            <p className="qr-subtitle">Choose verification method</p>

            <div className="qr-mode-buttons">
              <button onClick={() => setMode("file")}>
                📂 Upload QR Image
              </button>
              <button onClick={startCamera}>
                📷 Scan with Camera
              </button>
            </div>
          </div>
        )}

        {/* FILE MODE */}
        {mode === "file" && (
          <div className="qr-file-mode">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileScan}
            />
            <div id="qr-file-reader" />
          </div>
        )}

        {/* CAMERA MODE */}
        {mode === "camera" && (
          <div className="qr-layout">
            <div className="qr-left">
              <h3 className="qr-title">Scan Ticket</h3>
              <div className="qr-reader-box">
                <div id="qr-reader" />
              </div>
            </div>

            <div className="qr-right">
              {!status && (
                <div className="qr-placeholder">
                  Awaiting scan...
                </div>
              )}

              {status === "success" && order && (
                <div className="qr-result success">
                  <h4>✅ Entry Allowed</h4>
                  <p><strong>Name:</strong> {order.user.name}</p>
                  <p><strong>Event:</strong> {order.eventTitle}</p>

                  <span className="order-status verified">
                    TICKET VERIFIED
                  </span>
                </div>
              )}

              {status === "error" && (
                <div className="qr-result error">
                  <h4>❌ Entry Denied</h4>
                  <span className="order-status rejected">
                    INVALID / USED
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminQRScanner;
