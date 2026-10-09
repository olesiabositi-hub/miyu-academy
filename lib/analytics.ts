"use client";

type EventProps=Record<string,string|number|boolean|null|undefined>;

export const CONSENT_KEY="miyu_analytics_consent";
export const CONSENT_EVENT="miyu:consent-change";
const GA_ID=process.env.NEXT_PUBLIC_GA_ID||"G-XXJ4GG8YDY";

type W=Window&{dataLayer?:unknown[];gtag?:(...a:unknown[])=>void;[k:string]:unknown};

export function getConsent():"allow"|"essential"|null{
  try{
    const v=localStorage.getItem(CONSENT_KEY);
    return v==="allow"||v==="essential"?v:null;
  }catch{return null}
}

export function setConsent(value:"allow"|"essential"){
  try{localStorage.setItem(CONSENT_KEY,value)}catch{}
  applyConsent();
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

function clearGaCookies(){
  const host=location.hostname;
  const domains=[host,"."+host,"."+host.split(".").slice(-2).join(".")];
  document.cookie.split(";").map(c=>c.trim().split("=")[0]).filter(n=>n==="_ga"||n.startsWith("_ga_")||n==="_gid").forEach(n=>{
    domains.forEach(d=>{document.cookie=`${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`});
    document.cookie=`${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

/** Loads Google Analytics only after explicit consent; withdraws it otherwise. */
export function applyConsent(){
  if(typeof window==="undefined"||!GA_ID) return;
  const w=window as W;
  const disableKey=`ga-disable-${GA_ID}`;
  if(getConsent()==="allow"){
    w[disableKey]=false;
    if(w.gtag) return;
    w.dataLayer=w.dataLayer||[];
    w.gtag=function(){(w.dataLayer as unknown[]).push(arguments)};
    w.gtag("js",new Date());
    w.gtag("config",GA_ID,{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});
    const s=document.createElement("script");
    s.async=true;
    s.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(s);
  }else{
    w[disableKey]=true;
    clearGaCookies();
  }
}

/** Vendor-neutral event boundary. No user identifiers are ever sent. */
export function track(event:string,props:EventProps={}){
  if(getConsent()!=="allow") return;
  const w=window as W;
  if(w.gtag) w.gtag("event",event,props);
}
