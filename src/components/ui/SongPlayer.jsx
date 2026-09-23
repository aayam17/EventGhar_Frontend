import React, { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const BAR_COUNT = 28;

// Deterministic per-bar amplitude so the ripple isn't perfectly even —
// same trick used in SoundDivider.
const BAR_SEEDS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const n = Math.sin(i * 12.9898) * 43758.5453;
  return n - Math.floor(n);
});

// Accepts youtube.com/watch?v=, youtu.be/, /embed/, /shorts/ — whatever
// shape an admin is likely to paste straight from the address bar or
// the share button.
function extractYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname.replace(/^www\./, "") === "youtu.be") {
      return u.pathname.slice(1).split("/")[0] || null;
    }
    if (u.hostname.replace(/^www\./, "").endsWith("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1];
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/shorts/")[1];
    }
  } catch {
    return null;
  }
  return null;
}

// The YouTube IFrame API is loaded once and shared across every
// SongPlayer on the page (Hero + EventDetails could both mount one).
let ytApiPromise = null;
function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
  return ytApiPromise;
}

/**
 * Per-event "live song" player. Admin pastes a plain YouTube link on
 * the event form; this parses the video ID out of it and drives a
 * hidden YouTube IFrame player (1px, invisible, no video shown) from
 * a play/pause button sitting inside an animated waveform bar — the
 * same audio-meter motif as SoundDivider, except these bars only
 * ripple while something is actually playing, not on a loop.
 *
 * Renders nothing if songUrl is empty or isn't a recognizable
 * YouTube link, so call sites can render it unconditionally.
 */
export default function SongPlayer({ songUrl, songTitle, className = "", onPlayStateChange }) {
  const videoId = useMemo(() => extractYouTubeId(songUrl), [songUrl]);
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setReady(false);
    setPlaying(false);
    if (!videoId) return;

    let cancelled = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !YT || !hostRef.current) return;
      // YT.Player *replaces* its target element with an iframe and drops
      // the target's inline styles, so the hiding lives on the wrapper
      // (hostRef) and we hand the API a fresh child node to replace.
      const target = document.createElement("div");
      hostRef.current.appendChild(target);
      playerRef.current = new YT.Player(target, {
        videoId,
        playerVars: { controls: 0, disablekb: 1, playsinline: 1 },
        events: {
          onReady: () => !cancelled && setReady(true),
          onStateChange: (e) => {
            if (cancelled) return;
            const isPlaying = e.data === YT.PlayerState.PLAYING;
            setPlaying(isPlaying);
            onPlayStateChange?.(isPlaying);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        // player may already be torn down by the API itself
      }
      playerRef.current = null;
      if (hostRef.current) hostRef.current.innerHTML = "";
      onPlayStateChange?.(false);
    };
  }, [videoId]);

  if (!videoId) return null;

  const toggle = () => {
    if (!playerRef.current || !ready) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  return (
    <div className={`song-player ${className}`}>
      <div
        ref={hostRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <button
        type="button"
        className="song-player__play"
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? "Pause song" : "Play song"}
      >
        {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>

      <div className="song-player__meta">
        <p className="song-player__title">{songTitle || "This event's song"}</p>
        <p className="song-player__label">
          {!ready ? "Loading\u2026" : playing ? "Now playing" : "Tap to play"}
        </p>
      </div>

      <div className="song-player__bars" aria-hidden="true">
        {BAR_SEEDS.map((seed, i) => (
          <span
            key={i}
            className={`song-player__bar${playing ? " is-playing" : ""}`}
            style={{ "--peak": `${26 + seed * 64}%`, animationDelay: `${i * -0.045}s` }}
          />
        ))}
      </div>
    </div>
  );
}
