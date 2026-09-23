import React from "react";

/**
 * EventGhar brand wordmark: "Event" in the display face, "घर" (ghar,
 * "home") in a bold Devanagari face. Archivo Black has no Devanagari
 * glyphs, so the Nepali part gets its own font instead of falling back
 * to whatever the OS picks.
 *
 * Size and color come from the caller via className (text-2xl text-ink).
 */
export default function Wordmark({ className = "" }) {
  return (
    <span className={`font-display leading-none ${className}`}>
      <span className="sr-only">EventGhar</span>
      <span aria-hidden="true">
        Event<span className="font-devanagari font-extrabold">घर</span>
      </span>
    </span>
  );
}
