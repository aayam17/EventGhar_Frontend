import React, { useEffect, useMemo, useRef, useState } from "react";

// Fixed bar thickness + gap, in px — kept constant across screen sizes
// so the wave always reads the same "density," rather than getting
// chunkier on mobile or stretched-thin on a wide desktop section.
const BAR_WIDTH = 3;
const BAR_GAP = 3;

/**
 * Animated soundwave divider — a strip of bars that continuously
 * ripple like a live audio level meter, used to break up sections
 * instead of a plain border (a small, repeated cue that this is a
 * live-music platform).
 *
 * Built as plain flex bars, not a static SVG line: a single shared
 * CSS keyframe drives every bar's height, and each bar's negative
 * `animation-delay` offsets where in that cycle it starts — the same
 * trick behind voice-message and "now playing" waveforms — so the
 * peak visibly travels across the strip instead of the whole thing
 * pulsing in place. A `ResizeObserver` picks exactly enough bars to
 * fill the container edge-to-edge at a constant thickness, so it
 * still looks intentional at any section width.
 *
 * `color` accepts any CSS color value (works with brand tokens via var()).
 */
export default function SoundDivider({ color = "var(--color-cobalt)", className = "" }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0]?.contentRect?.width ?? 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const barCount = Math.max(16, Math.floor(width / (BAR_WIDTH + BAR_GAP)));

  // Deterministic per-bar amplitude so peaks aren't perfectly even —
  // some bars ripple higher than others, like a real level meter.
  const seeds = useMemo(
    () =>
      Array.from({ length: barCount }, (_, i) => {
        const n = Math.sin(i * 12.9898) * 43758.5453;
        return n - Math.floor(n);
      }),
    [barCount]
  );

  return (
    <div
      ref={containerRef}
      className={`sound-divider ${className}`}
      style={{ "--wave-color": color }}
      aria-hidden="true"
    >
      {seeds.map((seed, i) => (
        <span
          key={i}
          className="sound-divider__bar"
          style={{
            "--peak": `${26 + seed * 64}%`,
            animationDelay: `${i * -0.045}s`,
          }}
        />
      ))}
    </div>
  );
}
