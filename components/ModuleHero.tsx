import type { Locale } from "@/lib/course";
import { PRIMARY_COURSE } from "@/lib/courses";
import { t } from "@/lib/i18n";
import { moduleHeroArt } from "@/lib/visuals";

/**
 * Shared hero for modules that do not ship their own editorial hero (5–8).
 * Full-width art band on top, title panel overlapping it. Works with any image
 * composition and on phones, because the title never sits on the picture.
 */
export function ModuleHero({locale,moduleId,moduleNumber,title,durationLabel}:{locale:Locale;moduleId:string;moduleNumber:number;title:string;durationLabel:string}){
  const art=moduleHeroArt(moduleId);
  return <header className={"moduleHero"+(art?"":" moduleHeroPlain")}>
    {art&&<div className="moduleHeroMedia">
      <picture>
        <source media="(max-width: 820px)" srcSet={art.src836}/>
        <img src={art.src} width={art.width} height={art.height} alt={art.alt[locale]} style={{objectPosition:art.pos}} fetchPriority="high" decoding="async"/>
      </picture>
    </div>}
    <div className="moduleHeroPanel">
      <p className="eyebrow">{t(locale,"module.eyebrow",{n:moduleNumber,total:PRIMARY_COURSE.moduleCount})}</p>
      <h1>{title}</h1>
      <p className="moduleHeroMeta">{durationLabel}</p>
    </div>
  </header>;
}
