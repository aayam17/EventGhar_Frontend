import React from "react";

/**
 * KathmanduMusicScene — companion illustration to NepalSkylineArt, built
 * for the "Sounds of the Valley" band on the dashboard. Same hand-
 * screenprinted, flat-poster-color technique, but a street-level scene:
 * Durbar Square pagodas lit for a night gig, a madal-and-sarangi duo on
 * a raised stage, festival bunting overhead, and a raised-arm crowd —
 * the "Nepali music feel" rendered as a concert-flyer illustration
 * rather than a photo, so it stays on-brand with the poster palette.
 *
 * Colors are pulled from CSS variables so it re-themes with the app.
 */
export default function KathmanduMusicScene({ className = "" }) {
  return (
    <svg
      viewBox="0 0 800 480"
      className={className}
      role="img"
      aria-label="Illustration of a night music gig in Kathmandu's Durbar Square, with a madal and sarangi duo on stage, festival bunting, and a crowd with raised arms"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="kms-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-cobalt-dark)" />
          <stop offset="100%" stopColor="var(--color-cobalt)" />
        </linearGradient>
        <pattern id="kms-halftone" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1.1" fill="rgba(239,230,211,0.45)" />
        </pattern>
        <radialGradient id="kms-spot" cx="50%" cy="0%" r="75%">
          <stop offset="0%" stopColor="var(--color-marigold)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-marigold)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Night sky */}
      <rect x="0" y="0" width="800" height="480" fill="url(#kms-sky)" />
      <rect x="0" y="0" width="800" height="480" fill="url(#kms-halftone)" opacity="0.45" />

      {/* Stars */}
      {[[60,40],[130,80],[230,30],[340,55],[430,25],[520,70],[610,35],[690,60],[760,90],[40,110]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="var(--color-paper)" opacity="0.75" />
      ))}

      {/* Distant Himalayan ridge, muted */}
      <polygon
        points="0,190 70,145 150,180 230,120 310,170 400,135 480,175 560,140 650,180 730,150 800,185 800,480 0,480"
        fill="var(--color-pine-dark)"
        opacity="0.55"
      />

      {/* Spotlight wash over the stage */}
      <rect x="250" y="0" width="300" height="480" fill="url(#kms-spot)" />

      {/* Durbar Square pagoda, left */}
      <g opacity="0.92">
        <rect x="90" y="270" width="90" height="150" fill="var(--color-ink)" />
        <polygon points="75,270 195,270 172,238 98,238" fill="var(--color-ink)" />
        <rect x="112" y="196" width="46" height="42" fill="var(--color-ink)" />
        <polygon points="102,196 168,196 148,168 122,168" fill="var(--color-ink)" />
        <rect x="128" y="142" width="14" height="26" fill="var(--color-ink)" />
        <circle cx="135" cy="138" r="5" fill="var(--color-marigold)" />
      </g>

      {/* Second pagoda, right, slightly smaller / further back */}
      <g opacity="0.85">
        <rect x="600" y="290" width="72" height="130" fill="var(--color-ink)" />
        <polygon points="588,290 684,290 664,262 608,262" fill="var(--color-ink)" />
        <rect x="618" y="222" width="36" height="40" fill="var(--color-ink)" />
        <polygon points="610,222 662,222 646,198 626,198" fill="var(--color-ink)" />
        <rect x="632" y="178" width="10" height="20" fill="var(--color-ink)" />
        <circle cx="637" cy="175" r="4" fill="var(--color-marigold)" />
      </g>

      {/* Festival bunting strung between the pagodas */}
      <path d="M180,230 Q400,170 600,255" stroke="var(--color-paper)" strokeWidth="2" fill="none" opacity="0.7" />
      {Array.from({ length: 11 }).map((_, i) => {
        const t = i / 10;
        const x = 180 + t * 420;
        const y = 230 - Math.sin(t * Math.PI) * 62;
        const colors = ["var(--color-marigold)", "var(--color-raspberry)", "var(--color-pine)"];
        return (
          <polygon
            key={i}
            points={`${x},${y} ${x + 16},${y} ${x + 8},${y + 18}`}
            fill={colors[i % colors.length]}
            opacity="0.95"
          />
        );
      })}

      {/* Fairy lights along the same curve */}
      {Array.from({ length: 15 }).map((_, i) => {
        const t = i / 14;
        const x = 180 + t * 420;
        const y = 230 - Math.sin(t * Math.PI) * 62 + 6;
        return <circle key={i} cx={x} cy={y} r="2.2" fill="var(--color-marigold)" opacity="0.9" />;
      })}

      {/* Stage riser */}
      <rect x="300" y="392" width="200" height="18" fill="var(--color-ink)" />
      <rect x="300" y="410" width="200" height="8" fill="var(--color-stone-800)" />

      {/* Madal player, seated, stage left of center */}
      <g transform="translate(322,330)">
        <path d="M4,86 C4,50 12,30 28,30 C44,30 52,50 52,86 Z" fill="var(--color-ink)" />
        <circle cx="28" cy="16" r="14" fill="var(--color-ink)" />
        <path d="M14,10 A14,9 0 0 1 42,10 L42,6 L14,6 Z" fill="var(--color-raspberry)" />
        {/* madal drum, horizontal across the lap */}
        <rect x="-10" y="58" width="76" height="26" rx="10" fill="var(--color-marigold)" />
        <ellipse cx="-10" cy="71" rx="7" ry="13" fill="var(--color-marigold-dark)" />
        <ellipse cx="66" cy="71" rx="7" ry="13" fill="var(--color-marigold-dark)" />
        {/* arms striking the drum heads */}
        <path d="M20,44 L2,64" stroke="var(--color-ink)" strokeWidth="7" strokeLinecap="round" />
        <path d="M36,44 L54,64" stroke="var(--color-ink)" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* Sarangi player, seated, stage right of center */}
      <g transform="translate(438,326)" stroke="var(--color-paper)" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M4,90 C4,52 12,32 28,32 C44,32 52,52 52,90 Z" fill="var(--color-ink)" />
        <circle cx="28" cy="18" r="14" fill="var(--color-ink)" />
        <path d="M14,12 A14,9 0 0 1 42,12 L42,8 L14,8 Z" fill="var(--color-pine)" stroke="none" />
        {/* sarangi body held upright */}
        <path d="M42,46 C56,46 58,62 52,76 C48,86 36,86 34,74 C32,62 34,46 42,46 Z" fill="var(--color-marigold)" strokeWidth="1" />
        <rect x="43" y="14" width="6" height="32" rx="2" fill="var(--color-marigold)" stroke="none" />
        {/* bow */}
        <path d="M2,36 L54,54" stroke="var(--color-paper)" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M42,40 L54,26" stroke="var(--color-ink)" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* Rising music notes above the stage */}
      <g fill="var(--color-raspberry)">
        <g transform="translate(300,300)">
          <circle cx="0" cy="12" r="6" />
          <rect x="5" y="-20" width="3" height="32" />
          <path d="M8,-20 q15,2 11,15 q-2,-9 -11,-9 Z" />
        </g>
        <g transform="translate(500,286) scale(0.8)">
          <circle cx="0" cy="12" r="6" />
          <rect x="5" y="-20" width="3" height="32" />
        </g>
        <g transform="translate(460,258) scale(0.6)">
          <circle cx="0" cy="12" r="6" />
          <rect x="5" y="-20" width="3" height="32" />
        </g>
      </g>

      {/* Crowd silhouette, foreground, raised arms and phone-lights */}
      <g fill="var(--color-ink)">
        {[40,110,175,660,725,790].map((x, i) => {
          const h = 70 + (i % 3) * 10;
          const raise = i % 2 === 0;
          return (
            <g key={x} transform={`translate(${x},${480 - h})`}>
              <path d={`M0,${h} C0,${h * 0.35} 8,0 22,0 C36,0 44,${h * 0.35} 44,${h} Z`} />
              {raise && (
                <>
                  <path d="M6,10 L-14,-22" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="-16" cy="-26" r="3.2" fill="var(--color-marigold)" />
                </>
              )}
            </g>
          );
        })}
        {/* dense back row, simplified bumps */}
        <path d="M0,480 L0,440 Q60,420 120,440 Q200,410 280,440 Q560,410 640,440 Q720,420 800,440 L800,480 Z" opacity="0.9" />
      </g>
    </svg>
  );
}
