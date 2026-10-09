"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/course";
import { t } from "@/lib/i18n";

const MAX_NAME=60;

export function CertificateForm({locale}:{locale:Locale}){
 const router=useRouter();
 const [name,setName]=useState("");
 const [ok,setOk]=useState(false);
 const [busy,setBusy]=useState(false);
 const [failed,setFailed]=useState(false);
 async function issue(){
  setBusy(true);setFailed(false);
  try{
   const r=await fetch("/api/certificate/issue",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({studentName:name.trim(),language:locale})});
   if(!r.ok) throw new Error(await r.text());
   router.refresh();
  }catch{
   setFailed(true);
  }finally{
   setBusy(false);
  }
 }
 return <div className="certForm">
  <label htmlFor="certName">{t(locale,"cert.nameLabel")}</label>
  <input id="certName" type="text" autoComplete="name" maxLength={MAX_NAME} placeholder={t(locale,"cert.namePlaceholder")} value={name} onChange={e=>setName(e.target.value)}/>
  <label className="certCheck"><input type="checkbox" checked={ok} onChange={e=>setOk(e.target.checked)}/><span>{t(locale,"cert.confirmName")}</span></label>
  <div className="certNote">{t(locale,"cert.privacyNote")}</div>
  {failed&&<div className="lxError" role="alert">{t(locale,"cert.issueError")}</div>}
  <button type="button" className="lxBtn" disabled={!name.trim()||!ok||busy} onClick={issue}>{busy?t(locale,"cert.generating"):t(locale,"cert.generate")}</button>
 </div>;
}

export function CertificateActions({locale,token,certificateId}:{locale:Locale;token:string;certificateId:string}){
 const [toast,setToast]=useState("");
 const url=()=>`${location.origin}/${locale}/certificate/${token}`;
 function download(){
  // The browser uses the page title as the default file name for "Save as PDF".
  const prev=document.title;
  document.title=`MIYU-Certificate-${certificateId}`;
  const restore=()=>{document.title=prev;window.removeEventListener("afterprint",restore)};
  window.addEventListener("afterprint",restore);
  window.print();
 }
 async function copy(){
  try{
   await navigator.clipboard.writeText(url());
   setToast(t(locale,"cert.copied"));
   window.setTimeout(()=>setToast(""),2500);
  }catch{setToast("")}
 }
 async function share(){
  try{
   if(navigator.share) await navigator.share({title:"MIYU Academy",url:url()});
   else await copy();
  }catch{/* cancelled */}
 }
 return <div className="certActions">
  <button type="button" className="lxBtn" onClick={download}>{t(locale,"cert.download")}</button>
  <p className="certHint">{t(locale,"cert.downloadHint")}</p>
  <button type="button" className="lxBtn lxBtnGhost" onClick={copy}>{t(locale,"cert.copy")}</button>
  <button type="button" className="lxBtn lxBtnGhost" onClick={share}>{t(locale,"cert.share")}</button>
  <a className="lxBtn lxBtnGhost" href={`/${locale}/certificate/${token}`}>{t(locale,"cert.open")}</a>
  <div className="certToast" role="status" aria-live="polite">{toast}</div>
 </div>;
}
