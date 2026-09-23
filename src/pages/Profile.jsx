import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Ticket as TicketIcon, Gift, ShieldCheck, LogOut } from "lucide-react";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import EmptyState from "../components/ui/EmptyState";
import Toast, { useSnack } from "../components/ui/Toast";
import { api, userHeaders } from "../lib/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [notif, setNotif] = useState(true);
  const [giftedTickets, setGiftedTickets] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [snack, showSnack] = useSnack();

  const token = localStorage.getItem("eventghar_token");
  const navigate = useNavigate();

  useEffect(() => {
    // Not logged in, or the saved login has expired: go home instead of
    // trying to render an error response as if it were a profile.
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const load = (path, onData) =>
      fetch(api(path), { headers: userHeaders(false) })
        .then((res) => {
          if (res.status === 401) {
            localStorage.removeItem("eventghar_token");
            localStorage.removeItem("eventghar_user");
            navigate("/", { replace: true });
            throw new Error("expired");
          }
          if (!res.ok) throw new Error("failed");
          return res.json();
        })
        .then(onData)
        .catch(() => {});

    load("/api/profile", (data) => {
      setUser(data);
      setNotif(data.notifications?.email ?? true);
    });
    load("/api/profile/gifted-tickets", (d) => setGiftedTickets(Array.isArray(d) ? d : []));
    load("/api/profile/my-tickets", (d) => setMyTickets(Array.isArray(d) ? d : []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveProfile = async () => {
    try {
      setSaving(true);
      const res = await fetch(api("/api/profile"), {
        method: "PUT",
        headers: userHeaders(),
        body: JSON.stringify({
          fullName: user.fullName,
          phone: user.phone,
          notifications: { email: notif },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Couldn't save changes");

      // Keep the name shown in the navbar in sync
      const stored = JSON.parse(localStorage.getItem("eventghar_user") || "{}");
      localStorage.setItem(
        "eventghar_user",
        JSON.stringify({ ...stored, fullName: data.fullName, phone: data.phone })
      );
      showSnack("Profile updated");
    } catch (err) {
      showSnack(err.message || "Couldn't save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!user) {
    return (
      <Page>
        <div className="mx-auto max-w-4xl animate-pulse px-6 py-12">
          <div className="h-96 rounded-2xl bg-stone-100" />
        </div>
      </Page>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "tickets", label: "My Tickets", icon: TicketIcon },
    { id: "gifted", label: "Gifted Tickets", icon: Gift },
  ];

  const TicketRow = ({ ticket, gifted }) => (
    <button
      onClick={() => navigate(`/ticket/${ticket._id}`)}
      className="flex w-full items-center justify-between border-2 border-ink bg-white px-4 py-3.5 text-left transition hover:shadow-card"
    >
      <div>
        <p className="font-semibold text-ink">{ticket.eventTitle}</p>
        <p className="text-sm text-stone-500">
          {gifted ? `Gifted by ${ticket.purchaser?.name || "EventGhar User"}` : "Purchased ticket"}
        </p>
      </div>
      <span className="text-sm font-medium text-stone-400">View →</span>
    </button>
  );

  return (
    <Page>
      <div className="mx-auto grid max-w-4xl gap-6 px-6 py-10 md:grid-cols-[260px_1fr] md:px-9">
        {/* LEFT: identity + nav */}
        <div className="h-fit space-y-1 border-2 border-ink bg-white p-5 shadow-card">
          <div className="mb-4 flex flex-col items-center gap-2 border-b-2 border-ink pb-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-marigold/20 text-ink">
              <User className="h-7 w-7" />
            </div>
            <h3 className="font-display font-semibold text-ink">{user.fullName}</h3>
            {user.role === "admin" && (
              <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-paper">
                Admin
              </span>
            )}
          </div>

          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={[
                "flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                activeTab === id
                  ? "bg-raspberry/10 text-raspberry-dark"
                  : "text-stone-600 hover:bg-stone-100",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}

          {user.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="mt-2 flex w-full items-center gap-2.5 rounded-xl bg-ink px-3.5 py-2.5 text-sm font-semibold text-paper transition hover:bg-stone-800"
            >
              <ShieldCheck className="h-4 w-4" /> Admin Panel
            </button>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-stone-100 px-1 pt-4">
            <span className="text-sm text-stone-600">Email notifications</span>
            <button
              onClick={() => setNotif(!notif)}
              className={[
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-0 p-0 transition-colors",
                notif ? "bg-pine" : "bg-stone-300",
              ].join(" ")}
              aria-pressed={notif}
            >
              <span
                className={[
                  "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                  notif ? "translate-x-5" : "translate-x-0",
                ].join(" ")}
              />
            </button>
          </div>

          <button
            onClick={logout}
            className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-raspberry transition hover:bg-raspberry/10"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>

        {/* RIGHT: content */}
        <div className="border-2 border-ink bg-white p-6 shadow-card">
          {activeTab === "profile" && (
            <div className="space-y-4">
              <h4 className="font-display text-lg font-semibold text-ink">My profile</h4>
              <Input
                label="Full name"
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              />
              <Input label="Email" value={user.email} disabled className="bg-stone-50 text-stone-400" />
              <Input
                label="Phone number"
                value={user.phone || ""}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
              <Button loading={saving} onClick={saveProfile}>
                Save changes
              </Button>
            </div>
          )}

          {activeTab === "tickets" && (
            <div className="space-y-3">
              <h4 className="font-display text-lg font-semibold text-ink">My tickets</h4>
              {myTickets.length === 0 ? (
                <EmptyState
                  icon={TicketIcon}
                  title="No tickets yet"
                  description="Tickets you buy will show up here."
                />
              ) : (
                myTickets.map((t) => <TicketRow key={t._id} ticket={t} />)
              )}
            </div>
          )}

          {activeTab === "gifted" && (
            <div className="space-y-3">
              <h4 className="font-display text-lg font-semibold text-ink">Gifted tickets</h4>
              {giftedTickets.length === 0 ? (
                <EmptyState
                  icon={Gift}
                  title="No gifted tickets"
                  description="Tickets someone transfers to you will show up here."
                />
              ) : (
                giftedTickets.map((t) => <TicketRow key={t._id} ticket={t} gifted />)
              )}
            </div>
          )}
        </div>
      </div>

      {snack && <Toast message={snack.message} type={snack.type} />}
    </Page>
  );
};

export default Profile;
