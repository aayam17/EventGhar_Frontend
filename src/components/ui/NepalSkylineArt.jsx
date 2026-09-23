import React from "react";

/**
 * NepalSkylineArt — a flat, screenprint-style illustration for the
 * "Street Poster" identity: Himalayan ridgeline, a Boudhanath-style
 * stupa and a Nyatapola-style pagoda skyline, traditional five-colour
 * prayer flags (blue/white/red/green/yellow, in their real order),
 * and a silhouetted sarangi player with rising music notes.
 *
 * Colors are pulled from the app's CSS variables so it re-themes
 * automatically if the palette ever changes.
 */
export default function NepalSkylineArt({ className = "" }) {
  return (
    <svg
      viewBox="0 0 480 640"
      className={className}
      role="img"
      aria-label="Illustration of the Kathmandu skyline beneath the Himalaya, with prayer flags and a sarangi player"
    >
      <defs>
        <linearGradient id="ng-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-cobalt)" />
          <stop offset="100%" stopColor="var(--color-cobalt-dark)" />
        </linearGradient>
        <pattern id="ng-halftone" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1.1" fill="rgba(239,230,211,0.5)" />
        </pattern>
      </defs>

      {/* Night sky */}
      <rect x="0" y="0" width="480" height="640" fill="url(#ng-sky)" />
      <rect x="0" y="0" width="480" height="640" fill="url(#ng-halftone)" opacity="0.5" />

      {/* Stars */}
      {[[60,50],[110,90],[300,40],[350,110],[420,70],[40,150],[440,180],[260,60]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="var(--color-paper)" opacity="0.8" />
      ))}

      {/* Moon */}
      <circle cx="372" cy="96" r="40" fill="var(--color-marigold)" />
      <circle cx="388" cy="84" r="40" fill="var(--color-cobalt)" />

      {/* Prayer flags (Lung Ta) — traditional order: blue, white, red, green, yellow */}
      <path d="M20,30 L300,95" stroke="var(--color-paper)" strokeWidth="2" fill="none" opacity="0.85" />
      {[
        { x: 45, color: "var(--color-cobalt)" },
        { x: 95, color: "var(--color-paper)" },
        { x: 145, color: "var(--color-raspberry)" },
        { x: 195, color: "var(--color-pine)" },
        { x: 245, color: "var(--color-marigold)" },
      ].map((f, i) => {
        const t = (f.x - 20) / 280;
        const y = 30 + t * 65;
        return (
          <polygon
            key={i}
            points={`${f.x},${y} ${f.x + 22},${y} ${f.x + 11},${y + 26}`}
            fill={f.color}
            opacity="0.95"
          />
        );
      })}

      {/* Himalayan ridgeline */}
      <polygon
        points="0,430 45,345 95,405 150,300 205,385 255,315 315,400 365,335 420,390 480,355 480,640 0,640"
        fill="var(--color-pine)"
      />
      {/* snow caps */}
      <polygon points="150,300 168,320 132,320" fill="var(--color-paper)" opacity="0.9" />
      <polygon points="365,335 380,352 350,352" fill="var(--color-paper)" opacity="0.9" />

      {/* Boudhanath-style stupa */}
      <g>
        <rect x="118" y="472" width="76" height="16" fill="var(--color-ink)" />
        <path d="M120,462 A38,32 0 0 1 196,462 Z" fill="var(--color-ink)" />
        <rect x="140" y="426" width="34" height="36" fill="var(--color-ink)" />
        {/* eyes */}
        <circle cx="150" cy="440" r="4" fill="var(--color-paper)" />
        <circle cx="164" cy="440" r="4" fill="var(--color-paper)" />
        <path d="M146,432 q6,-6 12,0" stroke="var(--color-paper)" strokeWidth="2" fill="none" />
        <path d="M162,432 q6,-6 12,0" stroke="var(--color-paper)" strokeWidth="2" fill="none" />
        {/* spire */}
        <polygon points="146,426 190,426 168,352" fill="var(--color-ink)" />
        <circle cx="168" cy="345" r="6" fill="var(--color-marigold)" />
      </g>

      {/* Nyatapola-style pagoda (three tiers) */}
      <g>
        <rect x="272" y="466" width="76" height="24" fill="var(--color-ink)" />
        <polygon points="260,466 360,466 340,440 280,440" fill="var(--color-ink)" />
        <rect x="286" y="416" width="48" height="24" fill="var(--color-ink)" />
        <polygon points="278,416 342,416 326,394 294,394" fill="var(--color-ink)" />
        <rect x="298" y="372" width="24" height="22" fill="var(--color-ink)" />
        <polygon points="292,372 328,372 310,352" fill="var(--color-ink)" />
        <rect x="308" y="336" width="4" height="18" fill="var(--color-ink)" />
        <circle cx="310" cy="332" r="5" fill="var(--color-marigold)" />
      </g>

      {/* Sarangi player, seated silhouette, foreground left — outlined
          in paper so it reads clearly against the ink architecture */}
      <g transform="translate(56,478)" stroke="var(--color-paper)" strokeWidth="1.5" strokeLinejoin="round">
        {/* head + topi cap */}
        <circle cx="30" cy="20" r="15" fill="var(--color-ink)" />
        <path d="M15,14 A15,10 0 0 1 45,14 L45,10 L15,10 Z" fill="var(--color-raspberry)" stroke="none" />
        {/* torso, cross-legged seated */}
        <path d="M6,95 C6,55 14,34 30,34 C46,34 54,55 54,95 Z" fill="var(--color-ink)" />
        {/* far arm bowing */}
        <path d="M14,52 L-14,40" stroke="var(--color-ink)" strokeWidth="7" strokeLinecap="round" />
        {/* sarangi body, held upright at the chest */}
        <path d="M46,50 C60,50 62,66 56,80 C52,90 40,90 38,78 C36,66 38,50 46,50 Z" fill="var(--color-marigold)" strokeWidth="1" />
        <rect x="47" y="18" width="6" height="34" rx="2" fill="var(--color-marigold)" stroke="none" />
        {/* bow */}
        <path d="M4,38 L58,58" stroke="var(--color-paper)" strokeWidth="2.5" strokeLinecap="round" />
        {/* near arm holding neck */}
        <path d="M46,44 L58,30" stroke="var(--color-ink)" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* Rising music notes */}
      <g fill="var(--color-raspberry)">
        <g transform="translate(150,470)">
          <circle cx="0" cy="12" r="6" />
          <rect x="5" y="-18" width="3" height="30" />
          <path d="M8,-18 q14,2 10,14 q-2,-8 -10,-8 Z" />
        </g>
        <g transform="translate(178,430) scale(0.8)">
          <circle cx="0" cy="12" r="6" />
          <rect x="5" y="-18" width="3" height="30" />
        </g>
        <g transform="translate(196,392) scale(0.65)">
          <circle cx="0" cy="12" r="6" />
          <rect x="5" y="-18" width="3" height="30" />
        </g>
      </g>
    </svg>
  );
}
