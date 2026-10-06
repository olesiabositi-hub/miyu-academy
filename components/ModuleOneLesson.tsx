"use client";

import { useEffect } from "react";
import type { LessonBlock, LessonModel } from "@/lib/content/types";
import { Markdown } from "@/components/Markdown";
import { ChoiceCheck } from "@/components/Checks";
import styles from "./ModuleOneLesson.module.css";

type ProseBlock = Extract<LessonBlock,{type:"prose"}>;
type QuickBlock = Extract<LessonBlock,{type:"quick-check"}>;
type SelfBlock = Extract<LessonBlock,{type:"self-check"}>;
type CompleteBlock = Extract<LessonBlock,{type:"module-complete"}>;
type ArtKind="hero"|"middle"|"chaos"|"gaia"|"titans";

const art:Record<ArtKind,{src:string;width:number;height:number;ru:string;en:string}>={
  hero:{src:"/visuals/module-01/01-HERO-gaia-birth-of-order-1672.webp",width:1672,height:941,ru:"Гея — живая Земля в первом свете первозданного мира.",en:"Gaia emerging as living Earth in the first light of the primordial world."},
  middle:{src:"/visuals/module-01/02-MIDDLE-gaia-primordial-world-1672.webp",width:1672,height:941,ru:"Гея и первозданный мир до установления олимпийского порядка.",en:"Gaia and the primordial world before the Olympian order."},
  chaos:{src:"/visuals/module-01/03-DETAIL-chaos-titans-1254.webp",width:1254,height:1254,ru:"Первозданный мир на переходе от Хаоса к древнему поколению богов.",en:"The primordial world in the transition from Chaos toward the older generation of gods."},
  gaia:{src:"/visuals/module-01/04-DETAIL-gaia-1254.webp",width:1254,height:1254,ru:"Гея — Земля как живое божественное существо.",en:"Gaia — Earth as a living divine being."},
  titans:{src:"/visuals/module-01/05-DETAIL-titans-1254.webp",width:1254,height:1254,ru:"Титаны — старшее поколение божеств.",en:"The Titans — the older generation of deities."},
};

async function post(url:string,body:unknown){
  const r=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}

function Art({kind,className="",eager=false,locale}:{kind:ArtKind;className?:string;eager?:boolean;locale:"ru"|"en"}){
  const a=art[kind];
  return <img className={className} src={a.src} width={a.width} height={a.height} alt={a[locale]} loading={eager?"eager":"lazy"} fetchPriority={eager?"high":"auto"} decoding={eager?"sync":"async"}/>;
}

function firstHeadingRemoved(markdown:string){
  const lines=markdown.split(/\r?\n/);
  const first=lines.findIndex(line=>/^#{1,6}\s+/.test(line));
  if(first<0)return {heading:"",body:markdown};
  const heading=lines[first].replace(/^#{1,6}\s+/,"").trim();
  const body=lines.filter((_,i)=>i!==first).join("\n").trim();
  return {heading,body};
}

function splitOpening(markdown:string){
  const lines=markdown.split(/\r?\n/);
  const pullIndex=lines.findIndex(line=>/^\*\*.*→.*\*\*\s*$/.test(line));
  if(pullIndex<0)return {body:markdown,pull:""};
  const pull=lines[pullIndex].replace(/^\*\*/,"").replace(/\*\*\s*$/,"").trim();
  return {body:lines.filter((_,i)=>i!==pullIndex).join("\n").trim(),pull};
}

function splitTitans(markdown:string){
  const lines=markdown.split(/\r?\n/);
  const menLabel=lines.findIndex(line=>/^(Шесть мужчин|Six men):\s*$/.test(line.trim()));
  const womenLabel=lines.findIndex(line=>/^(И шесть женщин|And six women):\s*$/.test(line.trim()));
  if(menLabel<0||womenLabel<0)return null;
  const men=lines.slice(menLabel+1,womenLabel).map(x=>x.trim()).filter(Boolean);
  const afterWomen=lines.slice(womenLabel+1);
  const women:string[]=[];
  let consumed=0;
  for(const line of afterWomen){
    consumed++;
    if(!line.trim())continue;
    if(women.length<6){women.push(line.trim());continue;}
    consumed--;break;
  }
  while(consumed<afterWomen.length && !afterWomen[consumed]?.trim())consumed++;
  return {
    intro:lines.slice(0,menLabel).join("\n").trim(),
    menLabel:lines[menLabel].trim(),men,
    womenLabel:lines[womenLabel].trim(),women,
    tail:afterWomen.slice(consumed).join("\n").trim(),
  };
}

function prose(model:LessonModel,id:string){
  const block=model.blocks.find(b=>b.type==="prose"&&b.id===id) as ProseBlock|undefined;
  if(!block)throw new Error(`Module 1 missing prose block ${id}`);
  return block;
}
function quick(model:LessonModel,id:string){
  const block=model.blocks.find(b=>b.type==="quick-check"&&b.id===id) as QuickBlock|undefined;
  if(!block)throw new Error(`Module 1 missing quick check ${id}`);
  return block;
}
function selfCheck(model:LessonModel){
  const block=model.blocks.find(b=>b.type==="self-check") as SelfBlock|undefined;
  if(!block)throw new Error("Module 1 missing self-check");
  return block;
}
function completion(model:LessonModel){
  const block=model.blocks.find(b=>b.type==="module-complete") as CompleteBlock|undefined;
  if(!block)throw new Error("Module 1 missing completion block");
  return block;
}

export function ModuleOneLesson({model}:{model:LessonModel}){
  const ru=model.locale==="ru";
  const opening=prose(model,"prose-02");
  const openingSplit=splitOpening(opening.markdown);
  const warning=prose(model,"section-01");
  const beginning=prose(model,"section-02");
  const beginningSplit=firstHeadingRemoved(beginning.markdown);
  const q1=quick(model,"quick-check-01");
  const sky=prose(model,"section-03");
  const titans=prose(model,"section-04");
  const titansSplit=splitTitans(titans.markdown);
  const giantQuestion=prose(model,"prose-08");
  const titanMeaning=prose(model,"prose-09");
  const nextGeneration=prose(model,"section-05");
  const q2=quick(model,"quick-check-02");
  const cronus=prose(model,"section-06");
  const brothers=prose(model,"section-07");
  const lots=prose(model,"section-08");
  const zeus=prose(model,"section-09");
  const poseidon=prose(model,"section-10");
  const hades=prose(model,"section-11");
  const hadesClarification=prose(model,"section-12");
  const summary=prose(model,"section-13");
  const self=selfCheck(model);
  const remember=prose(model,"prose-21");
  const complete=completion(model);

  useEffect(()=>{post("/api/module/start",{moduleId:model.moduleId}).catch(()=>{})},[model.moduleId]);
  const persistCheck=(checkId:string,sourceIndex:number)=>post("/api/module/check",{moduleId:model.moduleId,checkId,sourceIndex}).catch(()=>{});

  async function finish(){
    await post("/api/module/complete",{moduleId:model.moduleId});
    location.href=`/${model.locale}/courses/greek-mythology/module-02`;
  }

  return <article className={styles.page}>
    <section id="intro" className={styles.hero} aria-labelledby="m1-title">
      <Art kind="hero" className={styles.heroImage} locale={model.locale} eager/>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>{ru?"МОДУЛЬ 01 / 08":"MODULE 01 / 08"}</p>
          <h1 id="m1-title">{model.title}</h1>
          <p className={styles.duration}><span className={styles.clock} aria-hidden="true"/>{model.durationLabel}</p>
        </div>
      </div>
    </section>

    <nav className={styles.sectionNav} aria-label={ru?"Навигация по модулю":"Module navigation"}>
      <a className={styles.sectionNavActive} href="#section-02">{ru?"Начало мира":"The first world"}</a>
      <span aria-hidden="true"/>
      <a href="#section-04">{ru?"Титаны":"The Titans"}</a>
      <span aria-hidden="true"/>
      <a href="#section-05">{ru?"Новое поколение":"The new generation"}</a>
      <span aria-hidden="true"/>
      <a href="#self-check">{ru?"Самопроверка":"Self-check"}</a>
    </nav>

    <section id="prose-02" className={styles.opening}>
      <div className={styles.openingBody}><Markdown>{openingSplit.body}</Markdown></div>
      {openingSplit.pull&&<blockquote className={styles.openingPull}>{openingSplit.pull}</blockquote>}
    </section>

    <section id="section-01" className={styles.readingWide}><Markdown>{warning.markdown}</Markdown></section>

    <section id="section-02" className={styles.gaiaSection}>
      <div className={styles.gaiaArt}><Art kind="gaia" locale={model.locale}/></div>
      <div className={styles.gaiaCopy}>
        <p className={styles.marker}>{beginningSplit.heading}</p>
        <Markdown>{beginningSplit.body}</Markdown>
      </div>
    </section>

    <section id="quick-check-01" className={styles.quickScene}>
      <div className={styles.quickInner}><div className={styles.quickCopy}>
        <p className={styles.marker}>{ru?"БЫСТРАЯ ПРОВЕРКА":"QUICK CHECK"}</p>
        <ChoiceCheck question={q1.question} locale={model.locale} onPersist={(v)=>persistCheck(q1.id,v)}/>
      </div></div>
      <div className={styles.quickArt}><Art kind="chaos" locale={model.locale}/></div>
    </section>

    <section id="section-03" className={styles.readingWide}><Markdown>{sky.markdown}</Markdown></section>

    <section id="section-04" className={styles.titansSection}>
      {titansSplit?<>
        <div className={styles.titansLead}><Markdown>{titansSplit.intro}</Markdown><Markdown>{titansSplit.tail}</Markdown></div>
        <div className={styles.titanLists}>
          <div><h3>{titansSplit.menLabel}</h3>{titansSplit.men.map(name=><p key={name}>{name}</p>)}</div>
          <div><h3>{titansSplit.womenLabel}</h3>{titansSplit.women.map(name=><p key={name}>{name}</p>)}</div>
        </div>
      </>:<Markdown>{titans.markdown}</Markdown>}
      <div className={styles.titanPair}>
        <div id="prose-08"><Markdown>{giantQuestion.markdown}</Markdown></div>
        <div id="prose-09"><Markdown>{titanMeaning.markdown}</Markdown></div>
      </div>
      <div className={styles.titansLandscape}><Art kind="titans" locale={model.locale}/></div>
    </section>

    <nav className={styles.chapterTransition} aria-label={ru?"Продолжить модуль":"Continue module"}>
      <div className={styles.chapterCount}>04 / 13</div>
      <div className={styles.chapterTrack}><span style={{width:"31%"}}/></div>
      <div className={styles.chapterNext}>{ru?"Дальше — новое поколение богов":"Next — the new generation of gods"}</div>
      <a className={styles.continueButton} href="#section-05">{ru?"Продолжить":"Continue"}<span aria-hidden="true">→</span></a>
    </nav>

    <section id="section-05" className={styles.readingWide}><Markdown>{nextGeneration.markdown}</Markdown></section>

    <section id="quick-check-02" className={`${styles.quickScene} ${styles.quickScenePlain}`}>
      <div className={styles.quickInner}><div className={styles.quickCopy}>
        <p className={styles.marker}>{ru?"БЫСТРАЯ ПРОВЕРКА":"QUICK CHECK"}</p>
        <ChoiceCheck question={q2.question} locale={model.locale} onPersist={(v)=>persistCheck(q2.id,v)}/>
      </div></div>
    </section>

    <section id="section-06" className={styles.readingWide}><Markdown>{cronus.markdown}</Markdown></section>
    <figure className={styles.middleScene}><Art kind="middle" locale={model.locale}/></figure>

    <section id="section-07" className={styles.splitEditorial}>
      <div><Markdown>{brothers.markdown}</Markdown></div>
      <div id="section-08"><Markdown>{lots.markdown}</Markdown></div>
    </section>

    <section className={styles.realmGrid} aria-label={ru?"Три сферы мира":"Three realms"}>
      <div id="section-09"><Markdown>{zeus.markdown}</Markdown></div>
      <div id="section-10"><Markdown>{poseidon.markdown}</Markdown></div>
      <div id="section-11"><Markdown>{hades.markdown}</Markdown></div>
    </section>

    <section id="section-12" className={styles.readingWide}><Markdown>{hadesClarification.markdown}</Markdown></section>
    <section id="section-13" className={`${styles.readingWide} ${styles.summary}`}><Markdown>{summary.markdown}</Markdown></section>

    <section id="self-check" className={styles.selfCheck}>
      <Markdown>{self.markdown}</Markdown>
      <div className={styles.selfQuestions}>{self.questions.map(q=><ChoiceCheck key={q.id} question={q} locale={model.locale} onPersist={(v)=>persistCheck(q.id,v)}/>)}</div>
    </section>

    <section id="prose-21" className={`${styles.readingWide} ${styles.remember}`}><Markdown>{remember.markdown}</Markdown></section>

    <section id="module-complete" className={styles.complete}>
      <div className={styles.completeCopy}><Markdown>{complete.markdown}</Markdown></div>
      <div className={styles.completeNav}>
        <div className={styles.chapterCount}>13 / 13</div>
        <div className={styles.chapterTrack}><span style={{width:"100%"}}/></div>
        <div className={styles.chapterNext}>{ru?"Модуль 2":"Module 2"}</div>
        <button className={styles.continueButton} onClick={finish}>{ru?"Продолжить":"Continue"}<span aria-hidden="true">→</span></button>
      </div>
    </section>
  </article>;
}
