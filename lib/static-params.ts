import fs from "node:fs";
import path from "node:path";
import { COURSES, isModuleOpen } from "@/lib/courses";
import { LOCALES, MODULE_IDS } from "@/lib/course";
import { IS_PREVIEW } from "@/lib/preview";

/**
 * Lists of pages to build in advance (generateStaticParams). Every page of the site is a ready file made at publish
 * time; nothing is rendered when a visitor opens it. A course marked "soon" is built only on deploy previews.
 */

/** Courses served by the generic routes /courses/[course]/… (every course except Greek). */
function genericCourses() {
  return COURSES.filter((c) => c.id !== "greek-mythology" && (c.status === "live" || (IS_PREVIEW && c.modules.some((m) => !m.soon))));
}

/** A course with its own folder app/[locale]/courses/<slug>/page.tsx keeps that course page. */
function hasOwnPage(slug: string) {
  return fs.existsSync(path.join(process.cwd(), "app", "[locale]", "courses", slug, "page.tsx"));
}

export const localeParams = () => LOCALES.map((locale) => ({ locale }));

export const coursePageParams = () => genericCourses().filter((c) => !hasOwnPage(c.slug)).map((c) => ({ course: c.slug }));

export const courseDashboardParams = () => genericCourses().map((c) => ({ course: c.slug }));

export const courseModuleParams = () =>
  genericCourses().flatMap((c) => c.modules.filter((m) => isModuleOpen(c, m.id)).map((m) => ({ course: c.slug, module: m.id })));

export const greekModuleParams = () => MODULE_IDS.map((module) => ({ module }));
