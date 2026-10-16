import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { LIVE_COURSES, SOON_COURSES, courseBasePath } from "@/lib/courses";
import { STEPS } from "@/lib/content/home";
import { STORIES, storyPath } from "@/lib/stories";
import { AuthorBlock } from "@/components/AuthorBlock";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { Stagger } from "@/components/Stagger";

export default async function AcademyHome({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;if(!isLocale(locale))notFound();
  const ru=locale==="ru";
  // The academy leads with its newest open course; with several, the hero button jumps to the chooser.
  const several=LIVE_COURSES.length>1;
  const newest=LIVE_COURSES[LIVE_COURSES.length-1];
  const course=courseBasePath(locale,newest);
  const heroTarget=several?"#courses":course;
  const newestMain=newest.title[locale].split(": ")[0];
  const c=ru?{
    kicker:"MIYU ACADEMY",
    h1:"Учись расшифровывать мир вокруг",
    lead:"Культурные курсы, в которых знание начинает работать за пределами урока.",
    start:"Начать курс",
    choose:"Выбрать курс",
    how:"Как это работает",
    chips:["RU / EN","в своём темпе","тесты по желанию"],
    courseEyebrow:"ПЕРВЫЙ КУРС",
    newEyebrow:"НОВЫЙ КУРС",
    onlineEyebrow:"ОНЛАЙН-КУРС",
    chooseEyebrow:"КУРСЫ",
    chooseTitle:"Выберите курс",
    chooseLead:"Все курсы открыты для всех, на русском и английском, без обязательных тестов.",
    open:"О курсе",
    storyEyebrow:"ВИЗУАЛЬНАЯ ИСТОРИЯ",
    storyOpen:"Смотреть историю",
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
    choose:"Choose a course",
    how:"How it works",
    chips:["RU / EN","self-paced","tests optional"],
    courseEyebrow:"FIRST COURSE",
    newEyebrow:"NEW COURSE",
    onlineEyebrow:"ONLINE COURSE",
    chooseEyebrow:"COURSES",
    chooseTitle:"Choose a course",
    chooseLead:"Every course is open to everyone, in Russian and English, with no required tests.",
    open:"About the course",
    storyEyebrow:"VISUAL STORY",
    storyOpen:"View the story",
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
            <Link className="lxBtn" href={heroTarget}>{several?c.choose:c.start} <span aria-hidden="true">→</span></Link>
            <a className="hxTextLinkDark" href="#how">{c.how} <span aria-hidden="true">↓</span></a>
          </div>
          <ul className="hxChipsDark">{c.chips.map(x=><li key={x}>{x}</li>)}</ul>
        </div>
      </div>
      <Link className="hxArchBadge" href={course}>
        <span className="lxEyebrow lxEyebrowGold">{several?c.newEyebrow:c.courseEyebrow}</span>
        <strong>{newestMain}</strong>
      </Link>
    </section>

    <section className="hxSection" id="courses">
      <div className="hxWrap">
        {several&&<div className="hxChooseHead">
          <div className="lxEyebrow">{c.chooseEyebrow}</div>
          <h2 className="hxH2">{c.chooseTitle}</h2>
          <p className="hxBody">{c.chooseLead}</p>
        </div>}
        <div className="hxCourseList">
          {LIVE_COURSES.map(cr=>{
            const [main,sub]=cr.title[locale].split(": ");
            const facts=ru
              ? [[String(cr.moduleCount),"модулей"],...(cr.hasFinal?[["15","вопросов в финале"]]:[]),["✓","тесты по желанию"]]
              : [[String(cr.moduleCount),"modules"],...(cr.hasFinal?[["15","final questions"]]:[]),["✓","tests optional"]];
            return <Reveal key={cr.id}>
              <article className="hxCourseCard">
                <picture className="hxCourseArt">
                  {cr.card&&<source media="(max-width: 700px)" srcSet={cr.card.src960}/>}
                  {cr.card&&<img src={cr.card.src} width={cr.card.width} height={cr.card.height} alt="" loading="lazy" decoding="async"/>}
                </picture>
                <div className="hxCourseBody">
                  <div className="lxEyebrow">{several?c.onlineEyebrow:c.courseEyebrow}</div>
                  <h2 className="hxH2">{sub?<>{main}:<span>{sub}</span></>:main}</h2>
                  {cr.blurb&&<p>{cr.blurb[locale]}</p>}
                  <ul className="hxFacts">{facts.map(([v,l])=><li key={l}><strong>{v}</strong><span>{l}</span></li>)}</ul>
                  <Link className="lxBtn" href={courseBasePath(locale,cr)}>{c.open} <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            </Reveal>;
          })}
          {STORIES.map(st=><Reveal key={st.id}>
            <article className="hxCourseCard">
              <picture className="hxCourseArt">
                <source media="(max-width: 700px)" srcSet={st.card.src960}/>
                <img src={st.card.src} width={st.card.width} height={st.card.height} alt="" loading="lazy" decoding="async"/>
              </picture>
              <div className="hxCourseBody">
                <div className="lxEyebrow">{c.storyEyebrow}</div>
                <h2 className="hxH2">{st.title[locale]}{st.original&&<span lang="os">{st.original}</span>}</h2>
                <p>{st.blurb[locale]}</p>
                <ul className="hxFacts">{st.facts[locale].map(([v,l])=><li key={l}><strong>{v}</strong><span>{l}</span></li>)}</ul>
                <Link className="lxBtn" href={storyPath(locale,st)}>{c.storyOpen} <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          </Reveal>)}
        </div>
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
          {SOON_COURSES.map(sc=><article className={"hxSoonCard"+(sc.card?"":" is-noart")} key={sc.id}>
            {sc.card&&<img src={sc.card.src960} width={sc.card.width} height={sc.card.height} alt="" loading="lazy" decoding="async"/>}
            <span className="hxTileShade" aria-hidden="true"/>
            <span className="hxChip hxChipTime">{ru?"Скоро":"Coming soon"}</span>
            <div className="hxSoonBody"><h3>{sc.title[locale]}</h3></div>
          </article>)}
        </Stagger>
      </div>
    </section>

    <AuthorBlock locale={locale}/>
    <Faq locale={locale} title={c.faqTitle} eyebrow={c.faqEyebrow}/>

    <section className="hxCta">
      <div className="hxWrap hxCtaInner">
        <div><h2 className="hxH2 hxH2Light">{c.ctaTitle}</h2><p>{c.ctaBody}</p></div>
        <Link className="lxBtn lxBtnGold" href={heroTarget}>{several?c.choose:c.start} <span aria-hidden="true">→</span></Link>
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
