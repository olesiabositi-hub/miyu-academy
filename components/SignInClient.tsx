"use client";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Locale } from "@/lib/course";

export function SignInClient({locale,returnTo}:{locale:Locale;returnTo:string}){
 const [email,setEmail]=useState("");const [age,setAge]=useState(false);const [sent,setSent]=useState(false);const [error,setError]=useState("");
 async function submit(){
  setError("");
  const canonical=(process.env.NEXT_PUBLIC_SITE_URL??location.origin).replace(/\/$/,"");
  if(location.origin!==canonical){
   location.assign(`${canonical}${location.pathname}${location.search}`);
   return;
  }
  const supabase=createBrowserSupabase();
  const callback=`${canonical}/auth/callback?next=${encodeURIComponent(returnTo)}&locale=${locale}`;
  const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:callback,data:{age16:true,preferred_locale:locale}}});
  if(error)setError(error.message);else setSent(true);
 }
 if(sent)return <div className="card formCard"><h2>{locale==="ru"?"Проверьте почту":"Check your email"}</h2><p>{locale==="ru"?"Мы отправили ссылку для входа.":"We sent you a sign-in link."}</p></div>;
 return <div className="card formCard"><h2>{locale==="ru"?"Войти в MIYU Academy":"Sign in to MIYU Academy"}</h2><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/>
 <label className="checkline"><input type="checkbox" checked={age} onChange={e=>setAge(e.target.checked)}/><span>{locale==="ru"?"Я подтверждаю, что мне не меньше 16 лет.":"I confirm that I am at least 16 years old."}</span></label>
 <p className="muted" style={{fontSize:12}}>{locale==="ru"?"Создавая аккаунт, вы соглашаетесь с Условиями использования и подтверждаете, что ознакомились с Политикой конфиденциальности.":"By creating an account, you agree to the Terms of Use and acknowledge the Privacy Notice."}</p>
 {error&&<p role="alert" style={{color:"var(--error)"}}>{error}</p>}<button className="btn" disabled={!email||!age} onClick={submit}>{locale==="ru"?"Отправить ссылку для входа":"Send sign-in link"}</button></div>
}
