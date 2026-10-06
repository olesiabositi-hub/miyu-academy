"use client";
import { Fragment, useEffect, useState } from "react";
import type { LessonModel } from "@/lib/content/types";
import { Markdown } from "@/components/Markdown";
import { ChoiceCheck,RevealChallenge } from "@/components/Checks";
import { ModuleOneArt } from "@/components/ModuleOneArt";
import { VisualStop } from "@/components/VisualStop";

async function post(url:string,body:unknown){
  const r=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}

export function LessonClient({model}:{model:LessonModel}){
  const moduleOne=model.moduleId==='module-01';
  const [readingProgress,setReadingProgress]=useState(0);
  useEffect(()=>{
    if(!moduleOne)return;
    const update=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;setReadingProgress(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0)};
    update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
    return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update)};
  },[moduleOne]);
  useEffect(()=>{post("/api/module/start",{moduleId:model.moduleId}).catch(()=>{})},[model.moduleId]);

  const persistCheck=(checkId:string,sourceIndex:number)=>
    post("/api/module/check",{moduleId:model.moduleId,checkId,sourceIndex}).catch(()=>{});

  return <article className={moduleOne?'moduleOneLesson':undefined}>
    {moduleOne&&<div className="m1ReadingProgress" aria-hidden="true"><span style={{width:`${readingProgress}%`}} /></div>}
    {moduleOne&&<nav className="m1Breadcrumb" aria-label={model.locale==='ru'?'Навигация по курсу':'Course navigation'}><a href={`/${model.locale}/courses/greek-mythology/dashboard`}>{model.locale==='ru'?'← К модулям':'← All modules'}</a><span>01 / 08</span></nav>}
    <div className={moduleOne?'m1Opening':undefined}>
    <header className="lessonHero reading">
      <p className="eyebrow">{model.locale==="ru"?`МОДУЛЬ ${model.moduleNumber} ИЗ 8`:`MODULE ${model.moduleNumber} OF 8`}</p>
      <h1>{model.title}</h1>
      <p className="muted">{model.durationLabel}</p>
    </header>
    {moduleOne&&<ModuleOneArt kind="hero" locale={model.locale}/>}
    </div>
    {moduleOne&&<nav className="m1Contents reading" aria-label={model.locale==='ru'?'В этом модуле':'In this module'}>{['section-02','section-04','section-07','self-check'].map((id,i)=><a key={id} href={`#${id}`}>{(model.locale==='ru'?['Начало мира','Титаны','Новое поколение','Самопроверка']:['The first world','The Titans','The new generation','Self-check'])[i]}</a>)}</nav>}

    {model.blocks.map(block=>{
      if(moduleOne&&block.id==="intro")return null;
      if(block.type==="visual-stop") return <section id={block.id} className="visualStop" key={block.id}><VisualStop block={block}/></section>;
      if(block.type==="quick-check") return <section id={block.id} className="reading checkWrap" key={block.id}><p className="eyebrow">{model.locale==="ru"?"БЫСТРАЯ ПРОВЕРКА":"QUICK CHECK"}</p><ChoiceCheck question={block.question} locale={model.locale} onPersist={(v)=>persistCheck(block.id,v)} /></section>;
      if(block.type==="self-check") return <section id={block.id} className="reading selfCheck" key={block.id}><h2>{model.locale==="ru"?"Самопроверка":"Self-check"}</h2>{block.questions.map(q=><ChoiceCheck key={q.id} question={q} locale={model.locale} onPersist={(v)=>persistCheck(q.id,v)} />)}</section>;
      if(block.type==="module-challenge") return <section id={block.id} className="reading challenge" key={block.id}><p className="eyebrow">MYTH DECODER — LEVEL {block.level}</p>{block.question?<ChoiceCheck question={block.question} locale={model.locale} onPersist={(v)=>persistCheck(`challenge-${block.level}`,v)} />:<RevealChallenge label={model.locale==="ru"?"Показать разбор":"Reveal answer"}><Markdown>{block.markdown}</Markdown></RevealChallenge>}</section>;
      if(block.type==="module-complete") return <section id={block.id} className="reading completion" key={block.id}><Markdown>{block.markdown}</Markdown><button className="btn" onClick={async()=>{await post("/api/module/complete",{moduleId:model.moduleId});location.href=`/${model.locale}/courses/greek-mythology/dashboard`}}>{model.locale==="ru"?"Завершить модуль":"Complete module"}</button></section>;
      if(block.type==="next-module") return <section id={block.id} className="reading nextBlock" key={block.id}><Markdown>{block.markdown}</Markdown></section>;
      const detail=moduleOne?({'section-02':'chaos','section-03':'gaia','section-04':'titans'} as const)[block.id as 'section-02'|'section-03'|'section-04']:undefined;
      return <Fragment key={block.id}>
        {moduleOne&&block.id==='section-06'&&<div className="m1Immersive"><ModuleOneArt kind="middle" locale={model.locale}/></div>}
        <section id={block.id} className={detail?`m1Editorial m1Editorial-${detail}`:'reading prose'}>
          <div className={detail?'prose m1EditorialCopy':undefined}><Markdown>{block.markdown}</Markdown></div>
          {detail&&<ModuleOneArt kind={detail} locale={model.locale}/>}
        </section>
      </Fragment>;
    })}
  </article>;
}

