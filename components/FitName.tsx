"use client";
import { useEffect, useLayoutEffect, useRef } from "react";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Prints the learner's name on one line and shrinks it (never grows) until it fits the box.
 * Size is kept in `cqw` (share of the certificate width), so screen, print and PDF look the same.
 */
export function FitName({text,baseCqw=7.2,className}:{text:string;baseCqw?:number;className?:string}){
  const ref=useRef<HTMLDivElement>(null);
  useIso(()=>{
    const el=ref.current;
    if(!el) return;
    const fit=()=>{
      el.style.fontSize=`${baseCqw}cqw`;
      const need=el.scrollWidth, have=el.clientWidth;
      if(need>have&&need>0) el.style.fontSize=`${(baseCqw*have/need*0.98).toFixed(3)}cqw`;
    };
    fit();
    const ro=new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit).catch(()=>{});
    window.addEventListener("beforeprint",fit);
    return ()=>{ro.disconnect();window.removeEventListener("beforeprint",fit)};
  },[text,baseCqw]);
  return <div ref={ref} className={className} style={{fontSize:`${baseCqw}cqw`}}>{text}</div>;
}
