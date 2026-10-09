"use client";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/course";
import { t } from "@/lib/i18n";

/**
 * Saves how far the learner has scrolled in a module and, on return, scrolls back to that spot.
 * Renders nothing but a short toast when it resumes.
 */
export function ResumeTracker({moduleId,locale,initialRatio,enabled=true}:{moduleId:string;locale:Locale;initialRatio:number|null;enabled?:boolean}){
  const [toast,setToast]=useState(false);
  const last=useRef(initialRatio??0);
  const latest=useRef(initialRatio??0);

  useEffect(()=>{
    if(!enabled) return;
    const ratioNow=()=>{
      const max=document.documentElement.scrollHeight-window.innerHeight;
      return max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;
    };
    const send=()=>{
      const r=latest.current;
      if(Math.abs(r-last.current)<0.01) return;
      last.current=r;
      fetch("/api/module/progress",{method:"POST",keepalive:true,headers:{"content-type":"application/json"},body:JSON.stringify({moduleId,ratio:r})}).catch(()=>{});
    };

    let resumed=false;
    if(initialRatio!==null&&initialRatio>0.03&&initialRatio<0.97&&!location.hash){
      resumed=true;
      const go=()=>{
        const max=document.documentElement.scrollHeight-window.innerHeight;
        window.scrollTo({top:max*initialRatio,behavior:"auto"});
        setToast(true);
        window.setTimeout(()=>setToast(false),4000);
      };
      // Wait for layout (images, fonts) before measuring the page.
      if(document.readyState==="complete") window.setTimeout(go,150);
      else window.addEventListener("load",()=>window.setTimeout(go,150),{once:true});
    }

    let timer:number|undefined;
    const onScroll=()=>{
      latest.current=ratioNow();
      if(timer===undefined) timer=window.setTimeout(()=>{timer=undefined;send()},2000);
    };
    const onHide=()=>{if(document.visibilityState==="hidden"){latest.current=ratioNow();send()}};
    window.addEventListener("scroll",onScroll,{passive:true});
    document.addEventListener("visibilitychange",onHide);
    return ()=>{
      window.removeEventListener("scroll",onScroll);
      document.removeEventListener("visibilitychange",onHide);
      if(timer!==undefined) window.clearTimeout(timer);
      void resumed;
    };
  },[moduleId,initialRatio,enabled]);

  return toast?<div className="resumeToast" role="status">{t(locale,"resume.toast")}</div>:null;
}
