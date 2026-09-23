import React from "react";

const tones = {
  live: "bg-raspberry/10 text-raspberry-dark",
  available: "bg-pine/10 text-pine-dark",
  approved: "bg-pine/10 text-pine-dark",
  soldout: "bg-stone-200 text-stone-600",
  rejected: "bg-raspberry/10 text-raspberry-dark",
  pending: "bg-marigold/15 text-marigold-dark",
  neutral: "bg-stone-100 text-stone-700",
};

/**
 * Small status label — used for order status, ticket status,
 * category tags, "live now" markers, etc.
 */
export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wide",
        tones[tone],
        className,
      ].join(" ")}
    >
      {tone === "live" && (
        <span className="eq-bars text-raspberry" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      )}
      {children}
    </span>
  );
}
