"use client";
import { useEffect } from "react";
import type { LessonModel } from "@/lib/content/types";
import { Markdown } from "@/components/Markdown";
import { ChoiceCheck,RevealChallenge } from "@/components/Checks";
import { ModuleOneLesson } from "@/components/ModuleOneLesson";
import { ModuleTwoLesson } from "@/components/ModuleTwoLesson";
import { ModuleThreeLesson } from "@/components/ModuleThreeLesson";
import { ModuleFourLesson } from "@/components/ModuleFourLesson";
import { VisualStop } from "@/components/VisualStop";

async function post(url:string,body:unknown){
  const r=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}

export function LessonClient({model}:{model:LessonModel}){
  if(model.moduleId==="module-01") return <ModuleOneLesson model={model}/>;
  if(model.moduleId==="module-02") return <ModuleTwoLesson model={model}/>;
  if(model.moduleId==="module-03") return <ModuleThreeLesson model={model}/>;
  if(model.moduleId==="module-04") return <ModuleFourLesson model={model}/>;
  return <GenericLesson model={model}/>;
}

function GenericLesson({model}:{model:LessonModel}){
  useEffect(()=>{post("/api/module/start",{moduleId:model.moduleId}).catch(()=>{})},[model.moduleId]);
  const persistCheck=(checkId:string,sourceIndex:number)=>post("/api/module/check",{moduleId:model.moduleId,checkId,sourceIndex}).catch(()=>{});

  return <article>
    <header className="lessonHero reading">
      <p className="eyebrow">{model.locale==="ru"?`МОДУЛЬ ${model.moduleNumber} ИЗ 8`:`MODULE ${model.moduleNumber} OF 8`}</p>
      <h1>{model.title}</h1>
      <p className="muted">{model.durationLabel}</p>
    </header>
    {model.blocks.map(block=>{
      if(block.type==="visual-stop") return <section id={block.id} className="visualStop" key={block.id}><VisualStop block={block}/></section>;
      if(block.type==="quick-check") return <section id={block.id} className="reading checkWrap" key={block.id}><p className="eyebrow">{model.locale==="ru"?"БЫСТРАЯ ПРОВЕРКА":"QUICK CHECK"}</p><ChoiceCheck question={block.question} locale={model.locale} onPersist={(v)=>persistCheck(block.id,v)} /></section>;
      if(block.type==="self-check") return <section id={block.id} className="reading selfCheck" key={block.id}><h2>{model.locale==="ru"?"Самопроверка":"Self-check"}</h2>{block.questions.map(q=><ChoiceCheck key={q.id} question={q} locale={model.locale} onPersist={(v)=>persistCheck(q.id,v)} />)}</section>;
      if(block.type==="module-challenge") return <section id={block.id} className="reading challenge" key={block.id}><p className="eyebrow">MYTH DECODER — LEVEL {block.level}</p>{block.question?<ChoiceCheck question={block.question} locale={model.locale} onPersist={(v)=>persistCheck(`challenge-${block.level}`,v)} />:<RevealChallenge label={model.locale==="ru"?"Показать разбор":"Reveal answer"}><Markdown>{block.markdown}</Markdown></RevealChallenge>}</section>;
      if(block.type==="module-complete") return <section id={block.id} className="reading completion" key={block.id}><Markdown>{block.markdown}</Markdown><button className="btn" onClick={async()=>{await post("/api/module/complete",{moduleId:model.moduleId});location.href=`/${model.locale}/courses/greek-mythology/dashboard`}}>{model.locale==="ru"?"Завершить модуль":"Complete module"}</button></section>;
      if(block.type==="next-module") return <section id={block.id} className="reading nextBlock" key={block.id}><Markdown>{block.markdown}</Markdown></section>;
      return <section id={block.id} className="reading prose" key={block.id}><Markdown>{block.markdown}</Markdown></section>;
    })}
  </article>;
}
