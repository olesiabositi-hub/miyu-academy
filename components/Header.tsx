"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/course";

export function Header({locale}:{locale:Locale}){
  const pathname=usePathname();
  const router=useRouter();
  const courseOverview=/^\/(en|ru)\/courses\/greek-mythology\/?$/.test(pathname);
  const moduleMatch=pathname.match(/^\/(en|ru)\/courses\/greek-mythology\/module-(0[12])\/?$/);
  const moduleNumber=moduleMatch?Number(moduleMatch[2]):0;

  function change(next:Locale){
    const parts=pathname.split("/");
    parts[1]=next;
    router.replace(parts.join("/"));
  }

  return <header className={"topbar"+(courseOverview?" topbarCourse":"")+(moduleMatch?" topbarModuleLesson":"")}>
    {moduleMatch?
      <Link className="moduleBrand" href={"/"+locale}><span className="moduleBrandWord">MIYU</span><span className="moduleBrandRule" aria-hidden="true"/><span className="moduleBrandAcademy">ACADEMY</span></Link>:
      <Link className="brand" href={"/"+locale}>MIYU<span>ACADEMY</span></Link>}
    <div className="topSpacer"/>
    <nav aria-label="Primary" className="topnav">
      <Link href={"/"+locale+"/courses/greek-mythology"}>{locale==="ru"?"Курс":"Course"}</Link>
      <Link href={"/"+locale+"/courses/greek-mythology/dashboard"}>{locale==="ru"?(moduleMatch?"Мой прогресс":"Прогресс"):"Progress"}</Link>
    </nav>
    {moduleMatch&&<div className="moduleHeaderProgress" aria-label={locale==="ru"?`Модуль ${moduleNumber} из 8`:`Module ${moduleNumber} of 8`}><span style={{width:`${moduleNumber/8*100}%`}}/></div>}
    <div className="lang" aria-label={locale==="ru"?"Язык":"Language"}>
      <button className={locale==="en"?"active":""} aria-pressed={locale==="en"} onClick={()=>change("en")}>EN</button>
      <button className={locale==="ru"?"active":""} aria-pressed={locale==="ru"} onClick={()=>change("ru")}>RU</button>
    </div>
  </header>
}
