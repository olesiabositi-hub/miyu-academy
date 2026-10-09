export const metadata={robots:{index:false,follow:false}};
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, COURSE_ID, COURSE_TITLE } from "@/lib/course";
import { MODULES } from "@/lib/content/catalog";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { isPreviewRequest } from "@/lib/preview";

export default async function Dashboard({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 if(await isPreviewRequest()) redirect(`/${locale}/courses/greek-mythology/module-01`);
 const {user,supabase}=await requireUser(locale,`/${locale}/courses/greek-mythology/dashboard`);
 const [{data:mods},{data:final},{data:cert}]=await Promise.all([
  supabase.from("module_progress").select("module_id,status,last_active_at,resume_block_id").eq("user_id",user.id).eq("course_id",COURSE_ID),
  supabase.from("final_decoder_progress").select("*").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle(),
  supabase.from("certificates").select("certificate_id,student_name,completed_at,status").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle(),
 ]);
 const state=new Map((mods??[]).map(x=>[x.module_id,x]));
 const completed=MODULES.filter(m=>state.get(m.id)?.status==="completed").length;
 const recommended=MODULES.find(m=>state.get(m.id)?.status!=="completed");
 const active=(mods??[]).filter(x=>x.status==="in_progress").sort((a,b)=>String(b.last_active_at).localeCompare(String(a.last_active_at)))[0];
 let continueHref=active?`/${locale}/courses/greek-mythology/${active.module_id}${active.resume_block_id?`#${active.resume_block_id}`:""}`:`/${locale}/courses/greek-mythology/${recommended?.id??"module-01"}`;
 let continueLabel=locale==="ru"?"Продолжить обучение":"Continue learning";
 if(final?.active_attempt_id){continueHref=`/${locale}/courses/greek-mythology/final-myth-decoder`;continueLabel=locale==="ru"?"Продолжить Final Myth Decoder":"Continue Final Myth Decoder"}
 else if(final?.passed&&!cert){continueHref=`/${locale}/courses/greek-mythology/certificate`;continueLabel=locale==="ru"?"Получить сертификат":"Get your certificate"}
 else if(cert){continueHref=`/${locale}/courses/greek-mythology/certificate`;continueLabel=locale==="ru"?"Открыть сертификат":"View certificate"}
 else if(completed===8){continueHref=`/${locale}/courses/greek-mythology/final-myth-decoder`;continueLabel=locale==="ru"?"Начать Final Myth Decoder":"Start Final Myth Decoder"}

 return <div className="container">
  <section className="hero"><div className="heroGrid"><div><p className="eyebrow">{locale==="ru"?"ВАШ КУРС":"YOUR COURSE"}</p><h1>{COURSE_TITLE[locale]}</h1>
  <p><strong>{final?.passed?(locale==="ru"?"Курс завершён":"Course completed"):`${completed} / 8`}</strong></p>
  {!final?.passed&&<div className="progressDots" aria-label={`${completed} of 8 modules completed`}>{MODULES.map(m=><span key={m.id} className={`dot ${state.get(m.id)?.status==="completed"?"doneDot":""}`}/>)}</div>}
  <Link className="btn" href={continueHref}>{continueLabel} →</Link></div><div className="heroArt" aria-hidden="true"/></div></section>

  <p className="eyebrow">{locale==="ru"?"МОДУЛИ":"MODULES"}</p>
  <div className="moduleList">{MODULES.map(m=>{const s=state.get(m.id)?.status??"not_started";return <Link className="moduleRow" key={m.id} href={`/${locale}/courses/greek-mythology/${m.id}`}><div className="moduleNum">{String(m.order).padStart(2,"0")}</div><div><div className="moduleTitle">{m[locale]}</div><div className="moduleMeta"><span className={s==="completed"?"done":s==="in_progress"?"progress":""}>{s==="completed"?(locale==="ru"?"Завершено":"Completed"):s==="in_progress"?(locale==="ru"?"В процессе":"In progress"):(locale==="ru"?"Не начато":"Not started")}</span>{recommended?.id===m.id&&` · ${locale==="ru"?"Рекомендуем дальше":"Recommended next"}`}</div></div><span>→</span></Link>})}</div>

  <div className="milestones"><section className="card milestone"><p className="eyebrow">FINAL MYTH DECODER</p><h3>{final?.passed?(locale==="ru"?"Завершён":"Completed"):final?.active_attempt_id?(locale==="ru"?"В процессе":"In progress"):completed===8?(locale==="ru"?"Готов":"Ready"):(locale==="ru"?"Заблокирован":"Locked")}</h3><p>15 questions · 80% · unlimited attempts</p><Link href={`/${locale}/courses/greek-mythology/final-myth-decoder`}>{locale==="ru"?"Открыть":"Open"} →</Link></section>
  <section className="card milestone"><p className="eyebrow">CERTIFICATE</p><h3>{cert?(locale==="ru"?"Выпущен":"Issued"):final?.passed?(locale==="ru"?"Готов":"Ready"):(locale==="ru"?"Заблокирован":"Locked")}</h3><p>{locale==="ru"?"Открывается после успешного Final Myth Decoder.":"Unlocks after a successful Final Myth Decoder."}</p>{final?.passed&&<Link href={`/${locale}/courses/greek-mythology/certificate`}>{cert?(locale==="ru"?"Открыть сертификат":"View certificate"):(locale==="ru"?"Получить сертификат":"Get your certificate")} →</Link>}</section></div>
 </div>
}
