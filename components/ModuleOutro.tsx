"use client";
import { useState } from "react";
import type { Locale } from "@/lib/course";
import { MODULES } from "@/lib/content/catalog";
import { MODULE_TEASERS } from "@/lib/content/teasers";
import { displayify, splitFlow } from "@/lib/content/outro";
import { adjacentModules, courseBasePath, modulePath, PRIMARY_COURSE } from "@/lib/courses";
import { t } from "@/lib/i18n";
import { Markdown } from "@/components/Markdown";

/**
 * End of every module, 1–8: what we just covered, what comes next, one Continue button.
 * Marks the module complete, then goes to the next module (or the Final Myth Decoder after module 8).
 */
export function ModuleOutro({locale,moduleId,heading,body,nextHeading,nextBody}:{locale:Locale;moduleId:string;heading:string;body:string;nextHeading?:string;nextBody?:string}){
  const [busy,setBusy]=useState(false);
  const [failed,setFailed]=useState(false);

  const current=MODULES.find(m=>m.id===moduleId);
  const number=current?current.order:0;
  const total=PRIMARY_COURSE.moduleCount;
  const nextId=adjacentModules(moduleId).next;
  const target=nextId?modulePath(locale,nextId):`${courseBasePath(locale)}/final-myth-decoder`;

  let nextTitle=nextHeading??"";
  let nextText=nextBody??"";
  if(!nextTitle){
    if(nextId){
      const nextModule=MODULES.find(m=>m.id===nextId);
      nextTitle=`${locale==="ru"?"Модуль":"Module"} ${nextModule?nextModule.order:""}. ${nextModule?nextModule[locale]:""}`;
      if(!nextText) nextText=MODULE_TEASERS[nextId]?.[locale]??"";
    }else{
      nextTitle=t(locale,"outro.finalTitle");
      if(!nextText) nextText=t(locale,"outro.finalBody");
    }
  }

  async function go(){
    setBusy(true);
    setFailed(false);
    try{
      const r=await fetch("/api/module/complete",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({moduleId})});
      if(!r.ok) throw new Error(await r.text());
      window.location.assign(target);
    }catch{
      setFailed(true);
      setBusy(false);
    }
  }

  const parts=splitFlow(body);

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
        <button type="button" className="lxBtn lxBtnGold" onClick={go} disabled={busy}>
          {busy?t(locale,"outro.saving"):<>{t(locale,"outro.continue")} <span aria-hidden="true">→</span></>}
        </button>
        {failed&&<div className="lxError" role="alert">{t(locale,"outro.error")}</div>}
      </aside>
    </div>
    <div className="lxOutroTrack" aria-hidden="true">
      <span>{String(number).padStart(2,"0")} / {String(total).padStart(2,"0")}</span>
      <div className="lxTrack"><i style={{width:`${total?number/total*100:0}%`}}/></div>
    </div>
  </section>;
}
