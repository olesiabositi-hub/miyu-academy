import type { CourseDefinition } from "@/lib/courses";

/**
 * Marks the page with the course's visual theme. CSS in globals.css switches the colour tokens with
 * `body:has(.themeMark.theme-<name>)`, so header, footer and page change together, with no flash,
 * and the Greek course and the academy home keep the default look.
 */
export function CourseTheme({ course }: { course: CourseDefinition }) {
  if (!course.theme) return null;
  return <span className={`themeMark theme-${course.theme}`} hidden aria-hidden="true" />;
}
