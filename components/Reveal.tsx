"use client";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Gentle scroll-in for blocks that start below the fold.
 *
 * Content is always rendered visible by the server. After hydration, only elements that are
 * still off-screen are marked pending and then released when they scroll into view, so a
 * script failure, a crawler or a screenshot never sees hidden content. Does nothing when the
 * visitor asked for reduced motion. See .reveal rules in globals.css.
 */
export function Reveal({children,className="",delay=0}:{children:ReactNode;className?:string;delay?:number}){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=ref.current;
    if(!el) return;
    if(typeof IntersectionObserver==="undefined") return;
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if(el.getBoundingClientRect().top<window.innerHeight*0.92) return;
    el.setAttribute("data-reveal","pending");
    const io=new IntersectionObserver((entries)=>{
      for(const entry of entries){
        if(entry.isIntersecting){
          el.setAttribute("data-reveal","shown");
          io.disconnect();
        }
      }
    },{rootMargin:"0px 0px -8% 0px",threshold:0.05});
    io.observe(el);
    return ()=>io.disconnect();
  },[]);
  return <div ref={ref} className={className} style={delay?{transitionDelay:`${delay}ms`}:undefined}>{children}</div>;
}
