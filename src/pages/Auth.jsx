import { useState } from "react";
import "../assets/css/Auth.css";
import EventGharLogo from "../assets/logo.png";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+977)?9[6-9]\d{8}$/;

const Auth = ({ onSuccess }) => {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");

    if (!emailRegex.test(form.email || "")) {
      return setError("Invalid email address");
    }

    if (mode === "signup" && !phoneRegex.test(form.phone || "")) {
      return setError("Invalid phone number");
    }

    if (mode === "signup" && form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const endpoint = mode === "signup" ? "register" : "login";

      const res = await fetch(
        `http://localhost:5001/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("eventghar_token", data.token);
      localStorage.setItem("eventghar_user", JSON.stringify(data.user));

      onSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        {/* LEFT */}
        <div className="auth-left">
          <h1>
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>

          {mode === "login" && (
            <p className="auth-sub">
              Log in to manage your bookings
            </p>
          )}

          {mode === "signup" && (
            <input
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
            />
          )}

          <input
            name="email"
            placeholder="Email address"
            onChange={handleChange}
          />

          {mode === "signup" && (
            <input
              name="phone"
              placeholder="+977 Phone Number"
              onChange={handleChange}
            />
          )}

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <span onClick={() => setShowPassword(!showPassword)}>👁</span>
          </div>

          {mode === "signup" && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
            />
          )}

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn" onClick={submit}>
            {mode === "signup" ? "SIGN UP" : "LOG IN"}
          </button>

          {/* ✅ MATCH LOGIN STYLE */}
          <p className="switch-text">
            {mode === "signup"
              ? "Already have an account?"
              : "Don’t have an account?"}{" "}
            <span
              onClick={() =>
                setMode(mode === "signup" ? "login" : "signup")
              }
            >
              {mode === "signup" ? "Log in" : "Sign up"}
            </span>
          </p>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <img src={EventGharLogo} alt="Event Ghar" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
