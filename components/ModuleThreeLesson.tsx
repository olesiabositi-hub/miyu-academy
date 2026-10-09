"use client";

import { Fragment, useEffect } from "react";
import type { LessonBlock, LessonModel } from "@/lib/content/types";
import { Markdown } from "@/components/Markdown";
import { ChoiceCheck, SelfCheck } from "@/components/Checks";
import { ModuleOutro } from "@/components/ModuleOutro";
import { parseCompletion, parseNext } from "@/lib/content/outro";
import styles from "./ModuleThreeLesson.module.css";

type ProseBlock = Extract<LessonBlock,{type:"prose"}>;
type QuickBlock = Extract<LessonBlock,{type:"quick-check"}>;
type SelfBlock = Extract<LessonBlock,{type:"self-check"}>;
type CompleteBlock = Extract<LessonBlock,{type:"module-complete"}>;
type NextBlock = Extract<LessonBlock,{type:"next-module"}>;
type ArtKind="hero"|"bestiary"|"cerberus"|"minotaur"|"sirens"|"hydra"|"polyphemus"|"closing";
type Part={heading:string;body:string};
type Subsection={heading:string;body:string};

const art:Record<ArtKind,{src:string;width:number;height:number;ru:string;en:string}>={
  hero:{src:"/visuals/module-03/01-HERO-mythic-bestiary.webp",width:1672,height:941,ru:"Мифологический бестиарий.",en:"A mythological bestiary."},
  bestiary:{src:"/visuals/module-03/02-BESTIARY-six-creatures-grid.webp",width:1448,height:1086,ru:"Шесть мифологических существ.",en:"Six mythological creatures."},
  cerberus:{src:"/visuals/module-03/03-CERBERUS-underworld-guardian.webp",width:1672,height:941,ru:"Цербер у входа в подземный мир.",en:"Cerberus at the entrance to the Underworld."},
  minotaur:{src:"/visuals/module-03/04-MINOTAUR-labyrinth.webp",width:1672,height:941,ru:"Минотавр в Лабиринте.",en:"The Minotaur in the Labyrinth."},
  sirens:{src:"/visuals/module-03/05-SIRENS-modern-vs-ancient.webp",width:1672,height:941,ru:"Современный русалкоподобный образ и античная сирена-женщина-птица.",en:"A modern mermaid-like Siren and an ancient bird-woman Siren."},
  hydra:{src:"/visuals/module-03/06-HYDRA-many-headed-problem.webp",width:1672,height:941,ru:"Лернейская гидра.",en:"The Lernaean Hydra."},
  polyphemus:{src:"/visuals/module-03/07-POLYPHEMUS-cyclops.webp",width:1122,height:1402,ru:"Полифем — одноглазый циклоп-пастух.",en:"Polyphemus — the one-eyed Cyclops shepherd."},
  closing:{src:"/visuals/module-03/08-BESTIARY-closing-grid.webp",width:1448,height:1086,ru:"Шесть существ бестиария.",en:"The six creatures in the bestiary."},
};

const copy={
  ru:{
    module:"МОДУЛЬ 03 / 08",nav:["Что такое монстр","Цербер","Медуза","Минотавр","Сирены","Гидра","Циклоп"],
    recognitionTitle:"Узнаете кого-нибудь?",recognitionNote:"Ничего выбирать не нужно. В конце модуля мы покажем эту же шестёрку ещё раз.",
    recognitionQuestion:"Сколько из шести вы узнали до начала урока?",
    markers:["01 / СНАЧАЛА","02 / ЦЕРБЕР","03 / МЕДУЗА","04 / МИНОТАВР","05 / СИРЕНЫ","06 / ГИДРА","07 / ЦИКЛОП","08 / СОБИРАЕМ БЕСТИАРИЙ"],
    quick:"БЫСТРАЯ ПРОВЕРКА",self:"САМОПРОВЕРКА",remember:"REMEMBER 6",
    v2:["3 головы","вход в подземный мир","главная функция: не пропускать"],
    mythModern:["ЦЕРБЕР","охраняет границу между мирами","SECURITY","контролирует доступ","Один образ. Та же идея спустя тысячи лет."],
    medusaCliff:["ЦЕЛЬ","победить Медузу","ПРОБЛЕМА","нельзя смотреть на Медузу","Как бы вы решили задачу?"],
    medusaBrand:["≈ 2500 лет","VERSACE","MEDUSA","iconic House code"],
    route:["Крит","Лабиринт","Минотавр","Тесей → скоро войдёт сюда"],
    siren:["СЕЙЧАС","русалкоподобный образ","ДРЕВНЯЯ ГРЕЦИЯ","женщина-птица"],
    timeline:[["Ancient Greece","женщина-птица"],["Later European tradition","сирена сближается с образом русалки"],["Starbucks","двухвостая морская сирена"]],
    hydra:["ОДНА МАЛЕНЬКАЯ ЗАДАЧА","Исправить форму","сломалась авторизация","миграция БД","переделать onboarding","HYDRA","Если одна задача уже превратилась в четыре — возможно, вы нашли её."],
    poseidon:["Посейдон","сын","Полифем","встречает Одиссея","что-то идёт очень плохо ?"],
    labels:[["Цербер","охранник"],["Медуза","взгляд"],["Минотавр","лабиринт"],["Сирены","опасное притяжение"],["Гидра","размножающаяся проблема"],["Полифем","один глаз"]],
    closingQuestion:"Теперь узнаёте всех шестерых?",nextLabel:"Дальше — герои",continue:"Продолжить",
  },
  en:{
    module:"MODULE 03 / 08",nav:["What is a monster?","Cerberus","Medusa","Minotaur","Sirens","Hydra","Cyclops"],
    recognitionTitle:"Recognise anyone?",recognitionNote:"There is nothing to choose. At the end of the module, we will show the same six again.",
    recognitionQuestion:"How many of the six did you recognise before the lesson started?",
    markers:["01 / FIRST","02 / CERBERUS","03 / MEDUSA","04 / MINOTAUR","05 / SIRENS","06 / HYDRA","07 / CYCLOPS","08 / BUILD THE BESTIARY"],
    quick:"QUICK CHECK",self:"SELF-CHECK",remember:"REMEMBER 6",
    v2:["3 heads","entrance to the Underworld","main function: do not let things pass through"],
    mythModern:["CERBERUS","Guards the boundary between worlds","SECURITY","Controls access","One image. The same idea thousands of years later."],
    medusaCliff:["GOAL","defeat Medusa","PROBLEM","you cannot look at Medusa","How would you solve the problem?"],
    medusaBrand:["≈ 2500 years","VERSACE","MEDUSA","iconic House code"],
    route:["Crete","Labyrinth","Minotaur","Theseus → will enter here soon"],
    siren:["NOW","a mermaid-like image","ANCIENT GREECE","a bird-woman"],
    timeline:[["Ancient Greece","bird-woman"],["Later European tradition","the Siren gradually moves closer to the image of a mermaid"],["Starbucks","a two-tailed sea Siren"]],
    hydra:["ONE SMALL TASK","Fix the form","authentication broke","DB migration","redo onboarding","HYDRA","If one task has already turned into four, you may have found it."],
    poseidon:["Poseidon","son","Polyphemus","meets Odysseus","something goes very wrong ?"],
    labels:[["Cerberus","guard"],["Medusa","gaze"],["Minotaur","Labyrinth"],["Sirens","dangerous attraction"],["Hydra","multiplying problem"],["Polyphemus","one eye"]],
    closingQuestion:"Can you recognise all six now?",nextLabel:"Next — heroes",continue:"Continue",
  }
} as const;

async function post(url:string,body:unknown){
  const r=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}

function Art({kind,className="",eager=false,locale}:{kind:ArtKind;className?:string;eager?:boolean;locale:"ru"|"en"}){
  const a=art[kind];
  return <img className={className} src={a.src} width={a.width} height={a.height} alt={a[locale]} loading={eager?"eager":"lazy"} fetchPriority={eager?"high":"auto"} decoding={eager?"sync":"async"}/>;
}

function prose(model:LessonModel,id:string){
  const block=model.blocks.find(b=>b.type==="prose"&&b.id===id) as ProseBlock|undefined;
  if(!block) throw new Error(`Module 3 missing prose block ${id}`);
  return block;
}
function quick(model:LessonModel,id:string){
  const block=model.blocks.find(b=>b.type==="quick-check"&&b.id===id) as QuickBlock|undefined;
  if(!block) throw new Error(`Module 3 missing quick check ${id}`);
  return block;
}
function selfCheck(model:LessonModel){
  const block=model.blocks.find(b=>b.type==="self-check") as SelfBlock|undefined;
  if(!block) throw new Error("Module 3 missing self-check");
  return block;
}
function completion(model:LessonModel){
  const block=model.blocks.find(b=>b.type==="module-complete") as CompleteBlock|undefined;
  if(!block) throw new Error("Module 3 missing completion block");
  return block;
}
function nextBlock(model:LessonModel){
  const block=model.blocks.find(b=>b.type==="next-module") as NextBlock|undefined;
  if(!block) throw new Error("Module 3 missing next-module block");
  return block;
}
function rememberBlock(model:LessonModel){
  const block=model.blocks.find(b=>b.type==="prose"&&/^#\s+(?:If you remember only six things|Если запомнить только шесть вещей)/im.test(b.markdown)) as ProseBlock|undefined;
  if(!block) throw new Error("Module 3 missing remember block");
  return block;
}
function cleanHeading(s:string){return s.replace(/^\d+\.\s*/,"").trim();}
function displayify(s:string){return s.replace(/^#\s+/gm,"### ");}
function splitHeading(markdown:string):Part{
  const lines=markdown.split(/\r?\n/);
  const i=lines.findIndex(line=>/^#{1,6}\s+/.test(line));
  if(i<0)return {heading:"",body:displayify(markdown)};
  return {heading:cleanHeading(lines[i].replace(/^#{1,6}\s+/,"")),body:displayify(lines.filter((_,n)=>n!==i).join("\n").trim())};
}
function introBody(markdown:string){
  const lines=markdown.split(/\r?\n/);
  let headingCount=0;
  return displayify(lines.filter(line=>{
    if(/^#\s+/.test(line)&&headingCount<2){headingCount++;return false;}
    if(/^\*\*(?:Время|Time):\*\*/.test(line)) return false;
    return true;
  }).join("\n").trim());
}
function introPull(markdown:string){
  const headings=markdown.split(/\r?\n/).filter(line=>/^#\s+/.test(line)).map(x=>x.replace(/^#\s+/,"").trim());
  return headings[2]??"";
}
function splitSubsections(markdown:string){
  const base=splitHeading(markdown);
  const lines=base.body.split(/\r?\n/);
  const indexes:number[]=[];
  lines.forEach((line,i)=>{if(/^###\s+/.test(line))indexes.push(i)});
  if(!indexes.length)return {heading:base.heading,intro:base.body,items:[] as Subsection[]};
  const intro=lines.slice(0,indexes[0]).join("\n").trim();
  const items=indexes.map((start,idx)=>{
    const end=indexes[idx+1]??lines.length;
    return {heading:lines[start].replace(/^###\s+/,"").trim(),body:lines.slice(start+1,end).join("\n").trim()};
  });
  return {heading:base.heading,intro,items};
}

function splitNext(markdown:string):Part{
  const lines=markdown.split(/\r?\n/);
  const first=lines.findIndex(line=>/^#\s+/.test(line));
  const second=lines.findIndex((line,i)=>i>first&&/^##\s+/.test(line));
  if(second<0) return splitHeading(markdown);
  return {
    heading:lines[second].replace(/^##\s+/,"").trim(),
    body:displayify(lines.filter((_,i)=>i!==first&&i!==second).join("\n").trim())
  };
}

export function ModuleThreeLesson({model}:{model:LessonModel}){
  const t=copy[model.locale];
  const intro=prose(model,"intro");
  const s1=splitHeading(prose(model,"section-01").markdown);
  const s2=splitHeading(prose(model,"section-02").markdown);
  const s3=splitHeading(prose(model,"section-03").markdown);
  const s4=splitHeading(prose(model,"section-04").markdown);
  const s5=splitHeading(prose(model,"section-05").markdown);
  const s6=splitHeading(prose(model,"section-06").markdown);
  const s7=splitHeading(prose(model,"section-07").markdown);
  const s8=splitHeading(prose(model,"section-08").markdown);
  const s9=splitHeading(prose(model,"section-09").markdown);
  const s10=splitHeading(prose(model,"section-10").markdown);
  const s11=splitHeading(prose(model,"section-11").markdown);
  const s12=splitHeading(prose(model,"section-12").markdown);
  const s13=splitHeading(prose(model,"section-13").markdown);
  const s14=splitHeading(prose(model,"section-14").markdown);
  const s15=splitHeading(prose(model,"section-15").markdown);
  const s16=splitHeading(prose(model,"section-16").markdown);
  const s17=splitHeading(prose(model,"section-17").markdown);
  const s18=splitHeading(prose(model,"section-18").markdown);
  const s19=splitHeading(prose(model,"section-19").markdown);
  const s20=splitHeading(prose(model,"section-20").markdown);
  const q1=quick(model,"quick-check-01"),q2=quick(model,"quick-check-02"),q3=quick(model,"quick-check-03"),q4=quick(model,"quick-check-04");
  const self=selfCheck(model);
  const remember=splitSubsections(rememberBlock(model).markdown);
  const outro=parseCompletion([completion(model).markdown]);
  const nextText=parseNext(nextBlock(model).markdown);
  const selfIntro=self.markdown.split(/\n-{3,}\n/)[0].replace(/^#\s+(?:Self-check|Самопроверка)\s*/i,"").trim();

  useEffect(()=>{post("/api/module/start",{moduleId:model.moduleId}).catch(()=>{})},[model.moduleId]);
  const persistCheck=(checkId:string,sourceIndex:number)=>post("/api/module/check",{moduleId:model.moduleId,checkId,sourceIndex}).catch(()=>{});

  return <article className={styles.page}>
    <section className={styles.hero} aria-labelledby="m3-title">
      <Art kind="hero" className={styles.heroImage} locale={model.locale} eager/>
      <div className={styles.heroShade}/>
      <div className={styles.heroInner}><div className={styles.heroCopy}>
        <p className={styles.kicker}>{t.module}</p>
        <h1 id="m3-title">{model.title}</h1>
        <p className={styles.duration}><span className={styles.clock} aria-hidden="true"/>{model.durationLabel}</p>
      </div></div>
    </section>

    <nav className={styles.sectionNav} aria-label={model.locale==="ru"?"Навигация по модулю":"Module navigation"}>
      <a href="#monster">{t.nav[0]}</a><span aria-hidden="true"/>
      <a href="#cerberus">{t.nav[1]}</a><span aria-hidden="true"/>
      <a href="#medusa">{t.nav[2]}</a><span aria-hidden="true"/>
      <a href="#minotaur">{t.nav[3]}</a><span aria-hidden="true"/>
      <a href="#sirens">{t.nav[4]}</a><span aria-hidden="true"/>
      <a href="#hydra">{t.nav[5]}</a><span aria-hidden="true"/>
      <a href="#cyclops">{t.nav[6]}</a>
    </nav>

    <section className={styles.opening}>
      <div className={`${styles.rich} ${styles.openingText}`}><Markdown>{introBody(intro.markdown)}</Markdown></div>
      <blockquote>{introPull(intro.markdown)}</blockquote>
    </section>

    <section className={styles.recognition}>
      <div className={`${styles.reading} ${styles.sectionHead}`}><p className={styles.marker}>{model.locale==="ru"?"ВИЗУАЛЬНАЯ ОСТАНОВКА 01":"VISUAL STOP 01"}</p><h2>{t.recognitionTitle}</h2><p>{t.recognitionNote}</p></div>
      <figure className={styles.bestiaryGrid}><Art kind="bestiary" locale={model.locale}/></figure>
      <div className={`${styles.reading} ${styles.recognitionQuestion}`}>{t.recognitionQuestion}</div>
    </section>

    <section id="monster" className={`${styles.monsterIntro} ${styles.reading}`}>
      <div><p className={styles.marker}>{t.markers[0]}</p><h2>{s1.heading}</h2><div className={styles.rich}><Markdown>{s1.body}</Markdown></div></div>
      <aside className={styles.threeQuestions}>{extractBoldLines(s1.body).slice(-3).map(x=><span key={x}>{x}</span>)}</aside>
    </section>

    <section id="cerberus" className={`${styles.creature} ${styles.cerberus}`}>
      <figure className={styles.fullArt}><Art kind="cerberus" locale={model.locale}/><figcaption>{t.v2.map(x=><b key={x}>{x}</b>)}</figcaption></figure>
      <div className={`${styles.reading} ${styles.splitText}`}>
        <article><p className={styles.marker}>{t.markers[1]}</p><h2>{s2.heading}</h2><div className={styles.rich}><Markdown>{s2.body}</Markdown></div></article>
        <article><h2>{s3.heading}</h2><div className={styles.rich}><Markdown>{s3.body}</Markdown></div></article>
      </div>
      <div className={`${styles.reading} ${styles.modernCerberus}`}>
        <article><h2>{s4.heading}</h2><div className={styles.rich}><Markdown>{s4.body}</Markdown></div></article>
        <aside className={styles.mythModern}><p className={styles.marker}>MYTH → MODERN WORLD</p><div><strong>{t.mythModern[0]}</strong><span>{t.mythModern[1]}</span></div><i>→</i><div><strong>{t.mythModern[2]}</strong><span>{t.mythModern[3]}</span></div><small>{t.mythModern[4]}</small></aside>
      </div>
      <QuickScene block={q1} locale={model.locale} onPersist={persistCheck}/>
    </section>

    <section id="medusa" className={`${styles.medusa} ${styles.creature}`}>
      <div className={`${styles.reading} ${styles.medusaHero}`}>
        <div className={`${styles.panelCrop} ${styles.medusaCrop}`} role="img" aria-label={model.locale==="ru"?"Медуза":"Medusa"}/>
        <article><p className={styles.marker}>{t.markers[2]}</p><h2>{s5.heading}</h2><div className={styles.rich}><Markdown>{s5.body}</Markdown></div></article>
      </div>
      <div className={`${styles.reading} ${styles.medusaSecond}`}>
        <article><h2>{s6.heading}</h2><div className={styles.rich}><Markdown>{s6.body}</Markdown></div></article>
        <aside className={styles.cliffhanger}><span>{t.medusaCliff[0]}</span><b>{t.medusaCliff[1]}</b><i>↓</i><span>{t.medusaCliff[2]}</span><b>{t.medusaCliff[3]}</b><i>↓</i><strong>???</strong><small>{t.medusaCliff[4]}</small></aside>
      </div>
      <div className={styles.medusaModern}><div className={`${styles.reading} ${styles.medusaModernGrid}`}>
        <article><h2>{s7.heading}</h2><div className={styles.rich}><Markdown>{s7.body}</Markdown></div></article>
        <aside className={styles.brandBridge}><div className={`${styles.panelCrop} ${styles.medusaMini}`} aria-hidden="true"/><div className={styles.years}>{t.medusaBrand[0]}</div><div className={styles.brandType}><span>{t.medusaBrand[1]}</span><b>{t.medusaBrand[2]}</b><small>{t.medusaBrand[3]}</small></div></aside>
      </div></div>
      <QuickScene block={q2} locale={model.locale} onPersist={persistCheck}/>
    </section>

    <section id="minotaur" className={`${styles.minotaur} ${styles.creature}`}>
      <figure className={styles.fullArt}><Art kind="minotaur" locale={model.locale}/></figure>
      <div className={`${styles.reading} ${styles.splitText}`}>
        <article><p className={styles.marker}>{t.markers[3]}</p><h2>{s8.heading}</h2><div className={styles.rich}><Markdown>{s8.body}</Markdown></div></article>
        <article><h2>{s9.heading}</h2><div className={styles.rich}><Markdown>{s9.body}</Markdown></div><aside className={styles.route}><span>{t.route[0]}</span><i>↓</i><span>{t.route[1]}</span><i>↓</i><span>{t.route[2]}</span><em>{t.route[3]}</em></aside></article>
      </div>
      <QuickScene block={q3} locale={model.locale} onPersist={persistCheck}/>
    </section>

    <section id="sirens" className={`${styles.sirens} ${styles.creature}`}>
      <div className={`${styles.reading} ${styles.sirenLead}`}><p className={styles.marker}>{t.markers[4]}</p><h2>{s10.heading}</h2><div className={styles.rich}><Markdown>{s10.body}</Markdown></div></div>
      <figure className={`${styles.fullArt} ${styles.sirenArt}`}><Art kind="sirens" locale={model.locale}/><figcaption><span><b>{t.siren[0]}</b>{t.siren[1]}</span><strong>VS</strong><span><b>{t.siren[2]}</b>{t.siren[3]}</span></figcaption></figure>
      <div className={`${styles.reading} ${styles.sirenColumns}`}>
        <article><h2>{s11.heading}</h2><div className={styles.rich}><Markdown>{s11.body}</Markdown></div></article>
        <article><h2>{s12.heading}</h2><div className={styles.rich}><Markdown>{s12.body}</Markdown></div></article>
      </div>
      <div className={`${styles.reading} ${styles.sirenTimeline}`}>
        <article><h2>{s13.heading}</h2><div className={styles.rich}><Markdown>{s13.body}</Markdown></div></article>
        <aside className={styles.timeline}>{t.timeline.map((x,i)=><div key={x[0]}><b>{x[0]}</b><span>{x[1]}</span>{i<t.timeline.length-1&&<i>→</i>}</div>)}</aside>
      </div>
      <QuickScene block={q4} locale={model.locale} onPersist={persistCheck}/>
    </section>

    <section id="hydra" className={`${styles.hydra} ${styles.creature}`}>
      <figure className={styles.fullArt}><Art kind="hydra" locale={model.locale}/></figure>
      <div className={`${styles.reading} ${styles.hydraGrid}`}>
        <article><p className={styles.marker}>{t.markers[5]}</p><h2>{s14.heading}</h2><div className={styles.rich}><Markdown>{s14.body}</Markdown></div><h2>{s15.heading}</h2><div className={styles.rich}><Markdown>{s15.body}</Markdown></div></article>
        <aside className={styles.hydraFlow}><p className={styles.marker}>{t.hydra[0]}</p><b>{t.hydra[1]}</b><i>↓</i><b>{t.hydra[2]}</b><div className={styles.fork}>↙︎ &nbsp;&nbsp;&nbsp;&nbsp; ↘︎</div><div className={styles.forkLabels}><span>{t.hydra[3]}</span><span>{t.hydra[4]}</span></div><i>↓</i><strong>{t.hydra[5]}</strong><small>{t.hydra[6]}</small></aside>
      </div>
      <div className={`${styles.reading} ${styles.splitCards}`}>
        <article><h2>{s16.heading}</h2><div className={styles.rich}><Markdown>{s16.body}</Markdown></div></article>
        <article><h2>{s17.heading}</h2><div className={styles.rich}><Markdown>{s17.body}</Markdown></div></article>
      </div>
    </section>

    <section id="cyclops" className={`${styles.cyclops} ${styles.creature}`}>
      <div className={`${styles.reading} ${styles.cyclopsGrid}`}>
        <article><p className={styles.marker}>{t.markers[6]}</p><h2>{s18.heading}</h2><div className={styles.rich}><Markdown>{s18.body}</Markdown></div><h2>{s19.heading}</h2><div className={styles.rich}><Markdown>{s19.body}</Markdown></div><aside className={styles.poseidonChain}>{t.poseidon.map((x,i)=><Fragment key={x}>{i>0&&<i>↓</i>}<span className={i===t.poseidon.length-1?styles.last:""}>{x}</span></Fragment>)}</aside></article>
        <figure className={styles.portrait}><Art kind="polyphemus" locale={model.locale}/></figure>
      </div>
    </section>

    <section className={styles.bestiaryClose}>
      <div className={`${styles.reading} ${styles.closeIntro}`}><p className={styles.marker}>{t.markers[7]}</p><h2>{s20.heading}</h2><div className={styles.rich}><Markdown>{s20.body}</Markdown></div></div>
      <figure className={styles.closingArt}><Art kind="closing" locale={model.locale}/></figure>
      <div className={`${styles.reading} ${styles.labels}`}>{t.labels.map(x=><div key={x[0]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div>
      <div className={`${styles.reading} ${styles.closingQuestion}`}>{t.closingQuestion}</div>
    </section>

    <SelfCheck questions={self.questions} locale={model.locale} onPersist={persistCheck} intro={selfIntro?<Markdown>{selfIntro}</Markdown>:undefined}/>

    <section className={styles.remember}><div className={styles.reading}>
      <p className={styles.marker}>{t.remember}</p><h2>{remember.heading}</h2>
      <div className={styles.rememberGrid}>{remember.items.map((item,i)=><article key={item.heading}><span>{i+1}</span><div className={styles.rich}><Markdown>{item.body}</Markdown></div></article>)}</div>
    </div></section>

    <ModuleOutro locale={model.locale} moduleId={model.moduleId} heading={outro.heading} body={outro.body} nextHeading={nextText.heading} nextBody={nextText.body}/>
  </article>;
}

function extractBoldLines(markdown:string){
  return markdown.split(/\r?\n/).map(line=>line.match(/^\*\*(.+?)\*\*\s*$/)?.[1]?.trim()).filter((x):x is string=>Boolean(x));
}

function QuickScene({block,locale,onPersist}:{block:QuickBlock;locale:"ru"|"en";onPersist:(id:string,sourceIndex:number)=>void}){
  return <div className={`${styles.quick} ${styles.reading}`}><p className={styles.marker}>{locale==="ru"?"БЫСТРАЯ ПРОВЕРКА":"QUICK CHECK"}</p><ChoiceCheck question={block.question} locale={locale} onPersist={(v)=>onPersist(block.id,v)}/></div>;
}
