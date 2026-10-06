export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";import QRCode from "qrcode";
import { isLocale, COURSE_ID, COURSE_TITLE } from "@/lib/course";import { requireUser } from "@/lib/auth";import { CertificateForm,CertificateActions } from "@/components/CertificateClient";import { CertificateVisual } from "@/components/CertificateVisual";

export default async function CertificatePage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const {user,supabase}=await requireUser(locale,`/${locale}/courses/greek-mythology/certificate`);
 const {data:prog}=await supabase.from("final_decoder_progress").select("passed,first_passed_at").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle();
 if(!prog?.passed)return <section className="assessment"><h1>{locale==="ru"?"Сертификат пока заблокирован":"Certificate is locked"}</h1><p>{locale==="ru"?"Сначала завершите Final Myth Decoder.":"Complete the Final Myth Decoder first."}</p></section>;
 const {data:cert}=await supabase.from("certificates").select("*").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle();
 if(!cert)return <section><div className="completionCopy"><p className="lead">The myths stay with you.</p><p className="mid">You now know how to recognise them.</p><p className="last">Your certificate is ready.</p></div><CertificateForm locale={locale}/></section>;
 const verifyUrl=`${process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000"}/en/certificate/${cert.verification_token}`;
 const qr=await QRCode.toDataURL(verifyUrl,{margin:0,width:220,color:{dark:"#0D1D35",light:"#FFFDF900"}});
 const completed=new Date(cert.completed_at).toLocaleDateString(locale,{day:"numeric",month:"long",year:"numeric"});
 return <section><div className="container" style={{paddingTop:42,textAlign:"center"}}><p className="eyebrow">✓ COURSE COMPLETED</p><h1>{locale==="ru"?"Ваш сертификат готов":"Your certificate is ready."}</h1></div><div className="certGrid">
 <div className="certPreview"><CertificateVisual locale={locale} name={cert.student_name} completed={completed} certificateId={cert.certificate_id} qrDataUrl={qr}/><div className="notice" style={{marginTop:12}}>{locale==="ru"?"Динамические поля и QR накладываются поверх утверждённого locked master без изменения композиции.":"Dynamic fields and QR are overlaid on the approved locked master without changing the composition."}</div></div>
 <aside className="card certPanel"><p className="eyebrow">MIYU ACADEMY</p><h3>{locale==="ru"?"Ваш credential":"Your credential"}</h3>
 {[["LEARNER",cert.student_name],["COURSE",COURSE_TITLE[locale]],["COMPLETED",completed],["CERTIFICATE ID",cert.certificate_id]].map(([a,b])=><div className="credentialRow" key={a}><div className="credentialLabel">{a}</div><div className="credentialValue">{b}</div></div>)}
 <CertificateActions locale={locale} token={cert.verification_token}/></aside></div></section>
}
