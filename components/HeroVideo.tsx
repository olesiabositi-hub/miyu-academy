"use client";
import { useEffect, useRef, useState } from "react";

const KEY = "miyu_hero_motion";

/**
 * Looping, muted background video for a course hero. Decorative (aria-hidden), with a pause button.
 * With "reduce motion" switched on in the system, or after the visitor paused it once (remembered in
 * this browser), only the still poster is shown.
 */
export function HeroVideo({ sources, poster, posterSmall, pauseLabel, playLabel }: {
  sources: { src: string; media?: string }[]; poster: string; posterSmall?: string; pauseLabel: string; playLabel: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    let off = false;
    try { off = localStorage.getItem(KEY) === "off"; } catch {}
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) off = true;
    const v = ref.current;
    if (!v) return;
    if (off) { v.pause(); setPlaying(false); return; }
    v.play().catch(() => setPlaying(false));
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); try { localStorage.setItem(KEY, "off"); } catch {} }
    else { v.play().then(() => setPlaying(true)).catch(() => {}); try { localStorage.removeItem(KEY); } catch {} }
  }

  return <>
    <div className="heroVideo" aria-hidden="true">
      <picture className="heroVideoPoster">
        {posterSmall && <source media="(max-width: 900px)" srcSet={posterSmall} />}
        <img src={poster} alt="" width={1920} height={1080} fetchPriority="high" decoding="async" />
      </picture>
      <video ref={ref} muted loop playsInline preload="metadata" poster={posterSmall ?? poster} className={playing ? "is-on" : ""}>
        {sources.map((s) => <source key={s.src} src={s.src} media={s.media} type="video/mp4" />)}
      </video>
    </div>
    <button type="button" className="heroVideoToggle" onClick={toggle} aria-label={playing ? pauseLabel : playLabel} title={playing ? pauseLabel : playLabel}>
      {playing
        ? <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><rect x="4" y="3" width="4" height="14" rx="1" fill="currentColor" /><rect x="12" y="3" width="4" height="14" rx="1" fill="currentColor" /></svg>
        : <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M5 3l12 7-12 7z" fill="currentColor" /></svg>}
    </button>
  </>;
}
