"use client";
import Link from "next/link";
import { useState } from "react";

export type Panel = { num: string; href: string; title: string; meta: string; src: string; src960?: string; pos?: string };

/**
 * The four worlds across the first screen, edge to edge. The panel under the pointer (or keyboard
 * focus) opens wider; on phones they sit in a 2×2 grid. Content is complete without JavaScript.
 */
export function HeroPanels({ panels, initial = 0 }: { panels: Panel[]; initial?: number }) {
  const [open, setOpen] = useState(initial);
  return <div className="muPanels">
    {panels.map((p, i) => <Link key={p.href} href={p.href} className={"muPanel" + (open === i ? " is-open" : "")} onMouseEnter={() => setOpen(i)} onFocus={() => setOpen(i)}>
      <picture>
        {p.src960 && <source media="(max-width: 860px)" srcSet={p.src960} />}
        <img src={p.src} alt="" style={{ objectPosition: p.pos }} fetchPriority={i < 2 ? "high" : undefined} decoding="async" />
      </picture>
      <span className="muPanelShade" aria-hidden="true" />
      <span className="muPanelText">
        <span className="muPanelNum" aria-hidden="true">{p.num}</span>
        <span className="muPanelTitle">{p.title}</span>
        <span className="muPanelMeta">{p.meta}</span>
      </span>
    </Link>)}
  </div>;
}
