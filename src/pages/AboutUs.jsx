import React from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, ShieldCheck, Rocket, Heart, FileText, Lock, RotateCcw, ArrowRight } from "lucide-react";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import { durbarSquare, concertVintage, kalBhairav } from "../assets/vintage";

// Facts about how EventGhar actually works. Deliberately not sales figures:
// add real numbers here only once they are true and you can back them up.
const STATS = [
  { value: "eSewa", label: "Secure checkout" },
  { value: "1 QR", label: "For every ticket" },
  { value: "Gift", label: "Transfer tickets to friends" },
  { value: "Refunds", label: "When an event is cancelled" },
];

const VALUES = [
  {
    icon: Ticket,
    tint: "bg-marigold",
    title: "Tickets, simplified",
    description:
      "No printing, no queues. Book in a few taps and walk in with a QR code that scans in seconds.",
  },
  {
    icon: ShieldCheck,
    tint: "bg-pine",
    title: "Secure, always",
    description:
      "Every payment runs through eSewa. If an event is cancelled, you can request a refund straight from My bookings.",
  },
  {
    icon: Rocket,
    tint: "bg-cobalt",
    title: "Built for hosts",
    description:
      "Tell us about your event and we'll list it, sell the tickets, and scan people in at the door, so organizers spend less time on logistics and more on the show.",
  },
  {
    icon: Heart,
    tint: "bg-raspberry",
    title: "Rooted in Kathmandu",
    description:
      "We started in the valley's rooftop gigs and temple courtyards, and we're building for the culture we grew up in.",
  },
];

const LEGAL_CARDS = [
  {
    icon: FileText,
    tint: "bg-cobalt",
    title: "Terms of service",
    description: "The rules for buying tickets, entering events, and hosting shows.",
    path: "/terms",
  },
  {
    icon: Lock,
    tint: "bg-pine",
    title: "Privacy policy",
    description: "What we collect, why, and the choices you have over your data.",
    path: "/privacy",
  },
  {
    icon: RotateCcw,
    tint: "bg-raspberry",
    title: "Refund policy",
    description: "When refunds are possible and how to request one.",
    path: "/refund-policy",
  },
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <Page>
      {/* HERO */}
      <section className="relative overflow-hidden bg-paper poster-grain">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-9 md:py-24">
          <div>
            <span className="inline-block -rotate-2 bg-marigold px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_var(--color-ink)]">
              Our story
            </span>
            <h1 className="mt-6 max-w-xl font-display text-4xl uppercase leading-[0.98] text-ink md:text-6xl">
              We're building
              <br />
              Nepal's <span className="text-raspberry">ticket home.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-stone-600">
              EventGhar started with a simple problem: finding out about a
              good show in Kathmandu always happened a day too late. So we
              built the place where events, tickets, and QR entry live
              together, for gig-goers and hosts alike.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="secondary" size="lg" onClick={() => navigate("/")}>
                Browse events
              </Button>
              <Button variant="ghost" size="lg" onClick={() => navigate("/host")}>
                Host an event
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm rotate-2">
            <div className="poster-photo poster-photo--marigold border-2 border-ink shadow-pop">
              <img
                src={durbarSquare}
                alt="Durbar Square, Kathmandu"
                className="aspect-[4/5] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* LEGAL: right under the hero so it's seen first */}
      <section className="border-y-2 border-ink bg-cobalt poster-grain">
        <div className="relative mx-auto max-w-7xl px-6 py-10 md:px-9 md:py-12">
          <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-block -rotate-2 bg-marigold px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_var(--color-ink)]">
                Legal
              </span>
              <h2 className="mt-4 font-display text-2xl uppercase leading-tight text-paper md:text-4xl">
                Know before you book
              </h2>
            </div>
            <p className="max-w-md border-l-4 border-marigold pl-4 text-base font-medium leading-relaxed tracking-[0.01em] text-paper md:text-lg">
              Short, plain-language pages on how EventGhar works, how we handle your
              data, and what happens if an event is cancelled.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {LEGAL_CARDS.map(({ icon: Icon, tint, title, description, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="group flex h-full flex-col items-start gap-4 border-2 border-ink bg-white p-5 text-left shadow-[4px_4px_0_var(--color-ink)] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)]"
              >
                <span className={`flex h-11 w-11 items-center justify-center border-2 border-ink ${tint}`}>
                  <Icon className="h-5 w-5 text-paper" strokeWidth={2.5} />
                </span>
                <span className="font-display text-lg font-bold text-ink">{title}</span>
                <span className="text-sm leading-relaxed text-stone-600">{description}</span>
                <span className="mt-auto flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink">
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-ink">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4 md:px-9">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="font-display text-3xl text-marigold md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-stone-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-9">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="mx-auto w-full max-w-md rotate-[-1.5deg] poster-photo poster-photo--cobalt border-2 border-ink shadow-pop md:mx-0">
            <img
              src={concertVintage}
              alt="A live gig in Kathmandu"
              className="aspect-[4/3]"
            />
          </div>

          <div>
            <span className="inline-block rotate-1 bg-cobalt px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-paper shadow-[3px_3px_0_var(--color-ink)]">
              Why we exist
            </span>
            <h2 className="mt-6 max-w-lg font-display text-3xl leading-[1.02] text-ink md:text-4xl">
              Every gully in this valley has a show worth showing up for.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone-600">
              Rooftop sets in Thamel, madal and sarangi duos in Basantapur,
              open-air festivals under the ridgeline. Kathmandu has never
              been short on nights worth remembering. What it needed was one
              place to find them, book them, and prove you were there.
            </p>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-stone-600">
              That's EventGhar: a ticketing platform built by people who were
              tired of hearing about the best show of the year after it
              already happened.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-y-2 border-ink bg-paper poster-grain">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-9">
          <span className="inline-block -rotate-2 bg-pine px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-paper shadow-[3px_3px_0_var(--color-ink)]">
            What we stand for
          </span>
          <h2 className="mt-4 max-w-2xl font-display text-3xl uppercase text-ink md:text-4xl">
            Built on a few simple rules
          </h2>

          <div className="poster-grid mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, tint, title, description }) => (
              <div
                key={title}
                className="flex h-full flex-col gap-4 border-2 border-ink bg-white p-5 shadow-card transition-shadow hover:shadow-pop"
              >
                <span className={`flex h-11 w-11 items-center justify-center border-2 border-ink ${tint}`}>
                  <Icon className="h-5 w-5 text-ink" strokeWidth={2.5} />
                </span>
                <h3 className="font-display text-lg font-bold text-ink">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-cobalt poster-grain">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-9 md:py-20">
          <div className="mx-auto w-full max-w-md rotate-[1.5deg] poster-photo poster-photo--raspberry border-2 border-ink shadow-pop md:mx-0">
            <img
              src={kalBhairav}
              alt="Kal Bhairav shrine, Durbar Square"
              className="aspect-[4/3]"
            />
          </div>

          <div>
            <span className="inline-block rotate-1 bg-raspberry px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-paper shadow-[3px_3px_0_var(--color-ink)]">
              Join us
            </span>
            <h2 className="mt-6 max-w-lg font-display text-3xl leading-[1.02] text-paper md:text-5xl">
              Got an event worth
              <br />
              showing up for?
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-stone-200">
              List it on EventGhar and let us handle discovery, ticketing,
              and entry, so you can focus on the night itself.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="marigold" size="lg" onClick={() => navigate("/host")}>
                Host an event
              </Button>
              <Button variant="ghost" size="lg" className="!border-paper !text-paper hover:!bg-paper hover:!text-ink" onClick={() => navigate("/contact")}>
                Talk to us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
};

export default AboutUs;
