export const metadata={robots:{index:false,follow:false}};
import fs from "node:fs";import path from "node:path";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { isPreviewRequest } from "@/lib/preview";
import { FinalResultClient } from "@/components/FinalResultClient";

export default async function ResultPage({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{demo?:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const {demo}=await searchParams;
 const preview=await isPreviewRequest();
 const fmd=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content","greek-mythology","final-myth-decoder.ru-en.json"),"utf8"));
 return <FinalResultClient locale={locale} questions={fmd.questions} preview={preview} demo={demo}/>;
}
