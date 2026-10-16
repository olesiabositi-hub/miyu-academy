import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Forum, Literata, Manrope } from "next/font/google";
import { isLocale, type Locale } from "@/lib/course";
import { MEDIA, STORY_SLUG, UI } from "@/lib/content/ossetianHeadscarf";
import { loadStory, type Chapter, type Seg } from "@/lib/content/ossetianHeadscarfStory";
import { Markdown } from "@/components/Markdown";
import { Reveal } from "@/components/Reveal";
import { Craft, FinaleThreads, Gallery, HeroVideo, LightScene, MotionToggle, Motifs, Scene, StoryShell, ThreadPath, Touch, Weave, Year } from "@/components/OssetianStory";
import "./story.css";

const display = Forum({ weight: "400", subsets: ["latin", "cyrillic"], variable: "--cx-display", display: "swap" });
const body = Literata({ subsets: ["latin", "cyrillic"], variable: "--cx-body", display: "swap" });
const ui = Manrope({ weight: ["500", "600"], subsets: ["latin", "cyrillic"], variable: "--cx-ui", display: "swap" });

export function generateStaticParams() { return [{ locale: "ru" }, { locale: "en" }]; }

const LIGHT_QUOTE: Record<Locale, string> = {
  ru: "«Это не ослепительно белый, а мягкий, чуть тёплый оттенок — от светло-бежевого до жемчужного, иногда с золотистым отливом. Он меняется в зависимости от освещения».",
  en: "“It is not a dazzling white, but a soft, slightly warm shade—from pale beige to pearl, sometimes with a golden sheen. It changes with the light.”",
};

function Block({ seg, locale }: { seg: Extract<Seg, { kind: "block" }>; locale: Locale }) {
  switch (seg.id) {
    case "light": return <LightScene locale={locale} quote={LIGHT_QUOTE[locale]} />;
    case "scene": return seg.arg ? <Scene name={seg.arg} locale={locale} /> : null;
    case "path": return <ThreadPath locale={locale} />;
    case "weave": return <Weave locale={locale} />;
    case "touch": return <Touch locale={locale} />;
    case "year": return <Year locale={locale} />;
    case "motifs": return <div className="cxGut"><div className="cxCol"><Motifs locale={locale} /></div></div>;
    case "gallery": return <Gallery locale={locale} />;
    case "craft": return <Craft locale={locale} />;
    default: return null;
  }
}

function Text({ md }: { md: string }) {
  return <div className="cxGut"><Reveal className="cxCol cxProse"><Markdown>{md}</Markdown></Reveal></div>;
}

function ChapterView({ ch, locale }: { ch: Chapter; locale: Locale }) {
  return <section className={"cxChap cxChap-" + ch.key} id={ch.key} aria-labelledby={`${ch.key}-h`}>
    {ch.cover && ch.cover.kind === "block" && <Block seg={ch.cover} locale={locale} />}
    <div className="cxGut cxChapHead"><div className="cxCol" data-n={ch.label.match(/\d+/)?.[0] ?? ""}>
      <div className="cxNum">{ch.label}</div>
      <h2 id={`${ch.key}-h`}>{ch.title}</h2>
    </div></div>
    {ch.segs.map((s, i) => s.kind === "text" ? <Text key={i} md={s.md} /> : <Block key={i} seg={s} locale={locale} />)}
  </section>;
}

function Finale({ ch, locale }: { ch: Chapter; locale: Locale }) {
  const text = ch.segs.filter((s): s is Extract<Seg, { kind: "text" }> => s.kind === "text").map((s) => s.md).join("\n\n");
  const blocks = text.split(/\n\s*\n/);
  const noteAt = blocks.findIndex((b) => /^\*[^*].*\*$/.test(b.trim()));
  const note = noteAt >= 0 ? blocks.splice(noteAt, 1)[0] : null;
  const lastAt = blocks.findIndex((b) => /^\*\*.+\*\*$/.test(b.trim()));
  const last = lastAt >= 0 ? blocks.splice(lastAt, 1)[0].trim().replace(/^\*\*|\*\*$/g, "") : null;
  return <>
    <section className="cxFin" id={ch.key} aria-labelledby={`${ch.key}-h`}>
      <picture className="cxFinBg" aria-hidden="true">
        <source media="(max-width: 800px)" srcSet={`${MEDIA}/golden-hour-800.webp`} />
        <img src={`${MEDIA}/golden-hour-1600.webp`} width={1600} height={900} alt="" loading="lazy" decoding="async" />
      </picture>
      <FinaleThreads />
      <div className="cxGut cxFinIn"><div className="cxCol">
        <div className="cxNum">{ch.label}</div>
        <h2 id={`${ch.key}-h`}>{ch.title}</h2>
        <div className="cxProse cxProseDark"><Markdown>{blocks.join("\n\n")}</Markdown></div>
        {last && <p className="cxLast">{last}</p>}
      </div></div>
    </section>
    {note && <div className="cxGut cxNoteBox"><div className="cxCol"><Markdown>{note}</Markdown></div></div>}
  </>;
}

export default async function OssetianHeadscarfStory({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const u = UI[locale];
  const chapters = loadStory(locale);
  const fin = chapters[chapters.length - 1];
  return <div className={`${display.variable} ${body.variable} ${ui.variable}`}>
    <StoryShell>
      <section className="cxHero" aria-labelledby="cx-title">
        <picture className="cxHeroMedia" aria-hidden="true">
          <source media="(max-width: 800px)" srcSet={`${MEDIA}/hero-poster-800.webp`} />
          <img src={`${MEDIA}/hero-poster-1600.webp`} width={1600} height={900} alt="" fetchPriority="high" decoding="async" />
        </picture>
        <HeroVideo />
        <div className="cxHeroShade" aria-hidden="true" />
        <div className="cxGut cxHeroIn"><div className="cxWide">
          <div className="cxOrig" lang="os">{u.eyebrowOrig}</div>
          <h1 id="cx-title">{u.title}</h1>
          <p className="cxSub">{u.sub}</p>
          <p className="cxLede">{u.lede}</p>
          <MotionToggle locale={locale} />
        </div></div>
        <div className="cxCue" aria-hidden="true"><span>{u.scroll}</span><i /></div>
      </section>
      {chapters.slice(0, -1).map((ch) => <ChapterView key={ch.key} ch={ch} locale={locale} />)}
      <Finale ch={fin} locale={locale} />
      <div className="cxGut cxEnd"><div className="cxCol"><Link className="cxBack" href={`/${locale}#courses`}>← {u.back}</Link></div></div>
    </StoryShell>
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
