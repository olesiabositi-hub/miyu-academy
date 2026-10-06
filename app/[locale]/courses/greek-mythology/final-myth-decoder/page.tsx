export const metadata={robots:{index:false,follow:false}};
import fs from "node:fs";import path from "node:path";
import { notFound } from "next/navigation";
import { isLocale, COURSE_ID } from "@/lib/course";
import { requireUser } from "@/lib/auth";
import { FinalDecoderClient } from "@/components/FinalDecoderClient";

export default async function FinalPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const {user,supabase}=await requireUser(locale,`/${locale}/courses/greek-mythology/final-myth-decoder`);
 const {count}=await supabase.from("module_progress").select("*",{count:"exact",head:true}).eq("user_id",user.id).eq("course_id",COURSE_ID).eq("status","completed");
 if(count!==8)return <section className="assessment"><p className="eyebrow">FINAL MYTH DECODER</p><h1>{locale==="ru"?"Пока заблокирован":"Locked for now"}</h1><p>{locale==="ru"?`Завершено ${count??0} из 8 модулей.`:`${count??0} of 8 modules completed.`}</p></section>;
 const {data:prog}=await supabase.from("final_decoder_progress").select("active_attempt_id").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle();
 let attempt=null;if(prog?.active_attempt_id){const {data}=await supabase.from("final_decoder_attempts").select("*").eq("id",prog.active_attempt_id).eq("user_id",user.id).maybeSingle();attempt=data}
 const fmd=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content","greek-mythology","final-myth-decoder.ru-en.json"),"utf8"));
 return <FinalDecoderClient locale={locale} questions={fmd.questions} initialAttempt={attempt}/>;
}
