import React from "react";

/**
 * Faint instrument-silhouette watermark — a madal (Nepali hand drum) and
 * a sarangi (bowed folk fiddle), drawn as flat line art. Meant to sit
 * behind hero/CTA copy at very low opacity, the same way `poster-wash`
 * archive photos sit behind the navbar: texture, not illustration.
 *
 * Visible at all breakpoints now — callers pass a responsive className
 * (smaller/repositioned on mobile) rather than hiding it below `md`, so
 * phone visitors get the same music cue desktop visitors do.
 */
export default function InstrumentMotif({ className = "", opacity = 0.06, color = "var(--color-ink)" }) {
  return (
    <svg
      viewBox="0 0 600 400"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Madal — double-headed hand drum */}
      <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
        <ellipse cx="150" cy="120" rx="70" ry="34" />
        <path d="M110 138 C 95 200, 95 260, 118 300" />
        <path d="M190 138 C 205 200, 205 260, 182 300" />
        <ellipse cx="150" cy="300" rx="55" ry="26" />
        <path d="M120 150 L 100 280" />
        <path d="M180 150 L 200 280" />
        <path d="M140 150 L 132 280" />
        <path d="M160 150 L 168 280" />
      </g>

      {/* Sarangi — bowed folk fiddle, drawn as a symmetric hourglass
          body (mirrored bezier curves) rather than a freehand outline,
          so the silhouette reads cleanly even at very low opacity. */}
      <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M460 70
             C 497 70, 518 100, 507 136
             C 533 152, 538 188, 511 207
             C 537 226, 532 262, 505 278
             C 516 313, 496 342, 460 342
             C 424 342, 404 313, 415 278
             C 388 262, 383 226, 409 207
             C 382 188, 387 152, 413 136
             C 402 100, 423 70, 460 70 Z"
        />
        {/* Neck */}
        <line x1="460" y1="70" x2="460" y2="18" />
        {/* Strings */}
        <line x1="440" y1="92" x2="440" y2="318" />
        <line x1="460" y1="86" x2="460" y2="324" />
        <line x1="480" y1="92" x2="480" y2="318" />
        {/* Bow */}
        <line x1="600" y1="35" x2="478" y2="162" />
      </g>
    </svg>
  );
}
