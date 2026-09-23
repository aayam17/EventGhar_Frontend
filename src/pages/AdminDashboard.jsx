import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  LayoutDashboard,
  CalendarDays,
  Star,
  Users,
  Ticket as TicketIcon,
  RotateCcw,
  Building2,
  LogOut,
  Wallet,
  UserRound,
  PartyPopper,
  BadgeDollarSign,
} from "lucide-react";

import AddEvent from "./AddEvent";
import EventList from "./EventList";
import AddFeaturedEvent from "./AddFeaturedEvent";
import FeaturedManager from "./FeaturedManager";
import OrganizerRequests from "./OrganizerRequests";
import AdminPromo from "./AdminPromo";
import CustomerList from "./CustomerList";
import AdminRefund from "./AdminRefund";
import Toast, { useSnack } from "../components/ui/Toast";
import EventGharLogo from "../assets/logo-tight";
import { api, adminHeaders } from "../lib/api";

/* ------------------ STYLE INJECTOR ------------------ */
const StyleInjector = ({ css }) => (
  <style dangerouslySetInnerHTML={{ __html: css }} />
);

/* ------------------ SIDEBAR ------------------ */
const Sidebar = ({ activeItem, setActiveItem }) => {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Events", icon: CalendarDays },
    { name: "Featured", icon: Star },
    { name: "Customer", icon: Users },
    { name: "Scan Ticket", icon: TicketIcon },
    { name: "Refund", icon: RotateCcw },
    { name: "Organizer", icon: Building2 },
  ];

  return (
    <aside className="admin-sidebar">
      <nav className="sidebar-nav">
        {navItems.map(({ name, icon: Icon }) => (
          <button
            key={name}
            type="button"
            aria-current={activeItem === name ? "page" : undefined}
            className={`nav-item ${activeItem === name ? "active" : ""}`}
            onClick={() => setActiveItem(name)}
          >
            <span className="nav-icon">
              <Icon size={18} strokeWidth={2} />
            </span>
            <span>{name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

/* ------------------ HEADER ------------------ */
const AdminHeader = () => (
  <header className="admin-header">
    <div className="header-left">
      <img src={EventGharLogo} alt="EventGhar" className="admin-logo" />
      <span className="header-title-text">Admin Dashboard</span>
    </div>

    <button
      className="admin-logout-btn"
      onClick={() => {
        localStorage.removeItem("eventghar_admin_token");
        localStorage.removeItem("eventghar_admin");
        window.location.href = "/admin/login";
      }}
    >
      <LogOut size={16} />
      Logout
    </button>
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
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

/* ================== QR SCANNER ================== */
const AdminQRScanner = () => {
  const [snack, showSnack] = useSnack();
  const [cameraHint, setCameraHint] = useState(null);

  // The widget below always offers "Scan an Image File" as a fallback, so
  // that keeps working no matter what. The live camera tab additionally
  // needs a secure context (https, or localhost) and camera permission —
  // this check tells the admin *why* the camera button is doing nothing
  // instead of leaving it silently stuck.
  useEffect(() => {
    if (!window.isSecureContext) {
      setCameraHint(
        "This page is open over plain HTTP on a non-localhost address, so the browser blocks camera access here. Open the admin dashboard over HTTPS (or on localhost on this computer) to use the live camera — image upload below still works either way."
      );
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraHint("This browser doesn't support camera access here. Use image upload below instead.");
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => stream.getTracks().forEach((t) => t.stop()))
      .catch((err) => {
        if (err.name === "NotAllowedError") {
          setCameraHint(
            "Camera access is blocked for this site. Click the camera icon in your browser's address bar, allow access, then reload this page."
          );
        } else if (err.name === "NotFoundError") {
          setCameraHint("No camera was found on this device. Use image upload below instead.");
        } else if (err.name === "NotReadableError") {
          setCameraHint("The camera is in use by another app or browser tab. Close it and reload this page.");
        }
      });
  }, []);

  // React 18 StrictMode intentionally double-mounts every component in dev
  // (mount → cleanup → mount again) to surface side-effect bugs. html5-qrcode
  // isn't built for that: the second instance's setup can start before the
  // first instance's async clear() has finished, so they fight over the same
  // #qr-reader div and the "Request Camera Permissions" button ends up wired
  // to a half-torn-down instance that does nothing when clicked.
  //
  // chainRef serializes every create/clear through one promise queue, so a
  // second mount always waits for the previous instance to fully clear
  // before touching the DOM node again — in dev *and* in production.
  const chainRef = useRef(Promise.resolve());
  const scannerRef = useRef(null);

  useEffect(() => {
    chainRef.current = chainRef.current.then(() => {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250, videoConstraints: { facingMode: "environment" } },
        false
      );
      scannerRef.current = scanner;

      scanner.render(
        async (decodedText) => {
          try {
            const res = await fetch(api("/api/orders/verify"), {
              method: "POST",
              headers: adminHeaders(),
              body: JSON.stringify({ ticketId: decodedText }),
            });
            const data = await res.json();
            // The server answers 200 with { valid: false } for bad tickets, so
            // res.ok alone would show a green toast for an invalid scan.
            if (res.status === 401 || res.status === 403) {
              showSnack("Admin session expired. Log in again.", "error");
              return;
            }
            const who = data.valid && data.attendee ? ` (${data.attendee})` : "";
            const extra =
              data.valid && data.ticketType
                ? ` · ${data.ticketType}${
                    data.remaining > 0 ? ` · ${data.remaining} more in this group` : ""
                  }`
                : "";
            showSnack(
              `${data.message}${who}${extra}`,
              data.valid ? "success" : "error"
            );
          } catch {
            showSnack("Verification failed", "error");
          }
        },
        () => {}
      );
    });

    return () => {
      chainRef.current = chainRef.current.then(() => {
        const scanner = scannerRef.current;
        scannerRef.current = null;
        return scanner ? scanner.clear().catch(() => {}) : undefined;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="analytics-card" style={{ maxWidth: 420 }}>
      <h3 className="card-title">Scan Ticket</h3>
      {cameraHint && (
        <p
          style={{
            color: "var(--color-raspberry-dark)",
            fontWeight: 600,
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          {cameraHint}
        </p>
      )}
      <div id="qr-reader" />
      {snack && <Toast message={snack.message} type={snack.type} />}
    </div>
  );
};

/* ================== MAIN DASHBOARD ================== */
const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [eventModal, setEventModal] = useState(false);
  const [editEventModal, setEditEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [featuredModal, setFeaturedModal] = useState(false);
  const [range, setRange] = useState("TODAY");

  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadEvents = () =>
    fetch(api("/api/events?all=true"), { headers: adminHeaders(false) })
      .then((r) => r.json())
      .then(setEvents);

  useEffect(() => {
    loadEvents();
    fetch(api("/api/orders"), { headers: adminHeaders(false) })
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []));
    fetch(api("/api/orders/refunds"), { headers: adminHeaders(false) })
      .then((r) => r.json())
      .then((data) => setRefunds(Array.isArray(data) ? data : []));
    fetch(api("/api/host-requests"), { headers: adminHeaders(false) })
      .then((r) => r.json())
      .then((data) => setOrganizers(Array.isArray(data) ? data : []));
  }, []);

  const paidOrders = orders.filter((o) => o.payment?.status === "PAID");
  const activePaid = paidOrders.filter((o) => o.refund?.status !== "APPROVED");
  const totalSales = activePaid.reduce((s, o) => s + (o.total || 0), 0);

  const renderDashboard = () => {
    const now = new Date();

    const inRange = (date) => {
      const d = new Date(date);
      if (range === "TODAY") return d.toDateString() === now.toDateString();
      if (range === "WEEK") return (now - d) / (1000 * 60 * 60 * 24) <= 7;
      if (range === "MONTH") return d.getMonth() === now.getMonth();
      return true;
    };

    const filteredOrders = activePaid.filter((o) => inRange(o.createdAt));
    const totalSalesFiltered = filteredOrders.reduce((s, o) => s + (o.total || 0), 0);
    const uniqueCustomers = new Set(
      filteredOrders.map((o) => o.user?.email || o.user?.id).filter(Boolean)
    ).size;

    const revenueByEvent = {};
    filteredOrders.forEach((o) => {
      revenueByEvent[o.eventTitle] = (revenueByEvent[o.eventTitle] || 0) + o.total;
    });

    return (
      <>
        {/* RANGE TOGGLE */}
        <div className="range-toggle">
          {["TODAY", "WEEK", "MONTH"].map((r) => (
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
          <MetricCard
            icon={<Wallet size={20} strokeWidth={2} />}
            label="Income"
            value={`NPR ${totalSalesFiltered.toLocaleString()}`}
            color="var(--color-marigold-dark)"
          />
          <MetricCard
            icon={<UserRound size={20} strokeWidth={2} />}
            label="Customers"
            value={uniqueCustomers}
            color="var(--color-pine-dark)"
          />
          <MetricCard
            icon={<PartyPopper size={20} strokeWidth={2} />}
            label="Events Live"
            value={events.length}
            color="var(--color-raspberry-dark)"
          />
          <MetricCard
            icon={<BadgeDollarSign size={20} strokeWidth={2} />}
            label="Gross Sales"
            value={`NPR ${totalSales.toLocaleString()}`}
            color="var(--color-marigold-dark)"
          />
        </div>

        {/* ACTION REQUIRED */}
        <div className="analytics-card">
          <h3 className="card-title">Action Required</h3>

          {refunds.filter((r) => r.refund?.status === "PENDING").length === 0 &&
            organizers.filter((o) => o.status === "pending").length === 0 &&
            filteredOrders.filter((o) => !o.used).length <= 10 && (
              <p className="all-clear">Nothing needs your attention right now.</p>
            )}

          {refunds.filter((r) => r.refund?.status === "PENDING").length > 0 && (
            <div className="alert-item">Pending refunds</div>
          )}

          {organizers.filter((o) => o.status === "pending").length > 0 && (
            <div className="alert-item">Organizer approvals pending</div>
          )}

          {filteredOrders.filter((o) => !o.used).length > 10 && (
            <div className="alert-item">High unused tickets</div>
          )}
        </div>

        {/* TOP EVENTS */}
        <div className="analytics-card">
          <h3 className="card-title">Top Performing Events</h3>

          {Object.entries(revenueByEvent).length === 0 && (
            <p className="empty-text">No sales in this range yet.</p>
          )}

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

          {orders.length === 0 && <p className="empty-text">No orders yet.</p>}

          {/* The API returns newest first, so take the first 8 */}
          {orders.slice(0, 8).map((o) => (
            <div key={o._id} className="sales-item">
              <span>{o.user?.name || "Unknown"}</span>
              <strong>{o.eventTitle}</strong>
              <span>
                {o.refund?.status === "APPROVED"
                  ? "Refunded"
                  : o.used
                  ? "Verified"
                  : o.payment?.status === "PAID"
                  ? "Paid"
                  : "Unpaid"}
              </span>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderContent = () => {
    if (activeItem === "Dashboard") return renderDashboard();
    if (activeItem === "Events")
      return (
        <EventList
          key={`events-${refreshKey}`}
          onAdd={() => setEventModal(true)}
          onEdit={(ev) => {
            setEditingEvent(ev);
            setEditEventModal(true);
          }}
        />
      );
    if (activeItem === "Featured")
      return (
        <FeaturedManager
          key={`featured-${refreshKey}`}
          onAdd={() => setFeaturedModal(true)}
        />
      );
    if (activeItem === "Customer") return <CustomerList />;
    if (activeItem === "Scan Ticket") return <AdminQRScanner />;
    if (activeItem === "Refund") return <AdminRefund />;
    if (activeItem === "Organizer")
      return (
        <>
          <AdminPromo />
          <OrganizerRequests />
        </>
      );
    return null;
  };

  return (
    <>
      <StyleInjector css={AdminDashboardStyles} />

      <div className="admin-app-container">
        <AdminHeader />
        <div className="admin-main-layout">
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
          <main className="admin-content-area">{renderContent()}</main>
        </div>
      </div>

      <Modal isOpen={eventModal} onClose={() => setEventModal(false)}>
        <AddEvent
          onClose={() => setEventModal(false)}
          onEventAdded={() => {
            loadEvents();
            setRefreshKey((k) => k + 1);
          }}
        />
      </Modal>

      <Modal isOpen={editEventModal} onClose={() => setEditEventModal(false)}>
        <AddEvent
          event={editingEvent}
          onClose={() => setEditEventModal(false)}
          onEventAdded={() => {
            loadEvents();
            setRefreshKey((k) => k + 1);
          }}
        />
      </Modal>

      <Modal isOpen={featuredModal} onClose={() => setFeaturedModal(false)}>
        <AddFeaturedEvent
          onClose={() => setFeaturedModal(false)}
          onAdded={() => {
            loadEvents();
            setRefreshKey((k) => k + 1);
          }}
        />
      </Modal>
    </>
  );
};

export default AdminDashboard;

/* =====================================================
   ADMIN DASHBOARD STYLES
   Uses the same brand tokens as the rest of EventGhar
   (defined as CSS variables in index.css via Tailwind @theme)
===================================================== */
const AdminDashboardStyles = `
.admin-app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-paper);
  font-family: var(--font-sans);
}

/* ================= HEADER ================= */
.admin-header {
  height: 64px;
  background: rgba(247,244,236,0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-stone-200);
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
  gap: 14px;
}

.admin-logo {
  height: 46px;
  width: auto;
  object-fit: contain;
}

.header-title-text {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-ink);
}

.admin-logout-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid var(--color-stone-200);
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  color: var(--color-raspberry-dark);
  transition: all 0.2s ease;
}

.admin-logout-btn:hover {
  background: color-mix(in srgb, var(--color-raspberry) 10%, transparent);
  border-color: var(--color-raspberry);
}

/* ================= LAYOUT ================= */
.admin-main-layout {
  display: flex;
  flex: 1;
}

/* ================= SIDEBAR ================= */
.admin-sidebar {
  width: 250px;
  flex-shrink: 0;
  background: #ffffff;
  padding: 22px 16px;
  border-right: 1px solid var(--color-stone-200);
  position: sticky;
  top: 64px;
  align-self: flex-start;
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px 14px;
  border: none;
  border-radius: 12px;
  background: transparent;
  font-family: inherit;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
  color: var(--color-stone-500);
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item:focus-visible {
  outline: 2px solid var(--color-marigold-dark);
  outline-offset: 2px;
}

.nav-item:hover {
  background: var(--color-stone-100);
  color: var(--color-ink);
}

.nav-item.active {
  background: var(--color-ink);
  color: var(--color-paper);
}

.nav-icon {
  display: flex;
  align-items: center;
}

/* ================= CONTENT ================= */
.admin-content-area {
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
}

/* ================= METRICS ================= */
.metric-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
}

.metric-card {
  display: flex;
  gap: 16px;
  padding: 20px 22px;
  border-radius: var(--radius-card);
  background: #ffffff;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-stone-200);
  border-left-width: 4px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-pop);
}

.metric-icon-bg {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.metric-value {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  color: var(--color-ink);
}

.metric-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-stone-500);
}

/* ================= ANALYTICS / SHARED ADMIN CARDS ================= */
.analytics-card,
.admin-card,
.featured-card {
  background: #ffffff;
  padding: 24px 26px;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-stone-200);
}

.card-title {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--color-ink);
}

.sales-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-stone-500);
  border-bottom: 1px dashed var(--color-stone-200);
}

.sales-item strong {
  color: var(--color-ink);
  flex: 1;
  text-align: left;
  font-weight: 600;
}

.sales-item:last-child {
  border-bottom: none;
}

.empty-text,
.all-clear {
  font-size: 14px;
  color: var(--color-stone-400);
  padding: 8px 0;
}

/* ================= RANGE TOGGLE ================= */
.range-toggle {
  display: flex;
  gap: 8px;
}

.range-toggle button {
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  font-weight: 700;
  font-size: 13px;
  background: var(--color-stone-100);
  color: var(--color-stone-600);
  cursor: pointer;
  transition: all 0.2s ease;
}

.range-toggle button.active {
  background: var(--color-ink);
  color: var(--color-paper);
}

/* ================= ALERT ================= */
.alert-item {
  background: color-mix(in srgb, var(--color-marigold) 15%, white);
  color: var(--color-marigold-dark);
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 10px;
}

.alert-item:last-child {
  margin-bottom: 0;
}

/* ================= ORDER / CUSTOMER CARDS (used by CustomerList, AdminRefund) ================= */
.order-card {
  background: #ffffff;
  border: 1px solid var(--color-stone-200);
  border-radius: var(--radius-card);
  padding: 18px 20px;
  margin-bottom: 14px;
  box-shadow: var(--shadow-card);
}

.order-card button {
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  margin-right: 8px;
  margin-top: 8px;
  transition: all 0.2s ease;
}

.order-card button:first-of-type {
  background: var(--color-pine);
  color: white;
}

.order-card button:last-of-type {
  background: var(--color-raspberry);
  color: white;
}

/* ================= MODAL ================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(23,20,15,0.45);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.modal-content {
  position: relative;
  background: #ffffff;
  padding: 32px 36px;
  border-radius: 22px;
  max-width: 620px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-pop);
}

.modal-close-btn {
  position: absolute;
  top: 14px;
  right: 18px;
  font-size: 26px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-stone-400);
  line-height: 1;
}

.modal-close-btn:hover {
  color: var(--color-raspberry);
}

/* ================= BUTTONS ================= */
.new-event-btn {
  background: var(--color-raspberry);
  color: white;
  border-radius: 999px;
  padding: 11px 22px;
  font-weight: 700;
  font-size: 13px;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(214,48,74,0.3);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.new-event-btn:hover {
  background: var(--color-raspberry-dark);
  transform: translateY(-1px);
}

/* Header row pattern for card-title + "+ New ..." action,
   used by EventList and FeaturedManager */
.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.card-header-row .card-title {
  margin-bottom: 0;
}

/* Generic inputs/selects/textareas used by the various admin sub-pages */
.admin-card input,
.admin-card select,
.admin-card textarea,
.modal-content input,
.modal-content select,
.modal-content textarea,
.input-box {
  width: 100%;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid var(--color-stone-200);
  font-size: 14px;
  margin-bottom: 12px;
  font-family: var(--font-sans);
  color: var(--color-ink);
  background: #ffffff;
}

.admin-card input:focus,
.admin-card select:focus,
.admin-card textarea:focus,
.modal-content input:focus,
.modal-content select:focus,
.modal-content textarea:focus,
.input-box:focus {
  outline: none;
  border-color: var(--color-marigold-dark);
  box-shadow: 0 0 0 3px rgba(240,166,58,0.18);
}

.admin-card button,
.modal-content > button,
.add-event-btn,
.submit-btn {
  background: var(--color-raspberry);
  color: white;
  border: none;
  border-radius: 999px;
  padding: 11px 20px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.admin-card button:hover,
.add-event-btn:hover,
.submit-btn:hover {
  background: var(--color-raspberry-dark);
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .admin-content-area {
    padding: 18px;
  }

  .admin-main-layout {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    border-right: none;
    border-bottom: 1px solid var(--color-stone-200);
    position: static;
    height: auto;
    overflow-y: visible;
  }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .new-event-btn {
    width: auto;
  }
}
`;
