"use client";

import { useEffect } from "react";
import type { LessonBlock, LessonModel } from "@/lib/content/types";
import { Markdown } from "@/components/Markdown";
import { ChoiceCheck } from "@/components/Checks";
import styles from "./ModuleTwoLesson.module.css";

type ProseBlock = Extract<LessonBlock,{type:"prose"}>;
type QuickBlock = Extract<LessonBlock,{type:"quick-check"}>;
type SelfBlock = Extract<LessonBlock,{type:"self-check"}>;
type CompleteBlock = Extract<LessonBlock,{type:"module-complete"}>;
type ArtKind="hero"|"olympus"|"rulers"|"war"|"aphrodite"|"twins"|"hermes"|"nike";

type Part={heading:string;body:string};
type Subsection={heading:string;body:string};

const art:Record<ArtKind,{src:string;width:number;height:number;ru:string;en:string}>={
  hero:{src:"/visuals/module-02/01-HERO-olympus-pantheon.webp",width:1672,height:941,ru:"Олимпийский пантеон над Средиземноморьем.",en:"The Olympian pantheon above the Mediterranean."},
  olympus:{src:"/visuals/module-02/02-OLYMPUS-mountain-divine-home.webp",width:1672,height:941,ru:"Гора Олимп как мифологический дом богов.",en:"Mount Olympus as the mythological home of the gods."},
  rulers:{src:"/visuals/module-02/03-ZEUS-HERA-rulers.webp",width:1672,height:941,ru:"Зевс и Гера — правители олимпийского мира.",en:"Zeus and Hera — rulers of the Olympian world."},
  war:{src:"/visuals/module-02/04-ATHENA-ARES-contrast.webp",width:1672,height:941,ru:"Афина и Арес как две разные стороны войны.",en:"Athena and Ares as two different faces of war."},
  aphrodite:{src:"/visuals/module-02/05-APHRODITE-cyprus.webp",width:1672,height:941,ru:"Афродита и морской пейзаж Кипра.",en:"Aphrodite and the seascape of Cyprus."},
  twins:{src:"/visuals/module-02/06-APOLLO-ARTEMIS-twins.webp",width:1672,height:941,ru:"Аполлон и Артемида — близнецы.",en:"Apollo and Artemis — the twins."},
  hermes:{src:"/visuals/module-02/07-HERMES-messenger.webp",width:1122,height:1402,ru:"Гермес — вестник богов и бог движения.",en:"Hermes — messenger of the gods and god of movement."},
  nike:{src:"/visuals/module-02/08-NIKE-victory.webp",width:1122,height:1402,ru:"Ника — олицетворение победы.",en:"Nike — the personification of victory."},
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

function prose(model:LessonModel,id:string){
  const block=model.blocks.find(b=>b.type==="prose"&&b.id===id) as ProseBlock|undefined;
  if(!block) throw new Error(`Module 2 missing prose block ${id}`);
  return block;
}
function quick(model:LessonModel,id:string){
  const block=model.blocks.find(b=>b.type==="quick-check"&&b.id===id) as QuickBlock|undefined;
  if(!block) throw new Error(`Module 2 missing quick check ${id}`);
  return block;
}
function selfCheck(model:LessonModel){
  const block=model.blocks.find(b=>b.type==="self-check") as SelfBlock|undefined;
  if(!block) throw new Error("Module 2 missing self-check");
  return block;
}
function completion(model:LessonModel){
  const block=model.blocks.find(b=>b.type==="module-complete") as CompleteBlock|undefined;
  if(!block) throw new Error("Module 2 missing completion block");
  return block;
}
function rememberBlock(model:LessonModel){
  const block=model.blocks.find(b=>b.type==="prose"&&/^#\s+(?:If you remember only seven things|Если запомнить только семь вещей)/im.test(b.markdown)) as ProseBlock|undefined;
  if(!block) throw new Error("Module 2 missing remember block");
  return block;
}

function cleanHeading(s:string){return s.replace(/^\d+\.\s*/,"").trim();}
function splitHeading(markdown:string):Part{
  const lines=markdown.split(/\r?\n/);
  const i=lines.findIndex(line=>/^#{1,6}\s+/.test(line));
  if(i<0)return {heading:"",body:markdown};
  return {heading:cleanHeading(lines[i].replace(/^#{1,6}\s+/,"")),body:lines.filter((_,n)=>n!==i).join("\n").trim()};
}
function introBody(markdown:string){
  const lines=markdown.split(/\r?\n/);
  let headingCount=0;
  return lines.filter(line=>{
    if(/^#\s+/.test(line)&&headingCount<2){headingCount++;return false;}
    if(/^\*\*(?:Время|Time):\*\*/.test(line)) return false;
    return true;
  }).join("\n").trim();
}
function introPull(markdown:string){
  const bold=[...markdown.matchAll(/\*\*([^*]+(?:\*[^*]+)*)\*\*/g)].map(m=>m[1].trim());
  return bold.find(text=>(text.match(/→/g)?.length??0)>=2)??"";
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
function splitFirstParagraph(markdown:string){
  const parts=markdown.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
  return {first:parts[0]??"",rest:parts.slice(1).join("\n\n")};
}

export function ModuleTwoLesson({model}:{model:LessonModel}){
  const ru=model.locale==="ru";
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
  const s21=splitSubsections(prose(model,"section-21").markdown);
  const s22=splitSubsections(prose(model,"section-22").markdown);
  const q1=quick(model,"quick-check-01"),q2=quick(model,"quick-check-02"),q3=quick(model,"quick-check-03"),q4=quick(model,"quick-check-04"),q5=quick(model,"quick-check-05");
  const self=selfCheck(model);
  const remember=splitSubsections(rememberBlock(model).markdown);
  const complete=splitHeading(completion(model).markdown);
  const minorLast=s21.items[s21.items.length-1];
  const minorSplit=minorLast?splitFirstParagraph(minorLast.body):{first:"",rest:""};
  const minorItems=minorLast?[...s21.items.slice(0,-1),{...minorLast,body:minorSplit.first}]:s21.items;
  const pantheonLast=s22.items[s22.items.length-1];
  const pantheonSplit=pantheonLast?splitFirstParagraph(pantheonLast.body):{first:"",rest:""};
  const pantheonItems=pantheonLast?[...s22.items.slice(0,-1),{...pantheonLast,body:pantheonSplit.first}]:s22.items;

  useEffect(()=>{post("/api/module/start",{moduleId:model.moduleId}).catch(()=>{})},[model.moduleId]);
  const persistCheck=(checkId:string,sourceIndex:number)=>post("/api/module/check",{moduleId:model.moduleId,checkId,sourceIndex}).catch(()=>{});
  async function finish(){
    await post("/api/module/complete",{moduleId:model.moduleId});
    location.href=`/${model.locale}/courses/greek-mythology/module-03`;
  }

  return <article className={styles.page}>
    <section className={styles.hero} aria-labelledby="m2-title">
      <Art kind="hero" className={styles.heroImage} locale={model.locale} eager/>
      <div className={styles.heroShade}/>
      <div className={styles.heroInner}><div className={styles.heroCopy}>
        <p className={styles.kicker}>{ru?"МОДУЛЬ 02 / 08":"MODULE 02 / 08"}</p>
        <h1 id="m2-title">{model.title}</h1>
        <p className={styles.duration}><span className={styles.clock} aria-hidden="true"/>{model.durationLabel}</p>
      </div></div>
    </section>

    <nav className={styles.sectionNav} aria-label={ru?"Навигация по модулю":"Module navigation"}>
      <a className={styles.sectionNavActive} href="#olympus">{ru?"Олимп":"Olympus"}</a><span aria-hidden="true"/>
      <a href="#athena-ares">{ru?"Афина и Арес":"Athena & Ares"}</a><span aria-hidden="true"/>
      <a href="#cyprus">{ru?"Кипр":"Cyprus"}</a><span aria-hidden="true"/>
      <a href="#twins">{ru?"Близнецы":"The twins"}</a><span aria-hidden="true"/>
      <a href="#self-check">{ru?"Самопроверка":"Self-check"}</a>
    </nav>

    <section className={styles.opening}>
      <div className={`${styles.rich} ${styles.openingBody}`}><Markdown>{introBody(intro.markdown)}</Markdown></div>
      {introPull(intro.markdown)&&<blockquote>{introPull(intro.markdown)}</blockquote>}
    </section>

    <section id="olympus" className={styles.olympusSection}>
      <div className={styles.olympusCopy}><p className={styles.marker}>{ru?"01 / ОЛИМП":"01 / OLYMPUS"}</p><h2>{s1.heading}</h2><div className={styles.rich}><Markdown>{s1.body}</Markdown></div></div>
      <figure className={styles.olympusArt}><Art kind="olympus" locale={model.locale}/></figure>
    </section>

    <section className={styles.rulersSection}>
      <figure className={styles.rulersArt}><Art kind="rulers" locale={model.locale}/></figure>
      <div className={styles.rulersCopy}><p className={styles.marker}>{ru?"02 / ВЛАСТЬ":"02 / POWER"}</p><div className={styles.rulersGrid}>
        <div><h2>{s2.heading}</h2><div className={styles.rich}><Markdown>{s2.body}</Markdown></div></div>
        <div><h2>{s3.heading}</h2><div className={styles.rich}><Markdown>{s3.body}</Markdown></div></div>
      </div></div>
    </section>

    <QuickScene block={q1} locale={model.locale} onPersist={persistCheck}/>

    <section className={`${styles.twoCol} ${styles.reading} ${styles.seaUnderworld}`}>
      <div><h2>{s4.heading}</h2><div className={styles.rich}><Markdown>{s4.body}</Markdown></div></div>
      <div><h2>{s5.heading}</h2><div className={styles.rich}><Markdown>{s5.body}</Markdown></div></div>
    </section>

    <section id="athena-ares" className={styles.comparisonSection}>
      <div className={styles.comparisonHead}><p className={styles.marker}>{ru?"04 / ДВА ЛИЦА ВОЙНЫ":"04 / TWO FACES OF WAR"}</p><h2>{s7.heading}</h2><div className={`${styles.rich} ${styles.sectionLead}`}><h3>{s6.heading}</h3><Markdown>{s6.body}</Markdown></div></div>
      <figure className={styles.wideArt}><Art kind="war" locale={model.locale}/></figure>
      <div className={`${styles.rich} ${styles.comparisonCopy}`}><Markdown>{s7.body}</Markdown></div>
    </section>

    <QuickScene block={q2} locale={model.locale} onPersist={persistCheck}/>

    <section className={`${styles.athensIt} ${styles.reading}`}>
      <div><p className={styles.marker}>{ru?"05 / АФИНА ВОКРУГ НАС":"05 / ATHENA AROUND US"}</p><h2>{s8.heading}</h2><div className={styles.rich}><Markdown>{s8.body}</Markdown></div></div>
      <aside className={styles.modernCard}><p className={styles.modernLabel}>{ru?"СОВРЕМЕННАЯ ОТСЫЛКА":"MODERN REFERENCE"}</p><h3>{s9.heading}</h3><div className={styles.rich}><Markdown>{s9.body}</Markdown></div></aside>
    </section>

    <section id="cyprus" className={styles.aphroditeSection}>
      <figure className={styles.wideArt}><Art kind="aphrodite" locale={model.locale}/></figure>
      <div className={`${styles.aphroditeGrid} ${styles.reading}`}>
        <div><p className={styles.marker}>{ru?"06 / АФРОДИТА + КИПР":"06 / APHRODITE + CYPRUS"}</p><h2>{s10.heading}</h2><div className={styles.rich}><Markdown>{s10.body}</Markdown></div></div>
        <div><h2>{s11.heading}</h2><div className={styles.rich}><Markdown>{s11.body}</Markdown></div><h3>{s12.heading}</h3><div className={styles.rich}><Markdown>{s12.body}</Markdown></div></div>
      </div>
    </section>

    <QuickScene block={q3} locale={model.locale} onPersist={persistCheck}/>

    <section id="twins" className={styles.twinsSection}>
      <div className={`${styles.twinsHead} ${styles.reading}`}><p className={styles.marker}>{ru?"07 / БЛИЗНЕЦЫ":"07 / THE TWINS"}</p><h2>Apollo ↔ Artemis</h2></div>
      <figure className={styles.wideArt}><Art kind="twins" locale={model.locale}/></figure>
      <div className={`${styles.twinsCopy} ${styles.reading}`}>
        <div><h2>{s13.heading}</h2><div className={styles.rich}><Markdown>{s13.body}</Markdown></div><aside className={`${styles.modernCard} ${styles.inlineCard}`}><p className={styles.modernLabel}>NASA / APOLLO</p><h3>{s14.heading}</h3><div className={styles.rich}><Markdown>{s14.body}</Markdown></div></aside></div>
        <div><h2>{s15.heading}</h2><div className={styles.rich}><Markdown>{s15.body}</Markdown></div><aside className={`${styles.modernCard} ${styles.inlineCard}`}><p className={styles.modernLabel}>NASA / ARTEMIS</p><h3>{s16.heading}</h3><div className={styles.rich}><Markdown>{s16.body}</Markdown></div></aside></div>
      </div>
    </section>

    <QuickScene block={q4} locale={model.locale} onPersist={persistCheck}/>

    <section className={styles.hermesSection}>
      <div className={styles.hermesCopy}><p className={styles.marker}>{ru?"08 / ДВИЖЕНИЕ + СООБЩЕНИЯ":"08 / MOVEMENT + MESSAGES"}</p><h2>{s17.heading}</h2><div className={styles.rich}><Markdown>{s17.body}</Markdown></div><div className={styles.sourcePair}>
        <aside className={styles.modernCard}><p className={styles.modernLabel}>{ru?"СОВРЕМЕННАЯ ОТСЫЛКА":"MODERN REFERENCE"}</p><h3>{s18.heading}</h3><div className={styles.rich}><Markdown>{s18.body}</Markdown></div></aside>
        <aside className={`${styles.modernCard} ${styles.caution}`}><p className={styles.modernLabel}>{ru?"ЛОВУШКА НАЗВАНИЯ":"NAMING TRAP"}</p><h3>{s19.heading}</h3><div className={styles.rich}><Markdown>{s19.body}</Markdown></div></aside>
      </div></div>
      <figure className={styles.portraitArt}><Art kind="hermes" locale={model.locale}/></figure>
    </section>

    <section className={styles.nikeSection}>
      <figure className={styles.portraitArt}><Art kind="nike" locale={model.locale}/></figure>
      <div className={styles.nikeCopy}><p className={styles.marker}>{ru?"09 / ПОБЕДА":"09 / VICTORY"}</p><h2>{s20.heading}</h2><div className={styles.rich}><Markdown>{s20.body}</Markdown></div></div>
    </section>

    <QuickScene block={q5} locale={model.locale} onPersist={persistCheck}/>

    <section className={`${styles.minorSection} ${styles.reading}`}>
      <p className={styles.marker}>{ru?"10 / НЕ ВСЕ СРАЗУ":"10 / NOT ALL AT ONCE"}</p><h2>{s21.heading}</h2><div className={`${styles.rich} ${styles.minorIntro}`}><Markdown>{s21.intro}</Markdown></div>
      <div className={styles.minorGrid}>{minorItems.map(item=><article key={item.heading}><h3>{item.heading}</h3><div className={styles.rich}><Markdown>{item.body}</Markdown></div></article>)}</div>
      {minorSplit.rest&&<div className={`${styles.rich} ${styles.minorTail}`}><Markdown>{minorSplit.rest}</Markdown></div>}
    </section>

    <section className={styles.pantheonSection}><div className={styles.reading}>
      <p className={styles.marker}>{ru?"11 / КАРТА ПАМЯТИ":"11 / MEMORY MAP"}</p><h2>{s22.heading}</h2><div className={styles.rich}><Markdown>{s22.intro}</Markdown></div>
      <div className={styles.pantheonGrid}>{pantheonItems.map(item=><article key={item.heading}><h3>{item.heading}</h3><div className={styles.rich}><Markdown>{item.body}</Markdown></div></article>)}</div>
      {pantheonSplit.rest&&<div className={`${styles.rich} ${styles.sumTail}`}><Markdown>{pantheonSplit.rest}</Markdown></div>}
    </div></section>

    <section id="self-check" className={`${styles.selfCheck} ${styles.reading}`}>
      <p className={styles.marker}>{ru?"САМОПРОВЕРКА":"SELF-CHECK"}</p><h2>{ru?"Самопроверка":"Self-check"}</h2>
      <div className={`${styles.rich} ${styles.selfIntro}`}><Markdown>{self.markdown.split(/\n-{3,}\n/)[0].replace(/^#\s+(?:Self-check|Самопроверка)\s*/i,"").trim()}</Markdown></div>
      <div className={styles.selfList}>{self.questions.map((q,i)=><article className={styles.selfItem} key={q.id}><div className={styles.selfNum}>{String(i+1).padStart(2,"0")}</div><ChoiceCheck question={q} locale={model.locale} onPersist={(v)=>persistCheck(q.id,v)}/></article>)}</div>
    </section>

    <section className={styles.rememberSection}><div className={styles.reading}>
      <p className={styles.marker}>{ru?"ЕСЛИ ЗАПОМНИТЬ ТОЛЬКО СЕМЬ ВЕЩЕЙ":"IF YOU REMEMBER ONLY SEVEN THINGS"}</p><h2>{remember.heading}</h2>
      <div className={styles.rememberGrid}>{remember.items.map((item,i)=><article key={item.heading}><span>{i+1}</span><div className={styles.rich}><Markdown>{item.body}</Markdown></div></article>)}</div>
    </div></section>

    <section className={styles.completion}>
      <div className={`${styles.reading} ${styles.completionCopy}`}><p className={styles.marker}>{ru?"МОДУЛЬ 02 / 08":"MODULE 02 / 08"}</p><h2>{complete.heading}</h2><div className={styles.rich}><Markdown>{complete.body}</Markdown></div></div>
      <div className={styles.completeNav}><span>02 / 08</span><div className={styles.track}><i/></div><strong>{ru?"Дальше — существа и чудовища":"Next — creatures and monsters"}</strong><button onClick={finish}>{ru?"Продолжить":"Continue"} <span aria-hidden="true">→</span></button></div>
    </section>
  </article>;
}

function QuickScene({block,locale,onPersist}:{block:QuickBlock;locale:"ru"|"en";onPersist:(id:string,sourceIndex:number)=>void}){
  return <section id={block.id} className={styles.quickScene}><div className={styles.quickInner}><div className={styles.quickCopy}>
    <p className={styles.marker}>{locale==="ru"?"БЫСТРАЯ ПРОВЕРКА":"QUICK CHECK"}</p>
    <ChoiceCheck question={block.question} locale={locale} onPersist={(v)=>onPersist(block.id,v)}/>
  </div></div></section>;
}
