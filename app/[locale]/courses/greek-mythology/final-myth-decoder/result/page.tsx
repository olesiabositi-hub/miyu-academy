export const metadata={robots:{index:false,follow:false}};
import { SupportNote } from "@/components/SupportNote";
import Link from "next/link";import { notFound,redirect } from "next/navigation";
import { isLocale, COURSE_ID } from "@/lib/course";import { requireUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { courseBasePath } from "@/lib/courses";
import { isPreviewRequest } from "@/lib/preview";
import { PreviewBadge } from "@/components/PreviewBadge";
import { FinalReview } from "@/components/FinalReview";

export default async function ResultPage({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{demo?:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const base=courseBasePath(locale);
 let prog:{latest_score:number|null;passed:boolean}|null=null;
 let selected:Record<string,number>={};
 const preview=await isPreviewRequest();
 if(preview){
  const {demo}=await searchParams;
  prog=demo==="fail"?{latest_score:9,passed:false}:{latest_score:13,passed:true};
  // Demo review: a few sample wrong answers, nothing is read from the database.
  selected=demo==="fail"?{"FMD-01":0,"FMD-03":2,"FMD-05":1,"FMD-07":1,"FMD-09":2,"FMD-11":1}:{"FMD-04":2,"FMD-12":1};
 }else{
  const {user,supabase}=await requireUser(locale,`${base}/final-myth-decoder/result`);
  const {data}=await supabase.from("final_decoder_progress").select("*").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle();
  prog=data;
  const {data:att}=await supabase.from("final_decoder_attempts").select("selected_answers").eq("user_id",user.id).eq("course_id",COURSE_ID).eq("status","submitted").order("submitted_at",{ascending:false}).limit(1).maybeSingle();
  selected=(att?.selected_answers??{}) as Record<string,number>;
 }
 if(!prog||prog.latest_score===null)redirect(`${base}/final-myth-decoder`);
 const result=prog as {latest_score:number;passed:boolean};
 const total=15;
 const badge=preview?<><PreviewBadge locale={locale}/><p className="fmdNote"><Link href="?demo=pass">demo: pass</Link> · <Link href="?demo=fail">demo: fail</Link></p></>:null;
 if(result.passed)return <><section className="fmd fmdIntro fmdResult is-pass">{badge}
  <div className="lxEyebrow">FINAL MYTH DECODER</div>
  <div className="fmdScore">{t(locale,"fmd.scoreOf",{score:result.latest_score,total})}</div>
  <h1 className="fmdHeadline">{t(locale,"fmd.resultPassTitle")}</h1>
  <p className="fmdLead">{t(locale,"fmd.resultPassBody")}</p>
  <Link className="lxBtn lxBtnGold" href={base}>{t(locale,"fmd.toCourse")} <span aria-hidden="true">→</span></Link>
 </section><FinalReview locale={locale} selected={selected}/><SupportNote locale={locale}/><div className="supportNoteSpacer"/></>;
 return <><section className="fmd fmdIntro fmdResult">{badge}
  <div className="lxEyebrow">FINAL MYTH DECODER</div>
  <div className="fmdScore">{t(locale,"fmd.scoreOf",{score:result.latest_score,total})}</div>
  <h1 className="fmdHeadline">{t(locale,"fmd.almost")}</h1>
  <p className="fmdLead">{t(locale,"fmd.needed",{pass:12,total})}</p>
  <div className="fmdNav fmdNavStart">
   <Link className="lxBtn lxBtnGhost" href={base}>{t(locale,"fmd.toCourse")}</Link>
   <Link className="lxBtn" href={`${base}/final-myth-decoder`}>{t(locale,"fmd.retry")}</Link>
  </div>
 </section><FinalReview locale={locale} selected={selected}/><SupportNote locale={locale}/><div className="supportNoteSpacer"/></>
}
