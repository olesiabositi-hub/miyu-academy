"use client";
import Link from "next/link";
import type { Locale } from "@/lib/course";
import type { CourseDefinition } from "@/lib/courses";
import { courseBasePath, modulePath } from "@/lib/courses";
import { PreviewBadge } from "@/components/PreviewBadge";
import { t } from "@/lib/i18n";
import { RunePouch } from "@/components/RunePouch";
import { moduleRows, useProgress } from "@/lib/progress";
import type { ModRow as StoreRow, RuneDraw } from "@/lib/progress";
import { RUNE_IDS } from "@/lib/runes";
import { useDemo } from "@/lib/useDemo";

export type ModRow = { module_id: string; status: string; last_active_at: string | null };

/**
 * Learner's progress page for any course without a final test (module list + continue button).
 * Progress comes from this browser. On a deploy preview `?demo=sample` / `?demo=prophecy` show sample data.
 */
export function CourseDashboard({ locale, course, preview }: { locale: Locale; course: CourseDefinition; preview: boolean }) {
  const store = useProgress();
  const demo = useDemo();
  let mods: ModRow[] = store ? moduleRows(store, course.id).map((r: StoreRow) => ({ module_id: r.module_id, status: r.status, last_active_at: r.last_active_at })) : [];
  let draws: RuneDraw[] = store?.courses[course.id]?.runes ?? [];
  if (preview && demo === "sample") {
    mods = course.moduleIds.slice(0, 2).map((id, i) => ({ module_id: id, status: i === 0 ? "completed" : "in_progress", last_active_at: i === 0 ? null : "2026-01-02T00:00:00Z" }));
    draws = mods.map((m, i) => ({ rune: RUNE_IDS[(i + 1) * 7 % RUNE_IDS.length], source: m.module_id, drawn_at: `2026-01-0${i + 1}` }));
  }
  if (preview && demo === "prophecy") {
    mods = course.moduleIds.map((id) => ({ module_id: id, status: "completed", last_active_at: null }));
    draws = course.moduleIds.map((id, i) => ({ rune: RUNE_IDS[(i + 1) * 5 % RUNE_IDS.length], source: id, drawn_at: `2026-01-0${i + 1}` }));
  }
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

    {course.runes && <RunePouch locale={locale} draws={draws} completed={completed} total={total} />}

    <p className="dashFoot"><Link href={`/${locale}/privacy-settings`}>{t(locale, "dash.settings")} →</Link></p>
  </section>;
}
