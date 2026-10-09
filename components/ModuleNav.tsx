import Link from "next/link";
import type { Locale } from "@/lib/course";
import { MODULES } from "@/lib/content/catalog";
import { adjacentModules, courseBasePath, modulePath } from "@/lib/courses";
import { t } from "@/lib/i18n";

function titleOf(moduleId:string,locale:Locale){
  const m=MODULES.find(x=>x.id===moduleId);
  return m?m[locale]:moduleId;
}
function numberOf(moduleId:string){
  const m=MODULES.find(x=>x.id===moduleId);
  return m?String(m.order).padStart(2,"0"):"";
}

/** Previous / all modules / next strip shown under every module, 1–8, in one consistent design. */
export function ModuleNav({locale,moduleId}:{locale:Locale;moduleId:string}){
  const {prev,next}=adjacentModules(moduleId);
  return <nav className="moduleNav" aria-label={t(locale,"module.navLabel")}>
    <div className="moduleNavInner">
      {prev?
        <Link className="moduleNavLink moduleNavPrev" href={modulePath(locale,prev)} rel="prev">
          <small>← {t(locale,"module.previous")}</small>
          <span><b>{numberOf(prev)}</b>{titleOf(prev,locale)}</span>
        </Link>:
        <span className="moduleNavSpacer" aria-hidden="true"/>}
      <Link className="moduleNavAll" href={courseBasePath(locale)+"#modules"}>{t(locale,"module.allModules")}</Link>
      {next?
        <Link className="moduleNavLink moduleNavNext" href={modulePath(locale,next)} rel="next">
          <small>{t(locale,"module.next")} →</small>
          <span><b>{numberOf(next)}</b>{titleOf(next,locale)}</span>
        </Link>:
        <span className="moduleNavSpacer" aria-hidden="true"/>}
    </div>
  </nav>;
}
