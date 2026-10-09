export const metadata={robots:{index:false,follow:false}};
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, COURSE_ID, COURSE_TITLE } from "@/lib/course";
import { MODULES } from "@/lib/content/catalog";
import { requireUser } from "@/lib/auth";
import { courseBasePath, modulePath, PRIMARY_COURSE } from "@/lib/courses";
import { isPreviewRequest } from "@/lib/preview";
import { PreviewBadge } from "@/components/PreviewBadge";
import { t } from "@/lib/i18n";

type ModRow={module_id:string;status:string;last_active_at:string|null};
type FinalRow={passed:boolean;active_attempt_id:string|null}|null;

export default async function Dashboard({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const base=courseBasePath(locale);
 const total=PRIMARY_COURSE.moduleCount;

 let mods:ModRow[]=[];
 let final:FinalRow=null;
 let hasCert=false;
 const preview=await isPreviewRequest();

 if(preview){
  // Deploy preview: sample data so the cabinet can be reviewed without signing in.
  mods=[
   {module_id:"module-01",status:"completed",last_active_at:null},
   {module_id:"module-02",status:"completed",last_active_at:null},
   {module_id:"module-03",status:"completed",last_active_at:null},
   {module_id:"module-04",status:"in_progress",last_active_at:new Date().toISOString()},
  ];
 }else{
  const {user,supabase}=await requireUser(locale,`${base}/dashboard`);
  const [{data:m},{data:f},{data:c}]=await Promise.all([
   supabase.from("module_progress").select("module_id,status,last_active_at").eq("user_id",user.id).eq("course_id",COURSE_ID),
   supabase.from("final_decoder_progress").select("passed,active_attempt_id").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle(),
   supabase.from("certificates").select("certificate_id").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle(),
  ]);
  mods=(m??[]) as ModRow[];final=(f??null) as FinalRow;hasCert=!!c;
 }

 const state=new Map(mods.map(x=>[x.module_id,x.status]));
 const completed=MODULES.filter(m=>state.get(m.id)==="completed").length;
 const recommended=MODULES.find(m=>state.get(m.id)!=="completed");
 const active=mods.filter(x=>x.status==="in_progress").sort((a,b)=>String(b.last_active_at).localeCompare(String(a.last_active_at)))[0];
 const passed=!!final?.passed;
 const allDone=completed===total;

 let href=modulePath(locale,active?.module_id??recommended?.id??"module-01");
 let label=t(locale,completed===0&&!active?"dash.start":"dash.continue");
 if(final?.active_attempt_id){href=`${base}/final-myth-decoder`;label=t(locale,"dash.continueFinal")}
 else if(hasCert){href=`${base}/certificate`;label=t(locale,"dash.viewCert")}
 else if(passed){href=`${base}/certificate`;label=t(locale,"dash.getCert")}
 else if(allDone){href=`${base}/final-myth-decoder`;label=t(locale,"dash.startFinal")}

 const finalStatus=passed?t(locale,"dash.finalDone"):final?.active_attempt_id?t(locale,"dash.finalProgress"):allDone?t(locale,"dash.finalReady"):t(locale,"dash.finalLocked");
 const certStatus=hasCert?t(locale,"dash.certIssued"):passed?t(locale,"dash.certReady"):t(locale,"dash.certLocked");

 return <section className="dashPage">
  {preview&&<PreviewBadge locale={locale}/>}
  <div className="dashHero">
   <div className="dashHeroMain">
    <div className="lxEyebrow lxEyebrowGold">{t(locale,"dash.eyebrow")}</div>
    <h1 className="dashTitle">{COURSE_TITLE[locale]}</h1>
    <div className="dashProgressLine">
     <strong>{passed?t(locale,"dash.completedCourse"):t(locale,"dash.progress",{n:completed,total})}</strong>
     <div className="lxTrack dashTrack" aria-hidden="true"><i style={{width:`${completed/total*100}%`}}/></div>
    </div>
    <Link className="lxBtn lxBtnGold" href={href}>{label} <span aria-hidden="true">→</span></Link>
   </div>
  </div>

  <div className="lxEyebrow dashSection">{t(locale,"dash.modules")}</div>
  <div className="dashModules">
   {MODULES.map(m=>{
    const s=state.get(m.id)??"not_started";
    return <Link className={"dashModule is-"+s} key={m.id} href={modulePath(locale,m.id)}>
     <span className="dashNum">{String(m.order).padStart(2,"0")}</span>
     <span className="dashModuleBody">
      <span className="dashModuleTitle">{m[locale]}</span>
      <span className="dashModuleMeta">
       <span className={"dashChip is-"+s}>{t(locale,s==="completed"?"dash.statusDone":s==="in_progress"?"dash.statusProgress":"dash.statusNew")}</span>
       {recommended?.id===m.id&&s!=="in_progress"&&<span className="dashRec">{t(locale,"dash.recommended")}</span>}
      </span>
     </span>
     <span className="dashArrow" aria-hidden="true">→</span>
    </Link>;
   })}
  </div>

  <div className="dashMilestones">
   <div className={"dashMile"+(allDone?"":" is-locked")}>
    <div className="lxEyebrow">{t(locale,"dash.final")}</div>
    <div className="dashMileTitle">{finalStatus}</div>
    <p className="dashMileMeta">{t(locale,"dash.finalMeta")}</p>
    {allDone&&<Link className="dashMileLink" href={`${base}/final-myth-decoder`}>{t(locale,"dash.open")} →</Link>}
   </div>
   <div className={"dashMile"+(passed?"":" is-locked")}>
    <div className="lxEyebrow">{t(locale,"dash.certificate")}</div>
    <div className="dashMileTitle">{certStatus}</div>
    {passed&&<Link className="dashMileLink" href={`${base}/certificate`}>{t(locale,hasCert?"dash.viewCert":"dash.getCert")} →</Link>}
   </div>
  </div>

  <p className="dashFoot"><Link href={`/${locale}/account`}>{t(locale,"dash.settings")} →</Link></p>
 </section>
}
