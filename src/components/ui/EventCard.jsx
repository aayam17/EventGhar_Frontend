import React from "react";
import { useNavigate } from "react-router-dom";
import { optimizeImage } from "../../lib/image";

// Cycles through the brand's flat poster colors, same order as the
// reference flyer design: navy, red, gold, green. Used as a fallback
// block when an event has no photo.
const TINTS = ["bg-cobalt", "bg-raspberry", "bg-marigold", "bg-pine"];

const formatDateShort = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d
    .toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" })
    .toUpperCase();
};

export default function EventCard({ event, index = 0 }) {
  const navigate = useNavigate();
  const isExpired =
    !!event.eventDateTime && new Date(event.eventDateTime) < new Date();
  const venue = event.venue?.name || event.venue;
  const tint = TINTS[index % TINTS.length];
  const isFree = !event.price || Number(event.price) === 0;
  const hasPhoto = Boolean(event.imageSrc);

  const metaLine = [formatDateShort(event.eventDateTime), venue]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden border-2 border-ink bg-white shadow-card transition-all duration-200 hover:shadow-pop poster-pin">
      <div
        className={[
          "relative h-36 overflow-hidden md:h-40",
          hasPhoto ? "" : `${tint} poster-grain flex items-center justify-center px-4 text-center`,
        ].join(" ")}
      >
        {hasPhoto ? (
          <>
            <img
              src={optimizeImage(event.imageSrc, 600)}
              alt={event.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-ink/85 to-transparent px-4 pb-3 pt-8">
              <h3 className="font-display text-lg uppercase leading-[1.05] text-paper line-clamp-2 md:text-xl">
                {event.title}
              </h3>
            </div>
          </>
        ) : (
          <h3 className="relative z-[1] font-display text-lg uppercase leading-[1.05] text-paper line-clamp-2 md:text-xl">
            {event.title}
          </h3>
        )}

        {isExpired && (
          <div className="absolute inset-0 z-[3] flex items-center justify-center bg-ink/60">
            <span className="bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-ink">
              Event ended
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t-2 border-ink p-4">
        <h4 className="font-display text-base font-bold leading-snug text-ink line-clamp-2">
          {event.title}
        </h4>

        {metaLine && (
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            {metaLine}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="font-display text-lg text-ink">
            {isFree ? "Free" : `Rs ${Number(event.price).toLocaleString()}`}
          </span>

          <button
            disabled={isExpired}
            onClick={() => navigate(`/events/${event._id}`)}
            className="rounded-md bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wide text-paper transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isExpired ? "Expired" : isFree ? "Reserve spot" : "Get tickets"}
          </button>
        </div>
      </div>
    </article>
  );
}
