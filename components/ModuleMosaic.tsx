"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { COURSE_ID, type Locale } from "@/lib/course";
import { MODULES } from "@/lib/content/catalog";
import { MODULE_TEASERS } from "@/lib/content/teasers";
import { modulePath } from "@/lib/courses";
import { t } from "@/lib/i18n";

/** The eight modules as an even 4×2 grid. Status chips appear only when the visitor is signed in. */
export function ModuleMosaic({locale}:{locale:Locale}){
  const [status,setStatus]=useState<Record<string,string>>({});

  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{
        const supabase=createBrowserSupabase();
        const {data:{session}}=await supabase.auth.getSession();
        if(!session) return;
        const {data}=await supabase.from("module_progress").select("module_id,status").eq("course_id",COURSE_ID);
        if(!alive||!data) return;
        const map:Record<string,string>={};
        data.forEach((r:{module_id:string;status:string})=>{map[r.module_id]=r.status});
        setStatus(map);
      }catch{/* chips are optional */}
    })();
    return ()=>{alive=false};
  },[]);

  return <div className="hxMosaic">
    {MODULES.map(m=>{
      const n=String(m.order).padStart(2,"0");
      const s=status[m.id];
      const time=m.duration[0]===m.duration[1]?`${m.duration[0]}`:`${m.duration[0]}–${m.duration[1]}`;
      return <Link key={m.id} href={modulePath(locale,m.id)} className="hxTile">
        <picture>
          <source media="(max-width: 700px)" srcSet={`/visuals/mosaic/m${n}-360.webp`}/>
          <img src={`/visuals/mosaic/m${n}.webp`} width={640} height={800} alt="" loading="lazy" decoding="async"/>
        </picture>
        <span className="hxTileShade" aria-hidden="true"/>
        <span className="hxChip hxChipTime">{t(locale,"module.duration",{min:time})}</span>
        {s==="completed"&&<span className="hxChip hxChipStatus is-done">{t(locale,"dash.statusDone")}</span>}
        {s==="in_progress"&&<span className="hxChip hxChipStatus">{t(locale,"dash.statusProgress")}</span>}
        <span className="hxTileBody">
          <span className="hxTileNum">{n}</span>
          <span className="hxTileTitle">{m[locale]}</span>
          <span className="hxTileText">{MODULE_TEASERS[m.id][locale]}</span>
        </span>
      </Link>;
    })}
  </div>;
}
