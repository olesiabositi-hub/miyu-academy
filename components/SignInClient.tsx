"use client";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Locale } from "@/lib/course";
import { t } from "@/lib/i18n";

export function SignInClient({locale,returnTo,authError}:{locale:Locale;returnTo:string;authError?:boolean}){
 const [email,setEmail]=useState("");
 const [age,setAge]=useState(false);
 const [sent,setSent]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState(authError?t(locale,"sign.authError"):"");

 // Sign-in always happens on the canonical domain, so that the session cookie and the Supabase redirect match.
 function toCanonical():string|null{
  const canonical=(process.env.NEXT_PUBLIC_SITE_URL??location.origin).replace(/\/$/,"");
  if(location.origin!==canonical){
   location.assign(`${canonical}${location.pathname}${location.search}`);
   return null;
  }
  return canonical;
 }
 const callbackFor=(canonical:string)=>`${canonical}/auth/callback?next=${encodeURIComponent(returnTo)}&locale=${locale}&age16=1`;

 async function google(){
  setError("");
  if(!age){setError(t(locale,"sign.needAge"));return}
  const canonical=toCanonical(); if(!canonical) return;
  setBusy(true);
  const supabase=createBrowserSupabase();
  const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:callbackFor(canonical)}});
  if(error){setError(t(locale,"sign.error"));setBusy(false)}
 }

 async function submit(){
  setError("");
  if(!age){setError(t(locale,"sign.needAge"));return}
  const canonical=toCanonical(); if(!canonical) return;
  setBusy(true);
  const supabase=createBrowserSupabase();
  const {error}=await supabase.auth.signInWithOtp({email:email.trim(),options:{emailRedirectTo:callbackFor(canonical),data:{age16:true,preferred_locale:locale}}});
  setBusy(false);
  if(error) setError(t(locale,"sign.error")); else setSent(true);
 }

 if(sent) return <div className="signCard">
  <div className="lxEyebrow">MIYU ACADEMY</div>
  <h1 className="signTitle">{t(locale,"sign.sentTitle")}</h1>
  <p className="signLead">{t(locale,"sign.sentBody",{email:email.trim()})}</p>
 </div>;

 return <div className="signCard">
  <div className="lxEyebrow">MIYU ACADEMY</div>
  <h1 className="signTitle">{t(locale,"sign.title")}</h1>
  <p className="signLead">{t(locale,"sign.lead")}</p>

  <label className="certCheck signAge"><input type="checkbox" checked={age} onChange={e=>{setAge(e.target.checked);if(e.target.checked) setError("")}}/><span>{t(locale,"sign.age")}</span></label>

  <button type="button" className="signGoogle" disabled={busy} onClick={google}>
   <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
   <span>{t(locale,"sign.google")}</span>
  </button>

  <div className="signOr"><span>{t(locale,"sign.or")}</span></div>

  <label className="signLabel" htmlFor="email">{t(locale,"sign.email")}</label>
  <input id="email" className="signInput" type="email" autoComplete="email" inputMode="email" value={email} onChange={e=>setEmail(e.target.value)}/>
  <button type="button" className="lxBtn" disabled={!email.trim()||busy} onClick={submit}>{busy?t(locale,"sign.sending"):t(locale,"sign.send")}</button>

  {error&&<div className="lxError" role="alert">{error}</div>}
  <p className="signLegal">{t(locale,"sign.legal")}</p>
 </div>;
}
