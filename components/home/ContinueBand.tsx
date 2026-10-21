"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Locale } from "@/lib/course";
import { adjacentModules, courseModule, getCourse, modulePath } from "@/lib/courses";

type Row = { course_id: string | null; module_id: string; status: string; last_active_at: string | null };
type Band = { course: string; n: number; total: number; title: string; done: number; href: string; img: string | null };

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

/**
 * "Welcome back" strip under the header for signed-in learners: the most recent module they
 * worked on (or the next one, if they finished it) and how far into that course they are.
 * Reads only the visitor's own progress rows (RLS); renders nothing for guests.
 * `?demo=continue` shows a sample strip so the design can be reviewed without signing in.
 */
export function ContinueBand({ locale, hello, cta, doneLabel, moduleOf }: { locale: Locale; hello: string; cta: string; doneLabel: string; moduleOf: string }) {
  const [band, setBand] = useState<Band | null>(null);

  useEffect(() => {
    let alive = true;
    const build = (rows: Row[]): Band | null => {
      const sorted = [...rows].filter((r) => r.last_active_at).sort((a, b) => (b.last_active_at ?? "").localeCompare(a.last_active_at ?? ""));
      for (const r of sorted) {
        const course = getCourse(r.course_id ?? "greek-mythology");
        if (!course) continue;
        let moduleId: string | null = r.module_id;
        if (r.status === "completed") moduleId = adjacentModules(r.module_id, course).next;
        if (!moduleId) continue;
        const m = courseModule(course, moduleId);
        if (!m || m.soon) continue;
        const done = rows.filter((x) => (x.course_id ?? "greek-mythology") === course.id && x.status === "completed").length;
        return { course: course.title[locale].split(": ")[0], n: m.order, total: course.moduleCount, title: m.title[locale], done, href: modulePath(locale, m.id, course), img: course.card?.src960 ?? null };
      }
      return null;
    };
    if (new URLSearchParams(window.location.search).get("demo") === "continue") {
      setBand(build([{ course_id: "egyptian-mythology", module_id: "module-03", status: "completed", last_active_at: "2026-10-20T10:00:00Z" }, { course_id: "egyptian-mythology", module_id: "module-02", status: "completed", last_active_at: "2026-10-18T10:00:00Z" }, { course_id: "egyptian-mythology", module_id: "module-01", status: "completed", last_active_at: "2026-10-16T10:00:00Z" }]));
      return;
    }
    (async () => {
      try {
        const supabase = createBrowserSupabase();
        const { data: s } = await supabase.auth.getSession();
        if (!s.session) return;
        const { data } = await supabase.from("module_progress").select("course_id,module_id,status,last_active_at").eq("user_id", s.session.user.id);
        if (alive && data) setBand(build(data as Row[]));
      } catch { /* no strip */ }
    })();
    return () => { alive = false; };
  }, [locale]);

  if (!band) return null;
  return <div className="muContinue">
    <div className="muWrap muContinueIn">
      {band.img && <img className="muContinueArt" src={band.img} alt="" width={88} height={56} />}
      <div className="muContinueText">
        <div className="muCap muCapCu">{hello} · {band.course} · {fill(moduleOf, { n: band.n, total: band.total })}</div>
        <div className="muContinueTitle">{band.title}</div>
      </div>
      <div className="muContinueTrack">
        <div className="muTrack"><i style={{ width: `${band.total ? (band.done / band.total) * 100 : 0}%` }} /></div>
        <div className="muCap">{fill(doneLabel, { done: band.done, total: band.total })}</div>
      </div>
      <Link className="muBtn muBtnSm" href={band.href}>{cta} <span aria-hidden="true">→</span></Link>
    </div>
  </div>;
}
