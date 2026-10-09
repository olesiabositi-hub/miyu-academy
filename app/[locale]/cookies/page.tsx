import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { cookiesDoc } from "@/lib/content/legal";
import { LegalDocView } from "@/components/LegalDoc";

export default async function CookiesPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 return <section className="legalPage"><LegalDocView doc={cookiesDoc(locale)} locale={locale}/></section>
}

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;if(!isLocale(locale))return {};
 const base=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";
 return {
  title:`${cookiesDoc(locale).title} | MIYU Academy`,
  alternates:{canonical:`${base}/${locale}/cookies`,languages:{en:`${base}/en/cookies`,ru:`${base}/ru/cookies`}},
 };
}
