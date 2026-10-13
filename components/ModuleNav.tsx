import Link from "next/link";
import type { Locale } from "@/lib/course";
import { PRIMARY_COURSE, adjacentModules, courseBasePath, courseModule, getCourse, modulePath } from "@/lib/courses";
import type { CourseDefinition } from "@/lib/courses";
import { t } from "@/lib/i18n";

function titleOf(course:CourseDefinition,moduleId:string,locale:Locale){
  const m=courseModule(course,moduleId);
  return m?m.title[locale]:moduleId;
}
function numberOf(course:CourseDefinition,moduleId:string){
  const m=courseModule(course,moduleId);
  return m?String(m.order).padStart(2,"0"):"";
}

/** Previous / all modules / next strip shown under every module, 1–8, in one consistent design. */
export function ModuleNav({locale,moduleId,courseId}:{locale:Locale;moduleId:string;courseId?:string}){
  const course=(courseId?getCourse(courseId):undefined)??PRIMARY_COURSE;
  const {prev,next}=adjacentModules(moduleId,course);
  return <nav className="moduleNav" aria-label={t(locale,"module.navLabel")}>
    <div className="moduleNavInner">
      {prev?
        <Link className="moduleNavLink moduleNavPrev" href={modulePath(locale,prev,course)} rel="prev">
          <small>← {t(locale,"module.previous")}</small>
          <span><b>{numberOf(course,prev)}</b>{titleOf(course,prev,locale)}</span>
        </Link>:
        <span className="moduleNavSpacer" aria-hidden="true"/>}
      <Link className="moduleNavAll" href={courseBasePath(locale,course)+"#modules"}>{t(locale,"module.allModules")}</Link>
      {next?
        <Link className="moduleNavLink moduleNavNext" href={modulePath(locale,next,course)} rel="next">
          <small>{t(locale,"module.next")} →</small>
          <span><b>{numberOf(course,next)}</b>{titleOf(course,next,locale)}</span>
        </Link>:
        <span className="moduleNavSpacer" aria-hidden="true"/>}
    </div>
  </nav>;
}
