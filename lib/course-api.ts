import { PRIMARY_COURSE, getCourse } from "@/lib/courses";
import type { CourseDefinition } from "@/lib/courses";

/**
 * Validates the { courseId?, moduleId } pair sent to /api/module/*.
 * courseId is optional (older clients and the Greek lessons omit it → Greek).
 * Only live courses accept progress writes; the module must belong to the course.
 */
export function resolveCourseModule(body: any): { course: CourseDefinition; moduleId: string } | null {
  const moduleId = body?.moduleId;
  if (typeof moduleId !== "string") return null;
  const courseId = body?.courseId;
  const course = courseId === undefined ? PRIMARY_COURSE : typeof courseId === "string" ? getCourse(courseId) : undefined;
  if (!course || course.status !== "live") return null;
  if (!course.moduleIds.includes(moduleId)) return null;
  return { course, moduleId };
}
