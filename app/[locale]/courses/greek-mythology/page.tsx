import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSE_TITLE, isLocale } from "@/lib/course";
import { MODULES } from "@/lib/content/catalog";

export default async function CourseOverview({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 return <div className="container">
  <section className="hero"><div className="heroGrid"><div><p className="eyebrow">MIYU ACADEMY · GREEK MYTHOLOGY</p><h1>{COURSE_TITLE[locale]}</h1>
  <p>{locale==="ru"?"8 модулей о том, как научиться узнавать древнегреческие мифы в языке, брендах, технологиях, городах и повседневной культуре.":"8 modules on learning to recognise Greek myths in language, brands, technology, cities and everyday culture."}</p>
  <p className="muted">~3.5 h · RU / EN · Final Myth Decoder · Certificate</p>
  <Link className="btn" href={`/${locale}/courses/greek-mythology/dashboard`}>{locale==="ru"?"Начать / продолжить":"Start / continue"} →</Link></div><div className="heroArt" aria-hidden="true"/></div></section>
  <p className="eyebrow">{locale==="ru"?"8 МОДУЛЕЙ":"8 MODULES"}</p>
  <div className="moduleList">{MODULES.map(m=><div className="moduleRow" key={m.id}><div className="moduleNum">{String(m.order).padStart(2,"0")}</div><div><div className="moduleTitle">{m[locale]}</div><div className="moduleMeta">~{m.duration[0]===m.duration[1]?m.duration[0]:`${m.duration[0]}–${m.duration[1]}`} min</div></div></div>)}</div>
 </div>
}

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;if(!isLocale(locale))return {};
 const base=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";
 const url=`${base}/${locale}/courses/greek-mythology`;
 const description=locale==="ru"
  ?"Научитесь узнавать греческие мифы в современном языке, брендах, технологиях, городах и повседневной культуре. Билингвальный курс MIYU Academy из 8 модулей."
  :"Learn to recognise Greek myths in modern language, brands, technology, cities and everyday culture. An 8-module bilingual course by MIYU Academy.";
 return {
  title:`${COURSE_TITLE[locale]} | MIYU Academy`,description,
  alternates:{canonical:url,languages:{en:`${base}/en/courses/greek-mythology`,ru:`${base}/ru/courses/greek-mythology`}},
  openGraph:{title:COURSE_TITLE[locale],description,url,siteName:"MIYU Academy",locale:locale==="ru"?"ru_RU":"en_US",type:"website"}
 }
}
