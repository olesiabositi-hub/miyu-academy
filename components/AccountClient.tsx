"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Locale } from "@/lib/course";
import { courseDashboardPath } from "@/lib/courses";
import { t } from "@/lib/i18n";

export function AccountClient({locale,email,provider,preferredLocale,demo=false}:{locale:Locale;email:string;provider:string;preferredLocale:Locale;demo?:boolean}){
  const router=useRouter();
  const [pref,setPref]=useState<Locale>(preferredLocale);
  const [saved,setSaved]=useState(false);
  const [confirming,setConfirming]=useState(false);
  const [typed,setTyped]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState(false);
  const [deleted,setDeleted]=useState(false);

  const word=t(locale,"acct.confirmWord");

  async function changeLocale(next:Locale){
    setPref(next);setSaved(false);
    if(demo) return;
    const supabase=createBrowserSupabase();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user) return;
    const {error}=await supabase.from("profiles").update({preferred_locale:next,updated_at:new Date().toISOString()}).eq("id",user.id);
    if(!error) setSaved(true);
  }

  async function signOut(){
    if(demo) return;
    setBusy(true);
    await createBrowserSupabase().auth.signOut().catch(()=>{});
    window.location.assign(`/${locale}`);
  }

  async function remove(){
    if(demo||typed.trim().toUpperCase()!==word) return;
    setBusy(true);setError(false);
    try{
      const r=await fetch("/api/account/delete",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({confirm:"DELETE"})});
      if(!r.ok) throw new Error(await r.text());
      await createBrowserSupabase().auth.signOut().catch(()=>{});
      setDeleted(true);
    }catch{
      setError(true);setBusy(false);
    }
  }

  if(deleted) return <section className="acctPage"><div className="acctCard acctCenter">
    <div className="lxEyebrow">MIYU ACADEMY</div>
    <h1 className="acctTitle">{t(locale,"acct.deleted")}</h1>
    <p className="acctLead">{t(locale,"acct.deletedBody")}</p>
    <a className="lxBtn" href={`/${locale}`}>{t(locale,"acct.home")}</a>
  </div></section>;

  return <section className="acctPage">
    <div className="acctHead">
      <div className="lxEyebrow">MIYU ACADEMY</div>
      <h1 className="acctTitle">{t(locale,"acct.title")}</h1>
    </div>
    {demo&&<div className="certNote">{t(locale,"acct.previewNote")}</div>}

    <div className="acctCard">
      <div className="acctRow"><div className="certRowLabel">{t(locale,"acct.signedAs").toUpperCase()}</div><div className="certRowValue">{email}</div></div>
      <div className="acctRow"><div className="certRowLabel">{t(locale,"acct.method").toUpperCase()}</div><div className="certRowValue">{t(locale,provider==="google"?"acct.methodGoogle":"acct.methodEmail")}</div></div>
      <div className="acctRow">
        <div className="certRowLabel">{t(locale,"acct.language").toUpperCase()}</div>
        <div className="acctLang" role="group" aria-label={t(locale,"acct.language")}>
          {(["ru","en"] as Locale[]).map(l=><button key={l} type="button" className={"acctLangBtn"+(pref===l?" is-active":"")} aria-pressed={pref===l} onClick={()=>changeLocale(l)}>{l.toUpperCase()}</button>)}
          <span className="certToast" role="status" aria-live="polite">{saved?t(locale,"acct.languageSaved"):""}</span>
        </div>
      </div>
      <div className="acctLinks">
        <Link href={courseDashboardPath(locale)}>{t(locale,"acct.progress")} →</Link>
        <Link href={`/${locale}/privacy-settings`}>{t(locale,"acct.privacy")} →</Link>
      </div>
      <button type="button" className="lxBtn lxBtnGhost" disabled={busy||demo} onClick={signOut}>{t(locale,"acct.signOut")}</button>
    </div>

    <div className="acctCard acctDanger">
      <h2 className="acctH2">{t(locale,"acct.danger")}</h2>
      <p className="acctLead">{t(locale,"acct.dangerBody")}</p>
      {!confirming
        ?<button type="button" className="lxBtn acctDeleteBtn" disabled={demo} onClick={()=>setConfirming(true)}>{t(locale,"acct.deleteStart")}</button>
        :<div className="acctConfirm">
          <label className="signLabel" htmlFor="del">{t(locale,"acct.confirmLabel",{word})}</label>
          <input id="del" className="signInput" type="text" autoComplete="off" value={typed} onChange={e=>setTyped(e.target.value)}/>
          {error&&<div className="lxError" role="alert">{t(locale,"acct.deleteError")}</div>}
          <div className="acctConfirmBtns">
            <button type="button" className="lxBtn lxBtnGhost" disabled={busy} onClick={()=>{setConfirming(false);setTyped("");setError(false)}}>{t(locale,"acct.cancel")}</button>
            <button type="button" className="lxBtn acctDeleteBtn" disabled={busy||typed.trim().toUpperCase()!==word} onClick={remove}>{busy?t(locale,"acct.deleting"):t(locale,"acct.deleteNow")}</button>
          </div>
        </div>}
    </div>
  </section>;
}
