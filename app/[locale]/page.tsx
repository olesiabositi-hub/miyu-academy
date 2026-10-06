import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSE_TITLE, isLocale } from "@/lib/course";

export default async function AcademyHome({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;if(!isLocale(locale))notFound();
  return <div className="container hero"><div className="heroGrid"><div>
    <p className="eyebrow">MIYU ACADEMY</p>
    <h1>{locale==="ru"?"Учись расшифровывать мир вокруг":"Learn to decode the world around you"}</h1>
    <p className="muted">{locale==="ru"?"Культурные курсы, в которых знание начинает работать за пределами урока.":"Cultural learning designed to keep working outside the lesson."}</p>
    <Link className="btn" href={`/${locale}/courses/greek-mythology`}>{COURSE_TITLE[locale]} →</Link>
  </div><div className="heroArt" aria-hidden="true"/></div></div>
}

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;if(!isLocale(locale))return {};
 const base=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";
 return {
  title:locale==="ru"?"MIYU Academy — учись расшифровывать мир вокруг":"MIYU Academy — Learn to Decode the World",
  alternates:{canonical:`${base}/${locale}`,languages:{en:`${base}/en`,ru:`${base}/ru`,"x-default":base}},
  openGraph:{title:locale==="ru"?"MIYU Academy — учись расшифровывать мир вокруг":"MIYU Academy — Learn to Decode the World",url:`${base}/${locale}`,siteName:"MIYU Academy",locale:locale==="ru"?"ru_RU":"en_US",type:"website"}
 }
}
