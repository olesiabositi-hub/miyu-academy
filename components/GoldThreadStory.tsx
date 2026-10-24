"use client";
import { useEffect, useRef } from "react";

/** Thin gold reading line under the header for «Золотая нить». Transform only; hidden with reduced motion. */
export function StoryProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.hidden = true; return; }
    let ticking = false;
    const draw = () => {
      ticking = false;
      const story = el.parentElement; if (!story) return;
      const r = story.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      el.style.transform = `scaleX(${p})`;
    };
    const on = () => { if (!ticking) { ticking = true; requestAnimationFrame(draw); } };
    draw();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return <div ref={ref} className="zgProg" aria-hidden="true" />;
}
