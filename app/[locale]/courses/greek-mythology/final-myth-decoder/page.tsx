export const metadata={robots:{index:false,follow:false}};
import fs from "node:fs";import path from "node:path";
import { notFound } from "next/navigation";
import { isLocale, COURSE_ID } from "@/lib/course";
import { requireUser } from "@/lib/auth";
import { FinalDecoderClient } from "@/components/FinalDecoderClient";
import { t } from "@/lib/i18n";
import { courseBasePath } from "@/lib/courses";
import Link from "next/link";
import { isPreviewRequest } from "@/lib/preview";
import { PreviewBadge } from "@/components/PreviewBadge";

export default async function FinalPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const preview=await isPreviewRequest();
 let attempt=null;
 if(!preview){
 const {user,supabase}=await requireUser(locale,`/${locale}/courses/greek-mythology/final-myth-decoder`);
 const {count}=await supabase.from("module_progress").select("*",{count:"exact",head:true}).eq("user_id",user.id).eq("course_id",COURSE_ID).eq("status","completed");
 if(count!==8)return <section className="fmd fmdIntro"><div className="lxEyebrow">FINAL MYTH DECODER</div><h1 className="fmdHeadline">{t(locale,"fmd.locked")}</h1><p className="fmdLead">{t(locale,"fmd.lockedBody",{n:count??0,total:8})}</p><Link className="lxBtn" href={courseBasePath(locale)}>{t(locale,"fmd.toCourse")}</Link></section>;
 const {data:prog}=await supabase.from("final_decoder_progress").select("active_attempt_id").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle();
 if(prog?.active_attempt_id){const {data}=await supabase.from("final_decoder_attempts").select("*").eq("id",prog.active_attempt_id).eq("user_id",user.id).maybeSingle();attempt=data}
 }
 const fmd=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content","greek-mythology","final-myth-decoder.ru-en.json"),"utf8"));
 // Never send correct answers or feedback to the browser: scoring happens on the server.
 const questions=(fmd.questions as any[]).map(q=>({id:q.id,category:q.category,module:q.module,en:{question:q.en.question,options:q.en.options},ru:{question:q.ru.question,options:q.ru.options}}));
 return <>{preview&&<PreviewBadge locale={locale}/>}<FinalDecoderClient locale={locale} questions={questions} initialAttempt={attempt} demo={preview}/></>;
}
