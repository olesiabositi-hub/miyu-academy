import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses";
import type { CourseDefinition } from "@/lib/courses";
import { isPreviewRequest } from "@/lib/preview";

/**
 * Resolves the :course segment for the generic course routes.
 * Live courses are open to everyone. A course that is "soon" is only reachable on
 * Netlify deploy previews (so new courses can be reviewed before they are announced).
 * The Greek course keeps its own dedicated pages and never comes through here.
 */
export async function loadCourse(slug: string): Promise<{ course: CourseDefinition; preview: boolean }> {
  const course = getCourseBySlug(slug);
  if (!course || course.slug === "greek-mythology") notFound();
  const preview = await isPreviewRequest();
  const visible = course.status === "live" || (preview && course.modules.some((m) => !m.soon));
  if (!visible) notFound();
  return { course, preview };
}
