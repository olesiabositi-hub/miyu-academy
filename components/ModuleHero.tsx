import type { Locale } from "@/lib/course";
import { PRIMARY_COURSE, courseModule, getCourse } from "@/lib/courses";
import { t } from "@/lib/i18n";
import { moduleHeroArt } from "@/lib/visuals";

/**
 * Shared hero for modules that do not ship their own editorial hero (5–8).
 * Full-width art band on top, title panel overlapping it. Works with any image
 * composition and on phones, because the title never sits on the picture.
 */
export function ModuleHero({locale,moduleId,moduleNumber,title,durationLabel,courseId}:{locale:Locale;moduleId:string;moduleNumber:number;title:string;durationLabel:string;courseId?:string}){
  const course=(courseId?getCourse(courseId):undefined)??PRIMARY_COURSE;
  // Greek modules 5–8 take their art from lib/visuals.ts; other courses from the module definition.
  const art=course.id===PRIMARY_COURSE.id?moduleHeroArt(moduleId):courseModule(course,moduleId)?.hero??null;
  // The picture is always shown whole, at its own proportions (never cropped to a band), at most 1672 px wide.
  // Themed courses add a slow zoom and their atmosphere (Norse: mist and snow; others: warm dust).
  const flow=!!art;
  const fx=flow&&!!course.theme;
  return <header className={"moduleHero"+(art?"":" moduleHeroPlain")+(flow?" moduleHeroFlow":"")+(fx?" moduleHeroFx":"")}>
    {art&&<div className="moduleHeroMedia" style={flow?{aspectRatio:`${art.width} / ${art.height}`}:undefined}>
      <picture>
        <source media="(max-width: 820px)" srcSet={art.src836}/>
        <img src={art.src} width={art.width} height={art.height} alt={art.alt[locale]} style={{objectPosition:art.pos}} fetchPriority="high" decoding="async"/>
      </picture>
      {fx&&course.theme==="norse"&&<div className="mhFx" aria-hidden="true">
        <span className="mhMist mhMistA"/><span className="mhMist mhMistB"/>
        {[6,14,23,31,40,49,57,66,74,83,91].map((x,i)=><i key={x} className="mhFlake" style={{left:`${x}%`,animationDelay:`${-i*2.7}s`,animationDuration:`${14+(i%4)*3}s`,width:`${3+(i%3)*2}px`,height:`${3+(i%3)*2}px`}}/>)}
      </div>}
      {fx&&course.theme!=="norse"&&<div className="mhFx" aria-hidden="true">
        {[9,21,34,47,58,72,85].map((x,i)=><i key={x} className="hxMote" style={{left:`${x}%`,animationDelay:`${-i*2.9}s`,animationDuration:`${17+(i%3)*4}s`}}/>)}
      </div>}
    </div>}
    <div className="moduleHeroPanel">
      <p className="eyebrow">{t(locale,"module.eyebrow",{n:moduleNumber,total:course.moduleCount})}</p>
      <h1>{title}</h1>
      <p className="moduleHeroMeta">{durationLabel}</p>
    </div>
  </header>;
}
