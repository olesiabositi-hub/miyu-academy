import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { t } from "@/lib/i18n";
import "./globals.css";

const serif=Cormorant_Garamond({subsets:["latin","cyrillic"],variable:"--font-serif"});
const sans=Inter({subsets:["latin","cyrillic"],variable:"--font-sans"});

export default async function LocaleLayout({children,params}:{children:ReactNode;params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(!isLocale(locale)) notFound();
  return <html lang={locale} className={`${serif.variable} ${sans.variable}`}><body><a className="skip" href="#main">{t(locale,"skip.main")}</a><Header locale={locale}/><main id="main">{children}</main><Footer locale={locale}/></body></html>
}
