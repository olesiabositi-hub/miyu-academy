"use client";
import { useState } from "react";
import type { ChoiceQuestion } from "@/lib/content/types";

export function ChoiceCheck({question,locale,onPersist}:{question:ChoiceQuestion;locale:"en"|"ru";onPersist?:(sourceIndex:number)=>void}){
  const [selected,setSelected]=useState<number|null>(null);
  const [submitted,setSubmitted]=useState(false);
  const correct=selected===question.answerSourceIndex;
  return <div className="check">
    <fieldset>
      <legend>{question.question}</legend>
      {question.options.map(o=><label key={o.sourceIndex} className={`answer ${selected===o.sourceIndex?"selected":""} ${submitted&&o.sourceIndex===question.answerSourceIndex?"correct":""}`}>
        <input type="radio" name={question.id} value={o.sourceIndex} checked={selected===o.sourceIndex}
          onChange={()=>{setSelected(o.sourceIndex);setSubmitted(false);onPersist?.(o.sourceIndex)}} />
        <span>{o.text}</span>
      </label>)}
    </fieldset>
    <button className="btn" disabled={selected===null} onClick={()=>setSubmitted(true)}>{locale==="ru"?"Проверить ответ":"Check answer"}</button>
    {submitted&&<div className={`feedback ${correct?"good":"bad"}`} role="status">
      <strong>{correct?(locale==="ru"?"Верно":"Correct"):(locale==="ru"?"Не совсем":"Not quite")}.</strong>
      {!correct&&<span> {locale==="ru"?"Правильный ответ отмечен выше.":"The correct answer is marked above."}</span>}
      {question.feedback&&<p>{question.feedback}</p>}
    </div>}
  </div>;
}

export function RevealChallenge({children,label}:{children:React.ReactNode;label:string}){
  const [open,setOpen]=useState(false);
  return <div className="challenge-reveal">
    <button className="btn secondary" onClick={()=>setOpen(v=>!v)}>{open?"Hide":label}</button>
    {open&&<div className="reveal">{children}</div>}
  </div>
}
