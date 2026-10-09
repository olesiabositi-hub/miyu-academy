"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/course";
import { courseBasePath, courseDashboardPath } from "@/lib/courses";
import { t, type UiKey } from "@/lib/i18n";

type Q={id:string;category:string;module:number;en:{question:string;options:string[]};ru:{question:string;options:string[]}};
type Attempt={id:string;current_question_index:number;selected_answers:Record<string,number>;option_order:number[][]};

const LETTERS=["A","B","C","D","E"];
const CATEGORY_KEYS:Record<string,UiKey>={recognition:"fmd.cat.recognition",meaning:"fmd.cat.meaning",connection:"fmd.cat.connection"};

async function api(url:string,body?:unknown){
  const r=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:body?JSON.stringify(body):undefined});
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}

export function FinalDecoderClient({locale,questions,initialAttempt,demo=false}:{locale:Locale;questions:Q[];initialAttempt:Attempt|null;demo?:boolean}){
  const router=useRouter();
  const [attempt,setAttempt]=useState<Attempt|null>(initialAttempt);
  const [review,setReview]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState<UiKey|null>(null);

  // Preview mode: nothing is sent to the server.
  const call=(url:string,body?:unknown):Promise<any>=>demo?Promise.resolve({}):api(url,body);
  const total=questions.length;
  const last=total-1;
  const i=Math.min(attempt?.current_question_index??0,last);
  const q=questions[i];
  const L=q?q[locale]:undefined;
  const answeredCount=Object.keys(attempt?.selected_answers??{}).length;

  async function start(){
    setBusy(true);
    setError(null);
    try{ setAttempt(demo?{id:"demo",current_question_index:0,selected_answers:{},option_order:questions.map(x=>x.ru.options.map((_,k)=>k))}:await api("/api/final/start")); }
    catch{ setError("fmd.submitError"); }
    finally{ setBusy(false); }
  }

  async function choose(sourceIndex:number){
    if(!attempt||!q) return;
    setAttempt({...attempt,selected_answers:{...attempt.selected_answers,[q.id]:sourceIndex}});
    setError(null);
    try{
      await call("/api/final/save",{attemptId:attempt.id,questionId:q.id,sourceIndex,currentQuestionIndex:i});
    }catch{
      setError("fmd.saveError");
    }
  }

  async function move(next:number){
    if(!attempt||!q) return;
    const n=Math.max(0,Math.min(last,next));
    setAttempt({...attempt,current_question_index:n});
    setReview(false);
    await call("/api/final/save",{attemptId:attempt.id,questionId:q.id,sourceIndex:attempt.selected_answers[q.id]??null,currentQuestionIndex:n}).catch(()=>{});
  }

  async function submit(){
    if(!attempt||answeredCount<total) return;
    setBusy(true);
    setError(null);
    try{
      await call("/api/final/submit",{attemptId:attempt.id});
      router.replace(`${courseBasePath(locale)}/final-myth-decoder/result${demo?"?demo=pass":""}`);
      router.refresh();
    }catch{
      setError("fmd.submitError");
      setBusy(false);
    }
  }

  // ---- Intro
  if(!attempt){
    return <section className="fmd fmdIntro">
      <div className="lxEyebrow">FINAL MYTH DECODER</div>
      <h1 className="fmdHeadline">{t(locale,"fmd.title")}</h1>
      <p className="fmdLead">{t(locale,"fmd.lead")}</p>
      <ul className="fmdFacts">
        <li><b>{total}</b><span>{t(locale,"fmd.factQuestions")}</span></li>
        <li><b>12/{total}</b><span>{t(locale,"fmd.factPass")}</span></li>
        <li><b>0:00</b><span>{t(locale,"fmd.factNoTimer")}</span></li>
        <li><b>∞</b><span>{t(locale,"fmd.factAttempts")}</span></li>
      </ul>
      <p className="fmdNote">{t(locale,"fmd.noteHidden")}</p>
      {error&&<div className="lxError fmdError" role="alert">{t(locale,error)}</div>}
      <button type="button" className="lxBtn" disabled={busy} onClick={start}>{t(locale,"fmd.start")} <span aria-hidden="true">→</span></button>
    </section>;
  }

  // ---- Review before submit
  if(review){
    return <section className="fmd">
      <div className="lxEyebrow">FINAL MYTH DECODER</div>
      <h1 className="fmdHeadline fmdHeadlineSm">{t(locale,"fmd.reviewTitle")}</h1>
      <p className="fmdNote">{t(locale,"fmd.answeredOf",{n:answeredCount,total})}</p>
      <div className="fmdTiles">
        {questions.map((x,idx)=>{
          const done=attempt.selected_answers[x.id]!==undefined;
          return <button key={x.id} type="button" className={"fmdTile"+(done?" is-done":"")} onClick={()=>move(idx)}>
            <b>{String(idx+1).padStart(2,"0")}</b>
            <span>{t(locale,done?"fmd.answered":"fmd.unanswered")}</span>
          </button>;
        })}
      </div>
      {error&&<div className="lxError fmdError" role="alert">{t(locale,error)}</div>}
      <div className="fmdNav">
        <button type="button" className="lxBtn lxBtnGhost" onClick={()=>move(last)}>{t(locale,"fmd.back")}</button>
        <button type="button" className="lxBtn" disabled={answeredCount<total||busy} onClick={submit}>{t(locale,"fmd.submit")}</button>
      </div>
    </section>;
  }

  // ---- Question
  if(!q||!L) return null;
  const order=attempt.option_order[i]??L.options.map((_,k)=>k);
  const selected=attempt.selected_answers[q.id];
  const catKey=CATEGORY_KEYS[q.category];
  const labelId=`fmd-q-${q.id}`;
  return <section className="fmd">
    <div className="fmdHead">
      <div className="lxEyebrow">{t(locale,"fmd.question",{n:i+1,total})}</div>
      <span className="fmdChip">{catKey?t(locale,catKey):q.category}</span>
    </div>
    <div className="fmdDots">
      {questions.map((x,idx)=>{
        const done=attempt.selected_answers[x.id]!==undefined;
        return <button key={x.id} type="button" aria-label={String(idx+1).padStart(2,"0")} aria-current={idx===i?"step":undefined}
          className={"fmdDot"+(done?" is-done":"")+(idx===i?" is-current":"")} onClick={()=>move(idx)}/>;
      })}
    </div>
    <h1 className="fmdQuestion" id={labelId}>{L.question}</h1>
    <div className="lxOptions" role="radiogroup" aria-labelledby={labelId}>
      {order.map((src,k)=>{
        const isSel=selected===src;
        return <button key={src} type="button" role="radio" aria-checked={isSel} className={"lxOption"+(isSel?" is-selected":"")} onClick={()=>choose(src)}>
          <span className="lxMark" aria-hidden="true">{LETTERS[k]??""}</span>
          <span className="lxText">{L.options[src]}</span>
        </button>;
      })}
    </div>
    {error&&<div className="lxError fmdError" role="alert">{t(locale,error)}</div>}
    <div className="fmdNav">
      <button type="button" className="lxBtn lxBtnGhost" onClick={()=>i===0?router.push(courseDashboardPath(locale)):move(i-1)}>{t(locale,"fmd.back")}</button>
      <button type="button" className="lxBtn" onClick={()=>i===last?setReview(true):move(i+1)}>{t(locale,i===last?"fmd.toReview":"fmd.next")} <span aria-hidden="true">→</span></button>
    </div>
    <p className="fmdNote">{t(locale,"fmd.noteHidden")}</p>
  </section>;
}
