import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { termsDoc } from "@/lib/content/legal";
import { LegalDocView } from "@/components/LegalDoc";

export default async function TermsPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 return <section className="legalPage"><LegalDocView doc={termsDoc(locale)} locale={locale}/></section>
}

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;if(!isLocale(locale))return {};
 const base=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";
 return {
  title:`${termsDoc(locale).title} | MIYU Academy`,
  alternates:{canonical:`${base}/${locale}/terms`,languages:{en:`${base}/en/terms`,ru:`${base}/ru/terms`}},
 };
}
