export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { parseLesson } from "@/lib/content/parser";
import { ModuleOneLesson } from "@/components/ModuleOneLesson";

export default async function ModuleOnePreview({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(!isLocale(locale))notFound();
  const model=parseLesson("module-01",locale);
  return <ModuleOneLesson model={model}/>;
}
