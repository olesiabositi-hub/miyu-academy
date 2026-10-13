import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { courseDashboardPath, getCourseBySlug, modulePath } from "@/lib/courses";
import { groupBold, isItalicLine, loadLanding, mergeShort, plain } from "@/lib/content/landing";
import { Markdown } from "@/components/Markdown";
import { Reveal } from "@/components/Reveal";
import { t } from "@/lib/i18n";

const SLUG = "norse-mythology";
const IMG = (name: string) => ({ src: `/visuals/norse/home/${name}-1448.webp`, src960: `/visuals/norse/home/${name}-960.webp` });

function Picture({ name, alt = "", lazy = true }: { name: string; alt?: string; lazy?: boolean }) {
  const i = IMG(name);
  return <picture>
    <source media="(max-width: 700px)" srcSet={i.src960} />
    <img src={i.src} width={1448} height={1086} alt={alt} loading={lazy ? "lazy" : undefined} decoding="async" />
  </picture>;
}

/** Card art per module (module 1 uses its own lesson illustration). */
const MODULE_ART: Record<number, { src: string; src480: string; alt: Record<"ru" | "en", string> }> = {
  1: { src: "/visuals/norse/m01/01-ginnungagap-724.webp", src480: "/visuals/norse/m01/01-ginnungagap-724.webp", alt: { ru: "Гиннунгагап: лёд и огонь", en: "Ginnungagap: ice and fire" } },
  2: { src: "/visuals/norse/art/02-asgard-960.webp", src480: "/visuals/norse/art/02-asgard-480.webp", alt: { ru: "Асгард и мост Биврёст", en: "Asgard and the Bifröst bridge" } },
  3: { src: "/visuals/norse/art/03-odin-960.webp", src480: "/visuals/norse/art/03-odin-480.webp", alt: { ru: "Один на троне с воронами и волками", en: "Odin on his throne with ravens and wolves" } },
  4: { src: "/visuals/norse/art/04-thor-960.webp", src480: "/visuals/norse/art/04-thor-480.webp", alt: { ru: "Тор с молотом Мьёльнир в грозу", en: "Thor with Mjölnir in a thunderstorm" } },
  5: { src: "/visuals/norse/art/05-loki-960.webp", src480: "/visuals/norse/art/05-loki-480.webp", alt: { ru: "Локи с зелёной магией", en: "Loki wreathed in green magic" } },
  6: { src: "/visuals/norse/art/06-freyja-960.webp", src480: "/visuals/norse/art/06-freyja-480.webp", alt: { ru: "Фрейя на колеснице, запряжённой рысями", en: "Freyja in her lynx-drawn chariot" } },
  7: { src: "/visuals/norse/art/08-fenrir-960.webp", src480: "/visuals/norse/art/08-fenrir-480.webp", alt: { ru: "Волк Фенрир на фоне луны", en: "The wolf Fenrir before the moon" } },
  8: { src: "/visuals/norse/art/09-valkyries-960.webp", src480: "/visuals/norse/art/09-valkyries-480.webp", alt: { ru: "Валькирии у ворот Вальгаллы", en: "Valkyries riding to Valhalla" } },
  9: { src: "/visuals/norse/art/10-ragnarok-960.webp", src480: "/visuals/norse/art/10-ragnarok-480.webp", alt: { ru: "Рагнарёк: последняя битва", en: "Ragnarök: the last battle" } },
};

/** Course page for Norse Mythology: approved copy from content/norse-mythology/landing/, laid out with its five illustrations. */
export default async function NorsePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const course = getCourseBySlug(SLUG);
  if (!course || course.status !== "live") notFound();
  const ru = locale === "ru";
  const doc = loadLanding(course.contentDir, locale);
  const [world, discover, programme, vikings, learn, audience, finale] = doc.sections;
  const dashboard = courseDashboardPath(locale, course);
  const hero = course.hero!;

  const tagline = doc.hero[0] ?? "";
  const factsLine = doc.hero.find((b, i) => i > 0 && /^\*\*.*·.*\*\*$/.test(b)) ?? "";
  const ctaLabel = (doc.hero.find((b) => b.startsWith("**[")) ?? "").replace(/^\*\*\[(.+)\]\*\*$/, "$1");
  const heroNote = plain(doc.hero.find((b) => isItalicLine(b)) ?? "");
  const leadBlocks = doc.hero.filter((b) => b !== tagline && b !== factsLine && !b.startsWith("**[") && !isItalicLine(b));

  const disc = groupBold(discover.blocks, 1);
  const learnG = groupBold(learn.blocks, 1);
  const finaleCta = (finale.blocks.find((b) => b.startsWith("**[")) ?? "").replace(/^\*\*\[(.+)\]\*\*$/, "$1");
  const finaleBody = finale.blocks.filter((b) => !b.startsWith("**[") && !b.startsWith("**MIYU"));
  const finaleBold = finaleBody.filter((b) => /^\*\*[^*].*\*\*$/.test(b));
  const finaleText = finaleBody.filter((b) => !finaleBold.includes(b) && !isItalicLine(b));
  const finaleNote = plain(finaleBody.find((b) => isItalicLine(b)) ?? "");
  const brand = finale.blocks.find((b) => b.startsWith("**MIYU")) ?? "";

  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const courseLd = { "@context": "https://schema.org", "@type": "Course", name: course.title[locale], description: course.blurb?.[locale], inLanguage: locale, provider: { "@type": "Organization", name: "MIYU Academy", url: base || undefined }, url: `${base}/${locale}/courses/${SLUG}` };

  return <div className="hx nl">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd).replace(/</g, "\\u003c") }} />

    <section className="hxHero hxHeroCourse nlHero">
      <picture className="hxHeroArt" aria-hidden="true">
        <source media="(max-width: 800px)" srcSet={hero.src960} />
        <img src={hero.src} width={hero.width} height={hero.height} alt="" fetchPriority="high" decoding="async" style={{ objectPosition: hero.pos }} />
      </picture>
      <div className="hxHeroFx" aria-hidden="true">
        <span className="hxFx hxFxMist hxFxMistA" />
        <span className="hxFx hxFxMist hxFxMistB" />
        {[8, 17, 29, 38, 52, 61, 73, 84, 92].map((x, i) => <i key={x} className="hxMote" style={{ left: `${x}%`, animationDelay: `${-i * 2.3}s`, animationDuration: `${16 + (i % 4) * 4}s` }} />)}
      </div>
      <div className="hxHeroShade" aria-hidden="true" />
      <div className="hxWrap hxHeroInner">
        <div className="hxHeroCopy">
          <div className="lxEyebrow lxEyebrowGold">MIYU ACADEMY · {ru ? "ОНЛАЙН-КУРС" : "ONLINE COURSE"}</div>
          <h1 className="hxH1">{doc.title}</h1>
          <p className="hxLead">{plain(tagline)}</p>
          <div className="hxActions">
            <Link className="lxBtn lxBtnGold" href={dashboard}>{ctaLabel} <span aria-hidden="true">→</span></Link>
            <a className="hxTextLink" href="#modules">{programme.heading.split(".")[0]} <span aria-hidden="true">↓</span></a>
          </div>
          <ul className="hxFacts hxFactsHero" aria-label={ru ? "Информация о курсе" : "Course facts"}>
            {plain(factsLine).split(" · ").map((f) => <li key={f}><span>{f}</span></li>)}
          </ul>
          {heroNote && <p className="nlHeroNote">{heroNote}</p>}
        </div>
      </div>
    </section>

    <section className="hxSection nlIntro">
      <div className="hxWrap">
        <Reveal><div className="nlLead">{[leadBlocks[0], ...mergeShort(leadBlocks.slice(1))].filter(Boolean).map((b, i) => <Markdown key={i}>{b}</Markdown>)}</div></Reveal>
      </div>
    </section>

    <section className="hxSection">
      <div className="hxWrap nlSplit">
        <Reveal>
          <h2 className="hxH2">{world.heading}</h2>
          <div className="nlProse">{mergeShort(world.blocks).map((b, i) => <Markdown key={i}>{b}</Markdown>)}</div>
        </Reveal>
        <Reveal delay={90}><figure className="nlArt"><Picture name="creation" /></figure></Reveal>
      </div>
    </section>

    <section className="hxSection nlDiscover">
      <div className="hxWrap nlSplit nlSplitRev">
        <Reveal><figure className="nlArt"><Picture name="asgard" /></figure></Reveal>
        <Reveal delay={90}>
          <h2 className="hxH2">{discover.heading}</h2>
          <ul className="nlFeatures">
            {disc.items.map((it) => <li key={it.title}><h3>{it.title}</h3>{it.body.map((b, i) => <Markdown key={i}>{b}</Markdown>)}</li>)}
          </ul>
          {disc.outro.map((b, i) => <div className="nlAside" key={i}><Markdown>{b}</Markdown></div>)}
        </Reveal>
      </div>
    </section>

    <section id="modules" className="hxSection">
      <div className="hxWrap">
        <div className="nlModulesHead">
          <h2 className="hxH2">{programme.heading}</h2>
          <div className="nlProse">{mergeShort(programme.blocks).map((b, i) => <Markdown key={i}>{b}</Markdown>)}</div>
        </div>
        <div className="nlModules">
          {programme.subs.map((sub, i) => {
            const mod = course.modules[i];
            const art = MODULE_ART[i + 1];
            const [num, ...titleParts] = sub.heading.split(/\.\s+/);
            const title = titleParts.join(". ");
            const notes = sub.blocks.filter(isItalicLine);
            const text = mergeShort(sub.blocks.filter((b) => !isItalicLine(b)), 400, 600);
            const open = !!mod && !mod.soon;
            const card = <>
              <span className="nlModArt">
                {art && <picture>
                  <source media="(max-width: 640px)" srcSet={art.src} />
                  <img src={art.src480} srcSet={`${art.src480} 480w, ${art.src} 960w`} sizes="(max-width: 900px) 50vw, 380px" width={960} height={720} alt={art.alt[locale]} loading="lazy" decoding="async" />
                </picture>}
                <span className="nlModNum">{num}</span>
              </span>
              <span className="nlModBody">
                <h3>{title}</h3>
                <span className="nlModText">{text.map((b, k) => <Markdown key={k}>{b}</Markdown>)}</span>
                {notes.map((n, k) => <span className="nlModNote" key={k}>{plain(n)}</span>)}
                <span className={"nlModStatus" + (open ? " is-open" : "")}>{open ? <>{t(locale, "nl.read")} <span aria-hidden="true">→</span></> : t(locale, "dash.statusSoon")}</span>
              </span>
            </>;
            return <Reveal key={sub.heading}>
              {open && mod
                ? <Link className="nlModule is-open" href={modulePath(locale, mod.id, course)}>{card}</Link>
                : <div className="nlModule is-soon" aria-disabled="true">{card}</div>}
            </Reveal>;
          })}
        </div>
      </div>
    </section>

    <section className="hxSection nlVikings">
      <div className="hxWrap nlSplit">
        <Reveal>
          <h2 className="hxH2">{vikings.heading}</h2>
          <div className="nlProse">{mergeShort(vikings.blocks).map((b, i) => <Markdown key={i}>{b}</Markdown>)}</div>
        </Reveal>
        <Reveal delay={90}><figure className="nlArt"><Picture name="runes" /></figure></Reveal>
      </div>
    </section>

    <section className="hxSection hxHow">
      <div className="hxWrap">
        <Reveal><h2 className="hxH2">{learn.heading}</h2></Reveal>
        <ul className="nlLearn">
          {learnG.items.map((it, i) => <li key={it.title}><span className="nlLearnNum">{String(i + 1).padStart(2, "0")}</span><h3>{it.title}</h3>{it.body.map((b, k) => <Markdown key={k}>{b}</Markdown>)}</li>)}
        </ul>
        <div className="nlProse nlLearnOutro">{mergeShort(learnG.outro).map((b, i) => <Markdown key={i}>{b}</Markdown>)}</div>
      </div>
    </section>

    <section className="hxSection">
      <div className="hxWrap nlSplit nlSplitRev">
        <Reveal><figure className="nlArt"><picture>
          <source media="(max-width: 700px)" srcSet="/visuals/norse/art/01-yggdrasil-480.webp" />
          <img src="/visuals/norse/art/01-yggdrasil-960.webp" width={960} height={720} alt="" loading="lazy" decoding="async" />
        </picture></figure></Reveal>
        <Reveal delay={90}>
          <h2 className="hxH2">{audience.heading}</h2>
          <div className="nlProse">{mergeShort(audience.blocks).map((b, i) => <Markdown key={i}>{b}</Markdown>)}</div>
        </Reveal>
      </div>
    </section>

    <section className="hxSection nlFinale">
      <div className="hxWrap nlSplit">
        <Reveal>
          <h2 className="hxH2 hxH2Light">{finale.heading}</h2>
          <div className="nlFinaleText">{mergeShort(finaleText).map((b, i) => <Markdown key={i}>{b}</Markdown>)}</div>
          {finaleBold.map((b, i) => <p className="nlFinaleAsk" key={i}>{plain(b)}</p>)}
          <Link className="lxBtn lxBtnGold" href={dashboard}>{finaleCta} <span aria-hidden="true">→</span></Link>
          {finaleNote && <p className="nlHeroNote">{finaleNote}</p>}
          {brand && <p className="nlBrand">{plain(brand)}</p>}
        </Reveal>
        <Reveal delay={90}><figure className="nlArt"><Picture name="ragnarok" /></figure></Reveal>
      </div>
    </section>
  </div>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const course = getCourseBySlug(SLUG);
  if (!isLocale(locale) || !course) return {};
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = `${base}/${locale}/courses/${SLUG}`;
  const description = locale === "ru"
    ? "Девять миров. Боги с сомнительными решениями. Конец света неизбежен. Курс MIYU Academy из девяти модулей по скандинавской мифологии."
    : "Nine worlds. Gods with questionable judgment. The end of the world is inevitable. A nine-module MIYU Academy course on Norse mythology.";
  return {
    title: `${course.title[locale]} | MIYU Academy`,
    description,
    alternates: { canonical: url, languages: { en: `${base}/en/courses/${SLUG}`, ru: `${base}/ru/courses/${SLUG}` } },
    openGraph: { title: course.title[locale], description, url, siteName: "MIYU Academy", locale: locale === "ru" ? "ru_RU" : "en_US", type: "website", images: [{ url: base + "/visuals/norse/home/hero-1916.webp", width: 1916, height: 821 }] },
    twitter: { card: "summary_large_image", title: course.title[locale], description },
  };
}
