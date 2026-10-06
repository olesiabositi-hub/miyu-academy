import fs from "node:fs";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import type { Locale } from "@/lib/course";
import { CONTENT_VERSION, COURSE_ID } from "@/lib/course";
import { moduleTitle } from "@/lib/content/catalog";
import type { ChoiceQuestion, LessonBlock, LessonModel } from "@/lib/content/types";

const choiceSchema = z.object({
  id:z.string(),
  question:z.string().min(1),
  options:z.array(z.object({sourceIndex:z.number().int().min(0),text:z.string().min(1)})).min(2),
  answerSourceIndex:z.number().int().min(0),
  feedback:z.string(),
});

function stripMd(s:string){
  return s
    .replace(/^#{1,6}\s+/gm,"")
    .replace(/\*\*/g,"")
    .replace(/^>\s?/gm,"")
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
    const m=line.match(/^([A-C])\.\s+(.+?)\s*$/);
    if(m){
      if(firstOption<0) firstOption=i;
      optionRows.push({sourceIndex:m[1].charCodeAt(0)-65,text:stripMd(m[2])});
    }
    const a=line.match(/^\*\*(?:Ответ|Answer):\*\*\s*([A-C])\b/i);
    if(a){answerLine=i;answerLetter=a[1].toUpperCase();}
  });
  if(optionRows.length>=2 && firstOption>=0 && answerLine>=0){
    const pre=lines.slice(0,firstOption)
      .filter(l=>!/^#{1,6}\s+/.test(l))
      .filter(l=>!/^(?:Quick check|Быстрая проверка)$/i.test(stripMd(l)))
      .join("\n");
    const question=stripMd(pre);
    const feedback=stripMd(lines.slice(answerLine+1).join("\n"));
    const q={id,question,options:optionRows,answerSourceIndex:answerLetter.charCodeAt(0)-65,feedback};
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

function parseSelfCheck(chunks:string[],start:number,locale:Locale){
  const questions:ChoiceQuestion[]=[];
  let i=start+1;
  while(i<chunks.length){
    const h=firstHeading(chunks[i]);
    const m=h.match(/^##\s+(\d+)\.\s+/);
    if(!m) break;
    questions.push(parseChoice(chunks[i],`self-check-q${String(Number(m[1])).padStart(2,"0")}`));
    i++;
  }
  if(!questions.length) throw new Error(`Self-check has no questions (${locale})`);
  return {end:i,block:{type:"self-check",id:"self-check",markdown:chunks.slice(start,i).join("\n\n---\n\n"),questions} as const};
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

export function parseLesson(moduleId:string,locale:Locale):LessonModel{
  const file=path.join(process.cwd(),"content","greek-mythology","master",`${moduleId}.${locale}.md`);
  const source=fs.readFileSync(file,"utf8");

  // Required Step 8 architecture: source must form a valid Markdown AST before semantic transforms.
  unified().use(remarkParse).use(remarkGfm).parse(source);

  const learnerSource=stripEditorialSources(source);
  const visualManifest=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content","greek-mythology","visual-assets.json"),"utf8"));
  const chunks=splitChunks(learnerSource);
  const blocks:LessonBlock[]=[];
  let quick=0, introAssigned=false;

  for(let i=0;i<chunks.length;){
    const chunk=chunks[i];
    const h=firstHeading(chunk);

    if(/^#\s+(?:Self-check|Самопроверка)\s*$/i.test(h)){
      const parsed=parseSelfCheck(chunks,i,locale);
      blocks.push(parsed.block); i=parsed.end; continue;
    }

    const visual=h.match(/^##\s+\[(?:VISUAL STOP|ВИЗУАЛЬНАЯ ОСТАНОВКА)\s+(\d+)\]\s*$/i);
    if(visual){
      const n=Number(visual[1]);
      const anchor=`visual-stop-${String(n).padStart(2,"0")}`;
      const challenge=parseChallenge(chunk,anchor);
      if(challenge){blocks.push(challenge);i++;continue;}
      const assetId=`gm-m${String(Number(moduleId.slice(-2))).padStart(2,"0")}-vs${String(n).padStart(2,"0")}`;
      const entry=visualManifest.entries.find((x:any)=>x.id===assetId);
      if(!entry) throw new Error(`Missing approved Step 14 visual mapping for ${assetId}`);
      blocks.push({type:"visual-stop",id:anchor,number:n,markdown:chunk,asset:{
        id:entry.id,title:entry.title,alt:entry.alt[locale],production:entry.production,priority:entry.priority
      }});
      i++; continue;
    }

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
    blocks.push({type:"prose",id,markdown:chunk});
    i++;
  }

  const moduleNumber=Number(moduleId.slice(-2));
  const durationLine=source.split(/\r?\n/).find(l=>locale==="ru"?/^\*\*Время:\*\*/.test(l):/^\*\*Time:\*\*/.test(l));
  const durationLabel=durationLine?.replace(/^\*\*(?:Время|Time):\*\*\s*/,"").trim() ?? "";

  return {
    courseId:COURSE_ID,moduleId,moduleNumber,locale,
    title:moduleTitle(moduleId,locale),durationLabel,
    contentVersion:CONTENT_VERSION,blocks
  };
}
