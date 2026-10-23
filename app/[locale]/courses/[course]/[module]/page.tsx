export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { parseLesson } from "@/lib/content/parser";
import { LessonClient } from "@/components/LessonClient";
import { ModuleNav } from "@/components/ModuleNav";
import { ResumeTracker } from "@/components/ResumeTracker";
import { PreviewBadge } from "@/components/PreviewBadge";
import { CourseTheme } from "@/components/CourseTheme";
import { isModuleOpen } from "@/lib/courses";
import { loadCourse } from "@/lib/course-access";

export default async function ModulePage({params}:{params:Promise<{locale:string;course:string;module:string}>}){
 const {locale,course:slug,module}=await params;if(!isLocale(locale))notFound();
 const {course,preview}=await loadCourse(slug);
 if(!isModuleOpen(course,module))notFound();
 const model=parseLesson(module,locale,course);
 return <><CourseTheme course={course}/>{preview&&<PreviewBadge locale={locale}/>}<ResumeTracker courseId={course.id} moduleId={module} locale={locale}/><LessonClient model={model}/><ModuleNav courseId={course.id} locale={locale} moduleId={module}/></>;
}
