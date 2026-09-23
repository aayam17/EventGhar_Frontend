import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, Clock, MapPin, ChevronRight, Building2 } from "lucide-react";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import Toast, { useSnack } from "../components/ui/Toast";
import QtyControl from "../components/ui/QtyControl";
import Badge from "../components/ui/Badge";
import SongPlayer from "../components/ui/SongPlayer";
import { durbarSquare } from "../assets/vintage";
import { api, API_URL } from "../lib/api";
import { optimizeImage } from "../lib/image";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [tab, setTab] = useState("DETAILS");
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [snack, showSnackbar] = useSnack();
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setMissing(false);
    setEvent(null);
    fetch(api(`/api/events/${id}`))
      .then((res) => res.json())
      .then((data) => {
        if (!data?._id || data.error) throw new Error(data.error || "Event not found");
        setEvent(data);
        document.title = `${data.title} | EventGhar`;
      })
      .catch(() => {
        setMissing(true);
        showSnackbar("Failed to load event details", "error");
      });
  }, [id]);

  if (missing) {
    return (
      <Page>
        <div className="mx-auto max-w-lg px-6 py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-ink">Event not found</h1>
          <p className="mt-2 text-stone-500">
            This featured slide is not linked to a bookable event yet.
          </p>
          <Button className="mt-6" onClick={() => navigate("/")}>
            Back to events
          </Button>
        </div>
      </Page>
    );
  }

  if (!event) {
    return (
      <Page>
        <div className="mx-auto max-w-5xl animate-pulse px-6 py-12">
          <div className="h-80 rounded-2xl bg-stone-100" />
        </div>
      </Page>
    );
  }

  const eventImage = optimizeImage(
    event.imageSrc?.startsWith("http")
      ? event.imageSrc
      : `${API_URL}/${(event.imageSrc || "").replace(/\\/g, "/")}`,
    1000
  );

  // Older events may have no ticket tiers. The server prices those as a single
  // GENERAL ticket at the event's starting price, so show the same here.
  const ticketOptions = event.tickets?.some((t) => t?.type)
    ? event.tickets.filter((t) => t?.type)
    : [{ type: "GENERAL", price: Number(event.price) || 0 }];

  const isExpired = event.eventDateTime && new Date(event.eventDateTime) < new Date();
  const isCancelled = event.isRefundable === true;
  const bookingDisabled = isExpired || isCancelled;

  const handleAddTicket = (ticket) => {
    setSelectedTickets((prev) => {
      const existing = prev.find((t) => t.type === ticket.type);
      if (existing) {
        return prev.map((t) =>
          t.type === ticket.type ? { ...t, qty: t.qty + 1 } : t
        );
      }
      showSnackbar(`${ticket.type} added`, "success");
      return [...prev, { ...ticket, qty: 1 }];
    });
  };

  const handleRemoveTicket = (ticket) => {
    setSelectedTickets((prev) => {
      const existing = prev.find((t) => t.type === ticket.type);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((t) => t.type !== ticket.type);
      return prev.map((t) =>
        t.type === ticket.type ? { ...t, qty: t.qty - 1 } : t
      );
    });
  };

  const totalTickets = selectedTickets.reduce((s, t) => s + t.qty, 0);
  const totalPrice = selectedTickets.reduce((s, t) => s + t.qty * t.price, 0);

  return (
    <Page>
      <div className="relative">
        <img
          src={durbarSquare}
          alt=""
          aria-hidden="true"
          className="poster-wash pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 w-full opacity-[0.06] md:h-96"
        />
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-9">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-stone-500">
          <button className="hover:text-ink" onClick={() => navigate("/")}>
            Home
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-ink">{event.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div className="space-y-4">
            <div className="relative overflow-hidden border-2 border-ink shadow-card">
              <img
                src={eventImage}
                alt={event.title}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute left-4 top-4">
                <Badge tone={isCancelled ? "pending" : isExpired ? "soldout" : "live"}>
                  {isCancelled ? "Event cancelled" : isExpired ? "Event ended" : "Tickets available"}
                </Badge>
              </div>
            </div>

            {event.songUrl && (
              <SongPlayer songUrl={event.songUrl} songTitle={event.songTitle || event.title} />
            )}

            <div className="flex items-center gap-3 border-2 border-ink bg-white px-4 py-3 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-marigold/20 text-ink">
                <Building2 className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">Hosted by</p>
                <p className="font-semibold text-ink">{event.organizer?.name || "EventGhar"}</p>
              </div>
            </div>

            {event.venue?.mapEmbedUrl && (
              <div className="overflow-hidden border-2 border-ink shadow-card">
                <iframe
                  src={event.venue.mapEmbedUrl}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Event Location"
                />
              </div>
            )}
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
              {event.title}
            </h1>

            <div className="mt-6 inline-flex border-2 border-ink p-1">
              {["DETAILS", "TICKETS"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    "px-5 py-2 text-sm font-bold uppercase tracking-wide transition-colors",
                    tab === t ? "bg-ink text-paper" : "text-stone-500 hover:text-ink",
                  ].join(" ")}
                >
                  {t === "DETAILS" ? "Details" : "Grab your ticket"}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {tab === "DETAILS" && (
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="border-2 border-ink bg-white p-4 shadow-card">
                      <CalendarDays className="h-4 w-4 text-raspberry" />
                      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-stone-500">Date</p>
                      <p className="text-sm font-semibold text-ink">{event.formattedDate}</p>
                    </div>
                    {event.time && (
                      <div className="border-2 border-ink bg-white p-4 shadow-card">
                        <Clock className="h-4 w-4 text-raspberry" />
                        <p className="mt-2 text-xs font-bold uppercase tracking-wide text-stone-500">Time</p>
                        <p className="text-sm font-semibold text-ink">{event.time}</p>
                      </div>
                    )}
                    {event.venue?.name && (
                      <div className="border-2 border-ink bg-white p-4 shadow-card">
                        <MapPin className="h-4 w-4 text-raspberry" />
                        <p className="mt-2 text-xs font-bold uppercase tracking-wide text-stone-500">Venue</p>
                        <p className="text-sm font-semibold text-ink">{event.venue.name}</p>
                      </div>
                    )}
                  </div>

                  <p className="whitespace-pre-line leading-relaxed text-stone-700">
                    {event.description}
                  </p>

                  {isCancelled && (
                    <div className="border-2 border-marigold-dark bg-marigold/10 px-4 py-3 text-sm text-marigold-dark">
                      This event has been cancelled{event.refundReason ? `: ${event.refundReason}` : "."}{" "}
                      Already bought a ticket? Check{" "}
                      <button className="font-semibold underline" onClick={() => navigate("/my-bookings")}>
                        My bookings
                      </button>{" "}
                      to request a refund.
                    </div>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    disabled={bookingDisabled}
                    onClick={() => setTab("TICKETS")}
                  >
                    {isCancelled
                      ? "Tickets unavailable"
                      : isExpired
                      ? "This event has ended"
                      : "Continue to tickets"}
                  </Button>
                </div>
              )}

              {tab === "TICKETS" && (
                <div className="space-y-3">
                  {ticketOptions.map((t, i) => {
                    const selected = selectedTickets.find((st) => st.type === t.type);
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between border-2 border-ink bg-white px-5 py-4 shadow-card"
                      >
                        <div>
                          <p className="font-semibold text-ink">{t.type}</p>
                          <p className="text-sm text-stone-500">
                            {Number(t.price) === 0
                              ? "Free"
                              : `NPR ${Number(t.price).toLocaleString()}`}
                          </p>
                        </div>
                        {!selected ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={bookingDisabled}
                            onClick={() => handleAddTicket(t)}
                          >
                            Add
                          </Button>
                        ) : (
                          <QtyControl
                            value={selected.qty}
                            onDec={() => handleRemoveTicket(t)}
                            onInc={() => handleAddTicket(t)}
                          />
                        )}
                      </div>
                    );
                  })}

                  <div className="sticky bottom-4 mt-4 flex items-center justify-between border-2 border-ink bg-white px-5 py-4 shadow-pop">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                        {totalTickets} ticket{totalTickets !== 1 ? "s" : ""}
                      </p>
                      <p className="font-display text-lg font-bold text-ink">
                        {totalTickets > 0 && totalPrice === 0
                          ? "Free"
                          : `NPR ${totalPrice.toLocaleString()}`}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      disabled={bookingDisabled}
                      onClick={() => {
                        if (selectedTickets.length === 0) {
                          showSnackbar("Please select at least one ticket", "warning");
                          return;
                        }
                        navigate(`/checkout/${event._id}`, {
                          state: { selectedTickets },
                        });
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>

      {snack && <Toast message={snack.message} type={snack.type} />}
    </Page>
  );
};

export default EventDetails;
