export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { requireUser } from "@/lib/auth";
import { parseLesson } from "@/lib/content/parser";
import { LessonClient } from "@/components/LessonClient";
import { ModuleNav } from "@/components/ModuleNav";
import { ResumeTracker } from "@/components/ResumeTracker";
import { PreviewBadge } from "@/components/PreviewBadge";
import { courseBasePath, isModuleOpen } from "@/lib/courses";
import { loadCourse } from "@/lib/course-access";

export default async function ModulePage({params}:{params:Promise<{locale:string;course:string;module:string}>}){
 const {locale,course:slug,module}=await params;if(!isLocale(locale))notFound();
 const {course,preview}=await loadCourse(slug);
 if(!isModuleOpen(course,module))notFound();
 let initialRatio:number|null=null;
 if(!preview){
  const {user,supabase}=await requireUser(locale,`${courseBasePath(locale,course)}/${module}`);
  const {data:row}=await supabase.from("module_progress").select("status,scroll_ratio").eq("user_id",user.id).eq("course_id",course.id).eq("module_id",module).maybeSingle();
  // Only resume a module that is still being read; a finished one starts from the top.
  if(row?.status==="in_progress"&&row.scroll_ratio!==null) initialRatio=Number(row.scroll_ratio);
 }
 const model=parseLesson(module,locale,course);
 return <>{preview&&<PreviewBadge locale={locale}/>}<ResumeTracker courseId={course.id} moduleId={module} locale={locale} initialRatio={initialRatio} enabled={!preview}/><LessonClient model={model}/><ModuleNav courseId={course.id} locale={locale} moduleId={module}/></>;
}
