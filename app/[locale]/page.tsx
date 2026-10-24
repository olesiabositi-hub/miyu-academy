import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/course";
import { isLocale } from "@/lib/course";
import { COURSES, LIVE_COURSES, courseBasePath, getCourse, modulePath } from "@/lib/courses";
import { STORIES, storyPath } from "@/lib/stories";
import { AUTHOR } from "@/lib/content/home";
import { ACTS, EXHIBITS, HOME, HOME_FAQ, PANELS, ROUTES, SPREADS, STEPS3, STORY_ART, type ActKind } from "@/lib/content/museum";
import { SUPPORT_URL } from "@/lib/links";
import { HeroPanels } from "@/components/home/HeroPanels";
import { Exhibit } from "@/components/home/Exhibit";
import { ContinueBand } from "@/components/home/ContinueBand";
import { Reveal } from "@/components/Reveal";

/** Where a home-page reference points: a module, a course page or a story. */
function hrefOf(locale: Locale, r: { course?: string; story?: string; module?: string }): string {
  if (r.story) { const st = STORIES.find((s) => s.id === r.story); return st ? storyPath(locale, st) : `/${locale}`; }
  const course = r.course ? getCourse(r.course) : undefined;
  if (!course) return `/${locale}#courses`;
  return r.module ? modulePath(locale, r.module, course) : courseBasePath(locale, course);
}

function ActIcon({ kind }: { kind: ActKind }) {
  const p = { width: 28, height: 28, viewBox: "0 0 28 28", fill: "none", stroke: "currentColor", strokeWidth: 1.3, "aria-hidden": true } as const;
  if (kind === "scales") return <svg {...p}><path d="M14 4v20M7 24h14M5 8h18M5 8l-3 7h6zM23 8l-3 7h6z" /></svg>;
  if (kind === "cartouche") return <svg {...p}><rect x="8" y="3" width="12" height="19" rx="6" /><path d="M6 25h16M12 8h4M14 12v4M11 18h6" /></svg>;
  if (kind === "rune") return <svg {...p}><path d="M14 3v22M14 13l-7-8M14 13l7-8" /></svg>;
  return <svg {...p}><path d="M3 20c4-10 7-10 9 0s6 10 9 0 3-8 4-8" /><circle cx="5" cy="8" r="2.5" /></svg>;
}

function Facts({ items }: { items: { v: string; l: string }[] }) {
  return <ul className="muFacts">{items.map((f) => <li key={f.l}><b>{f.v}</b><span>{f.l}</span></li>)}</ul>;
}

export default async function AcademyHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const c = HOME[locale];
  const story = STORIES[STORIES.length - 1];
  const firstStory = STORIES.length > 1 ? STORIES[0] : null;
  const art = STORY_ART[story.id];
  const storyNum = PANELS.find((p) => p.ref.story === story.id)?.num ?? "";
  const newest = LIVE_COURSES[LIVE_COURSES.length - 1];
  const others = LIVE_COURSES.filter((x) => x.id !== newest.id);
  const faq = HOME_FAQ[locale];
  const author = AUTHOR[locale];
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })) };

  const spreadFacts = (id: string) => (SPREADS[id]?.facts ?? []).map((f) => ({ v: f.v[locale], l: f.l[locale] }));
  const titleParts = (id: string) => { const cr = getCourse(id)!; const [main, sub] = cr.title[locale].split(": "); return { main, sub }; };

  return <div className="mu">
    <span className="themeMark theme-museum" hidden aria-hidden="true" />
    <ContinueBand locale={locale} hello={c.continueHello} cta={c.continueBtn} doneLabel={c.continueDone} moduleOf={c.moduleOf} />

    {/* ── Hero ── */}
    <section className="muHero" aria-labelledby="mu-title">
      <div className="muWrap muHeroHead">
        <div className="muHeroTitle">
          <div className="muEyebrow">{c.kicker}</div>
          <h1 id="mu-title">{c.h1a}<br /><i>{c.h1b}</i></h1>
        </div>
        <div className="muHeroAside">
          <p>{c.lead}</p>
          <div className="muActions">
            <Link className="muBtn" href="#courses">{c.choose} <span aria-hidden="true">→</span></Link>
            <Link className="muLink" href="#how">{c.how}</Link>
          </div>
        </div>
      </div>
      <HeroPanels initial={2} panels={PANELS.map((p) => ({ num: p.num, href: hrefOf(locale, p.ref), title: p.title[locale], meta: p.meta[locale], src: p.img.src, src960: p.img.src960, pos: p.img.pos }))} />
      <ul className="muWrap muStrip">{c.strip.map((s) => <li key={s}>{s}</li>)}</ul>
    </section>

    {/* ── Why ── */}
    <section className="muSection muWhy">
      <div className="muWrap muSplit">
        <div className="muEyebrow muSide">{c.whyEyebrow}</div>
        <div className="muMain">
          <p className="muManifesto">{c.why[0]}<i>{c.why[1]}</i>{c.why[2]}</p>
          <ul className="muPillars">{c.pillars.map((p) => <li key={p.t}><b>{p.t}</b><span>{p.b}</span></li>)}</ul>
        </div>
      </div>
    </section>

    {/* ── Courses ── */}
    <section className="muCourses" id="courses" aria-labelledby="mu-courses">
      <div className="muWrap muHead">
        <div><div className="muEyebrow">{c.coursesEyebrow}</div><h2 className="muH2" id="mu-courses">{c.coursesTitle}</h2></div>
        <p>{c.coursesLead}</p>
      </div>

      {(() => {
        const s = SPREADS[newest.id]; const { main, sub } = titleParts(newest.id);
        return <article className="muFeature">
          <picture className="muPlate muFeatureArt">
            {s.img.src960 && <source media="(max-width: 860px)" srcSet={s.img.src960} />}
            <img src={s.img.src} alt="" style={{ objectPosition: s.img.pos }} loading="lazy" decoding="async" />
            <span className="muTag">{c.newCourse}</span>
          </picture>
          <Reveal className="muWrap muFeatureText">
            <div className="muFeatureHead">
              <span className="muOutline" aria-hidden="true">{s.num}</span>
              <div><h3 className="muH3xl">{main}</h3>{sub && <div className="muSub">{sub}</div>}</div>
            </div>
            <div className="muFeatureBody">
              <p className="muLeadText">{newest.blurb?.[locale]}</p>
              <Facts items={spreadFacts(newest.id)} />
              <Link className="muBtn" href={courseBasePath(locale, newest)}>{c.open} <span aria-hidden="true">→</span></Link>
            </div>
          </Reveal>
        </article>;
      })()}

      {others.map((cr, i) => {
        const s = SPREADS[cr.id]; const { main, sub } = titleParts(cr.id);
        if (!s) return null;
        return <article className={"muSpread" + (i % 2 ? " is-flip" : "")} key={cr.id}>
          <picture className="muPlate muSpreadArt">
            {s.img.src960 && <source media="(max-width: 860px)" srcSet={s.img.src960} />}
            <img src={s.img.src} alt="" style={{ objectPosition: s.img.pos }} loading="lazy" decoding="async" />
          </picture>
          <Reveal className="muSpreadText">
            <span className="muOutline muOutlineSm" aria-hidden="true">{s.num}</span>
            <div className="muEyebrow">{c.onlineCourse}</div>
            <h3 className="muH3">{main}</h3>
            {sub ? <><div className="muSub">{sub}</div><p>{cr.blurb?.[locale]}</p></> : <p className="muQuote">{cr.blurb?.[locale]}</p>}
            <Facts items={spreadFacts(cr.id)} />
            <div><Link className="muLink" href={courseBasePath(locale, cr)}>{c.open} <span aria-hidden="true">→</span></Link></div>
          </Reveal>
        </article>;
      })}
    </section>

    {/* ── Visual story ── */}
    <section className="muSection muDeep" id="story" aria-labelledby="mu-story">
      <div className="muWrap">
        <div className="muHead muStoryHead">
          <div className="muFeatureHead">
            <span className="muOutline" aria-hidden="true">{storyNum}</span>
            <div>
              <div className="muEyebrow">{c.visualStory}</div>
              {story.original && <div className="muOrig" lang="os">{story.original}</div>}
              <h2 className="muH3xl" id="mu-story">{story.title[locale]}</h2>
            </div>
          </div>
          <div className="muStoryAside">
            <p>{story.blurb[locale]}</p>
            <Link className="muBtn" href={storyPath(locale, story)}>{c.storyOpen} <span aria-hidden="true">→</span></Link>
            {firstStory && <p className="muStoryFirst">{c.storyFirst} <Link className="muLink" href={storyPath(locale, firstStory)}>{firstStory.original ? <span lang="os">{firstStory.original}</span> : firstStory.title[locale]} <span aria-hidden="true">→</span></Link></p>}
          </div>
        </div>
        <Reveal className="muStoryGrid">
          <picture className="muPlate muStoryMain">
            <source media="(max-width: 860px)" srcSet={art.main.src960} />
            <img src={art.main.src} alt="" width={art.main.w} height={art.main.h} loading="lazy" decoding="async" />
          </picture>
          <div className="muStorySide">
            <div className="muPlate"><img src={art.a.src} alt="" style={{ objectPosition: art.a.pos }} loading="lazy" decoding="async" /></div>
            <div className="muPlate"><img src={art.b.src} alt="" style={{ objectPosition: art.b.pos }} loading="lazy" decoding="async" /></div>
          </div>
        </Reveal>
        <Facts items={story.facts[locale].map(([v, l]) => ({ v, l }))} />
      </div>
    </section>

    {/* ── Exhibit ── */}
    <section className="muSection" aria-labelledby="mu-exhibit">
      <div className="muWrap">
        <div className="muEyebrow">{c.exhibitEyebrow}</div>
        <h2 className="muH2 muH2Gap" id="mu-exhibit">{c.exhibitTitleA}<i>{c.exhibitTitleB}</i></h2>
        <Exhibit label={c.exhibitLabel} more={c.exhibitMore} note={c.exhibitNote}
          items={EXHIBITS.map((e) => ({ where: e.where[locale], title: e.title[locale], lines: e.lines[locale], href: hrefOf(locale, e), src: e.img.src, src960: e.img.src960, pos: e.img.pos, alt: e.alt[locale] }))} />
      </div>
    </section>

    {/* ── Interactive ── */}
    <section className="muSection muTight" aria-labelledby="mu-acts">
      <div className="muWrap">
        <div className="muHead">
          <div><div className="muEyebrow">{c.actsEyebrow}</div><h2 className="muH2" id="mu-acts">{c.actsTitle}</h2></div>
          <p>{c.actsLead}</p>
        </div>
        <ul className="muActs">
          {ACTS.map((a) => <li className="muAct" key={a.kind}>
            <div className="muPlate muActArt"><img src={a.img.src} alt="" style={{ objectPosition: a.img.pos }} loading="lazy" decoding="async" /><span className="muBadge"><ActIcon kind={a.kind} /></span></div>
            <div className="muCap muCapCu">{a.where[locale]}</div>
            <h3>{a.title[locale]}</h3>
            <p>{a.text[locale]}</p>
          </li>)}
        </ul>
      </div>
    </section>

    {/* ── Routes ── */}
    <section className="muSection muDeep" id="routes" aria-labelledby="mu-routes">
      <div className="muWrap">
        <div className="muHead">
          <div><div className="muEyebrow">{c.routesEyebrow}</div><h2 className="muH2" id="mu-routes">{c.routesTitleA}<i>{c.routesTitleB}</i></h2></div>
          <p>{c.routesLead}</p>
        </div>
        {ROUTES.map((r) => <Reveal className="muRoute" key={r.num}>
          <div className="muRouteText">
            <div className="muRouteNum">{c.route} {r.num}</div>
            <h3>{r.title[locale]}</h3>
            <p>{r.text[locale]}</p>
          </div>
          <ul className="muStops">
            {r.stops.map((s) => <li key={s.label.en}><Link href={hrefOf(locale, s)}>
              <span className="muPlate muStopArt"><img src={s.img.src} alt="" style={{ objectPosition: s.img.pos }} loading="lazy" decoding="async" /></span>
              <span className="muCap muCapCu">{s.world[locale]}</span>
              <span className="muStopLabel">{s.label[locale]}</span>
            </Link></li>)}
          </ul>
        </Reveal>)}
      </div>
    </section>

    {/* ── How ── */}
    <section className="muSection" id="how" aria-labelledby="mu-how">
      <div className="muWrap">
        <div className="muEyebrow">{c.howEyebrow}</div>
        <h2 className="muH2 muH2Gap" id="mu-how">{c.howTitle}</h2>
        <ol className="muSteps">
          {STEPS3[locale].map((s, i) => <li key={s.t}>
            <div className="muPlate muStepArt"><img src={s.img.src} alt="" style={{ objectPosition: s.img.pos }} loading="lazy" decoding="async" /></div>
            <div className="muStepNum" aria-hidden="true">{String(i + 1).padStart(2, "0")}</div>
            <h3>{s.t}</h3>
            <p>{s.b}</p>
          </li>)}
        </ol>
      </div>
    </section>

    {/* ── Index ── */}
    <section className="muSection muTight" aria-labelledby="mu-index">
      <div className="muWrap">
        <div className="muEyebrow">{c.indexEyebrow}</div>
        <h2 className="muH2 muH2Gap" id="mu-index">{c.indexTitle}</h2>
        <ol className="muIndex">
          {[...LIVE_COURSES.map((cr) => ({ id: cr.id, title: cr.title[locale].split(": ")[0], kind: c.onlineCourse, href: courseBasePath(locale, cr), live: true })),
            ...STORIES.map((st) => ({ id: st.id, title: st.title[locale], kind: c.visualStory, href: storyPath(locale, st), live: true })),
            ...COURSES.filter((x) => x.status === "soon").map((cr) => ({ id: cr.id, title: cr.title[locale], kind: c.onlineCourse, href: "", live: false }))]
            .sort((a, b) => Number(b.live) - Number(a.live))
            .map((r, i) => {
              const inner = <><span className="muIdxNum">{String(i + 1).padStart(2, "0")}</span><span className="muIdxTitle">{r.title}</span><span className="muIdxKind">{r.kind}</span><span className={"muIdxState" + (r.live ? " is-live" : "")}>{r.live ? c.live : c.soon}</span></>;
              return <li key={r.id} className={r.live ? "" : "is-soon"}>{r.live ? <Link href={r.href}>{inner}</Link> : <div>{inner}</div>}</li>;
            })}
        </ol>
      </div>
    </section>

    {/* ── Author ── */}
    <section className="muSection muDeep" id="author" aria-labelledby="mu-author">
      <div className="muWrap muAuthor">
        <div className="muPlate muAuthorArt"><img src="/visuals/home/author-720.webp" alt={author.alt} width={720} height={960} loading="lazy" decoding="async" /></div>
        <div className="muAuthorText">
          <div className="muEyebrow">{author.eyebrow}</div>
          <blockquote className="muAuthorQuote">{locale === "ru" ? `«${author.quote}»` : `“${author.quote}”`}</blockquote>
          <h2 id="mu-author">{author.title}</h2>
          <div className="muAuthorCols">{author.paragraphs.map((p) => <p key={p}>{p}</p>)}</div>
        </div>
      </div>
    </section>

    {/* ── Support ── */}
    <section className="muSection muTightBottom" id="support" aria-labelledby="mu-support">
      <div className="muWrap">
        <div className="muSupport">
          <div className="muPlate muSupportArt"><img src="/visuals/ossetian-headscarf/hearth-800.webp" alt="" loading="lazy" decoding="async" /></div>
          <div className="muSupportText">
            <div className="muEyebrow">{c.supportEyebrow}</div>
            <h2 className="muH2" id="mu-support">{c.supportTitleA}<i>{c.supportTitleB}</i></h2>
            <p className="muLeadText">{c.support1}</p>
            <p>{c.support2}</p>
            <div className="muActions">
              <a className="muBtn" href={SUPPORT_URL} target="_blank" rel="noopener">{c.supportBtn} <span aria-hidden="true">↗</span></a>
              <span className="muCap">{c.supportNote}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── FAQ ── */}
    <section className="muSection" aria-labelledby="mu-faq">
      <div className="muWrap muFaq">
        <div><div className="muEyebrow">{c.faqEyebrow}</div><h2 className="muH2" id="mu-faq">{c.faqTitle}</h2></div>
        <div className="muFaqList">
          {faq.map((f, i) => <details key={f.q} open={i === 0}><summary>{f.q}<span aria-hidden="true" /></summary><p>{f.a}</p></details>)}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </section>

    {/* ── Closing ── */}
    <section className="muCta" aria-labelledby="mu-cta">
      <img src="/visuals/home/how-learning-1200.webp" alt="" loading="lazy" decoding="async" />
      <span className="muCtaShade" aria-hidden="true" />
      <div className="muWrap muCtaIn">
        <h2 className="muH2" id="mu-cta">{c.ctaTitleA}<i>{c.ctaTitleB}</i></h2>
        <p>{c.ctaBody}</p>
        <Link className="muBtn" href="#courses">{c.choose} <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  </div>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; if (!isLocale(locale)) return {};
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { metaTitle: title, metaDesc: description } = HOME[locale];
  return {
    title, description,
    alternates: { canonical: `${base}/${locale}`, languages: { en: `${base}/en`, ru: `${base}/ru`, "x-default": base } },
    openGraph: { title, description, url: `${base}/${locale}`, siteName: "MIYU Academy", locale: locale === "ru" ? "ru_RU" : "en_US", type: "website", images: [{ url: `${base}/visuals/egypt/home/07-sunset-journey-to-egyptian-temple-1672.webp`, width: 1672, height: 941 }] },
  };
}
