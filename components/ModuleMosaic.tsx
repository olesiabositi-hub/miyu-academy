"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useStagger } from "@/components/Stagger";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Locale } from "@/lib/course";
import { PRIMARY_COURSE, getCourse, modulePath } from "@/lib/courses";
import { t } from "@/lib/i18n";

/** The eight modules as an even 4×2 grid. Status chips appear only when the visitor is signed in. */
export function ModuleMosaic({locale,courseId}:{locale:Locale;courseId?:string}){
  const course=(courseId?getCourse(courseId):undefined)??PRIMARY_COURSE;
  const [status,setStatus]=useState<Record<string,string>>({});
  const gridRef=useRef<HTMLDivElement>(null);
  useStagger(gridRef,60);

  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{
        const supabase=createBrowserSupabase();
        const {data:{session}}=await supabase.auth.getSession();
        if(!session) return;
        const {data}=await supabase.from("module_progress").select("module_id,status").eq("course_id",course.id);
        if(!alive||!data) return;
        const map:Record<string,string>={};
        data.forEach((r:{module_id:string;status:string})=>{map[r.module_id]=r.status});
        setStatus(map);
      }catch{/* chips are optional */}
    })();
    return ()=>{alive=false};
  },[course.id]);

  return <div className="hxMosaic" ref={gridRef}>
    {course.modules.map(m=>{
      const n=String(m.order).padStart(2,"0");
      const s=status[m.id];
      const time=m.duration[0]===m.duration[1]?`${m.duration[0]}`:`${m.duration[0]}–${m.duration[1]}`;
      if(m.soon) return <div key={m.id} className="hxTile is-noart is-soon" aria-disabled="true">
        <span className="hxTileShade" aria-hidden="true"/>
        <span className="hxChip hxChipTime">{t(locale,"dash.statusSoon")}</span>
        <span className="hxTileBody">
          <span className="hxTileNum">{n}</span>
          <span className="hxTileTitle">{m.title[locale]}</span>
          <span className="hxTileText">{m.teaser[locale]}</span>
        </span>
      </div>;
      return <Link key={m.id} href={modulePath(locale,m.id,course)} className={"hxTile"+(m.image?"":" is-noart")}>
        {m.image&&<picture>
          <source media="(max-width: 700px)" srcSet={m.image.src360}/>
          <img src={m.image.src} width={640} height={800} alt="" loading="lazy" decoding="async"/>
        </picture>}
        <span className="hxTileShade" aria-hidden="true"/>
        <span className="hxChip hxChipTime">{t(locale,"module.duration",{min:time})}</span>
        {s==="completed"&&<span className="hxChip hxChipStatus is-done">{t(locale,"dash.statusDone")}</span>}
        {s==="in_progress"&&<span className="hxChip hxChipStatus">{t(locale,"dash.statusProgress")}</span>}
        <span className="hxTileBody">
          <span className="hxTileNum">{n}</span>
          <span className="hxTileTitle">{m.title[locale]}</span>
          <span className="hxTileText">{m.teaser[locale]}</span>
        </span>
      </Link>;
    })}
  </div>;
}
