"use client";
import { useMemo,useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/course";

type Q={id:string;category:string;module:number;en:{question:string;options:string[]};ru:{question:string;options:string[]}};
type Attempt={id:string;current_question_index:number;selected_answers:Record<string,number>;option_order:number[][]};

async function api(url:string,body?:unknown){const r=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:body?JSON.stringify(body):undefined});if(!r.ok)throw new Error(await r.text());return r.json()}

export function FinalDecoderClient({locale,questions,initialAttempt}:{locale:Locale;questions:Q[];initialAttempt:Attempt|null}){
 const router=useRouter();const [attempt,setAttempt]=useState<Attempt|null>(initialAttempt);const [review,setReview]=useState(false);const [busy,setBusy]=useState(false);
 const i=attempt?.current_question_index??0;const q=questions[i];const L=q?.[locale];
 const answered=Object.keys(attempt?.selected_answers??{}).length;

 async function start(){setBusy(true);try{const a=await api("/api/final/start");setAttempt(a)}finally{setBusy(false)}}
 async function choose(sourceIndex:number){if(!attempt)return;const next={...attempt,selected_answers:{...attempt.selected_answers,[q.id]:sourceIndex}};setAttempt(next);await api("/api/final/save",{attemptId:attempt.id,questionId:q.id,sourceIndex,currentQuestionIndex:i})}
 async function move(next:number){if(!attempt)return;const n=Math.max(0,Math.min(14,next));const a={...attempt,current_question_index:n};setAttempt(a);setReview(false);await api("/api/final/save",{attemptId:attempt.id,questionId:q.id,sourceIndex:attempt.selected_answers[q.id]??null,currentQuestionIndex:n}).catch(()=>{})}
 async function submit(){if(!attempt||answered<15)return;setBusy(true);try{await api("/api/final/submit",{attemptId:attempt.id});router.replace(`/${locale}/courses/greek-mythology/final-myth-decoder/result`);router.refresh()}finally{setBusy(false)}}

 if(!attempt)return <section className="assessment"><p className="eyebrow">FINAL MYTH DECODER</p><h1>FINAL MYTH DECODER</h1><p>15 questions · 80% · unlimited attempts</p><p className="muted">{locale==="ru"?"Без таймера. Правильность ответов не раскрывается по ходу попытки.":"No timer. Correctness is not revealed during the attempt."}</p><button className="btn" disabled={busy} onClick={start}>{locale==="ru"?"Начать":"Start Final Myth Decoder"}</button></section>;

 if(review)return <section className="assessment"><p className="eyebrow">FINAL MYTH DECODER</p><h1>{locale==="ru"?"Проверить ответы":"Review answers"}</h1><p>{answered} / 15 {locale==="ru"?"отвечено":"answered"}</p><div className="reviewGrid">{questions.map((x,idx)=><button key={x.id} className="reviewItem" onClick={()=>move(idx)}>{String(idx+1).padStart(2,"0")} · {attempt.selected_answers[x.id]===undefined?(locale==="ru"?"без ответа":"unanswered"):(locale==="ru"?"отвечено":"answered")}</button>)}</div><div className="assessmentNav"><button className="btn secondary" onClick={()=>{setReview(false);move(14)}}>{locale==="ru"?"Назад":"Back"}</button><button className="btn" disabled={answered<15||busy} onClick={submit}>{locale==="ru"?"Отправить Final Myth Decoder":"Submit Final Myth Decoder"}</button></div></section>;

 const order=attempt.option_order[i]??[0,1,2];const selected=attempt.selected_answers[q.id];
 return <section className="assessment"><div className="assessmentHeader"><p className="eyebrow">{locale==="ru"?"ВОПРОС":"QUESTION"} {i+1} / 15</p><span className="eyebrow">{q.category}</span></div><div className="progressBar"><span style={{width:`${((i+1)/15)*100}%`}}/></div><h1>{L.question}</h1>
 {order.map(src=><button key={src} className={`assessmentAnswer ${selected===src?"selected":""}`} onClick={()=>choose(src)}>{L.options[src]}</button>)}
 <div className="assessmentNav"><button className="btn secondary" onClick={()=>i===0?router.push(`/${locale}/courses/greek-mythology/dashboard`):move(i-1)}>{locale==="ru"?"Назад":"Back"}</button><button className="btn" onClick={()=>i===14?setReview(true):move(i+1)}>{i===14?(locale==="ru"?"Проверить ответы":"Review answers"):(locale==="ru"?"Далее":"Next")}</button></div></section>
}
