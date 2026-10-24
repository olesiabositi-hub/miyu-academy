import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SupportNote } from "@/components/SupportNote";
import { Markdown } from "@/components/Markdown";
import { Reveal } from "@/components/Reveal";
import { isLocale, type Locale } from "@/lib/course";
import { FIRST_STORY_SLUG, HERO, MEDIA, PICS, SOURCES, STORY_SLUG, UI } from "@/lib/content/ossetianGoldEmbroidery";
import { loadStory, type ActivityId, type Chapter, type Seg } from "@/lib/content/ossetianGoldEmbroideryStory";
import { StoryProgress } from "@/components/GoldThreadStory";
import { Assemble, Barter, Dress, Hat, MotifFamilies, Stitch, Words } from "@/components/GoldThreadActivities";
import "./story.css";

/* «Золотая нить. Зæриндагхуыд». Built in advance like every page; fonts and type sizes come from the base,
   colours and decoration from .zg in story.css. Layout follows the first story: magazine spreads per chapter. */

type BlockSeg = Extract<Seg, { kind: "block" }>;

function src(name: string, w: number) { return `${MEDIA}/${name}-${w}.webp`; }

function Pic({ name, locale, eager = false, sizes }: { name: string; locale: Locale; eager?: boolean; sizes?: string }) {
  const p = PICS[name];
  return <picture>
    <source media="(max-width: 800px)" srcSet={src(name, 800)} />
    <img src={src(name, p.w)} width={p.w} height={p.h} alt={p.alt[locale]} sizes={sizes} loading={eager ? "eager" : "lazy"} decoding="async" />
  </picture>;
}

function Scene({ name, locale, inset = false }: { name: string; locale: Locale; inset?: boolean }) {
  return <figure className={"zgScene" + (inset ? " zgInset" : "")}><div className="zgFrame"><Pic name={name} locale={locale} /></div></figure>;
}

function Activity({ id, locale }: { id: ActivityId; locale: Locale }) {
  const a = (() => {
    switch (id) {
      case "barter": return <Barter locale={locale} />;
      case "stitch": return <Stitch locale={locale} />;
      case "assemble": return <Assemble locale={locale} />;
      case "motifs": return <MotifFamilies locale={locale} />;
      case "hat": return <Hat locale={locale} firstHref={`/${locale}/stories/${FIRST_STORY_SLUG}`} />;
      case "words": return <Words locale={locale} />;
      case "dress": return <Dress locale={locale} firstHref={`/${locale}/stories/${FIRST_STORY_SLUG}`} />;
    }
  })();
  return <div className={"zgGut zgAct zgAct-" + id}><div className="zgWide">{a}</div></div>;
}

function Block({ seg, locale }: { seg: BlockSeg; locale: Locale }) {
  if (seg.id === "scene" && seg.arg) return <Scene name={seg.arg} locale={locale} />;
  if (seg.id === "pic" && seg.arg) return <Scene name={seg.arg} locale={locale} inset />;
  return <Activity id={seg.id as ActivityId} locale={locale} />;
}

function Fact({ big, note }: { big: string; note: string }) {
  return <p className="zgFact"><span className="zgFactNum">{big}</span><span className="zgFactNote">{note}</span></p>;
}

/* ---------- magazine spreads: a chapter's text is laid out section by section (### = new section) */

type FactSeg = Extract<Seg, { kind: "fact" }>;
type Row = { facts: FactSeg[]; pic?: string; paras: string[] };
type Part = { kind: "row"; row: Row } | { kind: "quote"; text: string };
type Spread = { kind: "spread"; title?: string; lead: boolean; parts: Part[] } | { kind: "block"; seg: BlockSeg };

const QUOTE = /^\*\*([^*][\s\S]*?)\*\*$/;

function toSpreads(segs: Seg[]): Spread[] {
  const out: Spread[] = [];
  let cur: Extract<Spread, { kind: "spread" }> | null = null;
  const open = (title?: string) => { cur = { kind: "spread", title, lead: !title && out.length === 0, parts: [] }; out.push(cur); return cur; };
  const row = () => { const c = cur ?? open(); const last = c.parts[c.parts.length - 1]; if (last?.kind === "row") return last.row; const r: Row = { facts: [], paras: [] }; c.parts.push({ kind: "row", row: r }); return r; };
  for (const s of segs) {
    if (s.kind === "fact") { row().facts.push(s); continue; }
    if (s.kind === "block" && s.id === "pic" && s.arg) { const r = row(); if (r.pic || r.paras.length) (cur ?? open()).parts.push({ kind: "row", row: { facts: [], paras: [], pic: s.arg } }); else r.pic = s.arg; continue; }
    if (s.kind === "block") { out.push({ kind: "block", seg: s }); cur = null; continue; }
    for (const b of s.md.split(/\n\s*\n/)) {
      const t = b.trim(); if (!t) continue;
      if (t.startsWith("### ")) { open(t.slice(4).trim()); continue; }
      const q = t.match(QUOTE);
      if (q) { (cur ?? open()).parts.push({ kind: "quote", text: q[1] }); continue; }
      row().paras.push(t);
    }
  }
  return out;
}

function SpreadView({ sp, locale, side }: { sp: Extract<Spread, { kind: "spread" }>; locale: Locale; side: "l" | "r" }) {
  const rows = sp.parts.filter((p): p is Extract<Part, { kind: "row" }> => p.kind === "row").map((p) => p.row);
  const hasPic = rows.some((r) => r.pic), hasFact = rows.some((r) => r.facts.length);
  const variant = sp.lead ? "lead" : hasPic ? "pic" : hasFact ? "fact" : "plain";
  let titled = false;
  const title = () => { if (titled || !sp.title) return null; titled = true; return <h3 className="zgSub">{sp.title}</h3>; };
  return <div className={`zgGut zgSpread zgSp-${variant} zgSide-${side}`}><div className="zgWide">
    {variant === "plain" && title()}
    {sp.parts.map((p, i) => {
      if (p.kind === "quote") return <Reveal key={i}><p className="zgQuote"><span>{p.text}</span></p></Reveal>;
      const r = p.row, md = r.paras.join("\n\n");
      const facts = r.facts.map((f, k) => <Fact key={k} big={f.big} note={f.note} />);
      if (variant === "lead") {
        if (!facts.length) return <div key={i} className="zgRow zgRowLead zgProse"><Markdown>{md}</Markdown></div>;
        const [first, ...more] = r.paras;
        return <div key={i}>
          <div className="zgRow zgRowLead zgProse"><Markdown>{first}</Markdown></div>
          <div className="zgRow zgRowSplit zgLeadSplit"><div className="zgRail">{facts}</div><div className="zgMain zgProse"><Markdown>{more.join("\n\n")}</Markdown></div></div>
        </div>;
      }
      if (variant === "plain") return <div key={i} className={"zgRow zgProse " + (r.paras.length > 1 ? "zgTwoCol" : "zgOneCol")}><Markdown>{md}</Markdown></div>;
      const rail = variant === "pic"
        ? <>{r.pic ? <figure className="zgRailPic"><Pic name={r.pic} locale={locale} /></figure> : null}{facts}</>
        : <>{title()}{facts}</>;
      return <div key={i} className="zgRow zgRowSplit">
        <div className="zgRail">{rail}</div>
        <div className="zgMain zgProse">{variant === "pic" && title()}{md && <Markdown>{md}</Markdown>}</div>
      </div>;
    })}
  </div></div>;
}

function ChapterView({ ch, locale }: { ch: Chapter; locale: Locale }) {
  let n = 0;
  return <section className={"zgChap zgChap-" + ch.key} id={ch.key} aria-labelledby={`${ch.key}-h`}>
    {ch.cover?.kind === "block" && <Block seg={ch.cover} locale={locale} />}
    <div className="zgGut zgChapHead"><div className="zgWide" data-n={ch.label.match(/\d+/)?.[0] ?? ""}>
      <div className="zgLabel">{ch.label}</div>
      <h2 id={`${ch.key}-h`}>{ch.title}</h2>
      <span className="zgCouch" aria-hidden="true" />
    </div></div>
    {toSpreads(ch.segs).map((sp, i) => sp.kind === "block"
      ? <Block key={i} seg={sp.seg} locale={locale} />
      : <SpreadView key={i} sp={sp} locale={locale} side={(sp.title && n++ % 2) ? "r" : "l"} />)}
  </section>;
}

/** The epilogue on a dark ground: its prose, then the activity, then the closing line; the italic note goes below. */
function Finale({ ch, locale }: { ch: Chapter; locale: Locale }) {
  let note: string | null = null;
  const body: Seg[] = [];
  for (const s of ch.segs) {
    if (s.kind !== "text") { body.push(s); continue; }
    const kept: string[] = [];
    for (const b of s.md.split(/\n\s*\n/)) { const t = b.trim(); if (/^\*[^*][\s\S]*\*$/.test(t)) note = t; else kept.push(t); }
    if (kept.length) body.push({ kind: "text", md: kept.join("\n\n") });
  }
  return <>
    <section className="zgFin" id={ch.key} aria-labelledby={`${ch.key}-h`}>
      <div className="zgGut zgFinHead"><div className="zgCol">
        <div className="zgLabel">{ch.label}</div>
        <h2 id={`${ch.key}-h`}>{ch.title}</h2>
      </div></div>
      {body.map((s, i) => {
        if (s.kind === "block") return <Block key={i} seg={s} locale={locale} />;
        if (s.kind === "fact") return <div key={i} className="zgGut"><div className="zgCol"><Fact big={s.big} note={s.note} /></div></div>;
        const paras = s.md.split(/\n\s*\n/);
        return <div key={i} className="zgGut"><div className="zgCol">{paras.map((t, k) => {
          const q = t.match(QUOTE);
          return q ? <p key={k} className="zgLast">{q[1]}</p> : <div key={k} className="zgProse zgProseDark"><Markdown>{t}</Markdown></div>;
        })}</div></div>;
      })}
    </section>
    {note && <div className="zgGut zgNoteBox"><div className="zgCol"><Markdown>{note}</Markdown></div></div>}
  </>;
}

function Sources({ locale }: { locale: Locale }) {
  const u = UI[locale];
  return <section className="zgGut zgSources" aria-labelledby="zg-sources"><div className="zgCol">
    <h2 id="zg-sources" className="zgSourcesTitle">{u.sourcesTitle}</h2>
    <p className="zgSourcesLead">{u.sourcesLead}</p>
    <ol className="zgSourceList">
      {SOURCES.map((s) => <li key={s.url}>
        <span className="zgSrcAuthor">{s.author[locale]}.</span>{" "}
        <a href={s.url} target="_blank" rel="noopener" lang="ru">{s.title}</a>
        <span className="zgSrcWhere"> — {s.where[locale]}</span>
      </li>)}
    </ol>
  </div></section>;
}

function FirstStory({ locale }: { locale: Locale }) {
  const u = UI[locale];
  return <div className="zgGut zgFirst"><Link className="zgFirstCard zgWide" href={`/${locale}/stories/${FIRST_STORY_SLUG}`}>
    <span className="zgFirstPic" aria-hidden="true"><img src="/visuals/ossetian-headscarf/towers-solitude-800.webp" width={800} height={953} alt="" loading="lazy" decoding="async" /></span>
    <span className="zgFirstText">
      <span className="zgFirstEyebrow">{u.firstEyebrow}</span>
      <span className="zgFirstTitle"><span lang="os">Цыллæ хыз</span> · {u.firstTitle}</span>
      <span className="zgFirstLead">{u.firstText}</span>
      <span className="zgFirstCta">{u.firstCta} <span aria-hidden="true">→</span></span>
    </span>
  </Link></div>;
}

export default async function GoldThreadStoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const u = UI[locale];
  const chapters = loadStory(locale);
  const fin = chapters[chapters.length - 1];
  const hero = PICS[HERO.name];
  return <div className="zg">
    <StoryProgress />
    <section className="zgHero" aria-labelledby="zg-title">
      <picture className="zgHeroMedia" aria-hidden="true">
        <source media="(max-width: 800px)" srcSet={src(HERO.name, 800)} />
        <img src={src(HERO.name, hero.w)} width={hero.w} height={hero.h} alt="" fetchPriority="high" decoding="async" style={{ objectPosition: HERO.pos }} />
      </picture>
      <div className="zgHeroShade" aria-hidden="true" />
      <div className="zgGut zgHeroIn"><div className="zgWide">
        <div className="zgOrig" lang="os">{u.eyebrowOrig}</div>
        <h1 id="zg-title">{u.title}</h1>
        <p className="zgHeroSub">{u.sub}</p>
        <p className="zgLede">{u.lede}</p>
        <Link className="zgSequel" href={`/${locale}/stories/${FIRST_STORY_SLUG}`}>{u.sequel} <span aria-hidden="true">→</span></Link>
      </div></div>
      <div className="zgCue" aria-hidden="true"><span>{u.scroll}</span><i /></div>
    </section>
    {chapters.slice(0, -1).map((ch) => <ChapterView key={ch.key} ch={ch} locale={locale} />)}
    <Finale ch={fin} locale={locale} />
    <Sources locale={locale} />
    <FirstStory locale={locale} />
    <div className="zgSupport"><SupportNote locale={locale} /></div>
    <div className="zgGut zgEnd"><div className="zgCol"><Link className="zgBack" href={`/${locale}#courses`}>← {u.back}</Link></div></div>
  </div>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; if (!isLocale(locale)) return {};
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://miyu.academy").replace(/\/$/, "");
  const u = UI[locale], p = `/stories/${STORY_SLUG}`;
  return {
    title: u.metaTitle, description: u.metaDesc,
    alternates: { canonical: `${base}/${locale}${p}`, languages: { en: `${base}/en${p}`, ru: `${base}/ru${p}` } },
    openGraph: { title: u.metaTitle, description: u.metaDesc, url: `${base}/${locale}${p}`, siteName: "MIYU Academy", locale: locale === "ru" ? "ru_RU" : "en_US", type: "article", images: [{ url: `${base}${MEDIA}/og-${locale}.jpg`, width: 1200, height: 630, alt: u.title }] },
    twitter: { card: "summary_large_image", title: u.metaTitle, description: u.metaDesc, images: [`${base}${MEDIA}/og-${locale}.jpg`] },
  };
}
