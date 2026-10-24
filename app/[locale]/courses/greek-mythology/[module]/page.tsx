export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale, MODULE_IDS, COURSE_ID } from "@/lib/course";
import { parseLesson } from "@/lib/content/parser";
import { LessonClient } from "@/components/LessonClient";
import { ModuleNav } from "@/components/ModuleNav";
import { isPreviewRequest } from "@/lib/preview";
import { ResumeTracker } from "@/components/ResumeTracker";
import { PreviewBadge } from "@/components/PreviewBadge";
import { greekModuleParams } from "@/lib/static-params";

export const generateStaticParams=greekModuleParams;
export const dynamicParams=false;

export default async function ModulePage({params}:{params:Promise<{locale:string;module:string}>}){
 const {locale,module}=await params;if(!isLocale(locale)||!MODULE_IDS.includes(module))notFound();
 const preview=await isPreviewRequest();
 const model=parseLesson(module,locale);
 return <>{preview&&<PreviewBadge locale={locale}/>}<ResumeTracker courseId={COURSE_ID} moduleId={module} locale={locale}/><LessonClient model={model}/><ModuleNav locale={locale} moduleId={module}/></>;
}
