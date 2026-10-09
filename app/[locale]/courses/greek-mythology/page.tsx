import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSE_TITLE, isLocale } from "@/lib/course";
import { ModuleMosaic } from "@/components/ModuleMosaic";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { Stagger } from "@/components/Stagger";
export default async function CourseOverview({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(!isLocale(locale)) notFound();

  const copy=locale==="ru"?{
    kicker:"MIYU ACADEMY · ONLINE COURSE",
    intro:"Мифы не остались в прошлом. Они живут в языке, названиях, технологиях, городах, созвездиях и повседневной культуре.",
    primary:"Начать / продолжить",
    secondary:"Посмотреть модули",
    whyEyebrow:"ЗАЧЕМ ЭТОТ КУРС",
    whyTitle:"Начни видеть мифы вокруг себя",
    whyBody:"Это не курс на запоминание длинного списка богов. Он учит узнавать знакомые истории, символы и имена — а затем понимать, почему они снова и снова появляются в современном мире.",
    noticeTitle:"После курса ты начнёшь замечать",
    notice:["мифы в словах и названиях","богов и героев в современной культуре","смысл знакомых символов и образов","связи между древними историями и сегодняшним миром"],
    insideEyebrow:"КАК УСТРОЕНО ОБУЧЕНИЕ",
    insideTitle:"Истории, визуальные остановки и проверка понимания",
    modulesEyebrow:"ПРОГРАММА КУРСА",
    modulesTitle:"8 модулей — от происхождения мира до мифологии вокруг нас",
    finalEyebrow:"ФИНАЛ КУРСА",
    finalTitle:"Не экзамен на память. Проверка того, что ты действительно научилась распознавать.",
    finalBody:"В Final Myth Decoder — 15 вопросов на узнавание, смысл и связи. После успешного прохождения открывается сертификат MIYU Academy.",
    ctaTitle:"Готова начать видеть знакомый мир по-другому?",
    ctaBody:"Можно проходить курс в своём темпе и переключаться между русской и английской версиями.",
    cta:"Начать курс"
  }:{
    kicker:"MIYU ACADEMY · ONLINE COURSE",
    intro:"Myths did not stay in the past. They live in language, names, technology, cities, constellations and everyday culture.",
    primary:"Start / continue",
    secondary:"Explore modules",
    whyEyebrow:"WHY THIS COURSE",
    whyTitle:"Start seeing myths all around you",
    whyBody:"This is not a course about memorising a long list of gods. It teaches you to recognise familiar stories, symbols and names — and then understand why they keep appearing in the modern world.",
    noticeTitle:"After the course, you will start noticing",
    notice:["myths hidden in words and names","gods and heroes in modern culture","the meaning behind familiar symbols","connections between ancient stories and the world today"],
    insideEyebrow:"HOW LEARNING WORKS",
    insideTitle:"Stories, visual stops and checks that make the knowledge stick",
    modulesEyebrow:"COURSE PROGRAMME",
    modulesTitle:"8 modules — from the origins of the world to mythology around us",
    finalEyebrow:"THE COURSE FINALE",
    finalTitle:"Not a memory test. A check that you can actually recognise what you learned.",
    finalBody:"The Final Myth Decoder has 15 questions across recognition, meaning and connection. Pass it to unlock your MIYU Academy certificate.",
    ctaTitle:"Ready to see the familiar world differently?",
    ctaBody:"Study at your own pace and switch between Russian and English versions.",
    cta:"Start course"
  };

  const [titleMain,titleSub]=COURSE_TITLE[locale].split(": ");
  const facts=locale==="ru"
    ? [["8","модулей"],["RU / EN","две версии"],["15","Final Myth Decoder"],["✓","сертификат"],["∞","в своём темпе"]]
    : [["8","modules"],["RU / EN","bilingual"],["15","Final Myth Decoder"],["✓","certificate"],["∞","self-paced"]];

  const learning=locale==="ru"
    ? [
      ["01","Истории","Понятная логика вместо энциклопедии."],
      ["02","Visual Stops","Большие смысловые визуальные паузы."],
      ["03","Quick Checks","Короткие вопросы после ключевых идей."],
      ["04","Self-check","Проверка себя без давления и оценок."],
      ["05","Final Myth Decoder","Узнавание, смысл и связи."],
      ["06","Сертификат","После успешного финала."]
    ]
    : [
      ["01","Stories","Clear narrative instead of an encyclopedia."],
      ["02","Visual Stops","Large visual moments that help ideas land."],
      ["03","Quick Checks","Short checks right after key ideas."],
      ["04","Self-check","Check yourself without pressure or grades."],
      ["05","Final Myth Decoder","Recognition, meaning and connection."],
      ["06","Certificate","Unlocked after a successful final."]
    ];

  const modulesLead=locale==="ru"?"Не нужно знать мифологию заранее. Курс собирает карту постепенно, модуль за модулем.":"No prior mythology knowledge is needed. The course builds the map gradually, module by module.";
  const dashboard="/"+locale+"/courses/greek-mythology/dashboard";

  const base=(process.env.NEXT_PUBLIC_SITE_URL??"").replace(/\/$/,"");
  const courseLd={"@context":"https://schema.org","@type":"Course",name:COURSE_TITLE[locale],inLanguage:locale,provider:{"@type":"Organization",name:"MIYU Academy",url:base||undefined},url:`${base}/${locale}/courses/greek-mythology`};
  return <div className="hx">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(courseLd).replace(/</g,"\\u003c")}}/>
    <section className="hxHero hxHeroCourse">
      <picture className="hxHeroArt" aria-hidden="true">
        <source media="(max-width: 800px)" srcSet="/visuals/home/course-hero-960.webp"/>
        <img src="/visuals/home/course-hero-1916.webp" width={1916} height={821} alt="" fetchPriority="high" decoding="async"/>
      </picture>
      <div className="hxHeroFx" aria-hidden="true">
        <span className="hxFx hxFxMist hxFxMistA"/>
        <span className="hxFx hxFxMist hxFxMistB"/>
        {[8,17,29,38,52,61,73,84,92].map((x,i)=><i key={x} className="hxMote" style={{left:`${x}%`,animationDelay:`${-i*2.3}s`,animationDuration:`${16+(i%4)*4}s`}}/>)}
      </div>
      <div className="hxHeroShade" aria-hidden="true"/>
      <div className="hxWrap hxHeroInner">
        <div className="hxHeroCopy">
          <div className="lxEyebrow lxEyebrowGold">{copy.kicker}</div>
          <h1 className="hxH1">{titleMain}:<span>{titleSub}</span></h1>
          <p className="hxLead">{copy.intro}</p>
          <div className="hxActions">
            <Link className="lxBtn lxBtnGold" href={dashboard}>{copy.primary} <span aria-hidden="true">→</span></Link>
            <a className="hxTextLink" href="#modules">{copy.secondary} <span aria-hidden="true">↓</span></a>
          </div>
          <ul className="hxFacts hxFactsHero" aria-label={locale==="ru"?"Информация о курсе":"Course facts"}>
            {facts.map(([value,label])=><li key={label}><strong>{value}</strong><span>{label}</span></li>)}
          </ul>
        </div>
      </div>
    </section>

    <section className="hxSection">
      <div className="hxWrap hxWhy">
        <Reveal>
          <div className="lxEyebrow">{copy.whyEyebrow}</div>
          <h2 className="hxH2">{copy.whyTitle}</h2>
          <p className="hxBody">{copy.whyBody}</p>
        </Reveal>
        <Reveal delay={90}>
          <div className="hxNotice">
            <div className="lxEyebrow">{copy.noticeTitle}</div>
            <ol>{copy.notice.map((item,i)=><li key={item}><span>{String(i+1).padStart(2,"0")}</span><p>{item}</p></li>)}</ol>
          </div>
        </Reveal>
      </div>
    </section>

    <section className="hxSection hxHow">
      <div className="hxWrap hxHowGrid">
        <div>
          <div className="lxEyebrow">{copy.insideEyebrow}</div>
          <h2 className="hxH2">{copy.insideTitle}</h2>
          <Stagger as="ol" className="hxSteps hxSteps6" step={80}>
            {learning.map(([num,title,body])=><li key={title}><span>{num}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}
          </Stagger>
        </div>
        <picture className="hxHowArt">
          <source media="(max-width: 700px)" srcSet="/visuals/home/how-learning-600.webp"/>
          <img src="/visuals/home/how-learning-1200.webp" width={1200} height={900} alt="" loading="lazy" decoding="async"/>
        </picture>
      </div>
    </section>

    <section id="modules" className="hxSection">
      <div className="hxWrap">
        <div className="hxModulesHead">
          <div>
            <div className="lxEyebrow">{copy.modulesEyebrow}</div>
            <h2 className="hxH2">{copy.modulesTitle}</h2>
          </div>
          <p className="hxBody">{modulesLead}</p>
        </div>
        <ModuleMosaic locale={locale}/>
      </div>
    </section>

    <section className="hxFinale">
      <div className="hxWrap hxFinaleGrid">
        <div className="hxFinaleCopy">
          <div className="lxEyebrow lxEyebrowGold">{copy.finalEyebrow}</div>
          <h2 className="hxH2 hxH2Light">{copy.finalTitle}</h2>
          <p>{copy.finalBody}</p>
          <ul className="hxFacts hxFactsHero">
            <li><strong>15</strong><span>{locale==="ru"?"вопросов":"questions"}</span></li>
            <li><strong>12/15</strong><span>{locale==="ru"?"для прохождения":"to pass"}</span></li>
            <li><strong>∞</strong><span>{locale==="ru"?"попыток":"attempts"}</span></li>
          </ul>
        </div>
        <div className="hxCertShot">
          <img src="/certificate-master.webp" width={1492} height={1054} loading="lazy" decoding="async" alt={locale==="ru"?"Пример сертификата MIYU Academy":"MIYU Academy certificate preview"}/>
        </div>
      </div>
    </section>

    <Faq locale={locale} title={locale==="ru"?"Частые вопросы":"Frequently asked questions"} eyebrow={locale==="ru"?"ВОПРОСЫ":"QUESTIONS"}/>

    <section className="hxCta">
      <div className="hxWrap hxCtaInner">
        <div><h2 className="hxH2 hxH2Light">{copy.ctaTitle}</h2><p>{copy.ctaBody}</p></div>
        <Link className="lxBtn lxBtnGold" href={dashboard}>{copy.cta} <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  </div>
}

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale}=await params;
  if(!isLocale(locale)) return {};
  const base=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";
  const url=base+"/"+locale+"/courses/greek-mythology";
  const description=locale==="ru"
    ?"Научитесь узнавать греческие мифы в современном языке, брендах, технологиях, городах и повседневной культуре. Билингвальный курс MIYU Academy из 8 модулей."
    :"Learn to recognise Greek myths in modern language, brands, technology, cities and everyday culture. An 8-module bilingual course by MIYU Academy.";
  return {
    title:COURSE_TITLE[locale]+" | MIYU Academy",
    description,
    alternates:{canonical:url,languages:{en:base+"/en/courses/greek-mythology",ru:base+"/ru/courses/greek-mythology"}},
    openGraph:{title:COURSE_TITLE[locale],description,url,siteName:"MIYU Academy",locale:locale==="ru"?"ru_RU":"en_US",type:"website",images:[{url:base+"/visuals/home/course-hero-1916.webp",width:1916,height:821}]},
    twitter:{card:"summary_large_image",title:COURSE_TITLE[locale],description}
  }
}
