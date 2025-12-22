import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("eventghar_admin_token", data.token);
      localStorage.setItem(
        "eventghar_admin",
        JSON.stringify(data.admin)
      );

      navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <h2>Admin Login</h2>

        <input
          name="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="error-text">{error}</p>}

        <button onClick={submit} disabled={loading}>
          {loading ? "Signing in..." : "LOGIN"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
