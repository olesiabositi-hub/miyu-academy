"use client";
import Link from "next/link";
import type { Locale } from "@/lib/course";
import { COURSE_ID, COURSE_TITLE } from "@/lib/course";
import { MODULES } from "@/lib/content/catalog";
import { courseBasePath, modulePath, PRIMARY_COURSE } from "@/lib/courses";
import { PreviewBadge } from "@/components/PreviewBadge";
import { moduleRows, useProgress } from "@/lib/progress";
import { t } from "@/lib/i18n";
import { useDemo } from "@/lib/useDemo";

type ModRow={module_id:string;status:string;last_active_at:string|null};

/** Greek Mythology progress page: eight modules and the optional Final Myth Decoder. Progress comes from this browser. */
export function GreekDashboard({locale,preview}:{locale:Locale;preview:boolean}){
 const demo=useDemo();
 const base=courseBasePath(locale);
 const total=PRIMARY_COURSE.moduleCount;
 const store=useProgress();
 let mods:ModRow[]=store?moduleRows(store,COURSE_ID):[];
 const fin=store?.courses[COURSE_ID]?.final;
 let final:{passed:boolean;active_attempt_id:string|null}|null=fin?{passed:!!fin.passed,active_attempt_id:fin.attempt?.id??null}:null;
 if(preview&&demo==="sample"){
  mods=[
   {module_id:"module-01",status:"completed",last_active_at:null},
   {module_id:"module-02",status:"completed",last_active_at:null},
   {module_id:"module-03",status:"completed",last_active_at:null},
   {module_id:"module-04",status:"in_progress",last_active_at:"2026-01-02T00:00:00Z"},
  ];
  final=null;
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
 else if(allDone&&!passed){href=`${base}/final-myth-decoder`;label=t(locale,"dash.startFinal")}

 const finalStatus=passed?t(locale,"dash.finalDone"):final?.active_attempt_id?t(locale,"dash.finalProgress"):t(locale,"dash.finalReady");

 return <section className="dashPage">
  {preview&&<PreviewBadge locale={locale}/>}
  <div className="dashHero">
   <div className="dashHeroMain">
    <div className="lxEyebrow lxEyebrowGold">{t(locale,"dash.eyebrow")}</div>
    <h1 className="dashTitle">{COURSE_TITLE[locale]}</h1>
    <div className="dashProgressLine">
     <strong>{allDone?t(locale,"dash.completedCourse"):t(locale,"dash.progress",{n:completed,total})}</strong>
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
   <div className="dashMile">
    <div className="lxEyebrow">{t(locale,"dash.final")}</div>
    <div className="dashMileTitle">{finalStatus}</div>
    <p className="dashMileMeta">{t(locale,"dash.finalMeta")}</p>
    <Link className="dashMileLink" href={`${base}/final-myth-decoder`}>{t(locale,"dash.open")} →</Link>
   </div>
  </div>

  <p className="dashFoot"><Link href={`/${locale}/privacy-settings`}>{t(locale,"dash.settings")} →</Link></p>
 </section>
}
