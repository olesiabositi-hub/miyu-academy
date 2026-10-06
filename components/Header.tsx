"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/course";

export function Header({locale}:{locale:Locale}){
  const pathname=usePathname();const router=useRouter();
  function change(next:Locale){
    const parts=pathname.split("/");parts[1]=next;router.replace(parts.join("/"));
  }
  return <header className="topbar">
    <Link className="brand" href={`/${locale}`}>MIYU<span>ACADEMY</span></Link>
    <div className="topSpacer"/>
    <nav aria-label="Primary" className="topnav">
      <Link href={`/${locale}/courses/greek-mythology`}>{locale==="ru"?"Курс":"Course"}</Link>
      <Link href={`/${locale}/courses/greek-mythology/dashboard`}>{locale==="ru"?"Прогресс":"Progress"}</Link>
    </nav>
    <div className="lang" aria-label={locale==="ru"?"Язык":"Language"}>
      <button className={locale==="en"?"active":""} aria-pressed={locale==="en"} onClick={()=>change("en")}>EN</button>
      <button className={locale==="ru"?"active":""} aria-pressed={locale==="ru"} onClick={()=>change("ru")}>RU</button>
    </div>
  </header>
}
