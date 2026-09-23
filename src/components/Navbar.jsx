import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, User, Search, Menu, X, Ticket } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import Button from "./ui/Button";
import Auth from "../pages/Auth";
import { vintageTemple } from "../assets/vintage";
import Wordmark from "./ui/Wordmark";

const Navbar = ({ searchTerm = "", setSearchTerm = () => {}, onEventsClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const user = JSON.parse(localStorage.getItem("eventghar_user") || "null");
  const isLoggedIn = !!localStorage.getItem("eventghar_token");

  const active =
    location.pathname === "/contact"
      ? "Contact"
      : location.pathname === "/about"
      ? "About"
      : location.pathname === "/my-bookings"
      ? "Bookings"
      : location.pathname === "/host"
      ? "Host"
      : "Home";

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileOpen(false);
  }, [location.pathname]);

  const goEvents = (e) => {
    e?.preventDefault();
    navigate("/");
    setTimeout(() => onEventsClick && onEventsClick(), 120);
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const links = [
    { label: "Home", path: "/", key: "Home" },
    { label: "Events", path: "/", key: "Events", onClick: goEvents },
    { label: "Host", path: "/host", key: "Host" },
    { label: "About", path: "/about", key: "About" },
    { label: "Contact", path: "/contact", key: "Contact" },
    { label: "Bookings", path: "/my-bookings", key: "Bookings" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-ink bg-paper">
      <img
        src={vintageTemple}
        alt=""
        aria-hidden="true"
        className="poster-wash pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
      />
      <div className="relative mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-5 md:px-9">
        <div
          className="flex cursor-pointer items-center gap-2.5"
          onClick={() => navigate("/")}
        >
          <span className="flex h-10 w-10 shrink-0 -rotate-3 items-center justify-center border-2 border-ink bg-marigold shadow-[3px_3px_0_var(--color-ink)]">
            <Ticket className="h-5 w-5 text-ink" strokeWidth={2.5} />
          </span>
          <Wordmark className="text-2xl text-ink md:text-[26px]" />
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className={[
                "relative py-1.5 text-[15px] font-semibold transition-colors",
                active === item.key || (item.key === "Events" && location.hash === "#events")
                  ? "text-ink"
                  : "text-stone-500 hover:text-ink",
              ].join(" ")}
              onClick={(e) => {
                if (item.onClick) return item.onClick(e);
                e.preventDefault();
                navigate(item.path);
              }}
            >
              {item.label}
              <span
                className={[
                  "absolute -bottom-1.5 left-0 h-[3px] w-full origin-left rounded-full bg-raspberry transition-transform duration-200",
                  active === item.key ? "scale-x-100" : "scale-x-0",
                ].join(" ")}
              />
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              className="w-40 border-2 border-ink bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:w-56 focus:ring-2 focus:ring-marigold"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (location.pathname !== "/") navigate("/");
              }}
            />
          </div>

          <div className="relative" ref={notifRef}>
            <button
              className="relative flex h-10 w-10 items-center justify-center border-2 border-ink bg-white text-ink transition hover:bg-ink hover:text-paper"
              onClick={() => setNotifOpen((p) => !p)}
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-raspberry px-1 text-[10px] font-bold text-paper">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 border-2 border-ink bg-white p-2 shadow-pop">
                {unreadNotifications.length === 0 && (
                  <p className="px-3 py-3 text-sm text-stone-500">No new notifications</p>
                )}
                {unreadNotifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => {
                      markAsRead(n._id);
                      navigate(n.link);
                      setNotifOpen(false);
                    }}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-stone-100"
                  >
                    {n.title}
                  </button>
                ))}
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={() => {
                      markAllAsRead();
                      setNotifOpen(false);
                    }}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-center text-xs font-semibold text-stone-500 transition hover:bg-stone-100 hover:text-ink"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            className="hidden rounded-md sm:inline-flex"
            onClick={() => navigate("/host")}
          >
            Host an event
          </Button>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-white text-ink transition hover:bg-ink hover:text-paper"
                onClick={() => setOpen(!open)}
                aria-label="Account menu"
              >
                <User className="h-[18px] w-[18px]" />
              </button>

              {open && (
                <div className="absolute right-0 top-12 w-52 border-2 border-ink bg-white p-2 shadow-pop">
                  <p className="border-b border-stone-100 px-3 py-2.5 text-sm font-semibold text-ink">
                    {user?.fullName || "Guest"}
                  </p>
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-stone-700 transition hover:bg-stone-100"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-stone-700 transition hover:bg-stone-100"
                  >
                    My Bookings
                  </button>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      navigate("/");
                      window.location.reload();
                    }}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-raspberry transition hover:bg-raspberry/10"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="ghost" size="sm" icon={User} onClick={() => setShowAuth(true)}>
              Log in
            </Button>
          )}

          <button
            className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-white lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-stone-200 bg-paper px-5 py-4 lg:hidden">
          <div className="relative mb-3 sm:hidden">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              className="w-full border-2 border-ink bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-marigold"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            {links.map((item) => (
              <button
                key={item.label}
                className="rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ink hover:bg-stone-100"
                onClick={(e) => {
                  if (item.onClick) item.onClick(e);
                  else navigate(item.path);
                  setMobileOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showAuth && (
        <Auth
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            setShowAuth(false);
            window.location.reload();
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
