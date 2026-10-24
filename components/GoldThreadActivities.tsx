"use client";
/**
 * The seven activities of «Золотая нить» (docs/STORIES.md). All graphics are drawn here as SVG in the story's colours.
 * Rules: voluntary, no points or timers, keyboard first (native buttons and radios), 320 px wide, motion only by
 * CSS transitions of opacity/transform that story.css switches off with reduced motion. Copy: lib/content/ossetianGoldEmbroidery.ts.
 */
import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { ActivityFrame } from "@/components/ActivityFrame";
import type { Locale } from "@/lib/course";
import { ASSEMBLE, BARTER, DRESS, HAT, MOTIFS, STITCH, WORDS, WORDS_UI } from "@/lib/content/ossetianGoldEmbroidery";

/* ---------------------------------------------------------------- shared drawing */

const C = {
  gold: "#C9A24E", goldDeep: "#8E6A27", goldLight: "#F0D891", silver: "#C9C6BE",
  velvet: "#6E1A2C", velvetDeep: "#43101C", velvetLight: "#8E2A3E",
  cream: "#F5EEE2", silk: "#EDE2CC", night: "#1F0E10", ink: "#2A1A16", line: "#D8C3A0",
  wood: "#8A5A33", woodLight: "#B07A4A", linen: "#DCCDB0", brown: "#7A4A2A",
};

const VELVET: Record<string, [string, string, string]> = {
  crimson: ["#6E1A2C", "#43101C", "#932E44"],
  green: ["#1F3B2E", "#12241B", "#2F5642"],
  black: ["#221A1C", "#120D0E", "#3A2E30"],
};

/** A per-instance prefix for gradient ids (useId contains colons, which break url(#…)). */
function useUid() { return "zg" + useId().replace(/[^a-zA-Z0-9]/g, ""); }

/** Gold gradient + couching hatch, referenced as url(#<id>g) and url(#<id>h). */
function GoldDefs({ id }: { id: string }) {
  return <defs>
    <linearGradient id={id + "g"} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={C.goldLight} /><stop offset=".45" stopColor={C.gold} /><stop offset="1" stopColor={C.goldDeep} />
    </linearGradient>
    <pattern id={id + "h"} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <rect width="5" height="5" fill="transparent" /><line x1="0" y1="0" x2="0" y2="5" stroke={C.goldDeep} strokeWidth="1.1" opacity=".55" />
    </pattern>
    <linearGradient id={id + "s"} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".75" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
  </defs>;
}

/** Points of a spiral (for horns and scrolls). */
function spiral(cx: number, cy: number, r0: number, turns: number, a0: number, dir: 1 | -1) {
  const pts: string[] = [];
  const n = Math.round(turns * 28);
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = a0 + dir * t * turns * Math.PI * 2, r = r0 * (1 - t * 0.82);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts;
}

export type MotifKind = "tree" | "rosette" | "horns" | "scrolls";

/** The four motif families as gold silhouettes, drawn in a -50…50 box. Outer contour only, as the text describes. */
function MotifShape({ kind, paint, hatch, stroke = 7 }: { kind: MotifKind; paint: string; hatch?: string; stroke?: number }) {
  if (kind === "tree") {
    const leaf = (y: number, s: number) => `M0 ${y} C ${12 * s} ${y - 8} ${26 * s} ${y - 8} ${34 * s} ${y - 22} C ${20 * s} ${y - 22} ${8 * s} ${y - 14} 0 ${y} Z`;
    const d = [leaf(30, 1), leaf(30, -1), leaf(10, 1), leaf(10, -1), leaf(-10, 0.8), leaf(-10, -0.8), "M-3 46 L3 46 L2.5 -30 L-2.5 -30 Z", "M0 -46 C 7 -38 7 -30 0 -24 C -7 -30 -7 -38 0 -46 Z"].join(" ");
    return <g><path d={d} fill={paint} />{hatch && <path d={d} fill={hatch} />}</g>;
  }
  if (kind === "rosette") {
    const petal = "M0 0 C 9 -4 22 -12 26 -34 C 14 -30 4 -18 0 0 Z";
    return <g>{[0, 1, 2, 3, 4, 5].map((i) => <g key={i} transform={`rotate(${i * 60})`}><path d={petal} fill={paint} />{hatch && <path d={petal} fill={hatch} />}</g>)}
      <circle r="7" fill={paint} /></g>;
  }
  if (kind === "horns") {
    const l = ["0,40", "0,14", ...spiral(-17, -6, 22, 1.15, 0, -1)].join(" ");
    const r = ["0,40", "0,14", ...spiral(17, -6, 22, 1.15, Math.PI, 1)].join(" ");
    return <g fill="none" stroke={paint} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><polyline points={l} /><polyline points={r} /></g>;
  }
  const l = ["0,0", ...spiral(-24, -4, 22, 1.2, 0.2, -1)].join(" ");
  const r = ["0,0", ...spiral(24, 4, 22, 1.2, Math.PI + 0.2, -1)].join(" ");
  return <g fill="none" stroke={paint} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><polyline points={l} /><polyline points={r} /></g>;
}

function MotifIcon({ kind }: { kind: MotifKind }) {
  const id = useUid();
  return <svg viewBox="-55 -55 110 110" aria-hidden="true" focusable="false"><GoldDefs id={id} /><MotifShape kind={kind} paint={`url(#${id}g)`} hatch={`url(#${id}h)`} /></svg>;
}

function Seg<T extends string>({ legend, name, value, options, onChange, note }: {
  legend: string; name: string; value: T; options: { v: T; label: ReactNode }[]; onChange: (v: T) => void; note?: ReactNode;
}) {
  return <fieldset className="zgSeg">
    <legend>{legend}</legend>
    <div className="zgSegRow">
      {options.map((o) => <label key={o.v} className={"zgSegOpt" + (o.v === value ? " is-on" : "")}>
        <input type="radio" name={name} value={o.v} checked={o.v === value} onChange={() => onChange(o.v)} />
        <span>{o.label}</span>
      </label>)}
    </div>
    {note && <p className="zgSegNote">{note}</p>}
  </fieldset>;
}

/* ---------------------------------------------------------------- [[barter]] */

type Good = "hen" | "goose" | "butter" | "cheese" | "bread" | "coins";
const GOODS: Good[] = ["hen", "goose", "butter", "cheese", "bread", "coins"];

function GoodIcon({ kind }: { kind: Good | "skein" }) {
  switch (kind) {
    case "hen": return <g>
      <path d="M14 40 C 12 26 22 18 34 20 C 38 12 46 10 50 16 C 54 22 50 28 46 30 C 52 40 46 52 32 52 C 22 52 15 47 14 40 Z" fill="#9A5A2E" />
      <path d="M14 40 C 6 34 6 24 10 18 C 14 24 16 30 20 34 Z" fill="#6E3C1C" />
      <path d="M44 14 C 45 9 48 8 49 11 C 51 8 54 10 52 14 Z" fill="#B3282D" />
      <path d="M50 18 L57 20 L50 22 Z" fill="#D9A24A" /><circle cx="46" cy="18" r="1.6" fill={C.ink} />
      <path d="M24 38 C 30 34 38 36 40 42 C 34 44 28 44 24 38 Z" fill="#7C4220" />
      <path d="M28 52 L27 59 M36 52 L37 59" stroke="#D9A24A" strokeWidth="2" strokeLinecap="round" />
    </g>;
    case "goose": return <g>
      <path d="M10 42 C 10 32 20 28 32 30 C 36 30 38 26 38 20 C 38 12 42 8 47 9 C 52 10 53 16 50 19 C 46 22 44 26 45 32 C 52 38 50 50 36 52 C 22 54 10 50 10 42 Z" fill="#EFE8DA" stroke="#BDB09A" strokeWidth="1" />
      <path d="M50 12 L58 15 L50 17 Z" fill="#D98A3A" /><circle cx="47" cy="12.5" r="1.4" fill={C.ink} />
      <path d="M18 42 C 24 36 34 38 38 44" fill="none" stroke="#BDB09A" strokeWidth="1.2" />
    </g>;
    case "butter": return <g>
      <path d="M16 26 L48 26 L45 54 C 44 57 20 57 19 54 Z" fill="#A9643A" />
      <ellipse cx="32" cy="26" rx="16" ry="5" fill="#8A4F2C" /><ellipse cx="32" cy="25" rx="13" ry="3.6" fill="#F2D27A" />
      <path d="M22 34 C 28 36 36 36 42 34" stroke="#8A4F2C" strokeWidth="1.2" fill="none" />
    </g>;
    case "cheese": return <g>
      <ellipse cx="32" cy="44" rx="24" ry="8" fill="#D9C79F" /><rect x="8" y="30" width="48" height="14" fill="#EFE3C4" />
      <ellipse cx="32" cy="30" rx="24" ry="8" fill="#F7EED6" /><path d="M32 30 L56 30 L56 44 L32 44 Z" fill="#E7D7AE" opacity=".6" />
      <circle cx="20" cy="36" r="1.6" fill="#D9C79F" /><circle cx="44" cy="39" r="1.3" fill="#D9C79F" />
    </g>;
    case "bread": return <g>
      <path d="M8 44 C 8 28 20 20 32 20 C 44 20 56 28 56 44 C 56 50 8 50 8 44 Z" fill="#B97A3E" />
      <path d="M8 44 C 20 48 44 48 56 44 C 56 50 8 50 8 44 Z" fill="#8E5626" />
      <path d="M20 30 L26 36 M30 26 L36 34 M40 28 L46 34" stroke="#E2B06E" strokeWidth="2.4" strokeLinecap="round" />
    </g>;
    case "coins": return <g>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(0 ${-i * 7})`}><ellipse cx="32" cy="48" rx="16" ry="5" fill="#8C8A84" /><rect x="16" y="44" width="32" height="4" fill="#A6A49C" /><ellipse cx="32" cy="44" rx="16" ry="5" fill="#C9C6BE" /></g>)}
    </g>;
    case "skein": return <g>
      <ellipse cx="32" cy="34" rx="22" ry="14" fill="none" stroke={C.goldDeep} strokeWidth="9" />
      <ellipse cx="32" cy="34" rx="22" ry="14" fill="none" stroke={C.gold} strokeWidth="6" strokeDasharray="2 2.2" />
      <path d="M26 20 C 30 30 34 38 38 48" stroke={C.goldLight} strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>;
  }
}

export function Barter({ locale }: { locale: Locale }) {
  const t = BARTER[locale];
  const [basket, setBasket] = useState<Good[]>([]);
  const [last, setLast] = useState<Good | null>(null);
  const traded = basket.includes("hen");
  const put = (g: Good) => { if (!basket.includes(g)) setBasket([...basket, g]); setLast(g); };
  const note = last === null ? "" : last === "hen" ? t.notes.hen : last === "coins" ? t.notes.coins : t.notes.common;
  return <ActivityFrame eyebrow={t.eyebrow} title={t.title} lead={t.lead} kind="zgBarter">
    <div className="zgBarterGrid">
      <ul className="zgGoods" aria-label={t.basket}>
        {GOODS.map((g) => {
          const inB = basket.includes(g);
          return <li key={g}><button type="button" className="zgGood" aria-pressed={inB} onClick={() => put(g)}>
            <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><GoodIcon kind={g} /></svg>
            <span className="zgGoodName">{t.items[g]}</span>
            <span className="zgGoodState">{inB ? t.taken : t.put}</span>
          </button></li>;
        })}
      </ul>
      <div className="zgBarterScene">
        <svg viewBox="0 0 420 230" role="img" aria-label={`${t.basket}: ${basket.map((g) => t.items[g]).join(", ") || "—"}. ${traded ? t.skeins : ""}`}>
          <rect x="0" y="0" width="420" height="230" rx="6" fill="#EADCC2" />
          <path d="M0 170 L420 170 L420 230 L0 230 Z" fill="#D9C6A3" />
          {/* basket */}
          <path d="M30 120 L190 120 L176 198 C 174 206 46 206 44 198 Z" fill="#A5713E" />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${36 + i * 2} ${132 + i * 14} L${184 - i * 2} ${132 + i * 14}`} stroke="#7E5128" strokeWidth="3" />)}
          <path d="M44 120 C 50 70 170 70 176 120" fill="none" stroke="#7E5128" strokeWidth="6" />
          {basket.map((g, i) => <g key={g} className="zgIn" transform={`translate(${40 + (i % 3) * 46} ${i < 3 ? 82 : 66}) scale(.8)`}><GoodIcon kind={g} /></g>)}
          <text x="110" y="222" textAnchor="middle" className="zgSvgLabel">{t.basket}</text>
          {/* travellers' cloth */}
          <path d="M236 150 L404 150 L396 186 L244 186 Z" fill={C.velvet} />
          <path d="M244 186 L396 186" stroke={C.gold} strokeWidth="2" />
          <g className={"zgSkeins" + (traded ? " is-on" : "")}>
            <g transform="translate(250 104) scale(1.05)"><GoodIcon kind="skein" /></g>
            <g transform="translate(318 110) scale(1.05)"><GoodIcon kind="skein" /></g>
          </g>
          <text x="320" y="222" textAnchor="middle" className="zgSvgLabel">{traded ? t.skeins : t.counter}</text>
        </svg>
        <p className="zgLine" aria-live="polite">{note}</p>
        {traded && <p className="zgDone">{t.done}</p>}
        {basket.length > 0 && <button type="button" className="zgBtn zgBtnQuiet" onClick={() => { setBasket([]); setLast(null); }}>{t.again}</button>}
      </div>
    </div>
  </ActivityFrame>;
}

/* ---------------------------------------------------------------- [[stitch]] */

type Shift = "check" | "slant" | "herring";

export function Stitch({ locale }: { locale: Locale }) {
  const t = STITCH[locale];
  const id = useUid();
  const [step, setStep] = useState<"2" | "3" | "4">("3");
  const [shift, setShift] = useState<Shift>("slant");
  const [len, setLen] = useState<"short" | "long">("short");
  const k = Number(step), COLS = 36, ROWS = 16, W = 600, top = 22, rowH = 14, x0 = 24, colW = (W - 2 * x0) / COLS;
  const span = len === "long" ? 2 : 1;
  const off = (r: number) => shift === "check" ? 0 : shift === "slant" ? r : (r % (2 * k) < k ? r % (2 * k) : 2 * k - (r % (2 * k)));
  const stitches: { x: number; y: number; h: number; d: number }[] = [];
  for (let r = 0; r < ROWS; r += span) {
    const unit = r / span;
    for (let c = 0; c < COLS; c++) if ((c + off(unit)) % k === 0) stitches.push({ x: x0 + c * colW + colW / 2, y: top + r * rowH - 1, h: rowH * span + 2, d: c * 10 + unit * 6 });
  }
  const label = t.shifts[shift];
  return <ActivityFrame eyebrow={t.eyebrow} title={t.title} lead={t.lead} tone="dark" kind="zgStitch">
    <div className="zgStitchGrid">
      <svg className="zgStitchSvg" viewBox={`0 0 ${W} ${top * 2 + ROWS * rowH}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={t.svgLabel(label)}>
        <GoldDefs id={id} />
        <rect width={W} height={top * 2 + ROWS * rowH} fill={C.velvetDeep} rx="4" />
        {Array.from({ length: COLS + 1 }, (_, c) => <rect key={"p" + c} x={x0 + c * colW - 2.5} y={top - 10} width="5" height={ROWS * rowH + 20} fill="#E9DDC3" opacity=".22" rx="2" />)}
        {Array.from({ length: ROWS }, (_, r) => <g key={"r" + r}>
          <rect x={x0 - 6} y={top + r * rowH + 1} width={W - 2 * x0 + 12} height={rowH - 2} rx={(rowH - 2) / 2} fill={`url(#${id}g)`} />
          <rect x={x0 - 6} y={top + r * rowH + 1} width={W - 2 * x0 + 12} height={rowH - 2} rx={(rowH - 2) / 2} fill={`url(#${id}h)`} />
          <rect x={x0 - 6} y={top + r * rowH + 4} width={W - 2 * x0 + 12} height="2.4" fill={C.goldLight} opacity=".55" />
        </g>)}
        <g key={step + shift + len}>
          {stitches.map((s, i) => <rect key={i} className="zgSt" style={{ animationDelay: `${s.d}ms` }} x={s.x - 2.5} y={s.y} width="5" height={s.h} rx="2" fill="#9B2238" />)}
        </g>
      </svg>
      <div className="zgStitchCtl">
        <Seg legend={t.count} name={id + "k"} value={step} onChange={setStep} options={(["2", "3", "4"] as const).map((v) => ({ v, label: t.every(Number(v)) }))} />
        <Seg legend={t.shift} name={id + "s"} value={shift} onChange={setShift} options={(["check", "slant", "herring"] as const).map((v) => ({ v, label: t.shifts[v] }))} />
        <Seg legend={t.length} name={id + "l"} value={len} onChange={setLen} note={t.lengthNote[len]}
          options={(["short", "long"] as const).map((v) => ({ v, label: <span lang={locale === "ru" ? "os" : undefined}>{t.lengths[v]}</span> }))} />
        <p className="zgResult" aria-live="polite">{t.pictureOf} <b>{label}</b></p>
      </div>
    </div>
    <p className="zgCaption">{t.caption}</p>
  </ActivityFrame>;
}

/* ---------------------------------------------------------------- [[assemble]] */

type Piece = "crown" | "tree" | "leftScroll" | "rightScroll" | "rosette";
const PIECES: Piece[] = ["tree", "rosette", "leftScroll", "rightScroll", "crown"];
/** Where each piece sits on the hat (front view, 360×270) and how it is drawn. */
const SLOT: Record<Piece, { x: number; y: number; s: number; kind: MotifKind; flip?: boolean; w: number; h: number }> = {
  crown: { x: 180, y: 62, s: 0.62, kind: "scrolls", w: 26, h: 14 },
  tree: { x: 180, y: 150, s: 0.95, kind: "tree", w: 18, h: 30 },
  rosette: { x: 180, y: 226, s: 0.42, kind: "rosette", w: 12, h: 13 },
  leftScroll: { x: 92, y: 168, s: 0.7, kind: "horns", w: 16, h: 20 },
  rightScroll: { x: 268, y: 168, s: 0.7, kind: "horns", flip: true, w: 16, h: 20 },
};

function HatFront({ id, velvet = VELVET.crimson, children }: { id: string; velvet?: [string, string, string]; children?: ReactNode }) {
  return <>
    <defs><linearGradient id={id + "v"} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={velvet[1]} /><stop offset=".45" stopColor={velvet[2]} /><stop offset="1" stopColor={velvet[1]} /></linearGradient></defs>
    <path d="M70 62 L60 240 C 60 256 300 256 300 240 L290 62 Z" fill={`url(#${id}v)`} />
    <ellipse cx="180" cy="62" rx="110" ry="24" fill={velvet[2]} />
    <ellipse cx="180" cy="62" rx="110" ry="24" fill="none" stroke={velvet[1]} strokeWidth="2" />
    {children}
  </>;
}

export function Assemble({ locale }: { locale: Locale }) {
  const t = ASSEMBLE[locale];
  const id = useUid();
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Piece | null>(null);
  const [placed, setPlaced] = useState<Piece[]>([]);
  const [msg, setMsg] = useState<string>("");
  const building = step >= t.steps.length;
  const all = placed.length === PIECES.length;
  const drop = (slot: Piece) => {
    if (placed.includes(slot)) return;
    if (!sel) { setMsg(t.pick); return; }
    if (sel !== slot) { setMsg(t.wrong); return; }
    setPlaced([...placed, slot]); setSel(null); setMsg("");
  };
  const reset = () => { setStep(0); setSel(null); setPlaced([]); setMsg(""); };
  const gold = `url(#${id}g)`, hatch = `url(#${id}h)`;
  return <ActivityFrame eyebrow={t.eyebrow} title={t.title} lead={t.lead} kind="zgAssemble">
    {!building ? <div className="zgSteps">
      <svg className="zgPieceSvg" viewBox="0 0 300 220" role="img" aria-label={`${t.steps[step].k}: ${t.steps[step].t}`}>
        <GoldDefs id={id} />
        <rect width="300" height="220" fill="#EADCC2" rx="6" />
        {/* linen backing (step 4) */}
        <g className={"zgFade" + (step >= 3 ? " is-on" : "")}><path d="M108 40 L196 40 L204 184 L100 184 Z" fill={C.linen} transform="translate(8 6)" />
          <path d="M108 40 L196 40 L204 184 L100 184 Z" fill="none" stroke="#BFAE8C" strokeDasharray="3 3" transform="translate(8 6)" /></g>
        {/* the hoop and fabric (step 1) */}
        <g className={"zgFade" + (step === 0 ? " is-on" : "")}>
          <circle cx="150" cy="110" r="96" fill={C.cream} /><circle cx="150" cy="110" r="96" fill="none" stroke={C.woodLight} strokeWidth="10" />
          <circle cx="150" cy="110" r="102" fill="none" stroke={C.wood} strokeWidth="3" />
        </g>
        {/* cut margin (step 2+) */}
        <g className={"zgFade" + (step >= 1 ? " is-on" : "")}><path d="M150 18 C 196 52 214 104 196 196 L104 196 C 86 104 104 52 150 18 Z" fill={C.cream} stroke="#BFAE8C" strokeDasharray="4 3" /></g>
        <g transform="translate(150 110) scale(1.6)"><MotifShape kind="tree" paint={gold} hatch={hatch} /></g>
        {/* tusk shine (step 3) */}
        <g className={"zgFade zgShine" + (step >= 2 ? " is-on" : "")}>
          <g transform="translate(150 110) scale(1.6)"><MotifShape kind="tree" paint={`url(#${id}s)`} /></g>
          <path d="M222 176 C 246 166 268 146 282 112 C 280 140 262 168 232 186 Z" fill="#F3EBDD" stroke="#BFAE8C" />
          <path d="M222 176 L232 186 C 228 190 220 186 222 176 Z" fill="#CBB892" />
        </g>
      </svg>
      <div className="zgStepText">
        <ol className="zgStepList">
          {t.steps.map((s, i) => <li key={s.k} className={i === step ? "is-on" : i < step ? "is-done" : ""} aria-current={i === step ? "step" : undefined}>{s.k}</li>)}
        </ol>
        <p className="zgLine" aria-live="polite">{t.steps[step].t}</p>
        <div className="zgBtns">
          <button type="button" className="zgBtn zgBtnQuiet" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>{t.back}</button>
          <button type="button" className="zgBtn" onClick={() => setStep(step + 1)}>{t.next}</button>
        </div>
      </div>
    </div> : <div className="zgBuild">
      <p className="zgLine">{t.place}</p>
      <div className="zgTray" role="group" aria-label={t.pick}>
        {PIECES.map((p) => <button key={p} type="button" className="zgTrayPiece" aria-pressed={sel === p} disabled={placed.includes(p)} onClick={() => { setSel(p); setMsg(""); }}>
          <svg viewBox="-55 -55 110 110" aria-hidden="true" focusable="false"><GoldDefs id={id + p} /><g transform={SLOT[p].flip ? "scale(-1 1)" : undefined}><MotifShape kind={SLOT[p].kind} paint={`url(#${id + p}g)`} hatch={`url(#${id + p}h)`} /></g></svg>
          <span>{t.pieces[p]}</span>
        </button>)}
      </div>
      <div className="zgHatBoard">
        <svg viewBox="0 0 360 270" role="img" aria-label={`${placed.length} / ${PIECES.length}`}>
          <GoldDefs id={id + "b"} />
          <HatFront id={id + "b"}>
            {PIECES.map((p) => { const s = SLOT[p]; const tf = `translate(${s.x} ${s.y}) scale(${s.flip ? -s.s : s.s} ${s.s})`;
              return placed.includes(p)
                ? <g key={p} className="zgIn" transform={tf}><MotifShape kind={s.kind} paint={`url(#${id}bg)`} hatch={`url(#${id}bh)`} /></g>
                : <g key={p} transform={tf} opacity=".28"><MotifShape kind={s.kind} paint={C.cream} /></g>; })}
          </HatFront>
        </svg>
        {PIECES.map((p) => { const s = SLOT[p]; return <button key={p} type="button" className="zgSlot" disabled={placed.includes(p)}
          style={{ left: `${(s.x / 360) * 100}%`, top: `${(s.y / 270) * 100}%`, width: `${s.w}%`, height: `${s.h}%` }}
          aria-label={t.slot(t.pieces[p])} onClick={() => drop(p)} />; })}
      </div>
      <p className="zgLine" aria-live="polite">{all ? t.done : msg}</p>
      <button type="button" className="zgBtn zgBtnQuiet" onClick={reset}>{t.again}</button>
    </div>}
  </ActivityFrame>;
}

/* ---------------------------------------------------------------- [[motifs]] */

type Part = "sleeves" | "dress" | "crown" | "border";
const WHERE: Record<MotifKind, Part[]> = { tree: ["sleeves", "dress"], rosette: [], horns: [], scrolls: ["crown", "border"] };

function Attire({ lit, id, label }: { lit: Part[]; id: string; label: string }) {
  const on = (p: Part) => "zgPart" + (lit.includes(p) ? " is-lit" : "");
  return <svg className="zgAttire" viewBox="0 0 240 380" role="img" aria-label={label}>
    <GoldDefs id={id} />
    {/* hat */}
    <path d="M96 30 L92 66 L148 66 L144 30 Z" fill={C.velvet} />
    <ellipse cx="120" cy="30" rx="24" ry="6" className={on("crown")} />
    <path d="M110 66 C 112 74 128 74 130 66 L 128 82 L112 82 Z" fill="#E7D9C2" />
    {/* hanging sleeves */}
    <path d="M70 96 C 52 150 40 220 34 290 L60 296 C 64 230 74 170 86 116 Z" className={on("sleeves") + " zgSleeve"} />
    <path d="M170 96 C 188 150 200 220 206 290 L180 296 C 176 230 166 170 154 116 Z" className={on("sleeves") + " zgSleeve"} />
    {/* dress */}
    <path d="M86 86 C 100 80 140 80 154 86 L 160 160 C 176 230 190 300 196 360 L 44 360 C 50 300 64 230 80 160 Z" className={on("dress")} />
    <path d="M114 86 L120 360 M126 86 L120 360" stroke="#E7D9C2" strokeWidth="0" />
    <path d="M108 88 L108 200 L132 200 L132 88 Z" fill="#E9DCC6" />
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="110" y={96 + i * 16} width="20" height="5" rx="2.5" fill={C.gold} />)}
    <rect x="84" y="196" width="72" height="9" rx="2" fill={C.gold} />
    {/* border */}
    <path d="M44 360 L196 360 L194 348 L46 348 Z" className={on("border")} />
    <path d="M80 160 C 64 230 50 300 44 360 L 50 360 C 56 300 70 230 86 160 Z M160 160 C 176 230 190 300 196 360 L 190 360 C 184 300 170 230 154 160 Z" className={on("border")} />
  </svg>;
}

export function MotifFamilies({ locale }: { locale: Locale }) {
  const t = MOTIFS[locale];
  const id = useUid();
  const [k, setK] = useState<MotifKind | null>(null);
  const lit = k ? WHERE[k] : [];
  return <ActivityFrame eyebrow={t.eyebrow} title={t.title} lead={t.lead} kind="zgMotifs">
    <div className="zgMotifGrid">
      <div className="zgMotifCards" role="group" aria-label={t.title}>
        {(["tree", "rosette", "horns", "scrolls"] as const).map((m) => <button key={m} type="button" className="zgMotifCard" aria-pressed={k === m} onClick={() => setK(m)}>
          <MotifIcon kind={m} /><span>{t.items[m].name}</span>
        </button>)}
      </div>
      <Attire lit={lit} id={id} label={t.svgLabel} />
      <div className="zgMotifText" aria-live="polite">
        {k ? <>
          <h4>{t.items[k].name}</h4>
          <p>{t.items[k].text}</p>
          <p className="zgWhere"><b>{t.where}</b> {lit.length ? lit.map((p) => t.parts[p]).join(", ") : t.nowhere}</p>
        </> : <p className="zgMuted">{t.lead}</p>}
        <p className="zgCaution">{t.caution}</p>
      </div>
    </div>
  </ActivityFrame>;
}

/* ---------------------------------------------------------------- [[hat]] */

export function Hat({ locale, firstHref }: { locale: Locale; firstHref: string }) {
  const t = HAT[locale];
  const id = useUid();
  const [i, setI] = useState(0);
  const n = t.layers.length;
  const L = (k: number) => "zgFade" + (i >= k ? " is-on" : "");
  return <ActivityFrame eyebrow={t.eyebrow} title={t.title} lead={t.lead} tone="dark" kind="zgHat">
    <div className="zgHatGrid">
      <svg className="zgHatSvg" viewBox="0 0 360 300" role="img" aria-label={t.svgLabel(t.layers[i].k)}>
        <GoldDefs id={id} />
        <defs>
          <pattern id={id + "m"} width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 6 L6 0 L12 6 L6 12 Z" fill="none" stroke="#F5EEE2" strokeWidth=".9" /></pattern>
          <linearGradient id={id + "v"} x1="0" x2="1"><stop offset="0" stopColor={C.velvetDeep} /><stop offset=".45" stopColor={C.velvetLight} /><stop offset="1" stopColor={C.velvetDeep} /></linearGradient>
        </defs>
        {/* 1 base: cardboard / morocco */}
        <path d="M84 96 L74 236 C 74 250 286 250 286 236 L276 96 Z" fill="#C9A77A" stroke="#8C6A44" strokeWidth="1.5" />
        <ellipse cx="180" cy="96" rx="96" ry="22" fill="#D8BB8E" stroke="#8C6A44" strokeWidth="1.5" />
        {/* 2 soft layer */}
        <g className={L(1)}><path d="M80 94 L70 238 C 70 254 290 254 290 238 L280 94 Z" fill="#EFE6D6" /><ellipse cx="180" cy="94" rx="100" ry="24" fill="#F7F1E6" />
          {[0, 1, 2, 3, 4, 5].map((j) => <circle key={j} cx={98 + j * 33} cy={170 + (j % 2) * 18} r="10" fill="#fff" opacity=".5" />)}</g>
        {/* 3 velvet */}
        <g className={L(2)}><path d="M80 94 L70 238 C 70 254 290 254 290 238 L280 94 Z" fill={`url(#${id}v)`} /><ellipse cx="180" cy="94" rx="100" ry="24" fill={C.velvetLight} /></g>
        {/* 4 gold pieces */}
        <g className={L(3)}>
          <g transform="translate(180 168) scale(.95)"><MotifShape kind="tree" paint={`url(#${id}g)`} hatch={`url(#${id}h)`} /></g>
          <g transform="translate(104 178) scale(.62)"><MotifShape kind="horns" paint={`url(#${id}g)`} /></g>
          <g transform="translate(256 178) scale(-.62 .62)"><MotifShape kind="horns" paint={`url(#${id}g)`} /></g>
          <g transform="translate(180 94) scale(.6 .34)"><MotifShape kind="scrolls" paint={`url(#${id}g)`} /></g>
        </g>
        {/* 5 edging */}
        <g className={L(4)}><path d="M70 236 C 70 254 290 254 290 236" fill="none" stroke={`url(#${id}g)`} strokeWidth="9" />
          <ellipse cx="180" cy="94" rx="100" ry="24" fill="none" stroke={`url(#${id}g)`} strokeWidth="6" /></g>
        {/* 6 the headscarf from the first story */}
        <g className={L(5)}>
          <path d="M70 92 C 60 60 300 60 290 92 C 320 160 330 230 340 292 L20 292 C 30 230 40 160 70 92 Z" fill="#F5EEE2" opacity=".2" />
          <path d="M70 92 C 60 60 300 60 290 92 C 320 160 330 230 340 292 L20 292 C 30 230 40 160 70 92 Z" fill={`url(#${id}m)`} opacity=".5" />
          {Array.from({ length: 27 }, (_, j) => <line key={j} x1={22 + j * 12} y1="292" x2={20 + j * 12} y2="300" stroke="#F5EEE2" strokeWidth="1" opacity=".7" />)}
        </g>
      </svg>
      <div className="zgHatText">
        <ol className="zgStepList">
          {t.layers.map((l, j) => <li key={l.k} className={j === i ? "is-on" : j < i ? "is-done" : ""} aria-current={j === i ? "step" : undefined}>{l.k}</li>)}
        </ol>
        <p className="zgStepCount">{t.step(i + 1, n)}</p>
        <p className="zgLine" aria-live="polite">{t.layers[i].t}</p>
        {i === n - 1 && <Link className="zgLink" href={firstHref}>{t.veilLink} <span aria-hidden="true">→</span></Link>}
        <div className="zgBtns">
          <button type="button" className="zgBtn zgBtnQuiet" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>{t.back}</button>
          <button type="button" className="zgBtn" onClick={() => setI(Math.min(n - 1, i + 1))} disabled={i === n - 1}>{t.next}</button>
        </div>
      </div>
    </div>
  </ActivityFrame>;
}

/* ---------------------------------------------------------------- [[words]] */

export function Words({ locale }: { locale: Locale }) {
  const t = WORDS_UI[locale];
  const [open, setOpen] = useState<Set<number>>(new Set());
  const flip = (i: number) => { const s = new Set(open); if (s.has(i)) s.delete(i); else s.add(i); setOpen(s); };
  return <ActivityFrame eyebrow={t.eyebrow} title={t.title} lead={t.lead} kind="zgWords">
    <ul className="zgCards">
      {WORDS.map((w, i) => { const on = open.has(i); return <li key={w.os}>
        <button type="button" className={"zgCard" + (on ? " is-on" : "")} aria-pressed={on} onClick={() => flip(i)}>
          <span className="zgCardFront" aria-hidden={on}>
            <span className="zgCardWord" lang="os">{w.os}</span>
            {locale === "en" && <span className="zgCardLat">{w.lat}</span>}
            <span className="zgCardHint">{t.turn}</span>
          </span>
          <span className="zgCardBack" aria-hidden={!on}>
            <span className="zgCardSmall" lang="os">{w.os}</span>
            <span className="zgCardMean">{w.back[locale]}</span>
            <span className="zgCardHint">{t.turnBack}</span>
          </span>
        </button>
      </li>; })}
    </ul>
  </ActivityFrame>;
}

/* ---------------------------------------------------------------- [[dress]] */

type Item = "dress" | "sleeves" | "belt" | "shoes" | "hat" | "veils" | "scarf";
const ITEMS: Item[] = ["dress", "sleeves", "belt", "shoes", "hat", "veils", "scarf"];
const NEEDS_HAT: Item[] = ["veils", "scarf"];

function Bride({ on, velvet, pattern, id, label }: { on: Set<Item>; velvet: [string, string, string]; pattern: MotifKind; id: string; label: string }) {
  const has = (i: Item) => on.has(i);
  const L = (i: Item) => "zgFade" + (has(i) ? " is-on" : "");
  const g = `url(#${id}g)`, h = `url(#${id}h)`;
  return <svg className="zgBride" viewBox="0 0 300 520" role="img" aria-label={label}>
    <GoldDefs id={id} />
    <defs>
      <linearGradient id={id + "v"} x1="0" x2="1"><stop offset="0" stopColor={velvet[1]} /><stop offset=".5" stopColor={velvet[2]} /><stop offset="1" stopColor={velvet[1]} /></linearGradient>
      <pattern id={id + "m"} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 5 L5 0 L10 5 L5 10 Z" fill="none" stroke="#F5EEE2" strokeWidth=".8" /></pattern>
    </defs>
    <ellipse cx="150" cy="506" rx="110" ry="10" fill="#000" opacity=".25" />
    {/* the young woman, seen from behind, in a plain under-dress */}
    <path d="M140 92 L160 92 L163 120 L137 120 Z" fill="#D9B79A" />
    <path d="M112 128 C 120 116 180 116 188 128 L 196 250 C 214 330 226 420 232 500 L 68 500 C 74 420 86 330 104 250 Z" fill="#EFE6D6" />
    <ellipse cx="150" cy="70" rx="25" ry="29" fill="#2B1C17" />
    <path d="M132 82 C 136 100 164 100 168 82 C 166 106 134 106 132 82 Z" fill="#241712" />
    {/* shoes */}
    <g className={L("shoes")}><path d="M112 498 C 112 488 134 486 136 496 L 136 504 L112 504 Z" fill={velvet[0]} /><path d="M164 496 C 166 486 188 488 188 498 L188 504 L164 504 Z" fill={velvet[0]} />
      <path d="M112 500 L136 500 M164 500 L188 500" stroke={g} strokeWidth="3" /></g>
    {/* velvet dress */}
    <g className={L("dress")}>
      <path d="M108 124 C 118 112 182 112 192 124 L 200 250 C 218 330 230 416 238 496 L 62 496 C 70 416 82 330 100 250 Z" fill={`url(#${id}v)`} />
      <path d="M62 496 L238 496 L236 482 L64 482 Z" fill={g} /><path d="M62 496 L238 496 L236 482 L64 482 Z" fill={h} />
      <g transform="translate(150 430) scale(.55)" opacity=".95"><MotifShape kind="tree" paint={g} hatch={h} /></g>
      <path d="M150 128 L150 250" stroke={velvet[1]} strokeWidth="2" opacity=".6" />
    </g>
    {/* hanging sleeves */}
    <g className={L("sleeves")}>
      <path d="M108 128 C 88 190 76 280 70 380 L104 388 C 106 300 112 220 122 150 Z" fill={`url(#${id}v)`} />
      <path d="M192 128 C 212 190 224 280 230 380 L196 388 C 194 300 188 220 178 150 Z" fill={`url(#${id}v)`} />
      <path d="M70 380 L104 388" stroke={g} strokeWidth="4" /><path d="M230 380 L196 388" stroke={g} strokeWidth="4" />
      <g transform="translate(90 320) scale(.36)"><MotifShape kind={pattern} paint={g} hatch={h} stroke={9} /></g>
      <g transform="translate(210 320) scale(-.36 .36)"><MotifShape kind={pattern} paint={g} hatch={h} stroke={9} /></g>
      <g transform="translate(97 250) scale(.24)"><MotifShape kind={pattern} paint={g} stroke={9} /></g>
      <g transform="translate(203 250) scale(-.24 .24)"><MotifShape kind={pattern} paint={g} stroke={9} /></g>
    </g>
    {/* belt */}
    <g className={L("belt")}><rect x="100" y="238" width="100" height="14" rx="3" fill={g} /><rect x="100" y="238" width="100" height="14" rx="3" fill={h} />
      {[0, 1, 2, 3].map((j) => <circle key={j} cx={116 + j * 22.5} cy="245" r="3.2" fill={C.goldDeep} />)}</g>
    {/* hat */}
    <g className={L("hat")}>
      <path d="M120 22 L116 64 C 116 70 184 70 184 64 L180 22 Z" fill={velvet[0]} /><ellipse cx="150" cy="22" rx="30" ry="7" fill={velvet[2]} />
      <path d="M116 64 C 116 70 184 70 184 64" fill="none" stroke={g} strokeWidth="5" /><ellipse cx="150" cy="22" rx="30" ry="7" fill="none" stroke={g} strokeWidth="2.5" />
      <g transform="translate(150 44) scale(.42 .36)"><MotifShape kind="scrolls" paint={g} stroke={9} /></g>
    </g>
    {/* silk veils */}
    <g className={L("veils")}><path d="M120 60 C 112 120 108 190 110 250 L190 250 C 192 190 188 120 180 60 Z" fill="#F7F1E6" opacity=".42" />
      <path d="M126 64 C 120 130 118 190 120 248 M174 64 C 180 130 182 190 180 248" stroke="#FFFFFF" strokeWidth="1" opacity=".5" fill="none" /></g>
    {/* openwork headscarf */}
    <g className={L("scarf")}>
      <path d="M122 18 C 150 8 150 8 178 18 C 214 70 236 150 244 236 L150 300 L56 236 C 64 150 86 70 122 18 Z" fill="#F5EEE2" opacity=".1" />
      <path d="M122 18 C 150 8 150 8 178 18 C 214 70 236 150 244 236 L150 300 L56 236 C 64 150 86 70 122 18 Z" fill={`url(#${id}m)`} opacity=".55" />
      {Array.from({ length: 16 }, (_, j) => { const t = j / 15, x = 56 + t * 94, y = 236 + t * 64; return <line key={"a" + j} x1={x} y1={y} x2={x - 2} y2={y + 12} stroke="#F5EEE2" strokeWidth="1" opacity=".7" />; })}
      {Array.from({ length: 16 }, (_, j) => { const t = j / 15, x = 244 - t * 94, y = 236 + t * 64; return <line key={"b" + j} x1={x} y1={y} x2={x + 2} y2={y + 12} stroke="#F5EEE2" strokeWidth="1" opacity=".7" />; })}
    </g>
  </svg>;
}

export function Dress({ locale, firstHref }: { locale: Locale; firstHref: string }) {
  const t = DRESS[locale];
  const id = useUid();
  const [on, setOn] = useState<Set<Item>>(new Set());
  const [last, setLast] = useState<string>("");
  const [color, setColor] = useState<"crimson" | "green" | "black">("crimson");
  const [pattern, setPattern] = useState<MotifKind>("tree");
  const toggle = (i: Item) => {
    const s = new Set(on);
    if (s.has(i)) { s.delete(i); if (i === "hat") NEEDS_HAT.forEach((x) => s.delete(x)); setOn(s); setLast(""); return; }
    if (NEEDS_HAT.includes(i) && !s.has("hat")) { setLast(t.hatFirst); return; }
    s.add(i); setOn(s); setLast(`${t.items[i].name}. ${t.items[i].line}`);
  };
  const all = on.size === ITEMS.length;
  return <ActivityFrame eyebrow={t.eyebrow} title={t.title} lead={t.lead} tone="dark" kind="zgDress">
    <div className="zgDressGrid">
      <Bride on={on} velvet={VELVET[color]} pattern={pattern} id={id} label={t.svgLabel(on.size)} />
      <div className="zgDressCtl">
        <h4 className="zgChest">{t.chest}</h4>
        <ul className="zgChestList">
          {ITEMS.map((i) => <li key={i}><button type="button" className="zgChestItem" aria-pressed={on.has(i)} onClick={() => toggle(i)}>
            <span>{t.items[i].name}</span><span className="zgChestState">{on.has(i) ? t.on : t.take}</span>
          </button></li>)}
        </ul>
        <Seg legend={t.velvet} name={id + "c"} value={color} onChange={setColor}
          options={(["crimson", "green", "black"] as const).map((v) => ({ v, label: <><i className="zgSwatch" style={{ background: VELVET[v][2] }} />{t.colors[v]}</> }))} />
        <Seg legend={t.sleeve} name={id + "p"} value={pattern} onChange={setPattern}
          options={(["tree", "rosette", "horns", "scrolls"] as const).map((v) => ({ v, label: t.patterns[v] }))} />
        <p className="zgLine" aria-live="polite">{all ? t.done : last}</p>
        {all && <Link className="zgLink" href={firstHref}>{t.firstLink} <span aria-hidden="true">→</span></Link>}
        {on.size > 0 && <button type="button" className="zgBtn zgBtnQuiet" onClick={() => { setOn(new Set()); setLast(""); }}>{t.again}</button>}
      </div>
    </div>
  </ActivityFrame>;
}
