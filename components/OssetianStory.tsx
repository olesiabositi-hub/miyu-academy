"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/lib/course";
import { CRAFT, GALLERY, MEDIA, MOTIFS, PATH, PICS, TOUCH, UI, WEAVE, YEAR } from "@/lib/content/ossetianHeadscarf";

/* ------------------------------------------------------------------ motion */

const StillCtx = createContext<{ still: boolean; toggle: () => void }>({ still: false, toggle: () => {} });
const useStill = () => useContext(StillCtx).still;
const KEY = "miyu-story-still";

export function StoryShell({ children }: { children: ReactNode }) {
  const [still, setStill] = useState(false);
  useEffect(() => {
    let v = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try { const s = localStorage.getItem(KEY); if (s !== null) v = s === "1"; } catch { /* storage blocked */ }
    setStill(v);
  }, []);
  const toggle = useCallback(() => setStill((s) => { try { localStorage.setItem(KEY, s ? "0" : "1"); } catch { /* storage blocked */ } return !s; }), []);
  useEffect(() => { window.dispatchEvent(new Event("scroll")); }, [still]);
  return <StillCtx.Provider value={{ still, toggle }}><div className={"cx" + (still ? " cxStill" : "")}>{children}<Progress /></div></StillCtx.Provider>;
}

export function MotionToggle({ locale }: { locale: Locale }) {
  const { still, toggle } = useContext(StillCtx);
  return <button type="button" className="cxMotion" aria-pressed={!still} onClick={toggle}>
    <svg viewBox="0 0 16 10" width="16" height="10" fill="none" aria-hidden="true"><path d={still ? "M1 5H15" : "M1 5C3 1 5 1 8 5S13 9 15 5"} stroke="currentColor" strokeWidth="1.3" /></svg>
    {still ? UI[locale].motionOff : UI[locale].motionOn}
  </button>;
}

/** Shared scroll loop: one rAF per frame for every subscriber. */
const subs = new Set<() => void>();
let ticking = false;
function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; subs.forEach((f) => f()); }); }
function useScroll(fn: () => void) {
  const ref = useRef(fn); ref.current = fn;
  useEffect(() => {
    const f = () => ref.current();
    if (subs.size === 0) { window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll); }
    subs.add(f); f();
    return () => { subs.delete(f); if (subs.size === 0) { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); } };
  }, []);
}
const progressOf = (el: HTMLElement) => { const r = el.getBoundingClientRect(); const span = r.height - window.innerHeight; return Math.min(1, Math.max(0, -r.top / (span || 1))); };

function Progress() {
  const ref = useRef<HTMLDivElement>(null);
  useScroll(() => { const h = document.documentElement.scrollHeight - window.innerHeight; if (ref.current) ref.current.style.transform = `scaleX(${Math.min(1, window.scrollY / (h || 1))})`; });
  return <div className="cxProg" ref={ref} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ media */

export function Pic({ name, locale, className, eager }: { name: string; locale: Locale; className?: string; eager?: boolean }) {
  const p = PICS[name];
  return <picture className={className}>
    <source media="(max-width: 800px)" srcSet={`${MEDIA}/${name}-800.webp`} />
    <img src={`${MEDIA}/${name}-${p.w}.webp`} width={p.w} height={p.h} alt={p.alt[locale]} loading={eager ? undefined : "lazy"} decoding="async" />
  </picture>;
}

export function HeroVideo() {
  const still = useStill();
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { const v = ref.current; if (!v) return; if (still) v.pause(); else v.play().catch(() => {}); }, [still]);
  return <video ref={ref} className="cxHeroMedia" autoPlay muted loop playsInline preload="metadata" poster={`${MEDIA}/hero-poster-1600.webp`} aria-hidden="true">
    <source src={`${MEDIA}/hero.mp4`} type="video/mp4" />
  </video>;
}

/** Full-bleed picture with gentle parallax. */
export function Scene({ name, locale, children, className = "" }: { name: string; locale: Locale; children?: ReactNode; className?: string }) {
  // Pictures are shown whole, in their own proportions: no cropping, no parallax.
  return <figure className={"cxScene " + className}>
    <div className="cxFrame">
      <Pic name={name} locale={locale} />
      {children}
    </div>
  </figure>;
}

/** Ch.01 cover: the light follows the pointer across the silk. */
export function LightScene({ locale, quote }: { locale: Locale; quote: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useStill();
  const auto = useRef(true);
  const set = (x: number, y: number) => { const s = ref.current?.style; if (!s) return; s.setProperty("--lx", `${(x * 100).toFixed(1)}%`); s.setProperty("--ly", `${(y * 100).toFixed(1)}%`); s.setProperty("--tint", (0.04 + 0.34 * x).toFixed(3)); };
  useEffect(() => {
    set(0.6, 0.35);
    if (still) return;
    let raf = 0; const t0 = performance.now();
    const loop = (t: number) => { if (auto.current) { const k = (t - t0) / 6000; set(0.5 + 0.32 * Math.sin(k), 0.35 + 0.12 * Math.cos(k * 1.3)); } raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [still]);
  return <div ref={ref} className="cxLight"
    onPointerMove={(e) => { auto.current = false; const r = e.currentTarget.getBoundingClientRect(); set((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); }}
    onPointerLeave={() => { auto.current = true; }}>
    <Scene name="silk-light" locale={locale}>
      <span className="cxTint" aria-hidden="true" /><span className="cxGlow" aria-hidden="true" />
      <div className="cxCap"><div className="cxWide"><p>{quote}</p><div className="cxHint">{UI[locale].lightHint}</div></div></div>
    </Scene>
  </div>;
}

/* ------------------------------------------------------------------ path of the thread */

export function ThreadPath({ locale }: { locale: Locale }) {
  const sec = useRef<HTMLElement>(null), track = useRef<HTMLDivElement>(null);
  const still = useStill();
  const [lit, setLit] = useState(0);
  const dims = useRef({ max: 0, w: 1 });
  const measure = () => {
    const t = track.current; if (!t) return;
    const steps = t.querySelectorAll<HTMLElement>(".cxStep"); const last = steps[steps.length - 1]; if (!last) return;
    const w = last.offsetLeft + last.offsetWidth + Math.max(16, window.innerWidth * 0.08);
    t.style.setProperty("--tw", `${w}px`); dims.current = { max: Math.max(0, w - t.clientWidth), w };
  };
  useEffect(() => { measure(); window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); }, [locale]);
  useScroll(() => {
    const s = sec.current, t = track.current; if (!s || !t) return;
    if (still) { t.style.transform = ""; setLit(PATH.steps.length); return; }
    const p = Math.min(1, progressOf(s) * 1.08);
    t.style.transform = `translate3d(${(-p * dims.current.max).toFixed(1)}px,0,0)`;
    t.style.setProperty("--tp", p.toFixed(4));
    const steps = t.querySelectorAll<HTMLElement>(".cxStep"); let n = 0;
    steps.forEach((el) => { if ((el.offsetLeft + 9) / dims.current.w <= p + 0.001) n++; });
    setLit(n);
  });
  return <section className="cxPath" ref={sec} aria-labelledby="cx-path-t">
    <div className="cxStick">
      <div className="cxPathBg" aria-hidden="true" style={{ backgroundImage: `url(${MEDIA}/cocoons-800.webp)` }} />
      <div className="cxHead cxGut"><div className="cxWide">
        <span className="cxActLabel">{PATH.label[locale]}</span>
        <h3 className="cxActTitle" id="cx-path-t">{PATH.title[locale]}</h3>
        <p className="cxActSub">{PATH.sub[locale]}</p>
      </div></div>
      <div className="cxTrack" ref={track}>
        <i className="cxThread" aria-hidden="true" />
        {PATH.steps.map((s, i) => <div key={i} className={"cxStep" + (i < lit ? " is-lit" : "")}>
          <span className="cxK" aria-hidden="true" />
          <div className="cxN">{String(i + 1).padStart(2, "0")}</div>
          <h4>{s.h[locale]}</h4>
          <p>{s.p[locale]}</p>
          {"q" in s && s.q ? <div className="cxQ">{s.q[locale]}</div> : null}
        </div>)}
      </div>
    </div>
  </section>;
}

/* ------------------------------------------------------------------ weave */

const B = [0, 0.45, 0.75, 0.88, 1];
const stageOf = (p: number) => { for (let i = 3; i >= 1; i--) if (p >= B[i]) return i; return 0; };
const sub = (p: number, i: number) => Math.min(1, Math.max(0, (p - B[i]) / (B[i + 1] - B[i])));
function motif(u: number, v: number) {
  const a = Math.abs(u) + Math.abs(v);
  if (a > 0.56 && a < 0.7) return true;
  if (Math.abs(u) < 0.05 && v > -0.42 && v < 0.46) return true;
  for (const [x, y] of [[0.14, -0.22], [-0.14, -0.05], [0.14, 0.12], [-0.14, 0.28]]) if (Math.abs(u - x) + Math.abs(v - y) < 0.085) return true;
  if (Math.abs(u) + Math.abs(v + 0.47) < 0.06) return true;
  for (const [x, y] of [[0.84, 0.84], [-0.84, 0.84], [0.84, -0.84], [-0.84, -0.84]]) { const d = Math.abs(u - x) + Math.abs(v - y); if (d < 0.13 && d > 0.05) return true; }
  return false;
}

export function Weave({ locale }: { locale: Locale }) {
  const loom = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null);
  const still = useStill();
  const st = useRef({ target: 0, shown: 0, W: 0, H: 0, last: null as null | [number, number], ptr: null as null | [number, number], vis: false });
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);
  const [touched, setTouched] = useState(false);
  const stillRef = useRef(still); stillRef.current = still;

  useEffect(() => {
    const c = cv.current!, box = loom.current!, cx = c.getContext("2d")!;
    const S = st.current;
    const size = () => { const r = box.getBoundingClientRect(); const d = Math.min(2, window.devicePixelRatio || 1); S.W = r.width; S.H = r.height; c.width = r.width * d; c.height = r.height * d; cx.setTransform(d, 0, 0, d, 0, 0); };
    size(); window.addEventListener("resize", size);
    const io = new IntersectionObserver((e) => { S.vis = e[0].isIntersecting; }); io.observe(box);
    let raf = 0, lastStage = -1, lastDone = false;
    const draw = (t: number) => {
      const { W, H } = S; cx.clearRect(0, 0, W, H);
      const p = S.shown, net = sub(p, 0), emb = sub(p, 1), fr = sub(p, 2), sh = sub(p, 3);
      const C = W < 520 ? 14 : 22;
      const meshW = Math.min(W * 0.82, H * 0.95), late = p >= B[2], meshH = H * (late ? 0.66 : 0.74);
      const stretch = 1 + 0.75 * (1 - sh), cellW = meshW / C, w = cellW / stretch;
      const R = Math.max(4, Math.round(meshH / (cellW / 2))), h = meshH / R;
      const x0 = W / 2 - (C * w) / 2, y0 = (H - meshH) / 2 - (late ? H * 0.06 : 0);
      const P = (r: number, c: number): [number, number] => [x0 + c * w + (r % 2 ? w / 2 : 0), y0 + r * h];
      const len = (r: number) => (r % 2 ? C : C + 1);
      const start = [0]; for (let r = 1; r <= R + 1; r++) start[r] = start[r - 1] + len(r - 1);
      const total = start[R + 1], nShow = Math.floor(net * total);
      const on = (r: number, c: number) => start[r] + c < nShow;
      if (emb > 0) {
        const cells: { r: number; c: number; l: number; rr: number; d: number }[] = [];
        for (let r = 0; r + 2 <= R; r++) for (let c = 0; c < len(r); c++) {
          const [tx, ty] = P(r, c); const u = (tx - W / 2) / ((C * w) / 2), v = (ty + h - (y0 + meshH / 2)) / (meshH / 2);
          if (!motif(u, v)) continue; const [l, rr] = r % 2 ? [c, c + 1] : [c - 1, c];
          if (l < 0 || rr >= len(r + 1)) continue; cells.push({ r, c, l, rr, d: Math.hypot(u, v) });
        }
        cells.sort((a, b) => a.d - b.d); const m = Math.floor(emb * cells.length);
        cx.fillStyle = "rgba(241,226,196,0.82)";
        for (let i = 0; i < m; i++) { const e = cells[i], a = P(e.r, e.c), b = P(e.r + 2, e.c), l = P(e.r + 1, e.l), q = P(e.r + 1, e.rr); cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(q[0], q[1]); cx.lineTo(b[0], b[1]); cx.lineTo(l[0], l[1]); cx.closePath(); cx.fill(); }
      }
      cx.strokeStyle = "rgba(232,216,186,0.62)"; cx.lineWidth = 0.8; cx.beginPath();
      for (let r = 0; r < R; r++) for (let c = 0; c < len(r); c++) {
        if (!on(r, c)) continue; const a = P(r, c);
        for (const k of r % 2 ? [c, c + 1] : [c - 1, c]) { if (k < 0 || k >= len(r + 1) || !on(r + 1, k)) continue; const b = P(r + 1, k); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); }
      }
      cx.stroke();
      cx.fillStyle = "rgba(245,232,205,0.9)";
      for (let r = 0; r <= R; r++) for (let c = 0; c < len(r); c++) { if (!on(r, c)) continue; const a = P(r, c); cx.fillRect(a[0] - 0.9, a[1] - 0.9, 1.8, 1.8); }
      if (fr > 0) {
        const L = H * 0.2 * fr; cx.strokeStyle = "rgba(232,216,186,0.7)"; cx.lineWidth = 1; cx.beginPath();
        for (let c = 0; c < len(R); c++) { const [x, y] = P(R, c); const sw = stillRef.current ? 0 : Math.sin(t / 900 + c * 0.6) * 4 * fr; for (let k = -1; k <= 1; k++) { cx.moveTo(x, y); cx.quadraticCurveTo(x + k * 1.5 + sw * 0.4, y + L * 0.5, x + k * 2.2 + sw, y + L); } }
        cx.stroke();
      }
      if (nShow > 0 && nShow < total && S.ptr) {
        let r = 0; while (start[r + 1] <= nShow - 1) r++; const a = P(r, nShow - 1 - start[r]);
        cx.strokeStyle = "rgba(216,185,121,0.9)"; cx.lineWidth = 1.1; cx.beginPath(); cx.moveTo(a[0], a[1]);
        cx.quadraticCurveTo((a[0] + S.ptr[0]) / 2, Math.max(a[1], S.ptr[1]) + 30, S.ptr[0], S.ptr[1]); cx.stroke();
      }
    };
    const loop = (t: number) => {
      if (S.vis) {
        S.shown += (S.target - S.shown) * (stillRef.current ? 1 : 0.08);
        if (Math.abs(S.target - S.shown) < 0.0005) S.shown = S.target;
        draw(t);
        const sg = stageOf(S.shown), dn = S.shown >= 0.999;
        if (sg !== lastStage) { lastStage = sg; setStage(sg); }
        if (dn !== lastDone) { lastDone = dn; setDone(dn); }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", size); io.disconnect(); };
  }, []);

  const pos = (e: React.PointerEvent): [number, number] => { const r = loom.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const add = (p: [number, number]) => {
    const S = st.current;
    if (S.last) S.target = Math.min(1, S.target + Math.hypot(p[0] - S.last[0], p[1] - S.last[1]) / (Math.max(S.W, 320) * 7));
    S.last = p; S.ptr = p; if (!touched) setTouched(true);
  };
  const s = WEAVE.stages[stage];
  return <section className="cxNight cxWeave cxGut" aria-labelledby="cx-weave-t">
    <div className="cxWide">
      <span className="cxActLabel">{WEAVE.label[locale]}</span>
      <h3 className="cxActTitle" id="cx-weave-t">{WEAVE.title[locale]}</h3>
      <p className="cxActSub">{WEAVE.sub[locale]}</p>
      <div className="cxWeaveGrid">
        <div className="cxLoom" ref={loom} tabIndex={0} role="img" aria-label={WEAVE.aria[locale]}
          onPointerDown={(e) => { st.current.last = pos(e); st.current.ptr = st.current.last; }}
          onPointerMove={(e) => { if (e.pointerType !== "mouse" && !(e.buttons & 1)) return; add(pos(e)); }}
          onPointerLeave={() => { st.current.last = null; st.current.ptr = null; }}
          onPointerUp={(e) => { if (e.pointerType !== "mouse") { st.current.last = null; st.current.ptr = null; } }}
          onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { e.preventDefault(); st.current.target = Math.min(1, st.current.target + 0.04); setTouched(true); } }}>
          <canvas ref={cv} />
          <div className="cxTip" style={{ opacity: touched ? 0 : 1 }}>{WEAVE.tip[locale]}</div>
        </div>
        <div>
          <ol className="cxStages">
            {WEAVE.stages.map((x, i) => <li key={i} className={(i < stage || (i === 3 && done) ? "is-done" : "") + (i === stage && !done ? " is-on" : "")}><span>{String(i + 1).padStart(2, "0")}</span><span>{x.n[locale]}</span></li>)}
          </ol>
          <div className="cxStageText" aria-live="polite">
            {s.t[locale]}
            {"f" in s && s.f ? <span className="cxFact">{s.f[locale]}<small>{s.fs![locale]}</small></span> : null}
          </div>
          <div className="cxBtns">
            <button type="button" className="cxBtn" onClick={() => { st.current.target = 1; setTouched(true); }}>{WEAVE.done[locale]}</button>
            <button type="button" className="cxBtn" onClick={() => { st.current.target = 0; st.current.shown = 0; setTouched(false); }}>{WEAVE.reset[locale]}</button>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

/* ------------------------------------------------------------------ hotspots */

export function Touch({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(-1);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => { const f = () => setNarrow(window.innerWidth <= 640); f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  useEffect(() => { if (open < 0) return; const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(-1); }; document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k); }, [open]);
  const s = open >= 0 ? TOUCH.spots[open] : null;
  const note = s ? <div className="cxNote" role="dialog" aria-label={s.h[locale]} style={narrow ? undefined : { top: `${Math.min(s.y, 58)}%`, ...(s.x > 55 ? { right: `${100 - s.x + 3}%` } : { left: `${s.x + 3}%` }) }}>
    <button type="button" className="cxX" aria-label={TOUCH.close[locale]} onClick={() => setOpen(-1)}>×</button>
    <h4>{s.h[locale]}</h4><p>{s.p[locale]}</p><span className="cxSrc">{TOUCH.from[locale]} · {s.s[locale]}</span>
  </div> : null;
  return <section className="cxNight cxTouch cxGut" aria-labelledby="cx-touch-t">
    <div className="cxWide">
      <span className="cxActLabel">{TOUCH.label[locale]}</span>
      <h3 className="cxActTitle" id="cx-touch-t">{TOUCH.title[locale]}</h3>
      <p className="cxActSub">{TOUCH.sub[locale]}</p>
    </div>
    <div className="cxSpots">
      <Pic name="closeup-shuttle" locale={locale} />
      {TOUCH.spots.map((p, i) => <button key={i} type="button" className="cxDot" style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-label={p.h[locale]} aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} />)}
      {!narrow && note}
    </div>
    {narrow && <div className="cxWide">{note}</div>}
  </section>;
}

/* ------------------------------------------------------------------ year in knots */

export function Year({ locale }: { locale: Locale }) {
  const sec = useRef<HTMLElement>(null), grid = useRef<HTMLDivElement>(null);
  const still = useStill();
  const [day, setDay] = useState(0);
  const last = useRef(0);
  useScroll(() => {
    const s = sec.current; if (!s) return;
    const d = still ? 365 : Math.round(Math.min(1, progressOf(s) * 1.12) * 365);
    if (d === last.current) return;
    const ks = grid.current?.children; if (ks) { const a = Math.min(d, last.current), b = Math.max(d, last.current); for (let i = a; i < b; i++) ks[i]?.classList.toggle("is-on", i < d); }
    last.current = d; setDay(d);
  });
  return <section className="cxYear" ref={sec} aria-labelledby="cx-year-t">
    <div className="cxStick cxGut">
      <div className="cxWide cxYearIn">
        <div>
          <span className="cxActLabel">{YEAR.label[locale]}</span>
          <h3 className="cxActTitle" id="cx-year-t">{YEAR.title[locale]}</h3>
          <p className="cxActSub">{YEAR.sub[locale]}</p>
          <div className="cxCount"><span>{day}</span><small>{YEAR.days[locale]}</small></div>
          <div className="cxHours">{YEAR.hours[locale].replace("{h}", String(day * 2))}</div>
          <p className={"cxEve" + (day >= 365 ? " is-shown" : "")}>{YEAR.eve[locale]}</p>
        </div>
        <div className="cxKnots" ref={grid} aria-hidden="true">{Array.from({ length: 365 }, (_, i) => <i key={i} />)}</div>
      </div>
    </div>
  </section>;
}

/* ------------------------------------------------------------------ motifs */

const MOTIF_SVG = [
  <svg key="d" viewBox="0 0 64 64" fill="none"><path d="M32 6L58 32L32 58L6 32Z" /><path d="M32 20L44 32L32 44L20 32Z" /></svg>,
  <svg key="p" viewBox="0 0 64 64" fill="none"><path d="M32 58V10" /><path d="M32 40C22 38 18 30 20 24C28 26 32 32 32 40ZM32 30C42 28 46 20 44 14C36 16 32 22 32 30Z" /><circle cx="32" cy="8" r="3" /></svg>,
  <svg key="g" viewBox="0 0 64 64" fill="none"><path d="M8 8L56 56M56 8L8 56M32 6V58M6 32H58" /><path d="M32 18L46 32L32 46L18 32Z" /></svg>,
];

export function Motifs({ locale }: { locale: Locale }) {
  const [m, setM] = useState(0);
  return <div className="cxMotifs" role="group" aria-label={MOTIFS.label[locale]}>
    <span className="cxActLabel cxActLabelInk">{MOTIFS.label[locale]}</span>
    <div className="cxMotifRow">
      {MOTIFS.items.map((x, i) => <button key={i} type="button" className="cxMotif" aria-pressed={m === i} onClick={() => setM(i)}>{MOTIF_SVG[i]}<span>{x.n[locale]}</span></button>)}
    </div>
    <div className="cxReading" aria-live="polite">
      <div><span className="cxLab">{MOTIFS.readLabel[locale]}</span>{MOTIFS.items[m].r[locale]}</div>
      <div><span className="cxLab">{MOTIFS.butLabel[locale]}</span>{MOTIFS.but[locale]}</div>
    </div>
  </div>;
}

/* ------------------------------------------------------------------ gallery */

export function Gallery({ locale }: { locale: Locale }) {
  // Each picture keeps its own proportions; widths follow the aspect ratio so the row has one height.
  return <div className="cxDuo">{GALLERY.map((n) => { const p = PICS[n]; return <div key={n} className="cxDuoItem" style={{ "--ar": `${p.w} / ${p.h}`, "--r": (p.w / p.h).toFixed(4) } as CSSProperties}><Pic name={n} locale={locale} /></div>; })}</div>;
}

/* ------------------------------------------------------------------ the craft lives on */

const KNOT = <svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M4 14L14 4L24 14L14 24Z" /><circle cx="14" cy="14" r="2.4" /></svg>;

export function Craft({ locale }: { locale: Locale }) {
  const [passed, setPassed] = useState(1);
  const all = passed >= CRAFT.nodes.length;
  return <section className="cxNight cxCraft cxGut" aria-labelledby="cx-craft-t">
    <div className="cxWide">
      <span className="cxActLabel">{CRAFT.label[locale]}</span>
      <h3 className="cxActTitle" id="cx-craft-t">{CRAFT.title[locale]}</h3>
      <p className="cxActSub">{CRAFT.sub[locale]}</p>
      <div className="cxChain">
        {CRAFT.nodes.map((n, i) => <div key={i} className="cxChainItem">
          {i > 0 && <span className={"cxConn" + (i < passed ? " is-got" : "")} aria-hidden="true" />}
          <button type="button" className={"cxNode" + (i < passed ? " is-got" : "") + (i === passed ? " is-next" : "")} disabled={i !== passed} aria-disabled={i !== passed} onClick={() => setPassed((p) => p + 1)}>
            <span className="cxH">{KNOT}</span>
            <span className="cxNm">{n.n[locale]}</span>
            <span className="cxDs" aria-hidden={i >= passed}>{n.d[locale]}</span>
          </button>
        </div>)}
      </div>
      <p className={"cxCraftLine" + (all ? " is-shown" : "")} aria-hidden={!all}>{CRAFT.final[locale]}</p>
    </div>
  </section>;
}

/* ------------------------------------------------------------------ finale threads */

export function FinaleThreads() {
  const ref = useRef<HTMLCanvasElement>(null);
  const still = useStill();
  useEffect(() => {
    const c = ref.current!, g = c.getContext("2d")!; let w = 0, h = 0, on = false, raf = 0;
    const sz = () => { const r = c.getBoundingClientRect(); const d = Math.min(2, window.devicePixelRatio || 1); w = r.width; h = r.height; c.width = w * d; c.height = h * d; g.setTransform(d, 0, 0, d, 0, 0); };
    const io = new IntersectionObserver((e) => { on = e[0].isIntersecting; }); io.observe(c);
    const f = (t: number) => {
      if (on) { g.clearRect(0, 0, w, h); for (let i = 0; i < 7; i++) { const y = h * (0.2 + 0.6 * i / 6), a = still ? i : t / 2400 + i; g.strokeStyle = `rgba(216,185,121,${0.1 + 0.05 * (i % 3)})`; g.lineWidth = 0.8; g.beginPath(); g.moveTo(-10, y); for (let x = 0; x <= w + 20; x += 24) g.lineTo(x, y + Math.sin(x / 180 + a) * 18 + Math.sin(x / 61 + a * 1.7) * 4); g.stroke(); } }
      if (!still) raf = requestAnimationFrame(f);
    };
    sz(); window.addEventListener("resize", sz); on = true; raf = requestAnimationFrame(f);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", sz); io.disconnect(); };
  }, [still]);
  return <canvas ref={ref} className="cxFinCv" aria-hidden="true" />;
}
