import type { CourseModuleDef } from "@/lib/courses";

/**
 * Norse Mythology — module list.
 * Fill this in when the lesson files arrive (see docs/NEW_COURSE.md), then set
 * `status: "live"` for the course in lib/courses.ts. One entry per module:
 *
 *   { id:"module-01", order:1, duration:[15,20],
 *     title:{ ru:"…", en:"…" },
 *     teaser:{ ru:"Одна строка для карточки модуля.", en:"One line for the module card." },
 *     image:{ src:"/visuals/norse/mosaic/m01.webp", src360:"/visuals/norse/mosaic/m01-360.webp" } }
 */
export const NORSE_MODULES: readonly CourseModuleDef[] = [];
