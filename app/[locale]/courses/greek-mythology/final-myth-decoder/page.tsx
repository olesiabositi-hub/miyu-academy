export const metadata={robots:{index:false,follow:false}};
import fs from "node:fs";import path from "node:path";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { FinalDecoderClient } from "@/components/FinalDecoderClient";
import { isPreviewRequest } from "@/lib/preview";
import { PreviewBadge } from "@/components/PreviewBadge";

export default async function FinalPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const preview=await isPreviewRequest();
 const fmd=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content","greek-mythology","final-myth-decoder.ru-en.json"),"utf8"));
 // Correct answers and feedback are not sent with the questions; they appear only on the result page.
 const questions=(fmd.questions as any[]).map(q=>({id:q.id,category:q.category,module:q.module,en:{question:q.en.question,options:q.en.options},ru:{question:q.ru.question,options:q.ru.options}}));
 return <>{preview&&<PreviewBadge locale={locale}/>}<FinalDecoderClient locale={locale} questions={questions} demo={preview}/></>;
}
