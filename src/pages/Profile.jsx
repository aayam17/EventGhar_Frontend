import { useEffect, useState } from "react";
import "../assets/css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [notif, setNotif] = useState(true);
  const token = localStorage.getItem("eventghar_token");

  useEffect(() => {
    fetch("http://localhost:5001/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setNotif(data.notifications?.email);
      });
  }, []);

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
        {/* LEFT CARD */}
        <div className="profile-card left">
          <div className="profile-user">
            <span className="avatar">👤</span>
            <h3>{user.fullName}</h3>
          </div>

          <button className="pill">Profile</button>

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

        {/* RIGHT CARD */}
        <div className="profile-card right">
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
