"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import type { Locale } from "@/lib/course";
import { t } from "@/lib/i18n";
import { applyConsent,getConsent,setConsent,CONSENT_EVENT } from "@/lib/analytics";

export function ConsentBanner({locale}:{locale:Locale}){
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    applyConsent();
    setOpen(getConsent()===null);
    const sync=()=>setOpen(getConsent()===null);
    window.addEventListener(CONSENT_EVENT,sync);
    return()=>window.removeEventListener(CONSENT_EVENT,sync);
  },[]);
  if(!open) return null;
  return <div className="consent" role="dialog" aria-modal="false" aria-labelledby="consentTitle">
    <div className="consentBody">
      <h2 id="consentTitle">{t(locale,"consent.title")}</h2>
      <p>{t(locale,"consent.text")} <Link href={`/${locale}/cookies`}>{t(locale,"consent.more")}</Link></p>
    </div>
    <div className="consentActions">
      <button type="button" className="lxBtn consentBtn" onClick={()=>setConsent("essential")}>{t(locale,"consent.essential")}</button>
      <button type="button" className="lxBtn consentBtn" onClick={()=>setConsent("allow")}>{t(locale,"consent.allow")}</button>
    </div>
  </div>
}
