"use client";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/course";
import { getActivity } from "@/lib/content/activities";
import type { CartoucheActivity, MatchActivity, OrderActivity, ScalesActivity } from "@/lib/content/activities";
import { track } from "@/lib/analytics";

/**
 * Drop-in lesson activities (see lib/content/activities.ts). Voluntary: no points, no timers, nothing is saved.
 * All of them work with a keyboard and a screen reader, and honour reduced motion (CSS).
 */
const UI = {
  ru: { eyebrow: "Активность · по желанию", again: "Ещё раз", check: "Проверить", show: "Показать ответ", next: "Дальше", truth: "Правда", myth: "Миф",
        right: "Угадали.", wrong: "Не совсем.", isTrue: "Это правда.", isMyth: "Это миф.", up: "Выше", down: "Ниже", pickLeft: "Выберите имя слева", tryAgain: "Не эта пара. Попробуйте другую.",
        orderOk: "Всё по порядку.", orderFix: (n: number) => `На своём месте: ${n}. Поменяйте остальные местами.`, done: "Готово", name: "Ваше имя", placeholder: "Например, Мия",
        cartoucheNote: "Это игра: египтяне не писали по алфавиту и почти не записывали гласные. Здесь каждая буква заменена близким по звучанию односогласным знаком — так позднее записывали в картушах и иностранные имена.", empty: "Картуш пока пуст" },
  en: { eyebrow: "Activity · optional", again: "Again", check: "Check", show: "Show answer", next: "Next", truth: "True", myth: "Myth",
        right: "Well guessed.", wrong: "Not quite.", isTrue: "This is true.", isMyth: "This is a myth.", up: "Up", down: "Down", pickLeft: "Pick a name on the left", tryAgain: "Not that pair. Try another.",
        orderOk: "All in order.", orderFix: (n: number) => `In the right place: ${n}. Swap the others around.`, done: "Done", name: "Your name", placeholder: "For example, Mia",
        cartoucheNote: "This is a game: the Egyptians did not write with an alphabet and hardly wrote vowels. Here each letter is replaced by a single-consonant sign with a similar sound, the way foreign names were later written in cartouches.", empty: "The cartouche is still empty" },
} as const;

/** Stable shuffle (same on server and client): a permutation that never leaves everything in place. */
function shuffled<T>(items: readonly T[], seed: string): T[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const a = items.map((x, i) => ({ x, k: ((h ^ (i * 2654435761)) >>> 0) % 1000003 }));
  a.sort((p, q) => p.k - q.k);
  const out = a.map((p) => p.x);
  if (out.every((x, i) => x === items[i]) && out.length > 1) out.push(out.shift()!);
  return out;
}

function Frame({ kind, title, intro, locale, children }: { kind: string; title: string; intro: string; locale: Locale; children: React.ReactNode }) {
  return <section className={"acBox ac-" + kind} aria-label={title}>
    <div className="acHead">
      <span className="acIcon" aria-hidden="true">{ICON[kind as keyof typeof ICON]}</span>
      <div>
        <div className="acEyebrow">{UI[locale].eyebrow}</div>
        <h3 className="acTitle">{title}</h3>
        <p className="acIntro">{intro}</p>
      </div>
    </div>
    {children}
  </section>;
}

const ICON = {
  scales: <svg viewBox="0 0 48 48" width="44" height="44"><path d="M24 6v34M12 40h24M8 14h32" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 14l-5 12h10zM40 14l-5 12h10z" stroke="currentColor" strokeWidth="1.6" fill="none" /><circle cx="24" cy="6" r="2.4" fill="currentColor" /></svg>,
  order: <svg viewBox="0 0 48 48" width="44" height="44"><path d="M5 30c6 6 32 6 38 0" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 30h32M24 30V12l10 12H24" stroke="currentColor" strokeWidth="1.6" fill="none" /><circle cx="38" cy="10" r="4" stroke="currentColor" strokeWidth="1.6" fill="none" /><path d="M3 38c4 2 8 2 12 0s8-2 12 0 8 2 12 0 6-2 8-1" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>,
  match: <svg viewBox="0 0 48 48" width="44" height="44"><circle cx="11" cy="14" r="5" stroke="currentColor" strokeWidth="1.6" fill="none" /><circle cx="11" cy="34" r="5" stroke="currentColor" strokeWidth="1.6" fill="none" /><rect x="31" y="9" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" /><rect x="31" y="29" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" /><path d="M16 14l15 20M16 34l15-20" stroke="currentColor" strokeWidth="1.6" /></svg>,
  cartouche: <svg viewBox="0 0 48 48" width="44" height="44"><rect x="12" y="4" width="22" height="36" rx="11" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M10 44h26" stroke="currentColor" strokeWidth="2.4" /><path d="M18 14h10M18 22c3-3 7-3 10 0M20 31h6" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>,
};

/* ---------------- Scales of Ma'at ---------------- */
function Scales({ a, locale, id }: { a: ScalesActivity; locale: Locale; id: string }) {
  const u = UI[locale];
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);
  const item = a.items[i];
  const tilt = pick === null ? 0 : item.truth ? 0 : 14;
  function choose(v: boolean) { if (pick === null) { setPick(v); track("activity_answer", { activity: id, item: i, correct: v === item.truth }); } }
  function next() { if (i + 1 >= a.items.length) { setFinished(true); return; } setI(i + 1); setPick(null); }
  if (finished) return <Frame kind="scales" title={a.title[locale]} intro={a.intro[locale]} locale={locale}>
    <ul className="acScalesList">{a.items.map((x, k) => <li key={k} className={x.truth ? "is-true" : "is-myth"}><b>{x.truth ? u.truth : u.myth}</b><span>{x.text[locale]}</span></li>)}</ul>
    <button type="button" className="acBtn acBtnGhost" onClick={() => { setI(0); setPick(null); setFinished(false); }}>{u.again}</button>
  </Frame>;
  return <Frame kind="scales" title={a.title[locale]} intro={a.intro[locale]} locale={locale}>
    <div className="acScales">
      <svg className="acBalance" viewBox="0 0 320 210" aria-hidden="true">
        <path d="M160 32v150M110 196h100M128 182h64" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="160" cy="28" r="7" fill="currentColor" />
        <g className="acBeam" style={{ transform: `rotate(${-tilt}deg)` }}>
          <path d="M60 40h200" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <g className="acPan acPanL" style={{ transform: `rotate(${tilt}deg)` }}>
            <path d="M60 40l-26 62M60 40l26 62" stroke="currentColor" strokeWidth="1.5" />
            <path d="M28 102h64a32 14 0 0 1-64 0z" fill="currentColor" opacity=".9" />
            <path className="acHeart" d="M60 96c-7-9-18-4-14 4 3 6 14 10 14 10s11-4 14-10c4-8-7-13-14-4z" />
          </g>
          <g className="acPan acPanR" style={{ transform: `rotate(${tilt}deg)` }}>
            <path d="M260 40l-26 62M260 40l26 62" stroke="currentColor" strokeWidth="1.5" />
            <path d="M228 102h64a32 14 0 0 1-64 0z" fill="currentColor" opacity=".9" />
            <path className="acFeather" d="M262 100c-6-10-4-24 6-34 2 10 2 22-6 34zM262 100l4-30" />
          </g>
        </g>
      </svg>
      <div className="acScalesCard">
        <div className="acCount">{i + 1} / {a.items.length}</div>
        <p className="acStatement">{item.text[locale]}</p>
        {pick === null
          ? <div className="acChoice">
              <button type="button" className="acBtn" onClick={() => choose(true)}>{u.truth}</button>
              <button type="button" className="acBtn" onClick={() => choose(false)}>{u.myth}</button>
            </div>
          : <div className={"acVerdict " + (pick === item.truth ? "is-ok" : "is-bad")} role="status">
              <b>{pick === item.truth ? u.right : u.wrong} {item.truth ? u.isTrue : u.isMyth}</b>
              <span>{item.why[locale]}</span>
              <button type="button" className="acBtn" onClick={next}>{i + 1 >= a.items.length ? u.done : u.next} <span aria-hidden="true">→</span></button>
            </div>}
      </div>
    </div>
  </Frame>;
}

/* ---------------- Ra's barque: put in order ---------------- */
function Order({ a, locale, id }: { a: OrderActivity; locale: Locale; id: string }) {
  const u = UI[locale];
  const start = useMemo(() => shuffled(a.items.map((_, k) => k), id), [a, id]);
  const [seq, setSeq] = useState<number[]>(start);
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const ok = seq.every((x, k) => x === k);
  const inPlace = seq.filter((x, k) => x === k).length;
  function move(pos: number, d: number) {
    const to = pos + d; if (to < 0 || to >= seq.length) return;
    const s = seq.slice(); [s[pos], s[to]] = [s[to], s[pos]]; setSeq(s); setChecked(false);
  }
  function tap(pos: number) {
    if (sel === null) { setSel(pos); return; }
    if (sel !== pos) { const s = seq.slice(); [s[pos], s[sel]] = [s[sel], s[pos]]; setSeq(s); setChecked(false); }
    setSel(null);
  }
  return <Frame kind="order" title={a.title[locale]} intro={a.intro[locale]} locale={locale}>
    <ol className={"acOrder" + (checked && ok ? " is-done" : "")}>
      {seq.map((x, pos) => <li key={x} className={(sel === pos ? "is-sel " : "") + (checked ? (x === pos ? "is-ok" : "is-bad") : "")}>
        <span className="acStop" aria-hidden="true">{pos + 1}</span>
        <button type="button" className="acCard" aria-pressed={sel === pos} onClick={() => tap(pos)}>{a.items[x][locale]}</button>
        <span className="acMoves">
          <button type="button" aria-label={`${u.up}: ${a.items[x][locale]}`} disabled={pos === 0} onClick={() => move(pos, -1)}>↑</button>
          <button type="button" aria-label={`${u.down}: ${a.items[x][locale]}`} disabled={pos === seq.length - 1} onClick={() => move(pos, 1)}>↓</button>
        </span>
      </li>)}
    </ol>
    <div className="acRow" role="status">
      {!checked && <button type="button" className="acBtn" onClick={() => { setChecked(true); track("activity_answer", { activity: id, correct: ok }); }}>{u.check}</button>}
      {checked && ok && <p className="acDone"><b>{u.orderOk}</b> {a.done[locale]}</p>}
      {checked && !ok && <><p className="acHint">{u.orderFix(inPlace)}</p><button type="button" className="acBtn acBtnGhost" onClick={() => { setSeq(a.items.map((_, k) => k)); setChecked(true); }}>{u.show}</button></>}
      {checked && ok && <button type="button" className="acBtn acBtnGhost" onClick={() => { setSeq(start); setChecked(false); }}>{u.again}</button>}
    </div>
  </Frame>;
}

/* ---------------- Who is who: match pairs ---------------- */
function Match({ a, locale, id }: { a: MatchActivity; locale: Locale; id: string }) {
  const u = UI[locale];
  const right = useMemo(() => shuffled(a.pairs.map((_, k) => k), id + "r"), [a, id]);
  const [left, setLeft] = useState<number | null>(null);
  const [done, setDone] = useState<number[]>([]);
  const [miss, setMiss] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const all = done.length === a.pairs.length;
  function pickRight(k: number) {
    if (left === null) { setMsg(u.pickLeft); return; }
    if (k === left) { setDone([...done, k]); setLeft(null); setMsg(""); if (done.length + 1 === a.pairs.length) track("activity_done", { activity: id }); }
    else { setMiss(k); setMsg(u.tryAgain); setTimeout(() => setMiss(null), 450); }
  }
  return <Frame kind="match" title={a.title[locale]} intro={a.intro[locale]} locale={locale}>
    <div className="acMatch">
      <ul className="acMatchCol" aria-label="A">
        {a.pairs.map((p, k) => <li key={k}><button type="button" disabled={done.includes(k)} aria-pressed={left === k} className={"acChip" + (left === k ? " is-sel" : "") + (done.includes(k) ? " is-ok" : "")} onClick={() => { setLeft(k); setMsg(""); }}>
          {done.includes(k) && <span className="acPairNo" aria-hidden="true">{done.indexOf(k) + 1}</span>}{p.left[locale]}</button></li>)}
      </ul>
      <ul className="acMatchCol acMatchRight" aria-label="B">
        {right.map((k) => <li key={k}><button type="button" disabled={done.includes(k)} className={"acChip acChipR" + (done.includes(k) ? " is-ok" : "") + (miss === k ? " is-miss" : "")} onClick={() => pickRight(k)}>
          {done.includes(k) && <span className="acPairNo" aria-hidden="true">{done.indexOf(k) + 1}</span>}{a.pairs[k].right[locale]}</button></li>)}
      </ul>
    </div>
    <div className="acRow" role="status">
      {all ? <><p className="acDone"><b>{u.done}.</b> {a.done[locale]}</p><button type="button" className="acBtn acBtnGhost" onClick={() => { setDone([]); setLeft(null); }}>{u.again}</button></> : msg && <p className="acHint">{msg}</p>}
    </div>
  </Frame>;
}

/* ---------------- Cartouche ---------------- */
// Single-consonant signs (Gardiner numbers in comments). A simplified game alphabet, not a transliteration standard.
const G = {
  a: "\u{1313F}", /* G1 vulture */ i: "\u{131CB}", /* M17 reed */ y: "\u{131CC}", /* M17A two reeds */ w: "\u{13171}", /* G43 quail chick */
  b: "\u{130C0}", /* D58 foot */ p: "\u{132AA}", /* Q3 stool */ f: "\u{13191}", /* I9 horned viper */ m: "\u{13153}", /* G17 owl */
  n: "\u{13216}", /* N35 water */ r: "\u{1308B}", /* D21 mouth */ l: "\u{130ED}", /* E23 lion */ h: "\u{13254}", /* O4 shelter */
  kh: "\u{1340D}", /* Aa1 */ s: "\u{132F4}", /* S29 folded cloth */ sh: "\u{13219}", /* N37 pool */ q: "\u{1320E}", /* N29 hill */
  k: "\u{133A1}", /* V31 basket */ g: "\u{133BC}", /* W11 jar stand */ t: "\u{133CF}", /* X1 bread */ ch: "\u{1337F}", /* V13 tethering rope */
  d: "\u{130A7}", /* D46 hand */ dj: "\u{13193}", /* I10 cobra */ z: "\u{13283}", /* O34 bolt */
} as const;
type Sign = keyof typeof G;
const LATIN: Record<string, Sign[]> = { a: ["a"], b: ["b"], c: ["k"], d: ["d"], e: ["i"], f: ["f"], g: ["g"], h: ["h"], i: ["i"], j: ["dj"], k: ["k"], l: ["l"], m: ["m"], n: ["n"], o: ["w"], p: ["p"], q: ["q"], r: ["r"], s: ["s"], t: ["t"], u: ["w"], v: ["f"], w: ["w"], x: ["k", "s"], y: ["y"], z: ["z"] };
const CYR: Record<string, Sign[]> = { а: ["a"], б: ["b"], в: ["f"], г: ["g"], д: ["d"], е: ["i"], ё: ["y", "w"], ж: ["dj"], з: ["z"], и: ["i"], й: ["y"], к: ["k"], л: ["l"], м: ["m"], н: ["n"], о: ["w"], п: ["p"], р: ["r"], с: ["s"], т: ["t"], у: ["w"], ф: ["f"], х: ["kh"], ц: ["t", "s"], ч: ["ch"], ш: ["sh"], щ: ["sh"], ъ: [], ы: ["y"], ь: [], э: ["i"], ю: ["y", "w"], я: ["y", "a"] };
const DIGRAPH: Record<string, Sign> = { sh: "sh", ch: "ch", kh: "kh", th: "t", dj: "dj" };

function toSigns(name: string): { sign: Sign; from: string }[] {
  const s = name.toLowerCase();
  const out: { sign: Sign; from: string }[] = [];
  for (let i = 0; i < s.length; i++) {
    const two = s.slice(i, i + 2);
    if (DIGRAPH[two]) { out.push({ sign: DIGRAPH[two], from: name.slice(i, i + 2) }); i++; continue; }
    const ch = s[i];
    const signs = LATIN[ch] ?? CYR[ch];
    if (!signs) continue;
    signs.forEach((g, k) => out.push({ sign: g, from: k === 0 ? name[i] : "" }));
  }
  return out.slice(0, 16);
}

function Cartouche({ a, locale }: { a: CartoucheActivity; locale: Locale }) {
  const u = UI[locale];
  const [name, setName] = useState("");
  const signs = toSigns(name);
  return <Frame kind="cartouche" title={a.title[locale]} intro={a.intro[locale]} locale={locale}>
    <label className="acField"><span>{u.name}</span>
      <input type="text" value={name} maxLength={16} placeholder={u.placeholder} autoComplete="off" spellCheck={false} onChange={(e) => setName(e.target.value)} />
    </label>
    <div className="acCartouche" role="img" aria-label={signs.length ? `${u.name}: ${name}` : u.empty}>
      <div className="acRing">
        {signs.length ? signs.map((x, k) => <span className="acGlyph" key={k}><i lang="egy">{G[x.sign]}</i><small>{x.from}</small></span>) : <span className="acEmpty">{u.empty}</span>}
      </div>
      <span className="acTie" aria-hidden="true" />
    </div>
    <p className="acFoot">{u.cartoucheNote}</p>
  </Frame>;
}

export function ActivityBlock({ id, locale }: { id: string; locale: Locale }) {
  const a = getActivity(id);
  if (!a) return null;
  if (a.kind === "scales") return <Scales a={a} locale={locale} id={id} />;
  if (a.kind === "order") return <Order a={a} locale={locale} id={id} />;
  if (a.kind === "match") return <Match a={a} locale={locale} id={id} />;
  return <Cartouche a={a} locale={locale} />;
}
