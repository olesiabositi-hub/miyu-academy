import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSE_TITLE, isLocale } from "@/lib/course";
import { MODULES } from "@/lib/content/catalog";
import { CourseArtwork } from "@/components/CourseArtwork";
import { CourseHeroArt } from "@/components/CourseHeroArt";

const teaser = {
  "module-01": {
    ru: "От Хаоса и Геи до титанов и поколения Зевса.",
    en: "From Chaos and Gaia to the Titans and the generation of Zeus."
  },
  "module-02": {
    ru: "Кто есть кто среди богов — и как быстро их различать.",
    en: "Who is who among the gods — and how to recognise them quickly."
  },
  "module-03": {
    ru: "Монстры, чудовища и существа, которых лучше узнать заранее.",
    en: "Monsters, creatures and beings worth recognising before you meet them."
  },
  "module-04": {
    ru: "Герои, выборы, слабости и истории, которые пережили века.",
    en: "Heroes, choices, weaknesses and stories that survived for centuries."
  },
  "module-05": {
    ru: "Почему мифологические сюжеты до сих пор живут в нашей речи.",
    en: "Why mythological stories still live inside everyday language."
  },
  "module-06": {
    ru: "Троя: война, яблоко, Ахилл и самый известный конь в истории.",
    en: "Troy: war, an apple, Achilles and the most famous horse in history."
  },
  "module-07": {
    ru: "Одиссей, сирены, Цирцея, циклоп — и очень долгий путь домой.",
    en: "Odysseus, Sirens, Circe, a Cyclops — and one very long journey home."
  },
  "module-08": {
    ru: "Nike, Apollo, Mentor, Trojan и другие мифы вокруг нас.",
    en: "Nike, Apollo, Mentor, Trojan and other myths hidden in plain sight."
  }
} as const;

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

  return <div className="courseLanding gmLanding">
    <section className="gmHero">
      <div className="gmHeroBackdrop" aria-hidden="true"><CourseHeroArt/></div>
      <div className="gmHeroVignette" aria-hidden="true"/>
      <div className="container gmHeroInner">
        <div className="gmHeroCopy">
          <p className="eyebrow">{copy.kicker}</p>
          <h1>{titleMain}:<span>{titleSub}</span></h1>
          <p className="gmHeroLead">{copy.intro}</p>
          <div className="gmHeroActions">
            <Link className="btn courseGoldBtn" href={"/"+locale+"/courses/greek-mythology/dashboard"}>{copy.primary}<b aria-hidden="true">→</b></Link>
            <a className="gmTextLink" href="#modules">{copy.secondary}<b aria-hidden="true">↓</b></a>
          </div>
          <div className="gmHeroFacts" aria-label={locale==="ru"?"Информация о курсе":"Course facts"}>
            {facts.map(([value,label])=><span key={label}><strong>{value}</strong><small>{label}</small></span>)}
          </div>
        </div>
      </div>
    </section>

    <section className="gmWhy">
      <div className="gmWhyArt" aria-hidden="true"><img src="/visuals/miyu-home-hero.webp" alt="" /></div>
      <div className="container gmWhyGrid">
        <div className="gmWhyCopy">
          <p className="eyebrow">{copy.whyEyebrow}</p>
          <h2>{copy.whyTitle}</h2>
          <p>{copy.whyBody}</p>
        </div>
        <div className="gmWhyNotice">
          <p className="eyebrow">{copy.noticeTitle}</p>
          <div className="gmNoticeList">
            {copy.notice.map((item,i)=><div key={item}><span>{String(i+1).padStart(2,"0")}</span><p>{item}</p></div>)}
          </div>
        </div>
      </div>
    </section>

    <section className="gmLearning">
      <div className="gmLearningBackdrop" aria-hidden="true"/>
      <div className="container gmLearningInner">
        <div className="gmLearningLead">
          <p className="eyebrow">{copy.insideEyebrow}</p>
          <h2>{copy.insideTitle}</h2>
        </div>
        <div className="gmLearningRail">
          {learning.map(([num,title,body])=><article className="gmLearningItem" key={title}>
            <span>{num}</span><h3>{title}</h3><p>{body}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section id="modules" className="gmModules">
      <div className="container gmModulesHead">
        <div>
          <p className="eyebrow">{copy.modulesEyebrow}</p>
          <h2>{copy.modulesTitle}</h2>
        </div>
        <p>{locale==="ru"?"Не нужно знать мифологию заранее. Курс собирает карту постепенно, модуль за модулем.":"No prior mythology knowledge is needed. The course builds the map gradually, module by module."}</p>
      </div>
      <div className="gmModuleRailWrap">
        <div className="gmModuleRail">
          {MODULES.map(m=><article className="gmModuleItem" key={m.id}>
            <div className="gmModuleImage"><CourseArtwork slot={m.id}/></div>
            <div className="gmModuleMeta"><span>{String(m.order).padStart(2,"0")}</span><small>~{m.duration[0]===m.duration[1]?m.duration[0]:m.duration[0]+"–"+m.duration[1]} min</small></div>
            <h3>{m[locale]}</h3>
            <p>{teaser[m.id][locale]}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="gmFinale">
      <div className="gmFinaleBackdrop" aria-hidden="true"/>
      <div className="container gmFinaleGrid">
        <div className="gmFinaleCopy">
          <p className="eyebrow">{copy.finalEyebrow}</p>
          <h2>{copy.finalTitle}</h2>
          <p>{copy.finalBody}</p>
          <div className="gmDecoderScore">
            <span><strong>15</strong>{locale==="ru"?"вопросов":"questions"}</span>
            <span><strong>12/15</strong>{locale==="ru"?"для прохождения":"to pass"}</span>
            <span><strong>∞</strong>{locale==="ru"?"попыток":"attempts"}</span>
          </div>
        </div>
        <div className="gmCertificateStage">
          <img src="/certificate-master.webp" alt={locale==="ru"?"Пример сертификата MIYU Academy":"MIYU Academy certificate preview"} />
        </div>
      </div>
    </section>

    <section className="gmCTA">
      <div className="container gmCTAInner">
        <div>
          <p className="eyebrow">MIYU ACADEMY</p>
          <h2>{copy.ctaTitle}</h2>
          <p>{copy.ctaBody}</p>
        </div>
        <Link className="btn courseGoldBtn" href={"/"+locale+"/courses/greek-mythology/dashboard"}>{copy.cta}<b aria-hidden="true">→</b></Link>
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
    openGraph:{title:COURSE_TITLE[locale],description,url,siteName:"MIYU Academy",locale:locale==="ru"?"ru_RU":"en_US",type:"website"}
  }
}
