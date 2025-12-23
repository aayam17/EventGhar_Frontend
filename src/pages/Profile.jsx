import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [notif, setNotif] = useState(true);

  const [giftedTickets, setGiftedTickets] = useState([]);
  const [myTickets, setMyTickets] = useState([]);

  const [activeTab, setActiveTab] = useState("profile");

  const token = localStorage.getItem("eventghar_token");
  const navigate = useNavigate();

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    fetch("http://localhost:5001/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setNotif(data.notifications?.email);
      });

    fetch("http://localhost:5001/api/profile/gifted-tickets", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setGiftedTickets);

    fetch("http://localhost:5001/api/profile/my-tickets", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setMyTickets);
  }, []);

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    await fetch("http://localhost:5001/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: user.fullName,
        phone: user.phone,
        notifications: { email: notif },
      }),
    });

    alert("Profile updated");
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <div className="profile-wrapper">
      <div className="profile-grid">
        {/* ================= LEFT CARD ================= */}
        <div className="profile-card left">
          <div className="profile-user">
            <span className="avatar">👤</span>
            <h3>{user.fullName}</h3>
            {user.role === "admin" && (
              <span className="admin-badge">ADMIN</span>
            )}
          </div>

          <button
            className={`pill ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>

          <button
            className={`pill ${activeTab === "tickets" ? "active" : ""}`}
            onClick={() => setActiveTab("tickets")}
          >
            🎟 My Tickets
          </button>

          <button
            className={`pill ${activeTab === "gifted" ? "active" : ""}`}
            onClick={() => setActiveTab("gifted")}
          >
            🎁 Gifted Tickets
          </button>

          {user.role === "admin" && (
            <button
              className="admin-btn"
              onClick={() => navigate("/admin")}
            >
              🔑 Admin Panel
            </button>
          )}

          <div className="notif-row">
            <span>Notification</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={notif}
                onChange={() => setNotif(!notif)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>

        {/* ================= RIGHT CARD ================= */}
        <div className="profile-card right">
          {/* ===== PROFILE TAB ===== */}
          {activeTab === "profile" && (
            <>
              <h4>My Profile</h4>

              <input
                value={user.fullName}
                onChange={(e) =>
                  setUser({ ...user, fullName: e.target.value })
                }
                placeholder="Name"
              />

              <input value={user.email} disabled />

              <input
                value={user.phone}
                onChange={(e) =>
                  setUser({ ...user, phone: e.target.value })
                }
                placeholder="Phone Number"
              />

              <button className="save-btn" onClick={saveProfile}>
                Save Changes
              </button>
            </>
          )}

          {/* ===== MY TICKETS TAB ===== */}
          {activeTab === "tickets" && (
            <>
              <h4>🎟 My Tickets</h4>

              {myTickets.length === 0 && (
                <p className="empty-state">
                  You haven’t purchased any tickets yet.
                </p>
              )}

              {myTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="gift-ticket"
                  onClick={() =>
                    navigate(`/ticket/${ticket._id}`)
                  }
                >
                  <strong>{ticket.eventTitle}</strong>
                  <span>Purchased ticket</span>
                </div>
              ))}
            </>
          )}

          {/* ===== GIFTED TICKETS TAB ===== */}
          {activeTab === "gifted" && (
            <>
              <h4>🎁 Gifted Tickets</h4>

              {giftedTickets.length === 0 && (
                <p className="empty-state">
                  No tickets have been gifted to you yet.
                </p>
              )}

              {giftedTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="gift-ticket"
                  onClick={() =>
                    navigate(`/ticket/${ticket._id}`)
                  }
                >
                  <strong>{ticket.eventTitle}</strong>
                  <span>
                    Gifted by{" "}
                    {ticket.purchaser?.name || "EventGhar User"}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
