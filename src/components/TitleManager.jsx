import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE = "EventGhar";
const DEFAULT_TITLE = "EventGhar | Tickets for nights out in Nepal";

const TITLES = {
  "/": DEFAULT_TITLE,
  "/about": `About us | ${BASE}`,
  "/contact": `Contact us | ${BASE}`,
  "/host": `Host an event | ${BASE}`,
  "/my-bookings": `My bookings | ${BASE}`,
  "/profile": `My profile | ${BASE}`,
  "/terms": `Terms of service | ${BASE}`,
  "/privacy": `Privacy policy | ${BASE}`,
  "/refund-policy": `Refund policy | ${BASE}`,
  "/payment-success": `Payment confirmed | ${BASE}`,
  "/payment-failed": `Payment failed | ${BASE}`,
  "/admin": `Admin | ${BASE}`,
  "/admin/login": `Admin login | ${BASE}`,
};

/* Sets the browser tab title on every route change. Event pages set their
   own title (the event's name) once the event has loaded, so this leaves
   /events/... alone. Must be rendered inside <Router>. */
export default function TitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/events/")) return;

    if (pathname.startsWith("/ticket/")) {
      document.title = `Your ticket | ${BASE}`;
    } else if (pathname.startsWith("/checkout/")) {
      document.title = `Checkout | ${BASE}`;
    } else {
      document.title = TITLES[pathname] || `Page not found | ${BASE}`;
    }
  }, [pathname]);

  return null;
}
