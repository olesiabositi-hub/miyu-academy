"use client";
import { useEffect,useState } from "react";
import type { Locale } from "@/lib/course";
import { getConsent,setConsent } from "@/lib/analytics";

export function PrivacySettingsClient({locale}:{locale:Locale}){
 const ru=locale==="ru";
 const [analytics,setAnalytics]=useState(false);const [loaded,setLoaded]=useState(false);
 useEffect(()=>{setAnalytics(getConsent()==="allow");setLoaded(true)},[]);
 function save(value:boolean){setAnalytics(value);setConsent(value?"allow":"essential");}
 if(!loaded)return null;
 return <div className="card formCard"><h2>{ru?"Аналитика":"Analytics"}</h2><p className="muted">{ru?"Курс работает без опциональной аналитики.":"The course works without optional analytics."}</p>
 <label className="checkline"><input type="checkbox" checked={analytics} onChange={e=>save(e.target.checked)}/><span>{ru?"Разрешить Google Analytics (анонимная статистика посещений)":"Allow Google Analytics (anonymous usage statistics)"}</span></label>
 <p className="muted" style={{fontSize:12}}>{ru?"Без вашего согласия Google Analytics не загружается. При отзыве согласия аналитические cookies удаляются.":"Google Analytics does not load without your consent. If you withdraw consent, analytics cookies are removed."}</p></div>
}
