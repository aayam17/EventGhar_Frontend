import { useState } from "react";
import "../assets/css/Auth.css";

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

      const data = await res.json(); // SAFE NOW

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      localStorage.setItem("eventghar_token", data.token);
      localStorage.setItem("eventghar_user", JSON.stringify(data.user));

      onSuccess();
    } catch (err) {
      console.error("AUTH ERROR:", err);
      setError(err.message || "Server error. Please try again.");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <div className="auth-left">
          <h2>{mode === "signup" ? "Account Sign Up" : "Account Log In"}</h2>

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

          <button className="green-btn" onClick={submit}>
            {mode === "signup" ? "SIGN UP" : "LOG IN"}
          </button>

          <p className="switch-text">
            {mode === "signup"
              ? "Already have an account?"
              : "Don’t have an account?"}{" "}
            <span
              onClick={() =>
                setMode(mode === "signup" ? "login" : "signup")
              }
            >
              {mode === "signup" ? "Log In" : "Sign Up"}
            </span>
          </p>
        </div>

        <div className="auth-right">
          <img src="/logo.png" alt="Event Ghar" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
