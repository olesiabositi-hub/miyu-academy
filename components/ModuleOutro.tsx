"use client";
import { useState } from "react";
import type { Locale } from "@/lib/course";
import { displayify, splitFlow } from "@/lib/content/outro";
import { adjacentModules, courseBasePath, courseModule, getCourse, modulePath, PRIMARY_COURSE, upcomingModule } from "@/lib/courses";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";
import { Markdown } from "@/components/Markdown";
import { RuneReveal } from "@/components/RuneReveal";
import { SupportNote } from "@/components/SupportNote";
import { drawRune } from "@/lib/rune-client";
import type { RuneName } from "@/components/Rune";

/**
 * End of every module, 1–8: what we just covered, what comes next, one Continue button.
 * Marks the module complete, then goes to the next module (or the Final Myth Decoder after module 8).
 */
export function ModuleOutro({locale,moduleId,heading,body,nextHeading,nextBody,courseId}:{locale:Locale;moduleId:string;heading:string;body:string;nextHeading?:string;nextBody?:string;courseId?:string}){
  const course=(courseId?getCourse(courseId):undefined)??PRIMARY_COURSE;
  const [busy,setBusy]=useState(false);
  const [failed,setFailed]=useState(false);
  const [rune,setRune]=useState<RuneName|null>(null);

  const current=courseModule(course,moduleId);
  const number=current?current.order:0;
  const total=course.moduleCount;
  const nextId=adjacentModules(moduleId,course).next;
  const upcoming=upcomingModule(moduleId,course);
  // After the last module: Greek goes to the optional final, other courses back to the course page.
  const target=nextId?modulePath(locale,nextId,course):course.hasFinal?`${courseBasePath(locale,course)}/final-myth-decoder`:`${courseBasePath(locale,course)}`;

  let nextTitle=nextHeading??"";
  let nextText=nextBody??"";
  if(!nextTitle){
    if(nextId){
      const nextModule=courseModule(course,nextId);
      nextTitle=`${locale==="ru"?"Модуль":"Module"} ${nextModule?nextModule.order:""}. ${nextModule?nextModule.title[locale]:""}`;
      if(!nextText) nextText=nextModule?.teaser[locale]??"";
    }else if(upcoming){
      nextTitle=`${locale==="ru"?"Модуль":"Module"} ${upcoming.order}. ${upcoming.title[locale]}`;
      if(!nextText) nextText=upcoming.teaser[locale];
    }else if(!course.hasFinal){
      nextTitle=t(locale,"outro.courseDoneTitle");
      if(!nextText) nextText=t(locale,"outro.courseDoneBody");
    }else{
      nextTitle=t(locale,"outro.finalTitle");
      if(!nextText) nextText=t(locale,"outro.finalBody");
    }
  }

  async function go(){
    setBusy(true);
    setFailed(false);
    try{
      const r=await fetch("/api/module/complete",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({moduleId,courseId:course.id})});
      if(!r.ok) throw new Error(await r.text());
      track("module_complete",{module:moduleId,course:course.id});
      if(course.runes){
        // The reward must never block the lesson: if the draw fails we simply move on.
        const drawn=await drawRune(course.id,moduleId,number);
        if(drawn){ setRune(drawn); setBusy(false); return; }
      }
      window.location.assign(target);
    }catch{
      setFailed(true);
      setBusy(false);
    }
  }

  const parts=splitFlow(body);

  if(rune) return <section id="module-complete" className="lxOutro" aria-labelledby="rune-title">
    <RuneReveal locale={locale} rune={rune} stepsLeft={Math.max(0,total-number)} onNext={()=>window.location.assign(target)} nextLabel={t(locale,upcoming&&!nextId?"outro.backToCourse":"outro.continue")}/>
    {!nextId&&<SupportNote locale={locale}/>}
  </section>;

  return <section id="module-complete" className="lxOutro" aria-labelledby="module-complete-title">
    <div className="lxOutroGrid">
      <article className="lxOutroMain">
        <div className="lxEyebrow">{t(locale,"outro.completed")}</div>
        <h2 className="lxOutroTitle" id="module-complete-title">{heading||(locale==="ru"?"Модуль завершён":"Module completed")}</h2>
        <div className="lxOutroBody">
          {parts.map((p,i)=>p.type==="flow"
            ?<div className="lxFlow" key={i} role="list">{p.items.map((item,k)=><span className="lxFlowItem" role="listitem" key={k}>{k>0&&<i aria-hidden="true">→</i>}<b>{item}</b></span>)}</div>
            :<Markdown key={i}>{displayify(p.text)}</Markdown>)}
        </div>
      </article>
      <aside className="lxNext">
        <div className="lxEyebrow lxEyebrowGold">{t(locale,"outro.next")}</div>
        <div className="lxNextTitle">{nextTitle}</div>
        {nextText&&<div className="lxNextBody"><Markdown>{displayify(nextText)}</Markdown></div>}
        {upcoming&&!nextId&&<div className="lxNextSoon">{t(locale,"outro.soon")}</div>}
        <button type="button" className="lxBtn lxBtnGold" onClick={go} disabled={busy}>
          {busy?t(locale,"outro.saving"):<>{t(locale,upcoming&&!nextId?"outro.backToCourse":"outro.continue")} <span aria-hidden="true">→</span></>}
        </button>
        {failed&&<div className="lxError" role="alert">{t(locale,"outro.error")}</div>}
      </aside>
    </div>
    {!nextId&&<SupportNote locale={locale}/>}
    <div className="lxOutroTrack" aria-hidden="true">
      <span>{String(number).padStart(2,"0")} / {String(total).padStart(2,"0")}</span>
      <div className="lxTrack"><i style={{width:`${total?number/total*100:0}%`}}/></div>
    </div>
  </section>;
}
