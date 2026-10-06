"use client";
import { useEffect,useState } from "react";
import type { Locale } from "@/lib/course";

export function PrivacySettingsClient({locale}:{locale:Locale}){
 const [analytics,setAnalytics]=useState(false);const [loaded,setLoaded]=useState(false);
 useEffect(()=>{setAnalytics(localStorage.getItem("miyu_analytics_consent")==="allow");setLoaded(true)},[]);
 function save(value:boolean){setAnalytics(value);localStorage.setItem("miyu_analytics_consent",value?"allow":"essential");}
 if(!loaded)return null;
 return <div className="card formCard"><h2>{locale==="ru"?"Аналитика":"Analytics"}</h2><p className="muted">{locale==="ru"?"Курс работает без опциональной аналитики.":"The course works without optional analytics."}</p>
 <label className="checkline"><input type="checkbox" checked={analytics} onChange={e=>save(e.target.checked)}/><span>{locale==="ru"?"Разрешить опциональную продуктовую аналитику":"Allow optional product analytics"}</span></label>
 <p className="muted" style={{fontSize:12}}>{locale==="ru"?"В production эта настройка управляет подключением выбранного analytics vendor. Сейчас vendor не задан, поэтому трекинг не загружается.":"In production this preference controls the selected analytics vendor. No vendor is configured in this build, so no optional analytics loads."}</p></div>
}
