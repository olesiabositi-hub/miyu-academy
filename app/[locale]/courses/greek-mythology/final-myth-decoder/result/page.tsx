export const metadata={robots:{index:false,follow:false}};
import Link from "next/link";import { notFound,redirect } from "next/navigation";
import { isLocale, COURSE_ID } from "@/lib/course";import { requireUser } from "@/lib/auth";

export default async function ResultPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const {user,supabase}=await requireUser(locale,`/${locale}/courses/greek-mythology/final-myth-decoder/result`);
 const {data:prog}=await supabase.from("final_decoder_progress").select("*").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle();
 if(!prog||prog.latest_score===null)redirect(`/${locale}/courses/greek-mythology/final-myth-decoder`);
 if(prog.passed)return <section className="assessment"><div className="completionCopy"><p className="lead">The myths stay with you.</p><p className="mid">You now know how to recognise them.</p><p className="last">Your certificate is ready.</p></div><p style={{textAlign:"center"}}><strong>{prog.latest_score} / 15</strong></p><div style={{textAlign:"center"}}><Link className="btn" href={`/${locale}/courses/greek-mythology/certificate`}>{locale==="ru"?"Получить сертификат":"Get your certificate"}</Link></div></section>;
 return <section className="assessment"><p className="eyebrow">FINAL MYTH DECODER</p><h1>Almost there</h1><h2>{prog.latest_score} / 15</h2><p className="muted">{locale==="ru"?"Можно перечитать модули и попробовать снова.":"Review the course and try again."}</p><Link className="btn" href={`/${locale}/courses/greek-mythology/final-myth-decoder`}>{locale==="ru"?"Попробовать снова":"Try again"}</Link></section>
}
