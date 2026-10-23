"use client";
import { useEffect,useState } from "react";
import type { Locale } from "@/lib/course";
import { getConsent,setConsent } from "@/lib/analytics";
import { clearAllProgress, moduleRows, useProgress } from "@/lib/progress";

export function PrivacySettingsClient({locale}:{locale:Locale}){
 const ru=locale==="ru";
 const [analytics,setAnalytics]=useState(false);const [loaded,setLoaded]=useState(false);
 const [confirm,setConfirm]=useState(false);const [erased,setErased]=useState(false);
 const store=useProgress();
 useEffect(()=>{setAnalytics(getConsent()==="allow");setLoaded(true)},[]);
 function save(value:boolean){setAnalytics(value);setConsent(value?"allow":"essential");}
 if(!loaded)return null;
 const done=store?moduleRows(store).filter(r=>r.status==="completed").length:0;
 const started=store?moduleRows(store).length:0;
 return <>
 <div className="card formCard"><h2>{ru?"Прогресс":"Progress"}</h2>
 <p className="muted">{ru?"Аккаунтов нет. Прогресс по курсам хранится только в этом браузере и никуда не отправляется. На другом устройстве или после очистки данных сайта он начнётся заново.":"There are no accounts. Course progress is kept only in this browser and is never sent anywhere. On another device, or after you clear this site's data, it starts again."}</p>
 <p className="muted">{erased?(ru?"Прогресс стёрт.":"Progress erased."):started===0?(ru?"Сейчас в этом браузере прогресса нет.":"There is no progress in this browser yet."):(ru?`Начато модулей: ${started}, пройдено: ${done}.`:`Modules started: ${started}, completed: ${done}.`)}</p>
 {started>0&&!confirm&&<button type="button" className="lxBtn lxBtnGhost" onClick={()=>setConfirm(true)}>{ru?"Стереть прогресс…":"Erase progress…"}</button>}
 {confirm&&<div role="group" aria-label={ru?"Подтверждение":"Confirmation"} style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center"}}>
  <span style={{flexBasis:"100%"}}>{ru?"Стереть весь прогресс, руны и результаты во всех курсах? Это нельзя отменить.":"Erase all progress, runes and results in every course? This cannot be undone."}</span>
  <button type="button" className="lxBtn" onClick={()=>{clearAllProgress();setConfirm(false);setErased(true)}}>{ru?"Стереть":"Erase"}</button>
  <button type="button" className="lxBtn lxBtnGhost" onClick={()=>setConfirm(false)}>{ru?"Отмена":"Cancel"}</button>
 </div>}
 </div>
 <div className="card formCard"><h2>{ru?"Аналитика":"Analytics"}</h2><p className="muted">{ru?"Курс работает без опциональной аналитики.":"The course works without optional analytics."}</p>
 <label className="checkline"><input type="checkbox" checked={analytics} onChange={e=>save(e.target.checked)}/><span>{ru?"Разрешить Google Analytics (анонимная статистика посещений)":"Allow Google Analytics (anonymous usage statistics)"}</span></label>
 <p className="muted" style={{fontSize:12}}>{ru?"Без вашего согласия Google Analytics не загружается. При отзыве согласия аналитические cookies удаляются.":"Google Analytics does not load without your consent. If you withdraw consent, analytics cookies are removed."}</p></div>
 </>
}
