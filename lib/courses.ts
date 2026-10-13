import type { Locale } from "@/lib/course";
import { MODULES } from "@/lib/content/catalog";
import { MODULE_TEASERS } from "@/lib/content/teasers";
import { NORSE_MODULES } from "@/lib/content/norse";

/**
 * Course registry.
 *
 * Everything that needs to know "which courses exist" (header, footer, sitemap, future
 * academy home) reads from here instead of hard-coding the Greek Mythology paths.
 * To add a course: add one entry to COURSES, create its content under /content/<id>/
 * and its pages under app/[locale]/courses/<slug>/.
 */
export type CourseStatus = "live" | "soon";

export type CourseModuleDef = {
  id: string;
  order: number;
  duration: readonly [number, number];
  title: Record<Locale, string>;
  teaser: Record<Locale, string>;
  /** Optional tile art for the module grid (portrait 4:5). Without it the tile uses a gradient. */
  image?: { src: string; src360: string };
};

export type CourseDefinition = {
  id: string;
  slug: string;
  status: CourseStatus;
  title: Record<Locale, string>;
  /** One or two sentences for the course card on the academy home page. */
  blurb: Record<Locale, string> | null;
  /** Card / hero art. `null` shows a neutral gradient until the picture is supplied. */
  card: { src: string; src960: string; width: number; height: number } | null;
  hero: { src: string; src960: string; width: number; height: number; pos: string } | null;
  modules: readonly CourseModuleDef[];
  moduleCount: number;
  moduleIds: readonly string[];
  /** The optional Final Myth Decoder exists only for the Greek course. */
  hasFinal: boolean;
  /** Folder under /content, asset id prefix (gm-m01-vs01) and content version. */
  contentDir: string;
  assetPrefix: string;
  contentVersion: string;
  /** Greek keeps its strict visual manifest; new courses may omit entries. */
  strictVisuals: boolean;
};

function def(d: Omit<CourseDefinition, "moduleCount" | "moduleIds">): CourseDefinition {
  return { ...d, moduleCount: d.modules.length, moduleIds: d.modules.map((m) => m.id) };
}

const GREEK_MODULES: readonly CourseModuleDef[] = MODULES.map((m) => ({
  id: m.id,
  order: m.order,
  duration: m.duration as readonly [number, number],
  title: { ru: m.ru, en: m.en },
  teaser: MODULE_TEASERS[m.id],
  image: { src: `/visuals/mosaic/m${String(m.order).padStart(2, "0")}.webp`, src360: `/visuals/mosaic/m${String(m.order).padStart(2, "0")}-360.webp` },
}));

export const COURSES: readonly CourseDefinition[] = [
  def({
    id: "greek-mythology",
    slug: "greek-mythology",
    status: "live",
    title: {
      en: "Greek Mythology: Decode the World Around You",
      ru: "Греческая мифология: расшифруй мир вокруг себя",
    },
    blurb: {
      ru: "Мифы не остались в прошлом. Они живут в языке, названиях, технологиях, городах, созвездиях и повседневной культуре. Курс учит узнавать их и понимать, почему они снова и снова возвращаются.",
      en: "Myths did not stay in the past. They live in language, names, technology, cities, constellations and everyday culture. The course teaches you to recognise them and understand why they keep coming back.",
    },
    card: { src: "/visuals/home/course-hero-1916.webp", src960: "/visuals/home/course-hero-960.webp", width: 1916, height: 821 },
    hero: { src: "/visuals/home/course-hero-1916.webp", src960: "/visuals/home/course-hero-960.webp", width: 1916, height: 821, pos: "70% 50%" },
    modules: GREEK_MODULES,
    hasFinal: true,
    contentDir: "greek-mythology",
    assetPrefix: "gm",
    contentVersion: "gm-v2",
    strictVisuals: true,
  }),
  def({
    id: "norse-mythology",
    slug: "norse-mythology",
    status: "soon",
    title: { ru: "Скандинавская мифология", en: "Norse Mythology" },
    blurb: null,
    card: { src: "/visuals/home/soon-norse-960.webp", src960: "/visuals/home/soon-norse-960.webp", width: 960, height: 720 },
    hero: null,
    modules: NORSE_MODULES,
    hasFinal: false,
    contentDir: "norse-mythology",
    assetPrefix: "nm",
    contentVersion: "nm-v1",
    strictVisuals: false,
  }),
  def({
    id: "kalevala",
    slug: "kalevala",
    status: "soon",
    title: { ru: "Калевала: финский эпос", en: "The Kalevala: the Finnish Epic" },
    blurb: null,
    card: null,
    hero: null,
    modules: [],
    hasFinal: false,
    contentDir: "kalevala",
    assetPrefix: "kv",
    contentVersion: "kv-v1",
    strictVisuals: false,
  }),
  def({
    id: "nart-epic",
    slug: "nart-epic",
    status: "soon",
    title: { ru: "Нартский эпос", en: "The Nart Epic" },
    blurb: null,
    card: { src: "/visuals/home/soon-nart-960.webp", src960: "/visuals/home/soon-nart-960.webp", width: 960, height: 720 },
    hero: null,
    modules: [],
    hasFinal: false,
    contentDir: "nart-epic",
    assetPrefix: "ne",
    contentVersion: "ne-v1",
    strictVisuals: false,
  }),
  def({
    id: "egyptian-mythology",
    slug: "egyptian-mythology",
    status: "soon",
    title: { ru: "Древнеегипетская мифология", en: "Ancient Egyptian Mythology" },
    blurb: null,
    card: { src: "/visuals/home/soon-egypt-960.webp", src960: "/visuals/home/soon-egypt-960.webp", width: 960, height: 720 },
    hero: null,
    modules: [],
    hasFinal: false,
    contentDir: "egyptian-mythology",
    assetPrefix: "em",
    contentVersion: "em-v1",
    strictVisuals: false,
  }),
];

export const LIVE_COURSES = COURSES.filter((c) => c.status === "live");
export const SOON_COURSES = COURSES.filter((c) => c.status === "soon");

/** The course the academy currently leads with. */
export const PRIMARY_COURSE: CourseDefinition = LIVE_COURSES[0];

export function getCourse(id: string): CourseDefinition | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getCourseBySlug(slug: string): CourseDefinition | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function courseModule(course: CourseDefinition, moduleId: string): CourseModuleDef | undefined {
  return course.modules.find((m) => m.id === moduleId);
}

/** Course the visitor is currently inside, from a /xx/courses/<slug>/… path (null elsewhere). */
export function courseFromPath(pathname: string): CourseDefinition | null {
  const m = pathname.match(/^\/(?:en|ru)\/courses\/([a-z0-9-]+)(?:\/|$)/);
  return m ? getCourseBySlug(m[1]) ?? null : null;
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
