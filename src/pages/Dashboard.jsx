import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import EventCard from "../components/ui/EventCard";
import { EventCardSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import Toast, { useSnack } from "../components/ui/Toast";
import SoundDivider from "../components/ui/SoundDivider";
import InstrumentMotif from "../components/ui/InstrumentMotif";
import SongPlayer from "../components/ui/SongPlayer";
import { templeMusic, vintageTemple, kalBhairav, durbarSquare, concertVintage } from "../assets/vintage";
import { api } from "../lib/api";
import { optimizeImage } from "../lib/image";

const isHttpUrl = (value) => typeof value === "string" && /^https?:\/\//i.test(value);

// Same flat poster-color cycle used on the trending event cards, so the
// hero card falls back to a matching color block when an event has no photo.
const HERO_TINTS = ["bg-cobalt", "bg-raspberry", "bg-marigold", "bg-pine"];

const Hero = ({ onBrowse }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [songPlaying, setSongPlaying] = useState(false);

  useEffect(() => {
    fetch(api("/api/featured-events"))
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    events.forEach((item) => {
      if (!item.imageSrc) return;
      const img = new Image();
      img.src = optimizeImage(item.imageSrc, 800);
    });
  }, [events]);

  useEffect(() => {
    if (events.length <= 1 || paused || songPlaying) return;
    const autoSlide = setInterval(
      () => setCurrentIndex((i) => (i + 1) % events.length),
      4000
    );
    return () => clearInterval(autoSlide);
  }, [events, paused, songPlaying, currentIndex]);

  const event = events[currentIndex];
  const venue = event?.venue && !isHttpUrl(event.venue) ? event.venue : null;
  const dateLabel = event
    ? new Date(event.eventDateTime)
        .toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" })
        .toUpperCase()
    : null;

  return (
    <section className="relative overflow-hidden bg-paper poster-grain">
      <InstrumentMotif
        className="pointer-events-none absolute -right-8 -top-6 h-[200px] w-[200px] md:-right-16 md:top-0 md:h-full md:w-[440px]"
        opacity={0.06}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:px-9 md:py-24">
        <div>
          <p
            lang="ne"
            className="mb-4 flex items-center gap-3 text-lg font-semibold tracking-[0.14em] text-marigold-dark md:text-xl"
          >
            संगीत · कार्यक्रम · टिकट
          </p>
          <span className="inline-block -rotate-2 bg-marigold px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_var(--color-ink)]">
            Event ticketing for Nepal
          </span>
          <h1 className="mt-6 max-w-xl font-display text-4xl uppercase leading-[0.98] text-ink md:text-6xl">
            Your next
            <br />
            <span className="text-raspberry">night out</span>
            <br />
            starts here.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-stone-600">
            Concerts, festivals and gatherings, pasted up and sold out fast.
            Browse, book, and walk in with a QR ticket.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="secondary" size="lg" onClick={onBrowse}>
              Browse events
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate("/host")}>
              Host an event
            </Button>
          </div>

          {event?.songUrl && (
            <div className="mt-6 max-w-md">
              <SongPlayer
                songUrl={event.songUrl}
                songTitle={event.songTitle || event.title}
                onPlayStateChange={setSongPlaying}
              />
            </div>
          )}
        </div>

        <div
          className="mx-auto w-full max-w-xs rotate-2 md:max-w-sm"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative aspect-[4/5] overflow-hidden border-2 border-ink shadow-pop">
            {!loaded ? (
              <div className="h-full w-full skeleton-shimmer" />
            ) : event ? (
              <button
                type="button"
                className="block h-full w-full cursor-pointer text-left"
                onClick={() => navigate(`/events/${event.eventId || event._id}`)}
              >
                {events.map((item, i) => (
                  <div
                    key={item._id}
                    className={[
                      "absolute inset-0 transition-opacity duration-500",
                      i === currentIndex ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  >
                    {item.imageSrc ? (
                      <img
                        src={optimizeImage(item.imageSrc, 800)}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className={`h-full w-full ${HERO_TINTS[i % HERO_TINTS.length]} poster-grain`} />
                    )}
                  </div>
                ))}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 z-[1] p-4 md:p-5">
                  <p className="font-display text-xl uppercase leading-tight text-paper md:text-2xl">
                    {event.title}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-paper/85">
                    {[dateLabel, venue].filter(Boolean).join(" · ")}
                  </p>

                  {events.length > 1 && (
                    <div className="mt-3 flex items-center gap-1.5">
                      {events.map((_, i) => (
                        <span
                          key={i}
                          className={[
                            "h-1.5 rounded-full transition-all",
                            i === currentIndex ? "w-6 bg-marigold" : "w-1.5 bg-paper/60",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ) : (
              <div className="h-full w-full bg-cobalt poster-grain" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const FILTERS = [
  { id: "all", label: "All events" },
  { id: "soon", label: "This week" },
  { id: "value", label: "Under Rs 1,000" },
  { id: "live", label: "On sale" },
];

const TrendingEvents = React.forwardRef(
  ({ searchTerm, setSearchTerm, priceRange, setPriceRange, showSnack, filter, setFilter }, ref) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch(api("/api/events"))
        .then((res) => res.json())
        .then((data) => setEvents(Array.isArray(data) ? data : []))
        .catch(() => setEvents([]))
        .finally(() => setLoading(false));
    }, []);

    const filteredEvents = events.filter((event) => {
      const matchSearch =
        searchTerm.length < 3 ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice = event.price >= priceRange[0] && event.price <= priceRange[1];
      const now = new Date();
      const hasDate = !!event.eventDateTime && !isNaN(new Date(event.eventDateTime));
      const date = hasDate ? new Date(event.eventDateTime) : null;

      // Events whose date has passed stop showing up on the public list.
      // Events with no date stay visible so older listings don't vanish.
      if (date && date < now) return false;

      const matchFilter =
        filter === "all" ||
        (filter === "soon" && date && (date - now) / 86400000 <= 7) ||
        (filter === "value" && event.price <= 1000) ||
        (filter === "live" && true);
      return matchSearch && matchPrice && matchFilter;
    });

    return (
      <section id="events" ref={ref} className="mx-auto max-w-7xl px-6 py-14 md:px-9">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-block -rotate-2 bg-pine px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-paper shadow-[3px_3px_0_var(--color-ink)]">
              Happening soon
            </span>
            <h2 className="mt-3 font-display text-3xl uppercase text-ink md:text-4xl">
              Trending events
            </h2>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-64">
            <label htmlFor="price-filter" className="flex justify-between text-xs font-medium text-stone-500">
              <span>Max price</span>
              <span className="font-semibold text-ink">Rs {priceRange[1].toLocaleString()}</span>
            </label>
            <input
              id="price-filter"
              type="range"
              min="0"
              max="2000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceRange([0, val]);
                showSnack(`Showing events under Rs ${val}`, "info");
              }}
              className="range-marigold w-full"
            />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                filter === f.id
                  ? "bg-ink text-paper"
                  : "border border-stone-200 bg-white text-stone-600 hover:border-ink",
              ].join(" ")}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            title="No events found"
            description="Try a different search, filter, or widen your price range."
          />
        ) : (
          <div className="poster-grid grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEvents.map((event, i) => (
              <EventCard key={event._id} event={event} index={i} />
            ))}
          </div>
        )}
      </section>
    );
  }
);

const MusicNightBand = ({ onBrowse }) => {
  return (
    <section className="relative overflow-hidden bg-cobalt poster-grain">
      <InstrumentMotif
        className="pointer-events-none absolute -left-10 bottom-0 h-[170px] w-[190px] md:-left-20 md:h-[85%] md:w-[420px]"
        opacity={0.12}
        color="var(--color-paper)"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-9 md:py-20">
        <div className="mx-auto w-full max-w-md rotate-[-1.5deg] poster-photo poster-photo--marigold border-2 border-ink shadow-pop md:mx-0">
          <img
            src={concertVintage}
            alt="Archival photo of a music gig in Kathmandu"
            className="aspect-[4/3]"
          />
        </div>

        <div>
          <span className="inline-block rotate-1 bg-raspberry px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-paper shadow-[3px_3px_0_var(--color-ink)]">
            The valley's soundtrack
          </span>
          <h2 className="mt-6 max-w-lg font-display text-3xl leading-[1.02] text-paper md:text-5xl">
            Live music runs through
            <br />
            every gully in Kathmandu.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-stone-200">
            Rooftop sets in Thamel, madal and sarangi duos in Basantapur,
            open-air festivals under the ridgeline. EventGhar tracks the
            gigs so you don't find out about them the morning after.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="marigold" size="lg" onClick={onBrowse}>
              Find a live show
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const TrustBar = () => {
  const items = [
    "Secure eSewa checkout",
    "Instant QR tickets",
    "Host in a few clicks",
    "Transfer & gift tickets",
  ];
  return (
    <div className="bg-ink">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-6 text-center md:justify-between md:px-9">
        {items.map((label) => (
          <span
            key={label}
            className="text-xs font-bold uppercase tracking-wide text-paper md:text-sm"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

const ARCHIVE_PHOTOS = [
  { src: templeMusic, tint: "raspberry", caption: "Devotional singing outside a temple, Balaju · 1929–35", credit: "Martin Hurlimare / Nat Geo" },
  { src: kalBhairav, tint: "cobalt", caption: "Kal Bhairav shrine, Durbar Square · 1870", credit: "Bourne & Shepherd" },
  { src: durbarSquare, tint: "marigold", caption: "Durbar Square on a festival day", credit: "Archival print" },
  { src: vintageTemple, tint: "pine", caption: "Looking out from a temple courtyard", credit: "Archival print" },
];

const ArchiveBand = () => {
  return (
    <section className="border-y border-stone-200 bg-paper poster-grain">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-9">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-raspberry">
          Before the QR code
        </p>
        <h2 className="mt-1 max-w-2xl font-display text-2xl font-bold text-ink md:text-3xl">
          From the archives: Kathmandu, in the decades before us
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
          Pasted up like flyers on a Thamel wall: four frames of the valley
          that's always made room for music, from temple courtyards to
          tonight's lineup.
        </p>

        <div className="poster-grid mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ARCHIVE_PHOTOS.map((photo) => (
            <figure
              key={photo.caption}
              className={`poster-photo poster-photo--${photo.tint} poster-pin aspect-[3/4] border-2 border-ink shadow-card transition-shadow hover:shadow-pop`}
            >
              <img src={photo.src} alt={photo.caption} />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-ink/80 p-3">
                <p className="font-display text-xs leading-snug text-paper">{photo.caption}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-paper/60">{photo.credit}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [filter, setFilter] = useState("all");
  const [snack, showSnack] = useSnack();
  const trendingRef = useRef(null);

  const handleEventsClick = () => {
    trendingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Page
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onEventsClick={handleEventsClick}
    >
      <Hero onBrowse={handleEventsClick} />
      <div className="bg-paper py-1">
        <SoundDivider color="var(--color-cobalt)" />
      </div>
      <TrustBar />
      <TrendingEvents
        ref={trendingRef}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        showSnack={showSnack}
        filter={filter}
        setFilter={setFilter}
      />
      <ArchiveBand />
      <div className="bg-paper py-1">
        <SoundDivider color="var(--color-raspberry)" />
      </div>
      <MusicNightBand onBrowse={handleEventsClick} />
      {snack && <Toast message={snack.message} type={snack.type} />}
    </Page>
  );
};

export default Dashboard;
