import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import type { Locale } from "@/lib/course";
import { courseDashboardPath, getCourseBySlug, modulePath } from "@/lib/courses";
import { mergeShort } from "@/lib/content/landing";
import { Markdown } from "@/components/Markdown";
import { Reveal } from "@/components/Reveal";
import { CourseTheme } from "@/components/CourseTheme";
import { HeroVideo } from "@/components/HeroVideo";
import { t } from "@/lib/i18n";

const SLUG = "ancient-egypt";
const HOME = "/visuals/egypt/home";

/** Approved course-page copy (content/egyptian-mythology/landing/landing.<locale>.md): "## Блок NN. Label" + "### Heading" + text + "**Кнопка:** …". */
type Block = { label: string; heading: string; body: string[]; button: string | null };
function loadBlocks(locale: Locale): { title: string; blocks: Block[] } {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", "egyptian-mythology", "landing", `landing.${locale}.md`), "utf8").replace(/\r\n/g, "\n");
  const title = raw.match(/^#\s+(.+)$/m)?.[1].trim() ?? "";
  const blocks = raw.split(/\n(?=##\s)/).slice(1).map((chunk) => {
    const label = (chunk.match(/^##\s+(?:Блок|Block)\s+\d+\.\s+(.+)$/m)?.[1] ?? "").trim();
    const heading = (chunk.match(/^###\s+(.+)$/m)?.[1] ?? "").trim();
    const paras = chunk.replace(/^##\s+.+$/m, "").replace(/^###\s+.+$/m, "").replace(/^-{3,}\s*$/gm, "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
    const btn = paras.find((b) => /^\*\*(?:Кнопка|Button):\*\*/.test(b)) ?? null;
    return { label, heading, body: paras.filter((b) => b !== btn), button: btn ? btn.replace(/^\*\*(?:Кнопка|Button):\*\*\s*/, "").trim() : null };
  });
  return { title, blocks };
}

function Art({ name, alt }: { name: string; alt: string }) {
  return <figure className="egArt">
    <picture>
      <source media="(max-width: 760px)" srcSet={`${HOME}/${name}-960.webp`} />
      <img src={`${HOME}/${name}-1672.webp`} width={1672} height={941} alt={alt} loading="lazy" decoding="async" />
    </picture>
  </figure>;
}

const ART: Record<number, { name: string; alt: Record<Locale, string> }> = {
  1: { name: "02-ra-solar-barque-at-dawn", alt: { ru: "Ра в солнечной ладье на рассвете", en: "Ra in the solar barque at dawn" } },
  2: { name: "03-golden-judgment-in-egyptian-temple", alt: { ru: "Зал суда в храме", en: "The hall of judgment in a temple" } },
  3: { name: "05-golden-age-of-pyramid-builders", alt: { ru: "Строители у пирамиды", en: "Builders at a pyramid" } },
  4: { name: "08-archaeologists-and-gilded-sarcophagus", alt: { ru: "Археологи изучают позолоченный саркофаг", en: "Archaeologists examine a gilded sarcophagus" } },
  5: { name: "07-sunset-journey-to-egyptian-temple", alt: { ru: "Путешественница идёт к храму на закате", en: "A traveller walks to a temple at sunset" } },
};

/** Card art per module: the module's first chapter picture (4:3). */
const MODULE_ART: Record<number, string> = {
  1: "/visuals/egypt/m01/01-nun-and-first-mound",
  2: "/visuals/egypt/m02/01-osiris-king-of-the-nile",
  3: "/visuals/egypt/m03/03-ch02-ra-daytime-solar-barque",
  4: "/visuals/egypt/m04/01-weighing-of-the-heart",
  5: "/visuals/egypt/m05/02-construction-overlook",
  6: "/visuals/egypt/m06/01-tutankhamun-tomb-discovery",
};

/** Text of a landing block: lines of one sentence each are set together as paragraphs; bold lines stay apart. */
function Body({ blocks, className = "egProse" }: { blocks: string[]; className?: string }) {
  return <div className={className}>{mergeShort(blocks, 160, 520).map((b, i) => <Markdown key={i}>{b}</Markdown>)}</div>;
}

export default async function EgyptPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const course = getCourseBySlug(SLUG);
  if (!course || course.status !== "live") notFound();
  const ru = locale === "ru";
  const { title, blocks } = loadBlocks(locale);
  const [hero, gods, death, build, mystery, finale] = blocks;
  const dashboard = courseDashboardPath(locale, course);
  const [titleMain, titleSub] = title.split(": ");
  const facts = ru ? ["6 модулей", "RU / EN", "Проверки и игры по желанию"] : ["6 modules", "RU / EN", "Optional checks and games"];
  const totalMin = course.modules.reduce((a, m) => a + m.duration[0], 0);
  const hours = (Math.round(totalMin / 60 * 2) / 2).toLocaleString(ru ? "ru-RU" : "en-GB");

  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const courseLd = { "@context": "https://schema.org", "@type": "Course", name: course.title[locale], description: course.blurb?.[locale], inLanguage: locale, provider: { "@type": "Organization", name: "MIYU Academy", url: base || undefined }, url: `${base}/${locale}/courses/${SLUG}` };

  const Split = ({ b, art, rev, dark }: { b: Block; art: number; rev?: boolean; dark?: boolean }) =>
    <section className={"hxSection egSplitSec" + (dark ? " egDark" : "")}>
      <div className={"hxWrap egSplit" + (rev ? " egSplitRev" : "")}>
        <Reveal>
          {b.label && <div className="lxEyebrow egEyebrow">{b.label}</div>}
          <h2 className="hxH2 egH2">{b.heading}</h2>
          <Body blocks={b.body.filter((x) => !/^\*\*[^*].*\*\*$/.test(x))} />
          {b.body.filter((x) => /^\*\*[^*].*\*\*$/.test(x)).map((x, i) => <p className="egAsk" key={i}>{x.replace(/^\*\*|\*\*$/g, "")}</p>)}
          {b.button && <Link className="lxBtn lxBtnGold egBtn" href={dark ? "#modules" : dashboard}>{b.button} <span aria-hidden="true">→</span></Link>}
        </Reveal>
        <Reveal delay={90}><Art name={ART[art].name} alt={ART[art].alt[locale]} /></Reveal>
      </div>
    </section>;

  return <div className="hx eg">
    <CourseTheme course={course} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd).replace(/</g, "\\u003c") }} />

    <section className="egHero" aria-labelledby="eg-title">
      <HeroVideo
        sources={[{ src: `${HOME}/hero-1280.mp4`, media: "(max-width: 900px)" }, { src: `${HOME}/hero-1920.mp4` }]}
        poster={`${HOME}/hero-poster-1920.webp`} posterSmall={`${HOME}/hero-poster-960.webp`}
        pauseLabel={ru ? "Остановить видео" : "Pause video"} playLabel={ru ? "Включить видео" : "Play video"} />
      <div className="egHeroShade" aria-hidden="true" />
      <div className="hxWrap egHeroInner">
        <div className="egHeroCopy">
          <div className="lxEyebrow lxEyebrowGold">MIYU ACADEMY · {ru ? "ОНЛАЙН-КУРС" : "ONLINE COURSE"}</div>
          <h1 className="hxH1 egH1" id="eg-title">{titleMain}{titleSub && <span>{titleSub}</span>}</h1>
          <p className="egHeroHeading">{hero.heading}</p>
          <Body blocks={hero.body} className="egHeroLead" />
          <div className="hxActions">
            <Link className="lxBtn lxBtnGold" href={dashboard}>{hero.button} <span aria-hidden="true">→</span></Link>
            <a className="hxTextLink" href="#modules">{ru ? "Программа курса" : "Course programme"} <span aria-hidden="true">↓</span></a>
          </div>
          <ul className="egFacts" aria-label={ru ? "О курсе" : "About the course"}>{facts.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      </div>
    </section>

    <Split b={gods} art={1} />
    <Split b={death} art={2} rev />
    <Split b={build} art={3} />
    <Split b={mystery} art={4} rev dark />

    <section id="modules" className="hxSection egModulesSec">
      <div className="hxWrap">
        <div className="egModulesHead">
          <div className="lxEyebrow lxEyebrowGold">{ru ? "ПРОГРАММА КУРСА" : "COURSE PROGRAMME"}</div>
          <h2 className="hxH2 egH2">{ru ? "Шесть модулей" : "Six modules"}</h2>
          <p className="egModulesLead">{ru ? `Около ${hours} часов чтения, разбитых на главы. В каждом модуле — иллюстрации, быстрые проверки и игры. Проходите в своём темпе.` : `About ${hours} hours of reading, split into chapters. Every module has illustrations, quick checks and games. Go at your own pace.`}</p>
        </div>
        <ol className="egModules">
          {course.modules.map((m) => {
            const art = MODULE_ART[m.order];
            return <li key={m.id}><Reveal>
              <Link className="egModule" href={modulePath(locale, m.id, course)}>
                <span className="egModArt">
                  <img src={`${art}-724.webp`} srcSet={`${art}-724.webp 724w, ${art}-1448.webp 1448w`} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 380px" width={724} height={543} alt="" loading="lazy" decoding="async" />
                  <span className="egModNum">{String(m.order).padStart(2, "0")}</span>
                </span>
                <span className="egModBody">
                  <h3>{m.title[locale]}</h3>
                  <span className="egModText">{m.teaser[locale]}</span>
                  <span className="egModMeta"><span>{m.duration[0]}–{m.duration[1]} {ru ? "мин" : "min"}</span><span className="egModGo">{t(locale, "nl.read")} <span aria-hidden="true">→</span></span></span>
                </span>
              </Link>
            </Reveal></li>;
          })}
        </ol>
      </div>
    </section>

    <section className="hxSection egHow" id="how-it-works">
      <div className="hxWrap">
        <Reveal>
          <div className="lxEyebrow">{ru ? "КАК ПРОХОДИТ КУРС" : "HOW THE COURSE WORKS"}</div>
          <h2 className="hxH2 egH2">{ru ? "Читать, смотреть, играть" : "Read, look, play"}</h2>
        </Reveal>
        <ul className="egHowList">
          {(ru ? [
            ["Весы Маат", "Положите утверждение на весы: правда уравновесит перо, миф потянет чашу вниз."],
            ["Ладья Ра", "Расставьте события по порядку — от первых богов до Великой пирамиды."],
            ["Кто есть кто", "Соедините богов и героев мифа с их ролями и символами."],
            ["Картуш", "Напишите своё имя египетскими знаками в царской рамке."],
          ] : [
            ["The scales of Ma'at", "Put a statement on the scales: truth balances the feather, a myth drags the pan down."],
            ["Ra's barque", "Put events in order, from the first gods to the Great Pyramid."],
            ["Who is who", "Match the gods and heroes of the myths with their roles and symbols."],
            ["Cartouche", "Write your name in Egyptian signs inside a royal frame."],
          ]).map(([h, b], i) => <li key={h}><span className="egHowNum">{String(i + 1).padStart(2, "0")}</span><h3>{h}</h3><p>{b}</p></li>)}
        </ul>
        <p className="egHowNote">{ru ? "Все игры и проверки — по желанию: без баллов, без таймера. Чтобы сохранять прогресс, войдите в аккаунт — это бесплатно." : "All games and checks are optional: no points, no timer. To keep your progress, sign in: it is free."}</p>
      </div>
    </section>

    <section className="hxSection egFinale">
      <div className="hxWrap egSplit">
        <Reveal>
          <h2 className="hxH2 egH2 egH2Light">{finale.heading}</h2>
          <Body blocks={finale.body.filter((x) => !/^\*\*[^*].*\*\*$/.test(x))} className="egProse egProseLight" />
          {finale.body.filter((x) => /^\*\*[^*].*\*\*$/.test(x)).map((x, i) => <p className="egAsk egAskLight" key={i}>{x.replace(/^\*\*|\*\*$/g, "")}</p>)}
          {finale.button && <Link className="lxBtn lxBtnGold" href={dashboard}>{finale.button} <span aria-hidden="true">→</span></Link>}
        </Reveal>
        <Reveal delay={90}><Art name={ART[5].name} alt={ART[5].alt[locale]} /></Reveal>
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
  const description = course.blurb?.[locale] ?? "";
  return {
    title: `${course.title[locale]} | MIYU Academy`,
    description,
    alternates: { canonical: url, languages: { en: `${base}/en/courses/${SLUG}`, ru: `${base}/ru/courses/${SLUG}` } },
    openGraph: { title: course.title[locale], description, url, siteName: "MIYU Academy", locale: locale === "ru" ? "ru_RU" : "en_US", type: "website", images: [{ url: base + `${HOME}/10-starlit-nile-beneath-the-pyramids-1672.webp`, width: 1672, height: 941 }] },
    twitter: { card: "summary_large_image", title: course.title[locale], description },
  };
}
