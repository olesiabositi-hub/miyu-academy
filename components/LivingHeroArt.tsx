"use client";

import { PointerEvent, useEffect, useRef } from "react";

const clamp=(value:number,min:number,max:number)=>Math.min(max,Math.max(min,value));

export function LivingHeroArt(){
  const rootRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const root=rootRef.current;
    if(!root) return;

    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    if(media.matches) return;

    let frame=0;
    const updateParallax=()=>{
      const rect=root.getBoundingClientRect();
      const viewport=window.innerHeight||1;
      const center=rect.top+rect.height/2;
      const progress=clamp((center-viewport/2)/viewport,-1,1);
      root.style.setProperty("--hero-parallax-y",`${(-progress*10).toFixed(2)}px`);
      frame=0;
    };

    const queue=()=>{
      if(!frame) frame=window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll",queue,{passive:true});
    window.addEventListener("resize",queue);

    return ()=>{
      window.removeEventListener("scroll",queue);
      window.removeEventListener("resize",queue);
      if(frame) window.cancelAnimationFrame(frame);
    };
  },[]);

  const handlePointerMove=(event:PointerEvent<HTMLDivElement>)=>{
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root=rootRef.current;
    if(!root) return;
    const rect=root.getBoundingClientRect();
    const x=clamp((event.clientX-rect.left)/rect.width-.5,-.5,.5);
    const y=clamp((event.clientY-rect.top)/rect.height-.5,-.5,.5);
    root.style.setProperty("--hero-pointer-x",`${(x*8).toFixed(2)}px`);
    root.style.setProperty("--hero-pointer-y",`${(y*6).toFixed(2)}px`);
  };

  const resetPointer=()=>{
    const root=rootRef.current;
    if(!root) return;
    root.style.setProperty("--hero-pointer-x","0px");
    root.style.setProperty("--hero-pointer-y","0px");
  };

  return <div
    ref={rootRef}
    className="livingHero"
    onPointerMove={handlePointerMove}
    onPointerLeave={resetPointer}
    aria-hidden="true"
  >
    <div className="livingHeroImageWrap">
      <img className="livingHeroImage" src="/visuals/miyu-home-hero.webp" alt="" />
    </div>
    <div className="livingHeroMist"/>
    <div className="livingHeroGlow"/>
    <div className="livingHeroLines"/>
  </div>;
}
