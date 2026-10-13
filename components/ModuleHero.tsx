import type { Locale } from "@/lib/course";
import { PRIMARY_COURSE, getCourse } from "@/lib/courses";
import { t } from "@/lib/i18n";
import { moduleHeroArt } from "@/lib/visuals";

/**
 * Shared hero for modules that do not ship their own editorial hero (5–8).
 * Full-width art band on top, title panel overlapping it. Works with any image
 * composition and on phones, because the title never sits on the picture.
 */
export function ModuleHero({locale,moduleId,moduleNumber,title,durationLabel,courseId}:{locale:Locale;moduleId:string;moduleNumber:number;title:string;durationLabel:string;courseId?:string}){
  const course=(courseId?getCourse(courseId):undefined)??PRIMARY_COURSE;
  // Hero art for modules 5–8 is Greek-only; other courses use the plain title panel.
  const art=course.id===PRIMARY_COURSE.id?moduleHeroArt(moduleId):null;
  return <header className={"moduleHero"+(art?"":" moduleHeroPlain")}>
    {art&&<div className="moduleHeroMedia">
      <picture>
        <source media="(max-width: 820px)" srcSet={art.src836}/>
        <img src={art.src} width={art.width} height={art.height} alt={art.alt[locale]} style={{objectPosition:art.pos}} fetchPriority="high" decoding="async"/>
      </picture>
    </div>}
    <div className="moduleHeroPanel">
      <p className="eyebrow">{t(locale,"module.eyebrow",{n:moduleNumber,total:course.moduleCount})}</p>
      <h1>{title}</h1>
      <p className="moduleHeroMeta">{durationLabel}</p>
    </div>
  </header>;
}
