import type { Locale } from "@/lib/course";
import { MODULES } from "@/lib/content/catalog";

/**
 * Course registry.
 *
 * Everything that needs to know "which courses exist" (header, footer, sitemap, future
 * academy home) reads from here instead of hard-coding the Greek Mythology paths.
 * To add a course: add one entry to COURSES, create its content under /content/<id>/
 * and its pages under app/[locale]/courses/<slug>/.
 */
export type CourseStatus = "live" | "soon";

export type CourseDefinition = {
  id: string;
  slug: string;
  status: CourseStatus;
  title: Record<Locale, string>;
  moduleCount: number;
  moduleIds: readonly string[];
};

export const COURSES: readonly CourseDefinition[] = [
  {
    id: "greek-mythology",
    slug: "greek-mythology",
    status: "live",
    title: {
      en: "Greek Mythology: Decode the World Around You",
      ru: "Греческая мифология: расшифруй мир вокруг себя",
    },
    moduleCount: MODULES.length,
    moduleIds: MODULES.map((m) => m.id),
  },
];

export const LIVE_COURSES = COURSES.filter((c) => c.status === "live");

/** The course the academy currently leads with. */
export const PRIMARY_COURSE: CourseDefinition = LIVE_COURSES[0];

export function getCourse(id: string): CourseDefinition | undefined {
  return COURSES.find((c) => c.id === id);
}

export function courseBasePath(locale: Locale, course: CourseDefinition = PRIMARY_COURSE): string {
  return `/${locale}/courses/${course.slug}`;
}

export function courseDashboardPath(locale: Locale, course: CourseDefinition = PRIMARY_COURSE): string {
  return `${courseBasePath(locale, course)}/dashboard`;
}

export function modulePath(locale: Locale, moduleId: string, course: CourseDefinition = PRIMARY_COURSE): string {
  return `${courseBasePath(locale, course)}/${moduleId}`;
}

/** Parses "/ru/courses/greek-mythology/module-03" into its parts; null when not a module page. */
export function parseModulePath(pathname: string): { locale: Locale; course: CourseDefinition; moduleId: string; moduleNumber: number } | null {
  const m = pathname.match(/^\/(en|ru)\/courses\/([a-z0-9-]+)\/(module-(\d{2}))\/?$/);
  if (!m) return null;
  const course = COURSES.find((c) => c.slug === m[2]);
  if (!course || !course.moduleIds.includes(m[3])) return null;
  return { locale: m[1] as Locale, course, moduleId: m[3], moduleNumber: Number(m[4]) };
}

/** Previous and next module ids inside a course (null at the edges). */
export function adjacentModules(moduleId: string, course: CourseDefinition = PRIMARY_COURSE): { prev: string | null; next: string | null } {
  const i = course.moduleIds.indexOf(moduleId);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? course.moduleIds[i - 1] : null,
    next: i < course.moduleIds.length - 1 ? course.moduleIds[i + 1] : null,
  };
}
