import React, { useState, useEffect } from "react";

import AddEvent from "./AddEvent";
import EventList from "./EventList";
import AddFeaturedEvent from "./AddFeaturedEvent";
import FeaturedManager from "./FeaturedManager";
import OrganizerRequests from "./OrganizerRequests";
import AdminPromo from "./AdminPromo";
import CustomerList from "./CustomerList";

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

/* ================== MAIN DASHBOARD ================== */
const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [eventModal, setEventModal] = useState(false);
  const [featuredModal, setFeaturedModal] = useState(false);
  const [eventCount, setEventCount] = useState(0);

  const [totalSales, setTotalSales] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);

  const fetchEventsCount = async () => {
    const res = await fetch("http://127.0.0.1:5001/api/events");
    const data = await res.json();
    setEventCount(data.length);
  };

  const fetchSalesData = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/orders");
      const orders = await res.json();

      const paidOrders = orders.filter(
        (o) => o.payment?.status === "PAID"
      );

      const total = paidOrders.reduce(
        (sum, o) => sum + (o.total || 0),
        0
      );

      setTotalSales(total);
      setCustomerCount(paidOrders.length);
    } catch (err) {
      console.error("Failed to fetch sales data", err);
    }
  };

  useEffect(() => {
    fetchEventsCount();
    fetchSalesData();
  }, []);

  const metrics = [
    {
      label: "Income",
      value: `NPR ${totalSales.toLocaleString()}`,
      icon: "📊",
      color: "#ffb700",
    },
    {
      label: "Customers",
      value: customerCount,
      icon: "🧑‍💻",
      color: "#55aaff",
    },
    {
      label: "Events Live",
      value: eventCount,
      icon: "🎉",
      color: "#2ecc71",
    },
    {
      label: "Gross Sales",
      value: `NPR ${totalSales.toLocaleString()}`,
      icon: "💰",
      color: "#3498db",
    },
  ];

  /* ------------------ CONTENT SWITCH ------------------ */
  const renderContent = () => {
    if (activeItem === "Events")
      return <EventList onEventChange={setEventCount} />;

    if (activeItem === "Featured")
      return <FeaturedManager />;

    if (activeItem === "Customer")
      return <CustomerList />;

    if (activeItem === "Organizer")
      return (
        <>
          <AdminPromo />
          <OrganizerRequests />
        </>
      );

    return (
      <div className="metric-cards-container">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>
    );
  };

  return (
    <>
      <StyleInjector css={AdminDashboardStyles + modernCSS} />

      <div className="admin-app-container">
        <AdminHeader />

        <div className="admin-main-layout">
          <Sidebar
            activeItem={activeItem}
            setActiveItem={(item) => {
              setActiveItem(item);
              setEventModal(false);
              setFeaturedModal(false);
            }}
            onAdd={() =>
              activeItem === "Featured"
                ? setFeaturedModal(true)
                : setEventModal(true)
            }
          />

          <main className="admin-content-area">{renderContent()}</main>
        </div>
      </div>

      {/* ADD EVENT */}
      <Modal isOpen={eventModal} onClose={() => setEventModal(false)}>
        <AddEvent
          onClose={() => setEventModal(false)}
          onEventAdded={fetchEventsCount}
        />
      </Modal>

      {/* ADD FEATURED EVENT */}
      <Modal isOpen={featuredModal} onClose={() => setFeaturedModal(false)}>
        <AddFeaturedEvent
          onClose={() => setFeaturedModal(false)}
          onAdded={() => setActiveItem("Featured")}
        />
      </Modal>
    </>
  );
};

export default AdminDashboard;

// --- 7. Styles for Admin Dashboard (Updated for SVG) ---
const AdminDashboardStyles = `
  /* ==================================== */
  /* GLOBAL & UTILITY */
  /* ==================================== */
  :root {
    --admin-bg-light: #f4f6f9;
    --admin-sidebar-width: 250px;
    --admin-sidebar-bg: #fff;
    --admin-primary-red: #e74c3c;
    --admin-text-dark: #333;
    --admin-text-light: #555;
    --admin-border-color: #eee;
    --admin-card-bg: #fff;
  }

  html, body, #root {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100vh !important;
    overflow-x: hidden;
    font-family: 'Inter', sans-serif;
    background-color: var(--admin-bg-light);
  }

  .admin-app-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
  }

  /* ==================================== */
  /* HEADER */
  /* ==================================== */
  .admin-header {
    height: 60px;
    background-color: var(--admin-sidebar-bg);
    border-bottom: 1px solid var(--admin-border-color);
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .admin-logo {
    height: 30px;
    width: auto;
  }

  .header-title-text {
    font-size: 20px;
    font-weight: 600;
    color: var(--admin-text-dark);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .notification-icon, .user-icon {
    font-size: 20px;
    color: var(--admin-text-light);
    cursor: pointer;
  }

  .user-icon {
    font-size: 30px;
  }

  .search-group {
    position: relative;
  }

  .header-search-box {
    padding: 8px 15px;
    padding-right: 35px;
    border-radius: 20px;
    border: 1px solid #ccc;
    min-width: 180px;
    font-size: 14px;
    background-color: var(--admin-bg-light);
    transition: all 0.2s;
  }

  .header-search-box:focus {
    background-color: #fff;
    border-color: var(--admin-primary-red);
    outline: none;
  }

  .search-icon {
    position: absolute;
    right: 15px;
    color: #888;npm run dev
    font-size: 16px;
    pointer-events: none;
  }

  /* ==================================== */
  /* MAIN LAYOUT */
  /* ==================================== */
  .admin-main-layout {
    display: flex;
    flex: 1;
    width: 100%;
  }

  /* --- SIDEBAR --- */
  .admin-sidebar {
    width: var(--admin-sidebar-width);
    background-color: var(--admin-sidebar-bg);
    padding: 20px 15px;
    border-right: 1px solid var(--admin-border-color);
    flex-shrink: 0;
    position: sticky;
    top: 60px;
    height: calc(100vh - 60px);
    overflow-y: auto;
  }

  .new-event-btn {
    width: 100%;
    background-color: var(--admin-primary-red);
    color: #fff;
    border: none;
    padding: 12px 0;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 30px;
    box-shadow: 0 4px 6px rgba(231,76,60,0.2);
    transition: background-color 0.2s;
  }

  .new-event-btn:hover {
    background-color: #c0392b;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 10px;
    margin: 4px 0;
    border-radius: 8px;
    cursor: pointer;
    color: var(--admin-text-light);
    font-size: 15px;
    font-weight: 500;
    transition: background-color 0.2s, color 0.2s;
  }

  .nav-item:hover {
    background-color: #f0f0f0;
  }

  .nav-item.active {
    background-color: var(--admin-primary-red);
    color: #fff;
    font-weight: 700;
    box-shadow: 0 2px 5px rgba(231,76,60,0.3);
  }

  .nav-item.active .svg-icon-style {
    stroke: #fff;
  }

  .nav-icon {
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .svg-icon-style {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    transition: stroke 0.2s;
  }

  .sub-menu {
    padding-left: 30px;
    border-left: 2px solid var(--admin-border-color);
    margin-left: 20px;
  }

  .sub-menu-item {
    padding: 8px 0;
    font-size: 13px;
    color: var(--admin-text-light);
    cursor: pointer;
    transition: color 0.2s;
  }

  .sub-menu-item:hover {
    color: var(--admin-primary-red);
  }

  /* --- CONTENT AREA --- */
  .admin-content-area {
    flex-grow: 1;
    padding: 25px;
    display: flex;
    flex-direction: column;
    gap: 25px;
    overflow-y: auto;
    min-width: 0;
  }

  .metric-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
  }

  .metric-card {
    display: flex;
    align-items: center;
    gap: 15px;
    background-color: var(--admin-card-bg);
    padding: 15px 25px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    border: 1px solid;
  }

  .metric-icon-bg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .metric-details {
    display: flex;
    flex-direction: column;
  }

  .metric-value {
    font-size: 24px;
    font-weight: 800;
    color: var(--admin-text-dark);
    line-height: 1.1;
  }

  .metric-label {
    font-size: 14px;
    color: var(--admin-text-light);
    font-weight: 500;
  }

  .main-analytics-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
    flex-grow: 1;
  }

  .analytics-card {
    background-color: var(--admin-card-bg);
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    flex: 1;
    min-width: 0;
  }

  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--admin-text-dark);
    margin-bottom: 15px;
    border-bottom: 1px solid var(--admin-border-color);
    padding-bottom: 10px;
  }

  .sales-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px dashed var(--admin-border-color);
  }

  .sales-item:last-child {
    border-bottom: none;
  }

  .sales-rank {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: #f0f0f0;
    color: var(--admin-text-dark);
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sales-details {
    flex-grow: 1;
    padding-left: 15px;
  }

  .item-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--admin-text-dark);
  }

  .item-sales-label {
    font-size: 12px;
    color: var(--admin-text-light);
  }

  .sales-value {
    font-size: 16px;
    font-weight: 700;
    color: var(--admin-text-dark);
    margin-right: 15px;
    flex-shrink: 0;
  }

  .sales-chart-icon {
    color: green;
    font-size: 20px;
    flex-shrink: 0;
  }

  .transaction-table-container {
    width: 100%;
    overflow-x: auto;
  }

  .transaction-table-container table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
  }

  .transaction-table-container th, .transaction-table-container td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid var(--admin-border-color);
    font-size: 14px;
    color: var(--admin-text-light);
  }

  .transaction-table-container th {
    font-weight: 600;
    color: var(--admin-text-dark);
    background-color: var(--admin-bg-light);
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
  }

  .transaction-table-container tbody tr:hover {
    background-color: #fafafa;
  }

  .transaction-table-container td:first-child {
    font-weight: 600;
    color: var(--admin-primary-red);
  }

  .status-badge {
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    display: inline-block;
  }

  /* ==================================== */
  /* RESPONSIVENESS */
  /* ==================================== */
  @media (max-width: 1024px) {
    .admin-sidebar { width: 200px; }
  }

  @media (max-width: 768px) {
    .admin-sidebar {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid var(--admin-border-color);
      padding: 10px 20px;
      position: relative;
    }

    .admin-main-layout { flex-direction: column; }
    .header-title-text { display: none; }
    .sidebar-nav { flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 10px; }
    .new-event-btn { margin-bottom: 10px; }
    .nav-item { padding: 8px 10px; font-size: 14px; }
    .sub-menu { display: none; }
    .header-actions { gap: 10px; }
    .header-search-box { min-width: 120px; }
    .main-analytics-section { grid-template-columns: 1fr; }
    .metric-cards-container { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
    .admin-content-area { padding: 15px; gap: 15px; }
  }
`;

// Modern & Stylish Modal + Button CSS
const modernCSS = `
/* ===========================
   MODAL STYLING
=========================== */
/* Overlay with subtle gradient & blur */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    opacity: 0;
    animation: fadeInOverlay 0.3s forwards;
}

/* Modal content box */
.modal-content {
    background: #ffffff;
    padding: 30px 40px;
    border-radius: 18px;
    width: 90%;
    max-width: 600px;
    position: relative;
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
    transform: translateY(-30px);
    animation: slideInModal 0.35s forwards;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Close button */
.modal-close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 28px;
    background: none;
    border: none;
    cursor: pointer;
    color: #888;
    transition: color 0.2s, transform 0.2s;
}
.modal-close-btn:hover {
    color: #e74c3c;
    transform: rotate(90deg) scale(1.2);
}

/* Fade-in overlay */
@keyframes fadeInOverlay {
    to { opacity: 1; }
}

/* Slide-in modal */
@keyframes slideInModal {
    to { transform: translateY(0); opacity: 1; }
}

/* ===========================
   NEW EVENT BUTTON STYLING
=========================== */
.new-event-btn {
    width: 100%;
    background: linear-gradient(135deg, #e74c3c, #ff6b6b);
    color: #fff;
    border: none;
    padding: 14px 0;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 25px;
    box-shadow: 0 8px 20px rgba(231,76,60,0.3);
    transition: all 0.3s ease;
}

.new-event-btn:hover {
    background: linear-gradient(135deg, #ff6b6b, #e74c3c);
    box-shadow: 0 12px 25px rgba(231,76,60,0.4);
    transform: translateY(-2px) scale(1.02);
}

.new-event-btn:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 6px 15px rgba(231,76,60,0.25);
}

/* ===========================
   RESPONSIVENESS
=========================== */
@media (max-width: 768px) {
    .modal-content {
        padding: 25px 20px;
    }

    .modal-close-btn {
        font-size: 24px;
        top: 12px;
        right: 12px;
    }

    .new-event-btn {
        font-size: 14px;
        padding: 12px 0;
    }
}
`;

document.head.insertAdjacentHTML('beforeend', `<style>${modernCSS}</style>`);
