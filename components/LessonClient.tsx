"use client";
import { saveCheck, startModule } from "@/lib/progress";
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
import { GameBlock } from "@/components/GameBlock";
import { NewspaperChapter } from "@/components/Newspaper";
import { ChapterHead } from "@/components/ChapterHead";
import { getCourse } from "@/lib/courses";

export function LessonClient({model}:{model:LessonModel}){
  const greek=model.courseId==="greek-mythology";
  if(!greek) return <GenericLesson model={model}/>;
  if(model.moduleId==="module-01") return <ModuleOneLesson model={model}/>;
  if(model.moduleId==="module-02") return <ModuleTwoLesson model={model}/>;
  if(model.moduleId==="module-03") return <ModuleThreeLesson model={model}/>;
  if(model.moduleId==="module-04") return <ModuleFourLesson model={model}/>;
  return <GenericLesson model={model}/>;
}

type CompleteBlock=Extract<LessonBlock,{type:"module-complete"}>;
type NextBlock=Extract<LessonBlock,{type:"next-module"}>;

function GenericLesson({model}:{model:LessonModel}){
  useEffect(()=>{startModule(model.courseId,model.moduleId)},[model.courseId,model.moduleId]);
  const persistCheck=(checkId:string,sourceIndex:number)=>saveCheck(model.courseId,model.moduleId,checkId,sourceIndex);

  const completes=model.blocks.filter((b):b is CompleteBlock=>b.type==="module-complete");
  const next=model.blocks.find((b):b is NextBlock=>b.type==="next-module");
  const outro=parseCompletion(completes.map(b=>b.markdown));
  const nextText=next?parseNext(next.markdown):undefined;
  const firstCompleteId=completes.length>0?completes[0].id:"";

  const renderBlock=(block:LessonBlock)=>{
      if(block.type==="visual-stop") return <Reveal key={block.id}><section id={block.id} className="visualStop"><VisualStop block={block} locale={model.locale}/></section></Reveal>;
      if(block.type==="quick-check") return <Reveal key={block.id}><section id={block.id} className="reading lxQuickWrap"><div className="lxEyebrow">{t(model.locale,"check.quick")}</div><ChoiceCheck question={block.question} locale={model.locale} onPersist={(v)=>persistCheck(block.id,v)} /></section></Reveal>;
      if(block.type==="self-check"){
        const intro=block.markdown.split(/\n-{3,}\n/)[0].replace(/^#\s+(?:Self-check|Самопроверка)\s*/i,"").trim();
        return <SelfCheck key={block.id} questions={block.questions} locale={model.locale} onPersist={persistCheck} intro={intro?<Markdown>{intro}</Markdown>:undefined}/>;
      }
      if(block.type==="exam"){
        const intro=block.markdown.split(/\n-{3,}\n/)[0].replace(/^#\s+(?:Course final exam|Итоговый тест курса)\s*/i,"").trim();
        return <SelfCheck key={block.id} id="course-exam" variant="exam" questions={block.questions} locale={model.locale} onPersist={persistCheck} intro={intro?<Markdown>{intro}</Markdown>:undefined}/>;
      }
      if(block.type==="module-challenge") return <section id={block.id} className="reading challenge" key={block.id}><p className="eyebrow">MYTH DECODER — LEVEL {block.level}</p>{block.question?<ChoiceCheck question={block.question} locale={model.locale} onPersist={(v)=>persistCheck(`challenge-${block.level}`,v)} />:<RevealChallenge label={model.locale==="ru"?"Показать разбор":"Reveal answer"}><Markdown>{block.markdown}</Markdown></RevealChallenge>}</section>;
      if(block.type==="module-complete"){
        if(block.id!==firstCompleteId) return null;
        return <ModuleOutro key={block.id} courseId={model.courseId} locale={model.locale} moduleId={model.moduleId} heading={outro.heading} body={outro.body} nextHeading={nextText?nextText.heading:undefined} nextBody={nextText?nextText.body:undefined}/>;
      }
      if(block.type==="next-module") return null;
      if(block.type==="game") return <Reveal key={block.id}><section id={block.id} className="reading gameWrap"><GameBlock game={block.game} locale={model.locale} courseId={model.courseId}/></section></Reveal>;
      return <section id={block.id} className="reading prose" key={block.id}><Markdown notes={flow}>{block.markdown}</Markdown></section>;
  };

  // Lessons of other courses: a chapter heading, its picture and its text are set as one spread
  // (picture beside the text on wide screens). Greek lessons keep their original flow.
  const flow=model.courseId!=="greek-mythology";
  const items=flow?groupChapters(model.blocks):model.blocks.map(block=>({kind:"block" as const,block}));

  const newspaper=getCourse(model.courseId)?.layout==="newspaper";
  return <article className={flow?"lessonFlow"+(newspaper?" npLesson":""):undefined}>
    <ModuleHero courseId={model.courseId} locale={model.locale} moduleId={model.moduleId} moduleNumber={model.moduleNumber} title={model.title} durationLabel={model.durationLabel}/>
    {items.map(item=>{
      if(item.kind==="block") return renderBlock(item.block);
      if(newspaper) return <NewspaperChapter key={item.id} id={item.id} head={item.head} lead={item.lead} body={item.body.map(b=>b.markdown)} flip={item.flip}/>;
      return <section className={"chapter"+(item.lead?" hasArt":"")+(item.flip?" isFlip":"")} id={item.id} key={item.id}>
        <ChapterHead heading={item.head}/>
        <div className="chapterGrid">
          {item.lead&&<div className="chapterArt"><Markdown>{item.lead}</Markdown></div>}
          <div className="chapterText mxDrop">{item.body.map(b=><Markdown key={b.id} notes>{b.markdown}</Markdown>)}</div>
        </div>
      </section>;
    })}
  </article>;
}

type Prose=Extract<LessonBlock,{type:"prose"}>;
type Item=
  |{kind:"block";block:LessonBlock}
  |{kind:"chapter";id:string;head:string;lead:string|null;body:Prose[];flip:boolean};

const isHeadingOnly=(b:LessonBlock):b is Prose=>b.type==="prose"&&/^##\s+[^\n]+$/.test(b.markdown.trim());
const isFigureOnly=(b:LessonBlock):b is Prose=>b.type==="prose"&&/^!\[[^\]]*\]\([^)]+\)\s*$/.test(b.markdown.trim());

function groupChapters(blocks:LessonBlock[]):Item[]{
  const items:Item[]=[];
  let n=0;
  for(let i=0;i<blocks.length;){
    const b=blocks[i];
    if(!isHeadingOnly(b)){items.push({kind:"block",block:b});i++;continue;}
    let j=i+1;
    let lead:string|null=null;
    if(j<blocks.length&&isFigureOnly(blocks[j])){lead=(blocks[j] as Prose).markdown;j++;}
    const body:Prose[]=[];
    while(j<blocks.length&&blocks[j].type==="prose"&&!isHeadingOnly(blocks[j])){body.push(blocks[j] as Prose);j++;}
    n++;
    items.push({kind:"chapter",id:b.id,head:b.markdown,lead,body,flip:n%2===0});
    i=j;
  }
  return items;
}
