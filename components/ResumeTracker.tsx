"use client";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/course";
import { COURSE_ID } from "@/lib/course";
import { t } from "@/lib/i18n";
import { resumeRatio, saveScroll } from "@/lib/progress";

/**
 * Remembers (in this browser) how far the learner has scrolled in a module and, on return,
 * scrolls back to that spot. Renders nothing but a short toast when it resumes.
 */
export function ResumeTracker({moduleId,locale,courseId=COURSE_ID}:{moduleId:string;locale:Locale;courseId?:string}){
  const [toast,setToast]=useState(false);
  const last=useRef(0);
  const latest=useRef(0);

  useEffect(()=>{
    const initialRatio=resumeRatio(courseId,moduleId);
    last.current=latest.current=initialRatio??0;
    const ratioNow=()=>{
      const max=document.documentElement.scrollHeight-window.innerHeight;
      return max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;
    };
    const send=()=>{
      const r=latest.current;
      if(Math.abs(r-last.current)<0.01) return;
      last.current=r;
      saveScroll(courseId,moduleId,r);
    };

    if(initialRatio!==null&&initialRatio>0.03&&initialRatio<0.97&&!location.hash){
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
      if(timer===undefined) timer=window.setTimeout(()=>{timer=undefined;send()},1500);
    };
    const onHide=()=>{if(document.visibilityState==="hidden"){latest.current=ratioNow();send()}};
    window.addEventListener("scroll",onScroll,{passive:true});
    document.addEventListener("visibilitychange",onHide);
    const onLeave=()=>{latest.current=ratioNow();send()};
    window.addEventListener("pagehide",onLeave);
    return ()=>{
      window.removeEventListener("scroll",onScroll);
      document.removeEventListener("visibilitychange",onHide);
      window.removeEventListener("pagehide",onLeave);
      if(timer!==undefined) window.clearTimeout(timer);
    };
  },[moduleId,courseId]);

  return toast?<div className="resumeToast" role="status">{t(locale,"resume.toast")}</div>:null;
}
