export const metadata={robots:{index:false,follow:false}};
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { isLocale, COURSE_ID, COURSE_TITLE } from "@/lib/course";
import { requireUser } from "@/lib/auth";
import { courseBasePath } from "@/lib/courses";
import { t } from "@/lib/i18n";
import { isPreviewRequest } from "@/lib/preview";
import { PreviewBadge } from "@/components/PreviewBadge";
import { CertificateForm,CertificateActions } from "@/components/CertificateClient";
import { CertificateVisual } from "@/components/CertificateVisual";

export default async function CertificatePage({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{name?:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const base=courseBasePath(locale);
 const site=(process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000").replace(/\/$/,"");

 let cert:{student_name:string;completed_at:string;certificate_id:string;verification_token:string}|null=null;
 let preview=false;

 if(await isPreviewRequest()){
  // Deploy preview only: a sample certificate so the design can be reviewed without signing in.
  preview=true;
  const {name}=await searchParams;
  const sample=(name??"").replace(/[<>]/g,"").trim().slice(0,60)||(locale==="ru"?"Анастасия Соколова":"Olivia Martin");
  cert={student_name:sample,completed_at:new Date().toISOString(),certificate_id:"MIYU-GM-2026-000124",verification_token:"demo"};
 }else{
  const {user,supabase}=await requireUser(locale,`${base}/certificate`);
  const {data:prog}=await supabase.from("final_decoder_progress").select("passed,first_passed_at").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle();
  if(!prog?.passed)return <section className="certPage"><div className="certHead"><h1 className="certTitle">{t(locale,"cert.lockedTitle")}</h1><p className="certLead">{t(locale,"cert.lockedBody")}</p><Link className="lxBtn" href={`${base}/final-myth-decoder`}>{t(locale,"cert.toFinal")}</Link></div></section>;
  const {data}=await supabase.from("certificates").select("*").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle();
  cert=data;
  if(!cert)return <section className="certPage"><div className="certHead"><div className="lxEyebrow">{t(locale,"cert.eyebrowDone")}</div><h1 className="certTitle">{t(locale,"cert.issueTitle")}</h1><p className="certLead">{t(locale,"cert.issueLead")}</p></div><CertificateForm locale={locale}/></section>;
 }

 const verifyUrl=`${site}/${locale}/certificate/${cert.verification_token}`;
 const qr=await QRCode.toDataURL(verifyUrl,{margin:0,width:220,color:{dark:"#0D1D35",light:"#FFFDF900"}});
 const completed=new Date(cert.completed_at).toLocaleDateString(locale,{day:"numeric",month:"long",year:"numeric"});
 const rows:[string,string][]=[[t(locale,"cert.learner"),cert.student_name],[t(locale,"cert.course"),COURSE_TITLE[locale]],[t(locale,"cert.completed"),completed],[t(locale,"cert.id"),cert.certificate_id]];

 return <section className="certPage">
  {preview&&<PreviewBadge locale={locale}/>}
  <div className="certHead"><div className="lxEyebrow">✓ {t(locale,"cert.eyebrowDone")}</div><h1 className="certTitle">{t(locale,"cert.readyTitle")}</h1><p className="certLead">{t(locale,"cert.readyLead")}</p></div>
  <div className="certLayout">
   <div className="certStage"><CertificateVisual locale={locale} name={cert.student_name} completed={completed} certificateId={cert.certificate_id} qrDataUrl={qr}/></div>
   <aside className="certSide">
    <h2>{t(locale,"cert.credential")}</h2>
    {rows.map(([a,b])=><div className="certRow" key={a}><div className="certRowLabel">{a}</div><div className="certRowValue">{b}</div></div>)}
    <CertificateActions locale={locale} token={cert.verification_token} certificateId={cert.certificate_id}/>
   </aside>
  </div>
 </section>
}
