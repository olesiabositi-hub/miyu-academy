export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale, MODULE_IDS } from "@/lib/course";
import { requireUser } from "@/lib/auth";
import { parseLesson } from "@/lib/content/parser";
import { LessonClient } from "@/components/LessonClient";
import { ModuleNav } from "@/components/ModuleNav";
import { isPreviewRequest } from "@/lib/preview";
import { ResumeTracker } from "@/components/ResumeTracker";
import { COURSE_ID } from "@/lib/course";
import { PreviewBadge } from "@/components/PreviewBadge";

export default async function ModulePage({params}:{params:Promise<{locale:string;module:string}>}){
 const {locale,module}=await params;if(!isLocale(locale)||!MODULE_IDS.includes(module))notFound();
 const preview=await isPreviewRequest();
 let initialRatio:number|null=null;
 if(!preview){
  const {user,supabase}=await requireUser(locale,`/${locale}/courses/greek-mythology/${module}`);
  const {data:row}=await supabase.from("module_progress").select("status,scroll_ratio").eq("user_id",user.id).eq("course_id",COURSE_ID).eq("module_id",module).maybeSingle();
  // Only resume a module that is still being read; a finished one starts from the top.
  if(row?.status==="in_progress"&&row.scroll_ratio!==null) initialRatio=Number(row.scroll_ratio);
 }
 const model=parseLesson(module,locale);
 return <>{preview&&<PreviewBadge locale={locale}/>}<ResumeTracker moduleId={module} locale={locale} initialRatio={initialRatio} enabled={!preview}/><LessonClient model={model}/><ModuleNav locale={locale} moduleId={module}/></>;
}
