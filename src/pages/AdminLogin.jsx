import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import EventGharLogo from "../assets/logo.png";
import { api } from "../lib/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(api("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("eventghar_admin_token", data.token);
      localStorage.setItem("eventghar_admin", JSON.stringify(data.admin));

      navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(240,166,58,0.22),transparent_40%),radial-gradient(circle_at_85%_85%,rgba(214,48,74,0.18),transparent_45%)]" />
      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-8 shadow-pop"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <img src={EventGharLogo} alt="EventGhar" className="h-10 w-auto" />
          <span className="flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Login
          </span>
        </div>

        <div className="space-y-4">
          <Input
            name="email"
            type="email"
            label="Admin email"
            placeholder="admin@eventghar.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-raspberry/10 px-3 py-2 text-sm font-medium text-raspberry-dark">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="mt-6 w-full"
          size="lg"
          loading={loading}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Log in"}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
