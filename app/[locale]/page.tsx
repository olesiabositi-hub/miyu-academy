import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSE_TITLE, isLocale } from "@/lib/course";
import { courseBasePath } from "@/lib/courses";
import { SOON, STEPS } from "@/lib/content/home";
import { AuthorBlock } from "@/components/AuthorBlock";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { Stagger } from "@/components/Stagger";

export default async function AcademyHome({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;if(!isLocale(locale))notFound();
  const ru=locale==="ru";
  const course=courseBasePath(locale);
  const [titleMain,titleSub]=COURSE_TITLE[locale].split(": ");
  const c=ru?{
    kicker:"MIYU ACADEMY",
    h1:"Учись расшифровывать мир вокруг",
    lead:"Культурные курсы, в которых знание начинает работать за пределами урока.",
    start:"Начать курс",
    how:"Как это работает",
    chips:["RU / EN","в своём темпе","сертификат"],
    courseEyebrow:"ПЕРВЫЙ КУРС",
    courseBody:"Мифы не остались в прошлом. Они живут в языке, названиях, технологиях, городах, созвездиях и повседневной культуре. Курс учит узнавать их и понимать, почему они снова и снова возвращаются.",
    facts:[["8","модулей"],["15","вопросов в финале"],["✓","сертификат"]],
    open:"О курсе",
    howEyebrow:"КАК УСТРОЕНО ОБУЧЕНИЕ",
    howTitle:"Три шага от интереса к пониманию",
    soonEyebrow:"СКОРО",
    soonTitle:"Дальше будут новые курсы",
    faqEyebrow:"ВОПРОСЫ",
    faqTitle:"Частые вопросы",
    ctaTitle:"Начни видеть знакомый мир по-другому",
    ctaBody:"Первый курс уже открыт. Можно проходить в своём темпе и переключаться между русским и английским.",
  }:{
    kicker:"MIYU ACADEMY",
    h1:"Learn to decode the world around you",
    lead:"Cultural learning designed to keep working outside the lesson.",
    start:"Start the course",
    how:"How it works",
    chips:["RU / EN","self-paced","certificate"],
    courseEyebrow:"FIRST COURSE",
    courseBody:"Myths did not stay in the past. They live in language, names, technology, cities, constellations and everyday culture. The course teaches you to recognise them and understand why they keep coming back.",
    facts:[["8","modules"],["15","final questions"],["✓","certificate"]],
    open:"About the course",
    howEyebrow:"HOW LEARNING WORKS",
    howTitle:"Three steps from curiosity to understanding",
    soonEyebrow:"COMING SOON",
    soonTitle:"More courses are on the way",
    faqEyebrow:"QUESTIONS",
    faqTitle:"Frequently asked questions",
    ctaTitle:"Start seeing the familiar world differently",
    ctaBody:"The first course is open. Study at your own pace and switch between Russian and English.",
  };

  return <div className="hx">
    <section className="hxHero hxHeroAcademy">
      <picture className="hxHeroArt" aria-hidden="true">
        <source media="(max-width: 800px)" srcSet="/visuals/home/academy-arch-860.webp"/>
        <img src="/visuals/home/academy-hero-1672.webp" width={1672} height={716} alt="" fetchPriority="high" decoding="async"/>
      </picture>
      <div className="hxHeroFx" aria-hidden="true">
        <span className="hxFx hxFxSun"/>
        <span className="hxFx hxFxMist hxFxMistA"/>
        <span className="hxFx hxFxMist hxFxMistB"/>
        {[12,27,41,58,70,86].map((x,i)=><i key={x} className="hxMote" style={{left:`${x}%`,animationDelay:`${-i*3.1}s`,animationDuration:`${18+(i%3)*4}s`}}/>)}
      </div>
      <div className="hxHeroShade" aria-hidden="true"/>
      <div className="hxWrap hxHeroInner">
        <div className="hxHeroCopy hxHeroLightCopy">
          <div className="lxEyebrow">{c.kicker}</div>
          <h1 className="hxH1Dark">{c.h1}</h1>
          <p className="hxLeadDark">{c.lead}</p>
          <div className="hxActions">
            <Link className="lxBtn" href={course}>{c.start} <span aria-hidden="true">→</span></Link>
            <a className="hxTextLinkDark" href="#how">{c.how} <span aria-hidden="true">↓</span></a>
          </div>
          <ul className="hxChipsDark">{c.chips.map(x=><li key={x}>{x}</li>)}</ul>
        </div>
      </div>
      <Link className="hxArchBadge" href={course}>
        <span className="lxEyebrow lxEyebrowGold">{c.courseEyebrow}</span>
        <strong>{titleMain}</strong>
      </Link>
    </section>

    <section className="hxSection">
      <div className="hxWrap">
        <Reveal>
          <article className="hxCourseCard">
            <picture className="hxCourseArt">
              <source media="(max-width: 700px)" srcSet="/visuals/home/course-hero-960.webp"/>
              <img src="/visuals/home/course-hero-1916.webp" width={1916} height={821} alt="" loading="lazy" decoding="async"/>
            </picture>
            <div className="hxCourseBody">
              <div className="lxEyebrow">{c.courseEyebrow}</div>
              <h2 className="hxH2">{titleMain}:<span>{titleSub}</span></h2>
              <p>{c.courseBody}</p>
              <ul className="hxFacts">{c.facts.map(([v,l])=><li key={l}><strong>{v}</strong><span>{l}</span></li>)}</ul>
              <Link className="lxBtn" href={course}>{c.open} <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        </Reveal>
      </div>
    </section>

    <section className="hxSection hxHow" id="how">
      <div className="hxWrap hxHowGrid">
        <div>
          <div className="lxEyebrow">{c.howEyebrow}</div>
          <h2 className="hxH2">{c.howTitle}</h2>
          <Stagger as="ol" className="hxSteps" step={110}>
            {STEPS[locale].map(s=><li key={s.n}><span>{s.n}</span><div><h3>{s.title}</h3><p>{s.body}</p></div></li>)}
          </Stagger>
        </div>
        <picture className="hxHowArt">
          <source media="(max-width: 700px)" srcSet="/visuals/home/how-learning-600.webp"/>
          <img src="/visuals/home/how-learning-1200.webp" width={1200} height={900} alt="" loading="lazy" decoding="async"/>
        </picture>
      </div>
    </section>

    <section className="hxSection">
      <div className="hxWrap">
        <div className="lxEyebrow">{c.soonEyebrow}</div>
        <h2 className="hxH2">{c.soonTitle}</h2>
        <Stagger className="hxSoon" step={110}>
          {SOON[locale].map(s=><article className="hxSoonCard" key={s.key}>
            <img src={`/visuals/home/soon-${s.key}-960.webp`} width={960} height={720} alt="" loading="lazy" decoding="async"/>
            <span className="hxTileShade" aria-hidden="true"/>
            <span className="hxChip hxChipTime">{s.chip}</span>
            <div className="hxSoonBody"><h3>{s.title}</h3><p>{s.body}</p></div>
          </article>)}
        </Stagger>
      </div>
    </section>

    <AuthorBlock locale={locale}/>
    <Faq locale={locale} title={c.faqTitle} eyebrow={c.faqEyebrow}/>

    <section className="hxCta">
      <div className="hxWrap hxCtaInner">
        <div><h2 className="hxH2 hxH2Light">{c.ctaTitle}</h2><p>{c.ctaBody}</p></div>
        <Link className="lxBtn lxBtnGold" href={course}>{c.start} <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  </div>
}

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;if(!isLocale(locale))return {};
 const base=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";
 const title=locale==="ru"?"MIYU Academy — учись расшифровывать мир вокруг":"MIYU Academy — Learn to Decode the World";
 const description=locale==="ru"?"Культурные курсы, в которых знание начинает работать за пределами урока. Первый курс: греческая мифология.":"Cultural learning designed to keep working outside the lesson. First course: Greek mythology.";
 return {
  title,description,
  alternates:{canonical:`${base}/${locale}`,languages:{en:`${base}/en`,ru:`${base}/ru`,"x-default":base}},
  openGraph:{title,description,url:`${base}/${locale}`,siteName:"MIYU Academy",locale:locale==="ru"?"ru_RU":"en_US",type:"website",images:[{url:`${base}/visuals/home/academy-hero-1672.webp`,width:1672,height:716}]}
 }
}
