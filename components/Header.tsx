"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/course";
import { PRIMARY_COURSE, courseBasePath, courseDashboardPath, parseModulePath } from "@/lib/courses";
import { t } from "@/lib/i18n";

export function Header({locale}:{locale:Locale}){
  const pathname=usePathname();
  const router=useRouter();
  const [open,setOpen]=useState(false);

  const courseHref=courseBasePath(locale);
  const progressHref=courseDashboardPath(locale);
  const courseOverview=pathname.replace(/\/$/,"")===courseHref;
  const moduleInfo=parseModulePath(pathname);
  const moduleNumber=moduleInfo?moduleInfo.moduleNumber:0;
  const moduleTotal=PRIMARY_COURSE.moduleCount;
  const inModule=moduleInfo!==null;

  // Close the mobile menu after any navigation and on Escape.
  useEffect(()=>{setOpen(false)},[pathname]);
  useEffect(()=>{
    if(!open) return;
    const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape") setOpen(false)};
    document.addEventListener("keydown",onKey);
    return ()=>document.removeEventListener("keydown",onKey);
  },[open]);

  function change(next:Locale){
    const parts=pathname.split("/");
    parts[1]=next;
    router.replace(parts.join("/"));
  }

  const isActive=(href:string)=>pathname.replace(/\/$/,"")===href;
  const progressLabel=t(locale,inModule?"nav.progressModule":"nav.progress");

  return <header className={"topbar"+(courseOverview?" topbarCourse":"")+(inModule?" topbarModuleLesson":"")+(open?" topbarOpen":"")}>
    {inModule?
      <Link className="moduleBrand" href={"/"+locale}><span className="moduleBrandWord">MIYU</span><span className="moduleBrandRule" aria-hidden="true"/><span className="moduleBrandAcademy">ACADEMY</span></Link>:
      <Link className="brand" href={"/"+locale}>MIYU<span>ACADEMY</span></Link>}
    <div className="topSpacer"/>
    <nav aria-label={t(locale,"nav.primary")} className="topnav">
      <Link href={courseHref} aria-current={isActive(courseHref)?"page":undefined}>{t(locale,"nav.course")}</Link>
      <Link href={progressHref} aria-current={isActive(progressHref)?"page":undefined}>{progressLabel}</Link>
    </nav>
    {inModule&&<div className="moduleHeaderProgress" role="img" aria-label={t(locale,"nav.moduleOf",{n:moduleNumber,total:moduleTotal})}><span style={{width:`${moduleNumber/moduleTotal*100}%`}}/></div>}
    <div className="lang" role="group" aria-label={t(locale,"nav.language")}>
      <button type="button" className={locale==="en"?"active":""} aria-pressed={locale==="en"} onClick={()=>change("en")}>EN</button>
      <button type="button" className={locale==="ru"?"active":""} aria-pressed={locale==="ru"} onClick={()=>change("ru")}>RU</button>
    </div>
    <button type="button" className="menuBtn" aria-expanded={open} aria-controls="mobile-nav" aria-label={t(locale,open?"nav.menuClose":"nav.menuOpen")} onClick={()=>setOpen(v=>!v)}>
      <span className="menuBtnBars" aria-hidden="true"><i/><i/><i/></span>
    </button>
    <nav id="mobile-nav" className="mobileNav" aria-label={t(locale,"nav.primary")} hidden={!open}>
      <Link href={"/"+locale} aria-current={isActive("/"+locale)?"page":undefined}>{t(locale,"nav.academy")}</Link>
      <Link href={courseHref} aria-current={isActive(courseHref)?"page":undefined}>{t(locale,"nav.course")}</Link>
      <Link href={progressHref} aria-current={isActive(progressHref)?"page":undefined}>{t(locale,"nav.progress")}</Link>
    </nav>
  </header>
}
