"use client";
import { createElement, useEffect, useRef, type ReactNode, type RefObject } from "react";

/**
 * Reveals the direct children of a container one after another when it scrolls into view.
 * Same safety rules as Reveal: content is visible on the server, only blocks that start below
 * the fold are marked pending, and nothing happens with reduced motion.
 */
export function useStagger(ref:RefObject<HTMLElement|null>,step=70){
  useEffect(()=>{
    const root=ref.current;
    if(!root) return;
    if(typeof IntersectionObserver==="undefined") return;
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if(root.getBoundingClientRect().top<window.innerHeight*0.92) return;
    const kids=Array.from(root.children) as HTMLElement[];
    kids.forEach((k,i)=>{k.style.transitionDelay=`${i*step}ms`;k.setAttribute("data-reveal","pending")});
    const io=new IntersectionObserver((entries)=>{
      for(const e of entries){
        if(e.isIntersecting){
          kids.forEach(k=>k.setAttribute("data-reveal","shown"));
          io.disconnect();
        }
      }
    },{rootMargin:"0px 0px -8% 0px",threshold:0.05});
    io.observe(root);
    return ()=>io.disconnect();
  },[ref,step]);
}

export function Stagger({children,className,as="div",step=70}:{children:ReactNode;className?:string;as?:"div"|"ol"|"ul";step?:number}){
  const ref=useRef<HTMLElement>(null);
  useStagger(ref,step);
  return createElement(as,{ref,className},children);
}
