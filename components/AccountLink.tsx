"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Locale } from "@/lib/course";
import { courseDashboardPath } from "@/lib/courses";
import { t } from "@/lib/i18n";

/** "Sign in" or "Account", depending on whether a session exists in this browser. */
export function AccountLink({locale,className}:{locale:Locale;className?:string}){
  const [signedIn,setSignedIn]=useState<boolean|null>(null);
  useEffect(()=>{
    let alive=true;
    try{
      const supabase=createBrowserSupabase();
      supabase.auth.getSession().then(({data})=>{if(alive) setSignedIn(!!data.session)}).catch(()=>{if(alive) setSignedIn(false)});
      const {data:sub}=supabase.auth.onAuthStateChange((_e,session)=>{if(alive) setSignedIn(!!session)});
      return ()=>{alive=false;sub.subscription.unsubscribe()};
    }catch{
      setSignedIn(false);
    }
    return ()=>{alive=false};
  },[]);
  if(signedIn===null) return null;
  return signedIn
    ?<Link className={className} href={`/${locale}/account`}>{t(locale,"nav.account")}</Link>
    :<Link className={className} href={`/${locale}/sign-in?returnTo=${encodeURIComponent(courseDashboardPath(locale))}`}>{t(locale,"nav.signIn")}</Link>;
}
