"use client";

import { PointerEvent, useEffect, useRef } from "react";

const clamp=(value:number,min:number,max:number)=>Math.min(max,Math.max(min,value));

export function CourseHeroArt(){
  const rootRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const root=rootRef.current;
    if(!root) return;
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    if(media.matches) return;

    let frame=0;
    const update=()=>{
      const rect=root.getBoundingClientRect();
      const viewport=window.innerHeight||1;
      const center=rect.top+rect.height/2;
      const progress=clamp((center-viewport/2)/viewport,-1,1);
      root.style.setProperty("--course-parallax-y",`${(-progress*9).toFixed(2)}px`);
      frame=0;
    };
    const queue=()=>{if(!frame) frame=window.requestAnimationFrame(update);};

    update();
    window.addEventListener("scroll",queue,{passive:true});
    window.addEventListener("resize",queue);
    return ()=>{
      window.removeEventListener("scroll",queue);
      window.removeEventListener("resize",queue);
      if(frame) window.cancelAnimationFrame(frame);
    };
  },[]);

  const move=(event:PointerEvent<HTMLDivElement>)=>{
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root=rootRef.current;
    if(!root) return;
    const rect=root.getBoundingClientRect();
    const x=clamp((event.clientX-rect.left)/rect.width-.5,-.5,.5);
    const y=clamp((event.clientY-rect.top)/rect.height-.5,-.5,.5);
    root.style.setProperty("--course-pointer-x",`${(x*6).toFixed(2)}px`);
    root.style.setProperty("--course-pointer-y",`${(y*5).toFixed(2)}px`);
  };
  const reset=()=>{
    const root=rootRef.current;
    if(!root) return;
    root.style.setProperty("--course-pointer-x","0px");
    root.style.setProperty("--course-pointer-y","0px");
  };

  return <div
    ref={rootRef}
    className="courseLivingHero"
    onPointerMove={move}
    onPointerLeave={reset}
    aria-hidden="true"
  >
    <div className="courseLivingHeroImage"/>
    <div className="courseLivingHeroLight"/>
    <div className="courseLivingHeroMist"/>
    <div className="courseLivingHeroGold"/>
  </div>;
}
