"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ChoiceQuestion } from "@/lib/content/types";
import type { Locale } from "@/lib/course";
import { t } from "@/lib/i18n";

/**
 * Shared learning checks, used by all 8 modules.
 *  - ChoiceCheck: one inline question (Quick Check).
 *  - SelfCheck: one question per screen, explanation after each answer, result at the end.
 * Markup uses only div/button and `lx*` classes, so module-level CSS cannot restyle it differently.
 */
const LETTERS = ["A", "B", "C", "D", "E"];

function Options({question,selected,checked,onPick,labelId}:{question:ChoiceQuestion;selected:number|null;checked:boolean;onPick:(sourceIndex:number)=>void;labelId:string}){
  return <div className="lxOptions" role="radiogroup" aria-labelledby={labelId}>
    {question.options.map((o,idx)=>{
      const isSelected=selected===o.sourceIndex;
      const isRight=o.sourceIndex===question.answerSourceIndex;
      let state="";
      if(checked){
        if(isRight) state=" is-right";
        else if(isSelected) state=" is-wrong";
        else state=" is-dim";
      }else if(isSelected){
        state=" is-selected";
      }
      return <button key={o.sourceIndex} type="button" role="radio" aria-checked={isSelected} aria-disabled={checked||undefined}
        className={"lxOption"+state} onClick={()=>{if(!checked) onPick(o.sourceIndex)}}>
        <span className="lxMark" aria-hidden="true">{LETTERS[idx]??""}</span>
        <span className="lxText">{o.text}</span>
      </button>;
    })}
  </div>;
}

function Feedback({question,selected,locale}:{question:ChoiceQuestion;selected:number|null;locale:Locale}){
  const ok=selected===question.answerSourceIndex;
  const right=question.options.find(o=>o.sourceIndex===question.answerSourceIndex);
  return <div className={"lxFeedback "+(ok?"is-ok":"is-bad")} role="status">
    <div className="lxFeedbackTitle">{t(locale,ok?"check.correct":"check.incorrect")}</div>
    {!ok&&right&&<div className="lxFeedbackAnswer">{t(locale,"check.correctIs",{answer:right.text})}</div>}
    {question.feedback&&<div className="lxFeedbackText">{question.feedback}</div>}
  </div>;
}

export function ChoiceCheck({question,locale,onPersist}:{question:ChoiceQuestion;locale:Locale;onPersist?:(sourceIndex:number)=>void}){
  const [selected,setSelected]=useState<number|null>(null);
  const [checked,setChecked]=useState(false);
  const labelId=`lxq-${question.id}`;
  return <div className="lxq">
    <div className="lxQuestion" id={labelId}>{question.question}</div>
    <Options question={question} selected={selected} checked={checked} labelId={labelId}
      onPick={(v)=>{setSelected(v);onPersist?.(v)}}/>
    {!checked&&<button type="button" className="lxBtn" disabled={selected===null} onClick={()=>setChecked(true)}>{t(locale,"check.verify")}</button>}
    {checked&&<Feedback question={question} selected={selected} locale={locale}/>}
  </div>;
}

export function SelfCheck({questions,locale,onPersist,intro,id="self-check"}:{questions:ChoiceQuestion[];locale:Locale;onPersist?:(questionId:string,sourceIndex:number)=>void;intro?:ReactNode;id?:string}){
  const [i,setI]=useState(0);
  const [answers,setAnswers]=useState<Record<string,number>>({});
  const [checked,setChecked]=useState(false);
  const [done,setDone]=useState(false);
  const stepRef=useRef<HTMLDivElement>(null);
  const mounted=useRef(false);

  // Move keyboard / screen-reader focus to the new step, but not on first render.
  useEffect(()=>{
    if(!mounted.current){mounted.current=true;return}
    stepRef.current?.focus();
  },[i,done]);

  const total=questions.length;
  if(total===0) return null;
  const q=questions[Math.min(i,total-1)];
  const selected=answers[q.id]??null;
  const score=questions.filter(x=>answers[x.id]===x.answerSourceIndex).length;
  const isLast=i===total-1;

  function pick(v:number){
    setAnswers(a=>({...a,[q.id]:v}));
    onPersist?.(q.id,v);
  }
  function advance(){
    if(isLast){setDone(true);return}
    setI(i+1);
    setChecked(false);
  }
  function retry(){
    setAnswers({});
    setI(0);
    setChecked(false);
    setDone(false);
  }

  return <section id={id} className="lxSelf" aria-labelledby={`${id}-title`}>
    <div className="lxSelfInner">
      <div className="lxEyebrow">{t(locale,"check.self")}</div>
      <h2 className="lxSelfTitle" id={`${id}-title`}>{locale==="ru"?"Самопроверка":"Self-check"}</h2>
      {intro&&<div className="lxSelfIntro">{intro}</div>}

      <div className="lxCard" ref={stepRef} tabIndex={-1}>
        {!done&&<>
          <div className="lxProgress">
            <div className="lxDots" aria-hidden="true">
              {questions.map((x,k)=>{
                const answered=k<i||(k===i&&checked);
                const ok=answers[x.id]===x.answerSourceIndex;
                return <span key={x.id} className={"lxDot"+(k===i?" is-current":"")+(answered?(ok?" is-ok":" is-bad"):"")}/>;
              })}
            </div>
            <div className="lxCount">{t(locale,"check.question",{n:i+1,total})}</div>
          </div>
          <div className="lxQuestion lxQuestionBig" id={`${id}-q-${i}`}>{q.question}</div>
          <Options question={q} selected={selected} checked={checked} labelId={`${id}-q-${i}`} onPick={pick}/>
          {checked&&<Feedback question={q} selected={selected} locale={locale}/>}
          <div className="lxActions">
            {!checked
              ?<button type="button" className="lxBtn" disabled={selected===null} onClick={()=>setChecked(true)}>{t(locale,"check.verify")}</button>
              :<button type="button" className="lxBtn" onClick={advance}>{t(locale,isLast?"check.finish":"check.next")} <span aria-hidden="true">→</span></button>}
          </div>
        </>}

        {done&&<div className="lxResult">
          <div className="lxScore">{t(locale,"check.score",{score,total})}</div>
          <div className="lxResultText">{t(locale,score>=Math.ceil(total*0.7)?"check.resultGood":"check.resultMid")}</div>
          <div className="lxReviewTitle">{t(locale,"check.review")}</div>
          <ol className="lxReview">
            {questions.map((x)=>{
              const ok=answers[x.id]===x.answerSourceIndex;
              const right=x.options.find(o=>o.sourceIndex===x.answerSourceIndex);
              return <li key={x.id} className={ok?"is-ok":"is-bad"}>
                <span className="lxReviewMark" aria-hidden="true">{ok?"✓":"✗"}</span>
                <span className="lxReviewBody">
                  <span className="lxReviewQ">{x.question}</span>
                  {!ok&&right&&<span className="lxReviewA">{right.text}</span>}
                </span>
              </li>;
            })}
          </ol>
          <button type="button" className="lxBtn lxBtnGhost" onClick={retry}>{t(locale,"check.retry")}</button>
        </div>}
      </div>
    </div>
  </section>;
}

export function RevealChallenge({children,label}:{children:ReactNode;label:string}){
  const [open,setOpen]=useState(false);
  return <div className="challenge-reveal">
    <button type="button" className="btn secondary" onClick={()=>setOpen(v=>!v)}>{open?"Hide":label}</button>
    {open&&<div className="reveal">{children}</div>}
  </div>
}
