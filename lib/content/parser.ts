import fs from "node:fs";
import { greekProseBlocks, hasGreekArt, stripGreekIntro } from "@/lib/content/greekDialect";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import type { Locale } from "@/lib/course";
import { PRIMARY_COURSE, courseModule } from "@/lib/courses";
import type { CourseDefinition } from "@/lib/courses";
import { moduleTitle } from "@/lib/content/catalog";
import { tidyProse } from "@/lib/content/tidy";
import type { ChoiceQuestion, LessonBlock, LessonModel } from "@/lib/content/types";

const choiceSchema = z.object({
  id:z.string(),
  question:z.string().min(1),
  options:z.array(z.object({sourceIndex:z.number().int().min(0),text:z.string().min(1)})).min(2),
  answerSourceIndex:z.number().int().min(0),
  feedback:z.string(),
  kicker:z.string().optional(),
  feedbackOk:z.string().optional(),
  feedbackBad:z.string().optional(),
  optionFeedback:z.record(z.string(),z.string()).optional(),
});

function stripMd(s:string){
  return s
    .replace(/^#{1,6}\s+/gm,"")
    .replace(/\*\*/g,"")
    .replace(/^>\s?/gm,"")
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)/g,"$1$2")
    .trim();
}

function stripEditorialSources(source:string){
  const lines=source.split(/\r?\n/);
  const idx=lines.findIndex(l=>/^#{1,6}\s+.*(?:Источники для фактчекинга|Sources for fact-checking)/i.test(l));
  return (idx>=0?lines.slice(0,idx):lines).join("\n").trim();
}

function splitChunks(source:string){
  return source.split(/\n-{3,}\n/g).map(x=>x.trim()).filter(Boolean);
}

function firstHeading(chunk:string){
  return chunk.split(/\r?\n/).find(l=>/^#{1,6}\s+/.test(l)) ?? "";
}

function parseChoice(chunk:string,id:string):ChoiceQuestion{
  const lines=chunk.split(/\r?\n/);
  const optionRows:{sourceIndex:number;text:string}[]=[];
  let firstOption=-1, answerLine=-1, answerLetter="";
  lines.forEach((line,i)=>{
    const m=line.match(/^([A-D])\.\s+(.+?)\s*$/);
    if(m){
      if(firstOption<0) firstOption=i;
      optionRows.push({sourceIndex:m[1].charCodeAt(0)-65,text:stripMd(m[2])});
    }
    const a=line.match(/^\*\*(?:Ответ|Answer):\*\*\s*([A-D])\b/i);
    if(a){answerLine=i;answerLetter=a[1].toUpperCase();}
  });
  if(optionRows.length>=2 && firstOption>=0 && answerLine>=0){
    const preLines=lines.slice(0,firstOption)
      .filter(l=>!/^#{1,6}\s+/.test(l))
      .filter(l=>!/^(?:Quick check|Быстрая проверка)$/i.test(stripMd(l)));
    const numberedHeading=firstHeading(chunk).match(/^##\s+\d+\.\s+(.+)\s*$/);
    // A short all-bold or all-italic line above the question is its title (kicker).
    const paras=preLines.join("\n").split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
    let kicker:string|undefined;
    let question:string;
    if(numberedHeading&&paras.length===1&&/^\*[^*].*\*$/.test(paras[0])){
      // "## 1. Question" + one italic line: the italic line is the question's title.
      question=stripMd(numberedHeading[1]);
      kicker=stripMd(paras[0]);
    }else{
      if(paras.length>1&&/^(?:\*\*[^*].*\*\*|\*[^*].*\*)$/.test(paras[0])){kicker=stripMd(paras[0]);paras.shift();}
      question=stripMd(paras.join("\n\n"));
      // Numbered Self-check questions keep the question text in the heading itself ("## 1. Who are the Titans?").
      if(!question&&numberedHeading) question=stripMd(numberedHeading[1]);
    }
    // Tagged feedback lines: shown only for a right answer, a wrong answer, or one chosen option.
    let feedbackOk:string|undefined, feedbackBad:string|undefined;
    const optionFeedback:Record<string,string>={};
    const rest:string[]=[];
    for(const para of lines.slice(answerLine+1).join("\n").split(/\n\s*\n/)){
      const t=para.trim(); if(!t) continue;
      let m=t.match(/^\*\*(?:Если верно|If correct):\*\*\s*([\s\S]+)$/i); if(m){feedbackOk=stripMd(m[1]);continue;}
      m=t.match(/^\*\*(?:Если неверно|If incorrect):\*\*\s*([\s\S]+)$/i); if(m){feedbackBad=stripMd(m[1]);continue;}
      m=t.match(/^\*\*(?:Вариант|Option)\s+([A-D]):\*\*\s*([\s\S]+)$/i); if(m){optionFeedback[String(m[1].toUpperCase().charCodeAt(0)-65)]=stripMd(m[2]);continue;}
      rest.push(t);
    }
    const feedback=stripMd(rest.join("\n\n"));
    const q={id,question,options:optionRows,answerSourceIndex:answerLetter.charCodeAt(0)-65,feedback,
      ...(kicker?{kicker}:{}),...(feedbackOk?{feedbackOk}:{}),...(feedbackBad?{feedbackBad}:{}),
      ...(Object.keys(optionFeedback).length?{optionFeedback}:{})};
    return choiceSchema.parse(q);
  }

  // Approved deterministic binary mapping:
  // source index 0 = True / Да, source index 1 = False / Нет.
  const heading=firstHeading(chunk);
  if(/(?:True or false\?|Правда или нет\?)/i.test(heading)){
    const bold=lines.map((line,i)=>({i,m:line.match(/^\*\*(.+?)\*\*\s*$/)})).filter(x=>x.m);
    if(bold.length>=2){
      const statement=stripMd(bold[0].m![1]);
      const verdict=stripMd(bold[1].m![1]).replace(/[.!?]+$/,"").toLowerCase();
      const isTrue=["true","да","верно"].includes(verdict);
      const isFalse=["false","нет","неверно"].includes(verdict);
      if(isTrue||isFalse){
        const options=heading.toLowerCase().includes("правда")
          ? [{sourceIndex:0,text:"Да"},{sourceIndex:1,text:"Нет"}]
          : [{sourceIndex:0,text:"True"},{sourceIndex:1,text:"False"}];
        const feedback=stripMd(lines.slice(bold[1].i+1).join("\n"));
        return choiceSchema.parse({id,question:statement,options,answerSourceIndex:isTrue?0:1,feedback});
      }
    }
  }

  throw new Error(`Ambiguous choice block ${id}`);
}

function parseSelfCheck(chunks:string[],start:number,locale:Locale,prefix="self-check"){
  const questions:ChoiceQuestion[]=[];
  let i=start+1;
  while(i<chunks.length){
    const h=firstHeading(chunks[i]);
    const m=h.match(/^##\s+(\d+)\.\s+/);
    if(!m) break;
    questions.push(parseChoice(chunks[i],`${prefix}-q${String(Number(m[1])).padStart(2,"0")}`));
    i++;
  }
  if(!questions.length) throw new Error(`Self-check has no questions (${locale})`);
  const markdown=chunks.slice(start,i).join("\n\n---\n\n");
  if(prefix==="exam") return {end:i,block:{type:"exam",id:"exam",markdown,questions} as const};
  return {end:i,block:{type:"self-check",id:"self-check",markdown,questions} as const};
}

function parseChallenge(chunk:string, fallbackId:string){
  const h=chunk.match(/^#{1,3}\s+(?:\d+\.\s+)?MYTH DECODER — LEVEL\s+([1-5])\s*$/mi);
  if(!h) return null;
  const level=Number(h[1]);
  const id=`module-challenge-${String(level).padStart(2,"0")}`;
  try {
    return {type:"module-challenge",id:fallbackId||id,level,markdown:chunk,question:parseChoice(chunk,id)} as const;
  } catch {
    return {type:"module-challenge",id:fallbackId||id,level,markdown:chunk,revealOnly:true} as const;
  }
}

export function parseLesson(moduleId:string,locale:Locale,course:CourseDefinition=PRIMARY_COURSE):LessonModel{
  const file=path.join(process.cwd(),"content",course.contentDir,"master",`${moduleId}.${locale}.md`);
  const source=fs.readFileSync(file,"utf8");

  // Required Step 8 architecture: source must form a valid Markdown AST before semantic transforms.
  unified().use(remarkParse).use(remarkGfm).parse(source);

  const learnerSource=stripEditorialSources(source);
  const manifestFile=path.join(process.cwd(),"content",course.contentDir,"visual-assets.json");
  const visualManifest:{entries:any[]}=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,"utf8")):{entries:[]};
  const chunks=splitChunks(learnerSource);
  // Courses other than Greek start with "# Модуль N / # Title / subtitle / **Время:**". The page hero already
  // shows the title and duration, so drop those lines from the first chunk and keep the subtitle.
  if(course.id!==PRIMARY_COURSE.id && chunks.length){
    chunks[0]=chunks[0].split(/\r?\n/).filter(l=>!/^#\s/.test(l)&&!/^\*\*(?:Время|Time):\*\*/.test(l)).join("\n").trim();
    if(!chunks[0]) chunks.shift();
  }
  // Greek: the intro chunk also carries text after the duration line, so only the lines up to it are dropped.
  if(course.id===PRIMARY_COURSE.id && chunks.length){
    chunks[0]=stripGreekIntro(chunks[0]);
    if(!chunks[0]) chunks.shift();
  }
  const blocks:LessonBlock[]=[];
  let quick=0, introAssigned=false;

  for(let i=0;i<chunks.length;){
    const chunk=chunks[i];
    const h=firstHeading(chunk);

    if(/^#\s+(?:Course final exam|Итоговый тест курса)\s*$/i.test(h)){
      const parsed=parseSelfCheck(chunks,i,locale,"exam");
      blocks.push(parsed.block); i=parsed.end; continue;
    }

    if(/^#\s+(?:Self-check|Самопроверка)\s*$/i.test(h)){
      const parsed=parseSelfCheck(chunks,i,locale);
      blocks.push(parsed.block); i=parsed.end; continue;
    }

    const visual=h.match(/^##\s+\[(?:VISUAL STOP|ВИЗУАЛЬНАЯ ОСТАНОВКА)\s+(\d+)\]\s*$/i);
    if(visual){
      // Greek modules 3–4: the stops are design briefs ("Показываем Цербера крупно…"), not learner text.
      // Those modules show their pictures beside the chapters instead (lib/content/greekArt.ts).
      if(course.id===PRIMARY_COURSE.id && hasGreekArt(moduleId) && !parseChallenge(chunk,"")){i++;continue;}
      const n=Number(visual[1]);
      const anchor=`visual-stop-${String(n).padStart(2,"0")}`;
      const challenge=parseChallenge(chunk,anchor);
      if(challenge){blocks.push(challenge);i++;continue;}
      const assetId=`${course.assetPrefix}-m${String(Number(moduleId.slice(-2))).padStart(2,"0")}-vs${String(n).padStart(2,"0")}`;
      const entry=visualManifest.entries.find((x:any)=>x.id===assetId);
      if(!entry && course.strictVisuals) throw new Error(`Missing approved Step 14 visual mapping for ${assetId}`);
      // Courses without a manifest entry get a text-only stop (no picture) instead of failing the build.
      blocks.push({type:"visual-stop",id:anchor,number:n,markdown:chunk,asset:entry?{
        id:entry.id,title:entry.title,alt:entry.alt[locale],production:entry.production,priority:entry.priority
      }:{id:assetId,title:"",alt:"",production:"none",priority:"normal"}});
      i++; continue;
    }

    const game=chunk.trim().match(/^\[\[game:([a-z0-9-]+)\]\]$/);
    if(game){blocks.push({type:"game",id:`game-${game[1]}`,game:game[1],markdown:chunk});i++;continue;}
    // [[activity:<id>]] — one of the drop-in activities from lib/content/activities.ts
    const activity=chunk.trim().match(/^\[\[activity:([a-z0-9-]+)\]\]$/);
    if(activity){blocks.push({type:"game",id:`activity-${activity[1]}`,game:`activity:${activity[1]}`,markdown:chunk});i++;continue;}

    const challenge=parseChallenge(chunk,"");
    if(challenge){blocks.push(challenge);i++;continue;}

    if(/^##\s+(?:Quick check|Быстрая проверка)\s*$/i.test(h)){
      quick++;
      const id=`quick-check-${String(quick).padStart(2,"0")}`;
      blocks.push({type:"quick-check",id,markdown:chunk,question:parseChoice(chunk,id)});
      i++;continue;
    }

    if(/^#\s+(?:Module completed|Модуль завершён)\s*$/i.test(h)){
      blocks.push({type:"module-complete",id:"module-complete",markdown:chunk});i++;continue;
    }

    if(/^#\s+(?:Next|Дальше)\s*$/i.test(h)){
      blocks.push({type:"next-module",id:"next-module",markdown:chunk});i++;continue;
    }

    // Strict section rule: a numbered section requires a non-empty title.
    const strict=chunk.match(/^#\s+(\d+)\.[ \t]+(.+)\s*$/m);
    const id=strict?`section-${String(Number(strict[1])).padStart(2,"0")}`:(!introAssigned?"intro":`prose-${String(blocks.length+1).padStart(2,"0")}`);
    if(!introAssigned) introAssigned=true;
    if(course.id===PRIMARY_COURSE.id) blocks.push(...greekProseBlocks(chunk,id,moduleId,locale));
    else blocks.push({type:"prose",id,markdown:tidyProse(chunk,{leadIns:course.layout==="newspaper"})});
    i++;
  }

  const moduleNumber=Number(moduleId.slice(-2));
  const durationLine=source.split(/\r?\n/).find(l=>locale==="ru"?/^\*\*Время:\*\*/.test(l):/^\*\*Time:\*\*/.test(l));
  const durationLabel=durationLine?.replace(/^\*\*(?:Время|Time):\*\*\s*/,"").trim() ?? "";

  return {
    courseId:course.id,moduleId,moduleNumber,locale,
    title:courseModule(course,moduleId)?.title[locale] ?? moduleTitle(moduleId,locale),durationLabel,
    contentVersion:course.contentVersion,blocks
  };
}
