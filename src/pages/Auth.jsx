import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff, X } from "lucide-react";
import Wordmark from "../components/ui/Wordmark";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { api } from "../lib/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+977)?9[6-9]\d{8}$/;

const Auth = ({ onSuccess, onClose }) => {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (!onClose) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Handles the ID token Google's widget hands back. Kept in a ref so the
  // Google callback (registered once, below) always calls the latest version
  // instead of one that closed over a stale onSuccess/setState from mount.
  const handleGoogleCredentialRef = useRef();
  handleGoogleCredentialRef.current = async (response) => {
    setFormError("");
    setGoogleLoading(true);
    try {
      const res = await fetch(api("/api/auth/google"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("eventghar_token", data.token);
      localStorage.setItem("eventghar_user", JSON.stringify(data.user));
      onSuccess();
    } catch (err) {
      setFormError(err.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Loads the Google button once the Identity Services script (loaded in
  // index.html) is ready, and renders it into googleButtonRef.
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    let cancelled = false;

    const renderButton = () => {
      if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => handleGoogleCredentialRef.current(response),
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: mode === "signup" ? "signup_with" : "signin_with",
      });
    };

    if (window.google?.accounts?.id) {
      renderButton();
    } else {
      // The GSI <script> in index.html loads async/defer, so on a fast
      // mount it may not be ready yet — poll briefly until it is.
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          renderButton();
        }
      }, 100);
      setTimeout(() => clearInterval(interval), 10000);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const submit = async (e) => {
    e?.preventDefault();
    setFormError("");

    const nextErrors = {};
    if (mode === "signup" && !form.fullName) nextErrors.fullName = "Full name is required";
    if (!emailRegex.test(form.email || "")) nextErrors.email = "Enter a valid email address";
    if (mode === "signup" && !phoneRegex.test(form.phone || "")) {
      nextErrors.phone = "Enter a valid Nepal phone number";
    }
    if (!form.password) nextErrors.password = "Password is required";
    else if (mode === "signup" && form.password.length < 8) {
      nextErrors.password = "Use at least 8 characters";
    }
    if (mode === "signup" && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      setLoading(true);
      const endpoint = mode === "signup" ? "register" : "login";

      const res = await fetch(api(`/api/auth/${endpoint}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("eventghar_token", data.token);
      localStorage.setItem("eventghar_user", JSON.stringify(data.user));
      onSuccess();
    } catch (err) {
      setFormError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/50 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-[880px] overflow-hidden border-2 border-ink bg-white shadow-pop md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-white text-ink transition hover:bg-ink hover:text-paper"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <form onSubmit={submit} className="flex flex-col p-8 md:p-10">
          <span className="inline-flex w-fit -rotate-2 bg-marigold px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_var(--color-ink)]">
            {mode === "signup" ? "Join EventGhar" : "Welcome back"}
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink">
            {mode === "signup" ? "Create your account" : "Log in to continue"}
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            {mode === "signup"
              ? "Book tickets, gift nights out, and manage your QR passes."
              : "Access bookings, tickets, and your EventGhar profile."}
          </p>

          <div className="mt-6 space-y-3">
            {mode === "signup" && (
              <Input
                name="fullName"
                label="Full name"
                placeholder="Your full name"
                onChange={handleChange}
                error={errors.fullName}
                required
              />
            )}
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              onChange={handleChange}
              error={errors.email}
              required
            />
            {mode === "signup" && (
              <Input
                name="phone"
                label="Phone"
                placeholder="+977 98XXXXXXXX"
                onChange={handleChange}
                error={errors.phone}
                required
              />
            )}
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="••••••••"
                onChange={handleChange}
                error={errors.password}
                required
                className="pr-11"
              />
              <button
                type="button"
                className="absolute right-3 top-[34px] text-stone-400 hover:text-ink"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {mode === "signup" && (
              <Input
                name="confirmPassword"
                type="password"
                label="Confirm password"
                placeholder="••••••••"
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
            )}
          </div>

          {formError && (
            <p className="mt-3 border-2 border-raspberry bg-raspberry/10 px-3 py-2 text-sm font-medium text-raspberry-dark">
              {formError}
            </p>
          )}

          <Button type="submit" className="mt-6 w-full" size="lg" loading={loading}>
            {mode === "signup" ? "Create account" : "Log in"}
          </Button>

          {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
            <>
              <div className="mt-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-stone-200" />
                <span className="text-xs font-medium uppercase tracking-wide text-stone-400">or</span>
                <span className="h-px flex-1 bg-stone-200" />
              </div>
              <div className="mt-4 flex justify-center">
                <div ref={googleButtonRef} aria-busy={googleLoading} />
              </div>
            </>
          )}

          <p className="mt-5 text-center text-sm text-stone-500">
            {mode === "signup" ? "Already have an account?" : "Don’t have an account?"}{" "}
            <button
              type="button"
              className="font-semibold text-marigold-dark hover:underline"
              onClick={() => {
                setMode(mode === "signup" ? "login" : "signup");
                setErrors({});
                setFormError("");
              }}
            >
              {mode === "signup" ? "Log in" : "Sign up"}
            </button>
          </p>
        </form>

        <div className="relative hidden overflow-hidden bg-ink md:flex md:flex-col md:items-center md:justify-center md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(240,166,58,0.28),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(214,48,74,0.22),transparent_50%)]" />
          <Wordmark className="relative text-5xl text-paper" />
          <p className="relative mt-8 max-w-xs text-center font-display text-2xl font-bold leading-tight text-paper">
            Find the night. Book the seat. Show the code.
          </p>
          <p className="relative mt-3 max-w-xs text-center text-sm text-stone-300">
            Tickets for concerts, festivals, and gatherings across Nepal.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Auth;
