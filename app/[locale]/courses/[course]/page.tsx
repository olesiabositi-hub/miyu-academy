import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { ModuleMosaic } from "@/components/ModuleMosaic";
import { Reveal } from "@/components/Reveal";
import { courseDashboardPath, getCourseBySlug } from "@/lib/courses";
import { loadCourse } from "@/lib/course-access";

/** Generic course page for every course except Greek (which keeps its own editorial page). */
export default async function CoursePage({params}:{params:Promise<{locale:string;course:string}>}){
  const {locale,course:slug}=await params;
  if(!isLocale(locale)) notFound();
  const {course}=await loadCourse(slug);

  const ru=locale==="ru";
  const title=course.title[locale];
  const [titleMain,titleSub]=title.includes(": ")?title.split(": "):[title,""];
  const dashboard=courseDashboardPath(locale,course);
  const facts=ru
    ? [[String(course.moduleCount),"модулей"],["RU / EN","две версии"],["✓","тесты по желанию"],["∞","в своём темпе"]]
    : [[String(course.moduleCount),"modules"],["RU / EN","bilingual"],["✓","tests optional"],["∞","self-paced"]];
  const copy=ru?{
    kicker:"MIYU ACADEMY · ОНЛАЙН-КУРС",
    primary:"Начать / продолжить",secondary:"Посмотреть модули",
    modulesEyebrow:"ПРОГРАММА КУРСА",
    modulesTitle:`${course.moduleCount} модулей — шаг за шагом`,
    modulesLead:"Не нужно знать тему заранее. Курс собирает картину постепенно, модуль за модулем. Тесты по желанию: можно пройти для себя или просто читать.",
    ctaTitle:"Готовы начать?",ctaBody:"Проходите в своём темпе и переключайтесь между русской и английской версиями.",cta:"Начать курс"
  }:{
    kicker:"MIYU ACADEMY · ONLINE COURSE",
    primary:"Start / continue",secondary:"Explore modules",
    modulesEyebrow:"COURSE PROGRAMME",
    modulesTitle:`${course.moduleCount} modules, step by step`,
    modulesLead:"No prior knowledge is needed. The course builds the picture gradually, module by module. Tests are optional: take them for yourself, or simply read.",
    ctaTitle:"Ready to begin?",ctaBody:"Study at your own pace and switch between Russian and English versions.",cta:"Start course"
  };

  const base=(process.env.NEXT_PUBLIC_SITE_URL??"").replace(/\/$/,"");
  const courseLd={"@context":"https://schema.org","@type":"Course",name:title,inLanguage:locale,provider:{"@type":"Organization",name:"MIYU Academy",url:base||undefined},url:`${base}/${locale}/courses/${course.slug}`};
  const hero=course.hero??course.card;

  return <div className="hx">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(courseLd).replace(/</g,"\\u003c")}}/>
    <section className={"hxHero hxHeroCourse"+(hero?"":" hxHeroNoArt")}>
      {hero&&<picture className="hxHeroArt" aria-hidden="true">
        <source media="(max-width: 800px)" srcSet={hero.src960}/>
        <img src={hero.src} width={hero.width} height={hero.height} alt="" fetchPriority="high" decoding="async" style={{objectPosition:course.hero?.pos??"50% 50%"}}/>
      </picture>}
      <div className="hxHeroFx" aria-hidden="true">
        <span className="hxFx hxFxMist hxFxMistA"/>
        <span className="hxFx hxFxMist hxFxMistB"/>
        {[8,17,29,38,52,61,73,84,92].map((x,i)=><i key={x} className="hxMote" style={{left:`${x}%`,animationDelay:`${-i*2.3}s`,animationDuration:`${16+(i%4)*4}s`}}/>)}
      </div>
      <div className="hxHeroShade" aria-hidden="true"/>
      <div className="hxWrap hxHeroInner">
        <div className="hxHeroCopy">
          <div className="lxEyebrow lxEyebrowGold">{copy.kicker}</div>
          <h1 className="hxH1">{titleSub?<>{titleMain}:<span>{titleSub}</span></>:titleMain}</h1>
          {course.blurb&&<p className="hxLead">{course.blurb[locale]}</p>}
          <div className="hxActions">
            <Link className="lxBtn lxBtnGold" href={dashboard}>{copy.primary} <span aria-hidden="true">→</span></Link>
            <a className="hxTextLink" href="#modules">{copy.secondary} <span aria-hidden="true">↓</span></a>
          </div>
          <ul className="hxFacts hxFactsHero" aria-label={ru?"Информация о курсе":"Course facts"}>
            {facts.map(([value,label])=><li key={label}><strong>{value}</strong><span>{label}</span></li>)}
          </ul>
        </div>
      </div>
    </section>

    <section id="modules" className="hxSection">
      <div className="hxWrap">
        <div className="hxModulesHead">
          <div>
            <div className="lxEyebrow">{copy.modulesEyebrow}</div>
            <h2 className="hxH2">{copy.modulesTitle}</h2>
          </div>
          <p className="hxBody">{copy.modulesLead}</p>
        </div>
        <Reveal><ModuleMosaic locale={locale} courseId={course.id}/></Reveal>
      </div>
    </section>

    <section className="hxCta">
      <div className="hxWrap hxCtaInner">
        <div><h2 className="hxH2 hxH2Light">{copy.ctaTitle}</h2><p>{copy.ctaBody}</p></div>
        <Link className="lxBtn lxBtnGold" href={dashboard}>{copy.cta} <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  </div>
}

export async function generateMetadata({params}:{params:Promise<{locale:string;course:string}>}):Promise<Metadata>{
  const {locale,course:slug}=await params;
  const course=getCourseBySlug(slug);
  if(!isLocale(locale)||!course||course.status!=="live"||course.slug==="greek-mythology") return {robots:{index:false,follow:false}};
  const base=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";
  const url=`${base}/${locale}/courses/${course.slug}`;
  const description=course.blurb?.[locale]??course.title[locale];
  const image=(course.hero??course.card)?.src;
  return {
    title:`${course.title[locale]} | MIYU Academy`,
    description,
    alternates:{canonical:url,languages:{en:`${base}/en/courses/${course.slug}`,ru:`${base}/ru/courses/${course.slug}`}},
    openGraph:{title:course.title[locale],description,url,siteName:"MIYU Academy",locale:locale==="ru"?"ru_RU":"en_US",type:"website",images:image?[{url:base+image}]:undefined},
    twitter:{card:"summary_large_image",title:course.title[locale],description}
  };
}
