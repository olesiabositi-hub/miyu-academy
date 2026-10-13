import Link from "next/link";
import type { Locale } from "@/lib/course";
import type { CourseDefinition } from "@/lib/courses";
import { courseBasePath, modulePath } from "@/lib/courses";
import { PreviewBadge } from "@/components/PreviewBadge";
import { t } from "@/lib/i18n";

export type ModRow = { module_id: string; status: string; last_active_at: string | null };

/** Learner's progress page for any course without a final test (module list + continue button). */
export function CourseDashboard({ locale, course, mods, preview }: { locale: Locale; course: CourseDefinition; mods: ModRow[]; preview: boolean }) {
  const total = course.moduleCount;
  const state = new Map(mods.map((x) => [x.module_id, x.status]));
  const completed = course.modules.filter((m) => state.get(m.id) === "completed").length;
  const open = course.modules.filter((m) => !m.soon);
  const recommended = open.find((m) => state.get(m.id) !== "completed");
  const active = mods.filter((x) => x.status === "in_progress").sort((a, b) => String(b.last_active_at).localeCompare(String(a.last_active_at)))[0];
  // "Done" means every open module is finished; announced modules do not count against the learner.
  const allDone = open.length > 0 && open.every((m) => state.get(m.id) === "completed");
  const href = allDone ? courseBasePath(locale, course) : modulePath(locale, active?.module_id ?? recommended?.id ?? open[0]?.id ?? course.moduleIds[0], course);
  const label = allDone ? t(locale, "nav.course") : t(locale, completed === 0 && !active ? "dash.start" : "dash.continue");

  return <section className="dashPage">
    {preview && <PreviewBadge locale={locale} />}
    <div className="dashHero">
      <div className="dashHeroMain">
        <div className="lxEyebrow lxEyebrowGold">{t(locale, "dash.eyebrow")}</div>
        <h1 className="dashTitle">{course.title[locale]}</h1>
        <div className="dashProgressLine">
          <strong>{allDone && completed === total ? t(locale, "dash.completedCourse") : t(locale, "dash.progress", { n: completed, total })}</strong>
          <div className="lxTrack dashTrack" aria-hidden="true"><i style={{ width: `${total ? completed / total * 100 : 0}%` }} /></div>
        </div>
        <Link className="lxBtn lxBtnGold" href={href}>{label} <span aria-hidden="true">→</span></Link>
      </div>
    </div>

    <div className="lxEyebrow dashSection">{t(locale, "dash.modules")}</div>
    <div className="dashModules">
      {course.modules.map((m) => {
        const s = state.get(m.id) ?? "not_started";
        if (m.soon) return <div className="dashModule is-soon" key={m.id} aria-disabled="true">
          <span className="dashNum">{String(m.order).padStart(2, "0")}</span>
          <span className="dashModuleBody">
            <span className="dashModuleTitle">{m.title[locale]}</span>
            <span className="dashModuleMeta"><span className="dashChip is-soon">{t(locale, "dash.statusSoon")}</span></span>
          </span>
        </div>;
        return <Link className={"dashModule is-" + s} key={m.id} href={modulePath(locale, m.id, course)}>
          <span className="dashNum">{String(m.order).padStart(2, "0")}</span>
          <span className="dashModuleBody">
            <span className="dashModuleTitle">{m.title[locale]}</span>
            <span className="dashModuleMeta">
              <span className={"dashChip is-" + s}>{t(locale, s === "completed" ? "dash.statusDone" : s === "in_progress" ? "dash.statusProgress" : "dash.statusNew")}</span>
              {recommended?.id === m.id && s !== "in_progress" && <span className="dashRec">{t(locale, "dash.recommended")}</span>}
            </span>
          </span>
          <span className="dashArrow" aria-hidden="true">→</span>
        </Link>;
      })}
    </div>

    <p className="dashFoot"><Link href={`/${locale}/account`}>{t(locale, "dash.settings")} →</Link></p>
  </section>;
}
