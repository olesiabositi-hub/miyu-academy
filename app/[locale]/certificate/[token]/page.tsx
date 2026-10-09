import { notFound } from "next/navigation";
import { isLocale, COURSE_TITLE } from "@/lib/course";
import { createServerSupabase } from "@/lib/supabase/server";
import { t } from "@/lib/i18n";
import { isPreviewRequest } from "@/lib/preview";

export const metadata={robots:{index:false,follow:false},title:"Certificate Verification | MIYU Academy"};

export default async function VerifyPage({params}:{params:Promise<{locale:string;token:string}>}){
 const {locale,token}=await params;
 if(!isLocale(locale))notFound();

 let c:{student_name:string;completed_at:string;certificate_id:string;status:string}|null=null;
 if(token==="demo"&&await isPreviewRequest()){
  c={student_name:locale==="ru"?"Анастасия Соколова":"Olivia Martin",completed_at:new Date().toISOString(),certificate_id:"MIYU-GM-2026-000124",status:"valid"};
 }else{
  const supabase=await createServerSupabase();
  const {data,error}=await supabase.rpc("verify_certificate",{p_token:token});
  const row=Array.isArray(data)?data[0]:data;
  if(!error&&row) c=row;
 }

 if(!c)return <section className="certPage"><div className="verifyCard"><div className="lxEyebrow">MIYU ACADEMY</div><h1 className="verifyName">{t(locale,"cert.verifyNotFound")}</h1><p className="verifyMeta">{t(locale,"cert.verifyNotFoundBody")}</p></div></section>;

 const valid=c.status==="valid";
 const completed=new Date(c.completed_at).toLocaleDateString(locale,{day:"numeric",month:"long",year:"numeric"});
 return <section className="certPage">
  <div className="verifyCard">
   <div className="lxEyebrow">MIYU ACADEMY · {t(locale,"cert.verifyTitle")}</div>
   <h1 className="verifyName">{c.student_name}</h1>
   <p className="verifyMeta">{t(locale,"cert.certifies")}</p>
   <p className="verifyCourse">{COURSE_TITLE[locale]}</p>
   <p className="verifyMeta">{t(locale,"cert.completed")[0]+t(locale,"cert.completed").slice(1).toLowerCase()}: {completed}</p>
   <p className="verifyMeta">Certificate ID: <strong>{c.certificate_id}</strong></p>
   <div className={"verifyStatus "+(valid?"is-valid":"is-revoked")}>{valid?"✓ "+t(locale,"cert.valid"):"✕ "+t(locale,"cert.revoked")}</div>
   <p className="verifyMeta">{t(locale,"cert.verifiedBy")}</p>
  </div>
 </section>
}
