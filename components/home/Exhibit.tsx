"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export type ExhibitItem = { where: string; title: string; lines: string[]; href: string; src: string; src960?: string; pos?: string; alt: string };

/**
 * One real fragment of a lesson. The server renders the first one; after hydration a random one
 * is chosen, so a returning visitor sees a different fragment. The block sits well below the fold,
 * so the swap is never seen.
 */
export function Exhibit({ items, label, more, note }: { items: ExhibitItem[]; label: string; more: string; note: string }) {
  const [i, setI] = useState(0);
  useEffect(() => { setI(Math.floor(Math.random() * items.length)); }, [items.length]);
  const e = items[i];
  return <div className="muExhibit">
    <picture className="muPlate muExhibitArt">
      {e.src960 && <source media="(max-width: 860px)" srcSet={e.src960} />}
      <img src={e.src} alt={e.alt} style={{ objectPosition: e.pos }} loading="lazy" decoding="async" />
    </picture>
    <div className="muExhibitText">
      <div className="muCap">{e.where} · {label}</div>
      <h3 className="muExhibitTitle">{e.title}</h3>
      <blockquote className="muExhibitQuote">{e.lines.map((l) => <p key={l}>{l}</p>)}</blockquote>
      <div className="muExhibitFoot">
        <Link className="muLink" href={e.href}>{more} <span aria-hidden="true">→</span></Link>
        <span className="muCap">{note}</span>
      </div>
    </div>
  </div>;
}
