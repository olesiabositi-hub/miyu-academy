"use client";
import { useEffect, useLayoutEffect, useRef } from "react";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Prints the learner's name on one line and shrinks it (never grows) until it fits the box.
 * Size is kept in `cqw` (share of the certificate width), so screen, print and PDF look the same.
 */
export function FitName({text,baseCqw=7.2,className,twoLine=false}:{text:string;baseCqw?:number;className?:string;twoLine?:boolean}){
  const ref=useRef<HTMLDivElement>(null);
  useIso(()=>{
    const el=ref.current;
    if(!el) return;
    const fit=()=>{
      el.classList.remove("is-two");
      el.style.whiteSpace="nowrap";
      el.style.fontSize=`${baseCqw}cqw`;
      const need=el.scrollWidth, have=el.clientWidth;
      if(!(need>have&&need>0)) return;
      let size=baseCqw*have/need*0.98;
      // Very long names: use two balanced lines at a larger size instead of one tiny line.
      if(twoLine&&size<4&&/[\s-]/.test(text)){
        el.classList.add("is-two");
        el.style.whiteSpace="normal";
        el.style.setProperty("text-wrap","balance");
        let s2=Math.min(4.2,baseCqw);
        for(let i=0;i<40&&s2>1.5;i++){
          el.style.fontSize=`${s2}cqw`;
          const cs=getComputedStyle(el);
          const lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.1;
          if(el.scrollWidth<=el.clientWidth&&el.scrollHeight<=lh*2.05) break;
          s2-=0.15;
        }
        return;
      }
      el.style.fontSize=`${size.toFixed(3)}cqw`;
    };
    fit();
    let lastW=el.clientWidth;
    const ro=new ResizeObserver(()=>{if(el.clientWidth!==lastW){lastW=el.clientWidth;fit()}});
    ro.observe(el);
    document.fonts?.ready.then(fit).catch(()=>{});
    window.addEventListener("beforeprint",fit);
    return ()=>{ro.disconnect();window.removeEventListener("beforeprint",fit)};
  },[text,baseCqw,twoLine]);
  return <div ref={ref} className={className} style={{fontSize:`${baseCqw}cqw`}}>{text}</div>;
}
