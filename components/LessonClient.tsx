"use client";
import { useEffect } from "react";
import type { LessonBlock, LessonModel } from "@/lib/content/types";
import { Markdown } from "@/components/Markdown";
import { ChoiceCheck,RevealChallenge,SelfCheck } from "@/components/Checks";
import { ModuleOneLesson } from "@/components/ModuleOneLesson";
import { ModuleTwoLesson } from "@/components/ModuleTwoLesson";
import { ModuleThreeLesson } from "@/components/ModuleThreeLesson";
import { ModuleFourLesson } from "@/components/ModuleFourLesson";
import { VisualStop } from "@/components/VisualStop";
import { ModuleHero } from "@/components/ModuleHero";
import { ModuleOutro } from "@/components/ModuleOutro";
import { Reveal } from "@/components/Reveal";
import { parseCompletion, parseNext } from "@/lib/content/outro";
import { t } from "@/lib/i18n";

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

type CompleteBlock=Extract<LessonBlock,{type:"module-complete"}>;
type NextBlock=Extract<LessonBlock,{type:"next-module"}>;

function GenericLesson({model}:{model:LessonModel}){
  useEffect(()=>{post("/api/module/start",{moduleId:model.moduleId}).catch(()=>{})},[model.moduleId]);
  const persistCheck=(checkId:string,sourceIndex:number)=>post("/api/module/check",{moduleId:model.moduleId,checkId,sourceIndex}).catch(()=>{});

  const completes=model.blocks.filter((b):b is CompleteBlock=>b.type==="module-complete");
  const next=model.blocks.find((b):b is NextBlock=>b.type==="next-module");
  const outro=parseCompletion(completes.map(b=>b.markdown));
  const nextText=next?parseNext(next.markdown):undefined;
  const firstCompleteId=completes.length>0?completes[0].id:"";

  return <article>
    <ModuleHero locale={model.locale} moduleId={model.moduleId} moduleNumber={model.moduleNumber} title={model.title} durationLabel={model.durationLabel}/>
    {model.blocks.map(block=>{
      if(block.type==="visual-stop") return <Reveal key={block.id}><section id={block.id} className="visualStop"><VisualStop block={block} locale={model.locale}/></section></Reveal>;
      if(block.type==="quick-check") return <Reveal key={block.id}><section id={block.id} className="reading lxQuickWrap"><div className="lxEyebrow">{t(model.locale,"check.quick")}</div><ChoiceCheck question={block.question} locale={model.locale} onPersist={(v)=>persistCheck(block.id,v)} /></section></Reveal>;
      if(block.type==="self-check"){
        const intro=block.markdown.split(/\n-{3,}\n/)[0].replace(/^#\s+(?:Self-check|Самопроверка)\s*/i,"").trim();
        return <SelfCheck key={block.id} questions={block.questions} locale={model.locale} onPersist={persistCheck} intro={intro?<Markdown>{intro}</Markdown>:undefined}/>;
      }
      if(block.type==="module-challenge") return <section id={block.id} className="reading challenge" key={block.id}><p className="eyebrow">MYTH DECODER — LEVEL {block.level}</p>{block.question?<ChoiceCheck question={block.question} locale={model.locale} onPersist={(v)=>persistCheck(`challenge-${block.level}`,v)} />:<RevealChallenge label={model.locale==="ru"?"Показать разбор":"Reveal answer"}><Markdown>{block.markdown}</Markdown></RevealChallenge>}</section>;
      if(block.type==="module-complete"){
        if(block.id!==firstCompleteId) return null;
        return <ModuleOutro key={block.id} locale={model.locale} moduleId={model.moduleId} heading={outro.heading} body={outro.body} nextHeading={nextText?nextText.heading:undefined} nextBody={nextText?nextText.body:undefined}/>;
      }
      if(block.type==="next-module") return null;
      return <section id={block.id} className="reading prose" key={block.id}><Markdown>{block.markdown}</Markdown></section>;
    })}
  </article>;
}
