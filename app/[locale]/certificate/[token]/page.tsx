import { notFound } from "next/navigation";
import { isLocale, COURSE_TITLE } from "@/lib/course";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata={robots:{index:false,follow:false},title:"Certificate Verification | MIYU Academy"};

export default async function VerifyPage({params}:{params:Promise<{locale:string;token:string}>}){
 const {locale,token}=await params;
 if(!isLocale(locale))notFound();

 const supabase=await createServerSupabase();
 const {data,error}=await supabase.rpc("verify_certificate",{p_token:token});
 const c=Array.isArray(data)?data[0]:data;

 if(error||!c)return <section className="assessment"><h1>{locale==="ru"?"Сертификат не найден":"Certificate not found"}</h1></section>;

 const valid=c.status==="valid";
 return <section className="assessment">
   <p className="eyebrow">MIYU ACADEMY</p>
   <h1>{locale==="ru"?"ПРОВЕРЕННЫЙ СЕРТИФИКАТ":"VERIFIED CERTIFICATE"}</h1>
   <h2>{c.student_name}</h2>
   <p>{locale==="ru"?"Сертификат подтверждает успешное прохождение курса":"has successfully completed the course"}</p>
   <h3>{COURSE_TITLE[locale]}</h3>
   <p>{locale==="ru"?"Завершено":"Completed"}: {new Date(c.completed_at).toLocaleDateString(locale)}</p>
   <p>Certificate ID: <strong>{c.certificate_id}</strong></p>
   <p className={valid?"done":""}><strong>{valid?(locale==="ru"?"✓ Действителен":"✓ Valid"):(locale==="ru"?"✕ Сертификат отозван":"✕ Certificate revoked")}</strong></p>
 </section>
}
