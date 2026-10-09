export const metadata={robots:{index:false,follow:false}};
import Link from "next/link";import { notFound,redirect } from "next/navigation";
import { isLocale, COURSE_ID } from "@/lib/course";import { requireUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { courseBasePath } from "@/lib/courses";
import { isPreviewRequest } from "@/lib/preview";
import { PreviewBadge } from "@/components/PreviewBadge";

export default async function ResultPage({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{demo?:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const base=courseBasePath(locale);
 let prog:{latest_score:number|null;passed:boolean}|null=null;
 const preview=await isPreviewRequest();
 if(preview){
  const {demo}=await searchParams;
  prog=demo==="fail"?{latest_score:9,passed:false}:{latest_score:13,passed:true};
 }else{
  const {user,supabase}=await requireUser(locale,`${base}/final-myth-decoder/result`);
  const {data}=await supabase.from("final_decoder_progress").select("*").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle();
  prog=data;
 }
 if(!prog||prog.latest_score===null)redirect(`${base}/final-myth-decoder`);
 const result=prog as {latest_score:number;passed:boolean};
 const total=15;
 const badge=preview?<><PreviewBadge locale={locale}/><p className="fmdNote"><Link href="?demo=pass">demo: pass</Link> · <Link href="?demo=fail">demo: fail</Link></p></>:null;
 if(result.passed)return <section className="fmd fmdIntro fmdResult is-pass">{badge}
  <div className="lxEyebrow">FINAL MYTH DECODER</div>
  <div className="fmdScore">{t(locale,"fmd.scoreOf",{score:result.latest_score,total})}</div>
  <h1 className="fmdHeadline">{t(locale,"fmd.resultPassTitle")}</h1>
  <p className="fmdLead">{t(locale,"fmd.resultPassBody")} {t(locale,"fmd.resultPassCert")}</p>
  <Link className="lxBtn lxBtnGold" href={`${base}/certificate`}>{t(locale,"fmd.getCertificate")} <span aria-hidden="true">→</span></Link>
 </section>;
 return <section className="fmd fmdIntro fmdResult">{badge}
  <div className="lxEyebrow">FINAL MYTH DECODER</div>
  <div className="fmdScore">{t(locale,"fmd.scoreOf",{score:result.latest_score,total})}</div>
  <h1 className="fmdHeadline">{t(locale,"fmd.almost")}</h1>
  <p className="fmdLead">{t(locale,"fmd.needed",{pass:12,total})}</p>
  <div className="fmdNav fmdNavStart">
   <Link className="lxBtn lxBtnGhost" href={base}>{t(locale,"fmd.toCourse")}</Link>
   <Link className="lxBtn" href={`${base}/final-myth-decoder`}>{t(locale,"fmd.retry")}</Link>
  </div>
 </section>
}
