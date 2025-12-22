import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import AddEvent from "./AddEvent";
import EventList from "./EventList";
import AddFeaturedEvent from "./AddFeaturedEvent";
import FeaturedManager from "./FeaturedManager";
import OrganizerRequests from "./OrganizerRequests";
import AdminPromo from "./AdminPromo";
import CustomerList from "./CustomerList";
import AdminRefund from "./AdminRefund";

/* ------------------ CONSTANTS ------------------ */
const EventGharLogo =
  "https://placehold.co/100x40/e74c3c/FFFFFF?text=EVENT+GHAR";

/* ------------------ STYLE INJECTOR ------------------ */
const StyleInjector = ({ css }) => (
  <style dangerouslySetInnerHTML={{ __html: css }} />
);

/* ------------------ SVG ICON ------------------ */
const EventIconSVG = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/* ------------------ SIDEBAR ------------------ */
const Sidebar = ({ activeItem, setActiveItem, onAdd }) => {
  const navItems = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Events", icon: EventIconSVG },
    { name: "Featured", icon: "⭐" },
    { name: "Customer", icon: "🧑‍💻" },
    { name: "Scan Ticket", icon: "🎫" },
    { name: "Refund", icon: "🔄" },
    { name: "Organizer", icon: "🏢" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="admin-sidebar">
      <button className="new-event-btn" onClick={onAdd}>
        + New {activeItem === "Featured" ? "Featured Event" : "Event"}
      </button>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.name}
            className={`nav-item ${activeItem === item.name ? "active" : ""}`}
            onClick={() => setActiveItem(item.name)}
          >
            <span className="nav-icon">
              {typeof item.icon === "function" ? (
                <item.icon className="svg-icon-style" />
              ) : (
                item.icon
              )}
            </span>
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

/* ------------------ HEADER ------------------ */
const AdminHeader = () => (
  <header className="admin-header">
    <div className="header-left">
      <img src={EventGharLogo} alt="Event Ghar Logo" className="admin-logo" />
      <span className="header-title-text">Analytics</span>
    </div>
  </header>
);

/* ------------------ METRIC CARD ------------------ */
const MetricCard = ({ icon, label, value, color }) => (
  <div className="metric-card" style={{ borderColor: color }}>
    <div className="metric-icon-bg" style={{ backgroundColor: `${color}1A` }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  </div>
);

/* ------------------ MODAL ------------------ */
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

/* ================== QR SCANNER ================== */
const AdminQRScanner = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const res = await fetch(
            "http://localhost:5001/api/orders/verify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ticketId: decodedText }),
            }
          );
          const data = await res.json();
          alert(data.message);
        } catch {
          alert("Verification failed");
        }
      },
      () => {}
    );

    return () => scanner.clear().catch(() => {});
  }, []);

  return (
    <div className="analytics-card" style={{ maxWidth: 420 }}>
      <h3 className="card-title">🎫 Scan Ticket</h3>
      <div id="qr-reader" />
    </div>
  );
};

/* ================== MAIN DASHBOARD ================== */
const AdminDashboard = () =>
   {
  
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [eventModal, setEventModal] = useState(false);
  const [featuredModal, setFeaturedModal] = useState(false);
  const [range, setRange] = useState("TODAY");

  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/events").then(r => r.json()).then(setEvents);
    fetch("http://localhost:5001/api/orders").then(r => r.json()).then(setOrders);
    fetch("http://localhost:5001/api/orders/refunds").then(r => r.json()).then(setRefunds);
    fetch("http://127.0.0.1:5001/api/host-requests").then(r => r.json()).then(setOrganizers);
  }, []);

  const paidOrders = orders.filter(o => o.payment?.status === "PAID");
  const totalSales = paidOrders.reduce((s, o) => s + (o.total || 0), 0);

  const metrics = [
    { label: "Income", value: `NPR ${totalSales.toLocaleString()}`, icon: "📊", color: "#ffb700" },
    { label: "Customers", value: paidOrders.length, icon: "🧑‍💻", color: "#55aaff" },
    { label: "Events Live", value: events.length, icon: "🎉", color: "#2ecc71" },
    { label: "Gross Sales", value: `NPR ${totalSales.toLocaleString()}`, icon: "💰", color: "#3498db" },
  ];

  const renderDashboard = () => {
  const now = new Date();

  const inRange = (date) => {
    const d = new Date(date);
    if (range === "TODAY")
      return d.toDateString() === now.toDateString();

    if (range === "WEEK")
      return (now - d) / (1000 * 60 * 60 * 24) <= 7;

    if (range === "MONTH")
      return d.getMonth() === now.getMonth();

    return true;
  };

  const filteredOrders = paidOrders.filter(o =>
    inRange(o.createdAt)
  );

  const totalSalesFiltered = filteredOrders.reduce(
    (s, o) => s + (o.total || 0),
    0
  );

  const revenueByEvent = {};
  filteredOrders.forEach(o => {
    revenueByEvent[o.eventTitle] =
      (revenueByEvent[o.eventTitle] || 0) + o.total;
  });

  return (
    <>
      {/* RANGE TOGGLE */}
      <div className="range-toggle">
        {["TODAY", "WEEK", "MONTH"].map(r => (
          <button
            key={r}
            className={range === r ? "active" : ""}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* METRICS */}
      <div className="metric-cards-container">
        <MetricCard icon="📊" label="Income"
          value={`NPR ${totalSalesFiltered.toLocaleString()}`}
          color="#ffb700" />

        <MetricCard icon="🧑‍💻" label="Customers"
          value={filteredOrders.length}
          color="#55aaff" />

        <MetricCard icon="🎉" label="Events Live"
          value={events.length}
          color="#2ecc71" />

        <MetricCard icon="💰" label="Gross Sales"
          value={`NPR ${totalSalesFiltered.toLocaleString()}`}
          color="#3498db" />
      </div>

      {/* ACTION REQUIRED */}
      <div className="analytics-card">
        <h3 className="card-title">Action Required</h3>

        {refunds.filter(r => r.status === "PENDING").length > 0 && (
          <div className="alert-item">🔄 Pending refunds</div>
        )}

        {organizers.filter(o => o.status === "pending").length > 0 && (
          <div className="alert-item">🏢 Organizer approvals pending</div>
        )}

        {filteredOrders.filter(o => !o.used).length > 10 && (
          <div className="alert-item">🎫 High unused tickets</div>
        )}
      </div>

      {/* TOP EVENTS */}
      <div className="analytics-card">
        <h3 className="card-title">Top Performing Events</h3>

        {Object.entries(revenueByEvent)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([title, value], i) => (
            <div key={title} className="sales-item">
              <span>#{i + 1}</span>
              <strong>{title}</strong>
              <span>NPR {value.toLocaleString()}</span>
            </div>
          ))}
      </div>

      {/* LIVE ACTIVITY */}
      <div className="analytics-card">
        <h3 className="card-title">Live Activity</h3>

        {orders.slice(-8).reverse().map(o => (
          <div key={o._id} className="sales-item">
            <span>{o.user.name}</span>
            <strong>{o.eventTitle}</strong>
            <span>{o.used ? "🎫 Verified" : "💰 Paid"}</span>
          </div>
        ))}
      </div>
    </>
  );
};

  const renderContent = () => {
    if (activeItem === "Dashboard") return renderDashboard();
    if (activeItem === "Events") return <EventList />;
    if (activeItem === "Featured") return <FeaturedManager />;
    if (activeItem === "Customer") return <CustomerList />;
    if (activeItem === "Scan Ticket") return <AdminQRScanner />;
    if (activeItem === "Refund") return <AdminRefund />;
    if (activeItem === "Organizer") return (<><AdminPromo /><OrganizerRequests /></>);
    return null;
  };

  return (
    <>
      <StyleInjector css={AdminDashboardStyles + modernCSS} />

      <div className="admin-app-container">
        <AdminHeader />
        <div className="admin-main-layout">
          <Sidebar
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            onAdd={() => activeItem === "Featured" ? setFeaturedModal(true) : setEventModal(true)}
          />
          <main className="admin-content-area">{renderContent()}</main>
        </div>
      </div>

      <Modal isOpen={eventModal} onClose={() => setEventModal(false)}>
        <AddEvent onClose={() => setEventModal(false)} />
      </Modal>

      <Modal isOpen={featuredModal} onClose={() => setFeaturedModal(false)}>
        <AddFeaturedEvent onClose={() => setFeaturedModal(false)} />
      </Modal>
    </>
  );
};

export default AdminDashboard;


// --- 7. Styles for Admin Dashboard (Updated for SVG) ---
const AdminDashboardStyles = `
:root {
  --admin-bg-light: #f6f7fb;
  --admin-sidebar-width: 260px;
  --admin-sidebar-bg: #ffffff;
  --admin-primary-red: #e74c3c;
  --admin-text-dark: #0f172a;
  --admin-text-light: #64748b;
  --admin-border-color: #e5e7eb;
  --admin-card-bg: #ffffff;
}

/* ================= GLOBAL ================= */
html, body, #root {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: linear-gradient(180deg, #f8fafc, #eef2f7);
}

.admin-app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ================= HEADER ================= */
.admin-header {
  height: 64px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--admin-border-color);
  padding: 0 28px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-title-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--admin-text-dark);
}

/* ================= LAYOUT ================= */
.admin-main-layout {
  display: flex;
  flex: 1;
}

/* ================= SIDEBAR ================= */
.admin-sidebar {
  width: var(--admin-sidebar-width);
  background: linear-gradient(180deg, #ffffff, #f9fafb);
  padding: 22px 16px;
  border-right: 1px solid var(--admin-border-color);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  color: var(--admin-text-light);
  cursor: pointer;
  transition: all 0.25s ease;
}

.nav-item:hover {
  background: #f1f5f9;
  color: var(--admin-text-dark);
}

.nav-item.active {
  background: linear-gradient(135deg, #e74c3c, #ff6b6b);
  color: #ffffff;
  box-shadow: 0 10px 30px rgba(231,76,60,0.35);
}

.nav-icon {
  font-size: 18px;
}

/* ================= CONTENT ================= */
.admin-content-area {
  flex: 1;
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ================= METRICS ================= */
.metric-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.metric-card {
  display: flex;
  gap: 16px;
  padding: 22px 26px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff, #f9fafb);
  box-shadow:
    0 20px 45px rgba(0,0,0,0.08),
    inset 0 1px 0 rgba(255,255,255,0.8);
  border: 1px solid rgba(0,0,0,0.05);
  transition: transform 0.25s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
}

.metric-icon-bg {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.metric-value {
  font-size: 26px;
  font-weight: 800;
  color: var(--admin-text-dark);
}

.metric-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--admin-text-light);
}

/* ================= ANALYTICS ================= */
.analytics-card {
  background: linear-gradient(180deg, #ffffff, #f9fafb);
  padding: 26px 28px;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.05);
}

.card-title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--admin-text-dark);
}

.sales-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--admin-text-light);
  border-bottom: 1px dashed var(--admin-border-color);
}

.sales-item strong {
  color: var(--admin-text-dark);
}

.sales-item:last-child {
  border-bottom: none;
}

/* ================= RANGE TOGGLE ================= */
.range-toggle {
  display: flex;
  gap: 10px;
}

.range-toggle button {
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  font-weight: 700;
  background: #e5e7eb;
  cursor: pointer;
  transition: all 0.25s ease;
}

.range-toggle button.active {
  background: linear-gradient(135deg, #e74c3c, #ff6b6b);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(231,76,60,0.35);
}

/* ================= ALERT ================= */
.alert-item {
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  color: #9a3412;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 700;
  margin-bottom: 10px;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .admin-content-area {
    padding: 20px;
  }

  .admin-sidebar {
    width: 100%;
  }
}
`;


// Modern & Stylish Modal + Button CSS
const modernCSS = `
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.45);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #ffffff;
  padding: 32px 36px;
  border-radius: 22px;
  max-width: 620px;
  width: 92%;
  box-shadow: 0 30px 80px rgba(0,0,0,0.25);
}

.modal-close-btn {
  position: absolute;
  top: 14px;
  right: 18px;
  font-size: 28px;
  border: none;
  background: none;
  cursor: pointer;
  color: #94a3b8;
}

.modal-close-btn:hover {
  color: #e74c3c;
}

.new-event-btn {
  background: linear-gradient(135deg, #e74c3c, #ff6b6b);
  color: #fff;
  border-radius: 14px;
  padding: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 16px 34px rgba(231,76,60,0.4);
}

.new-event-btn:hover {
  transform: translateY(-2px);
}
`;

document.head.insertAdjacentHTML('beforeend', `<style>${modernCSS}</style>`);
