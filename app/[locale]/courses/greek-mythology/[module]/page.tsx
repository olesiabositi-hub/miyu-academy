export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale, MODULE_IDS } from "@/lib/course";
import { requireUser } from "@/lib/auth";
import { parseLesson } from "@/lib/content/parser";
import { LessonClient } from "@/components/LessonClient";
import { ModuleNav } from "@/components/ModuleNav";

export default async function ModulePage({params}:{params:Promise<{locale:string;module:string}>}){
 const {locale,module}=await params;if(!isLocale(locale)||!MODULE_IDS.includes(module))notFound();
 await requireUser(locale,`/${locale}/courses/greek-mythology/${module}`);
 const model=parseLesson(module,locale);
 return <><LessonClient model={model}/><ModuleNav locale={locale} moduleId={module}/></>;
}
