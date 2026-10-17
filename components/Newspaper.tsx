"use client";
import { Markdown } from "@/components/Markdown";

/**
 * Newspaper layout for a lesson chapter (courses with `layout: "newspaper"`).
 *
 * Nothing in the text is changed; the chapter is only cut into pieces and set on a grid:
 *  - chapter head: label ("Глава 3"), big number, title;
 *  - the chapter picture beside the first paragraphs (the "lead"), whole and uncropped;
 *  - the rest of the text in two columns. Long runs are cut into blocks of a few paragraphs, so a
 *    column is never taller than a screen or two — no long single strip down the middle of the page;
 *  - an all-bold sentence is a pull quote across both columns; a "**Label:** …" paragraph or a quote
 *    is a note across both columns; a `### subhead` starts a new section;
 *  - a picture inside the text (`![…](…)` before a subhead) is set beside that section's first paragraphs.
 * Phones get one column, picture first.
 */
type Part =
  | { t: "h"; text: string }
  | { t: "p"; md: string; len: number }
  | { t: "list"; md: string; len: number }
  | { t: "pull"; md: string }
  | { t: "note"; md: string; label: string; body: string }
  | { t: "fig"; src: string; alt: string };

const FIG = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/;
const plainLen = (s: string) => s.replace(/[*_#>`]/g, "").length;

function parts(markdowns: string[]): Part[] {
  const out: Part[] = [];
  for (const md of markdowns) {
    for (const raw of md.split(/\n\s*\n/)) {
      const p = raw.trim();
      if (!p) continue;
      let m: RegExpMatchArray | null;
      if ((m = p.match(/^#{2,4}\s+(.+)$/))) { out.push({ t: "h", text: m[1].trim() }); continue; }
      if ((m = p.match(FIG))) { out.push({ t: "fig", alt: m[1], src: m[2] }); continue; }
      if (/^\*\*[^*]+\*\*$/.test(p)) { out.push({ t: "pull", md: p }); continue; }
      const q = p.replace(/^>\s?/gm, "");
      if ((m = q.match(/^\*\*([^*\n]{2,60}?)[:.]\*\*\s*([\s\S]*)$/)) && (p.startsWith(">") || m[2])) {
        out.push({ t: "note", md: q, label: m[1].trim(), body: m[2].trim() }); continue;
      }
      if (p.startsWith(">")) { out.push({ t: "note", md: q, label: "", body: q }); continue; }
      if (/^([-*+]\s|\d+[.)]\s)/.test(p)) { out.push({ t: "list", md: p, len: plainLen(p) }); continue; }
      out.push({ t: "p", md: p, len: plainLen(p) });
    }
  }
  return out;
}

type Flow = Extract<Part, { t: "p" | "list" }>;
type Block = { kind: "cols"; items: Flow[]; len: number } | { kind: "pull"; md: string } | { kind: "note"; label: string; body: string } | { kind: "fig"; src: string; alt: string };

/** Running text → column blocks of at most ~COL chars, broken at pull quotes and notes. */
const COL = 2300;
function blocks(list: Part[]): Block[] {
  const out: Block[] = [];
  let cur: Flow[] = [], len = 0;
  const flush = () => { if (cur.length) out.push({ kind: "cols", items: cur, len }); cur = []; len = 0; };
  for (const p of list) {
    if (p.t === "p" || p.t === "list") {
      if (len > 0 && len + p.len > COL) flush();
      cur.push(p); len += p.len; continue;
    }
    flush();
    if (p.t === "pull") out.push({ kind: "pull", md: p.md });
    else if (p.t === "note") out.push({ kind: "note", label: p.label, body: p.body });
    else if (p.t === "fig") out.push({ kind: "fig", src: p.src, alt: p.alt });
  }
  flush();
  // A short last block (one or two lines) joins the block before it rather than standing alone.
  for (let i = out.length - 1; i > 0; i--) {
    const a = out[i - 1], b = out[i];
    if (a.kind === "cols" && b.kind === "cols" && b.len < 260) { a.items.push(...b.items); a.len += b.len; out.splice(i, 1); }
  }
  return out;
}

/** The first paragraphs that sit beside a picture (about LEAD chars, at least one paragraph). */
const LEAD = 760;
function takeLead(list: Part[]): { lead: Flow[]; rest: Part[] } {
  const lead: Flow[] = [];
  let len = 0, i = 0;
  for (; i < list.length; i++) {
    const p = list[i];
    if (p.t !== "p") break;
    if (lead.length && len + p.len > LEAD * 1.2) break;
    lead.push(p); len += p.len;
    if (len >= LEAD) { i++; break; }
  }
  return { lead, rest: list.slice(i) };
}

function Picture({ src, alt, eager }: { src: string; alt: string; eager?: boolean }) {
  const small = src.replace(/-1448\.webp$/, "-724.webp");
  return <figure className="npFig">
    <picture>
      {small !== src && <source media="(max-width: 700px)" srcSet={small} />}
      <img src={src} width={1448} height={1086} alt={alt} loading={eager ? undefined : "lazy"} decoding="async" />
    </picture>
  </figure>;
}

function Run({ items }: { items: Flow[] }) {
  return <>{items.map((p, i) => <Markdown key={i}>{p.md}</Markdown>)}</>;
}

function Blocks({ list }: { list: Block[] }) {
  return <>{list.map((b, i) => {
    if (b.kind === "pull") return <div className="npPull" key={i}><Markdown>{b.md}</Markdown></div>;
    if (b.kind === "note") return <aside className="npNote" key={i}>{b.label && <div className="npNoteLabel">{b.label}</div>}<div className="npNoteBody"><Markdown>{b.body}</Markdown></div></aside>;
    if (b.kind === "fig") return <div className="npWideFig" key={i}><Picture src={b.src} alt={b.alt} /></div>;
    return <div className={"npCols" + (b.len < 480 ? " npCols1" : "")} key={i}><Run items={b.items} /></div>;
  })}</>;
}

function Spread({ fig, list, flip }: { fig: { src: string; alt: string }; list: Part[]; flip: boolean }) {
  const { lead, rest } = takeLead(list);
  return <>
    <div className={"npSpread" + (flip ? " isFlip" : "")}>
      <div className="npSpreadArt"><Picture src={fig.src} alt={fig.alt} /></div>
      <div className="npSpreadText"><Run items={lead} /></div>
    </div>
    <Blocks list={blocks(rest)} />
  </>;
}

export function NewspaperChapter({ id, head, lead, body, flip }: { id: string; head: string; lead: string | null; body: string[]; flip: boolean }) {
  const title = head.replace(/^#{1,6}\s+/, "").trim();
  const m = title.match(/^((?:Глава|Chapter)\s+(\d+)|Вступление|Introduction|Завершение|Conclusion)\.\s*(.*)$/);
  const label = m ? m[1] : "";
  const num = m && m[2] ? m[2].padStart(2, "0") : "";
  const name = m ? m[3] : title;
  const leadFig = lead ? lead.trim().match(FIG) : null;

  const all = parts(body);
  // sections: text before the first subhead, then one section per subhead (a picture just before a subhead belongs to it)
  type Sec = { head: string | null; fig: { src: string; alt: string } | null; list: Part[] };
  const secs: Sec[] = [{ head: null, fig: null, list: [] }];
  let pendingFig: { src: string; alt: string } | null = null;
  for (const p of all) {
    if (p.t === "fig") { pendingFig = { src: p.src, alt: p.alt }; continue; }
    if (p.t === "h") { secs.push({ head: p.text, fig: pendingFig, list: [] }); pendingFig = null; continue; }
    if (pendingFig) { secs[secs.length - 1].list.push({ t: "fig", ...pendingFig }); pendingFig = null; }
    secs[secs.length - 1].list.push(p);
  }

  return <section className={"npChapter" + (num ? "" : " npChapterFrame")} id={id}>
    <header className="npHead">
      {label && <div className="npLabel">{label}</div>}
      <h2 className="npTitle">{name}</h2>
      {num && <span className="npNum" aria-hidden="true">{num}</span>}
    </header>
    {secs.map((s, i) => {
      const fig = i === 0 ? (leadFig ? { src: leadFig[2], alt: leadFig[1] } : null) : s.fig;
      if (!s.head && !s.list.length) return null;
      return <div className={"npSection" + (i === 0 ? " npOpening" : "")} key={i}>
        {s.head && <h3 className="npSub">{s.head}</h3>}
        {fig && s.list.length
          ? <Spread fig={fig} list={s.list} flip={i === 0 ? flip : (i % 2 === 1) !== flip} />
          : <>{fig && <div className="npWideFig"><Picture src={fig.src} alt={fig.alt} /></div>}<Blocks list={blocks(s.list)} /></>}
      </div>;
    })}
  </section>;
}
