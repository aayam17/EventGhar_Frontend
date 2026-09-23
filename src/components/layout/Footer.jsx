import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, MapPin, Ticket, Instagram, Facebook, Twitter, ArrowUp, ShieldCheck, Send } from "lucide-react";
import Wordmark from "../ui/Wordmark";
import { templeVintage } from "../../assets/vintage";
import { api } from "../../lib/api";
import { SUPPORT_EMAIL, SOCIAL_LINKS } from "../../config/site";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubError("");
    try {
      const res = await fetch(api("/api/newsletter"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not subscribe");
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      setSubError(err.message || "Could not subscribe");
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-auto border-t-2 border-ink bg-ink text-paper">
      <div className="relative overflow-hidden poster-photo poster-photo--cobalt">
        <img
          src={templeVintage}
          alt="Archival photograph of a Kathmandu temple"
          className="h-40 w-full md:h-56"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-7xl items-center justify-between px-6 pb-4 md:px-9">
          <span className="inline-block -rotate-1 bg-marigold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_var(--color-ink)]">
            From the archives · Kathmandu
          </span>
        </div>
      </div>

      {/* Newsletter — the one clear action on the footer, kept above the fold of it */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-9">
          <div>
            <h3 className="font-display text-xl font-bold text-paper md:text-2xl">
              Get the drop on new events
            </h3>
            <p className="mt-1.5 text-sm text-stone-400">
              New listings and presales, straight to your inbox. No spam.
            </p>
          </div>

          {subscribed ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-pine">
              <ShieldCheck className="h-4 w-4" /> You're on the list.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2.5">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-2 border-white/20 bg-white/5 px-4 py-2.5 text-sm text-paper outline-none transition-all placeholder:text-stone-500 focus:border-marigold focus:ring-4 focus:ring-marigold/20"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex shrink-0 items-center gap-2 border-2 border-marigold bg-marigold px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:bg-marigold-dark hover:border-marigold-dark"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
          )}
          {subError && (
            <p className="text-sm text-raspberry">{subError}</p>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr] md:px-9">
        <div>
          <Wordmark className="text-3xl text-paper" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-400">
            Nepal's ticket home: discover nights out, book in seconds, and
            walk in with a QR code. Hosted with care, paid securely via eSewa.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-stone-400">
            <MapPin className="h-4 w-4 text-marigold" />
            Kathmandu, Nepal
          </p>

          {(() => {
            const socials = [
              { icon: Instagram, label: "Instagram", href: SOCIAL_LINKS.instagram },
              { icon: Facebook, label: "Facebook", href: SOCIAL_LINKS.facebook },
              { icon: Twitter, label: "Twitter", href: SOCIAL_LINKS.twitter },
            ].filter((s) => s.href);

            if (!socials.length) return null;
            return (
              <div className="mt-6 flex items-center gap-2.5">
                {socials.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center border border-white/15 text-stone-300 transition hover:border-marigold hover:text-marigold"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            );
          })()}
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
            Explore
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-stone-300">
            <li>
              <button className="transition hover:text-marigold" onClick={() => navigate("/")}>
                Upcoming events
              </button>
            </li>
            <li>
              <button className="transition hover:text-marigold" onClick={() => navigate("/about")}>
                About us
              </button>
            </li>
            <li>
              <button className="transition hover:text-marigold" onClick={() => navigate("/host")}>
                Host an event
              </button>
            </li>
            <li>
              <button className="transition hover:text-marigold" onClick={() => navigate("/my-bookings")}>
                My bookings
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
            Support
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-stone-300">
            <li>
              <button className="transition hover:text-marigold" onClick={() => navigate("/contact")}>
                Contact us
              </button>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-stone-500" />
              {SUPPORT_EMAIL}
            </li>
            <li className="flex items-center gap-2">
              <Ticket className="h-3.5 w-3.5 text-stone-500" />
              Instant QR tickets
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
            Legal
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-stone-300">
            <li><button className="transition hover:text-marigold" onClick={() => navigate("/terms")}>Terms of service</button></li>
            <li><button className="transition hover:text-marigold" onClick={() => navigate("/privacy")}>Privacy policy</button></li>
            <li><button className="transition hover:text-marigold" onClick={() => navigate("/refund-policy")}>Refund policy</button></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between md:px-9">
          <span>© {new Date().getFullYear()} EventGhar. All rights reserved.</span>

          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-pine" />
              Secure checkout · eSewa · Nepal
            </span>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-8 w-8 items-center justify-center border border-white/15 text-stone-300 transition hover:border-marigold hover:text-marigold"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
