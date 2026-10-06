import { notFound } from "next/navigation";import { isLocale } from "@/lib/course";import { PrivacySettingsClient } from "@/components/PrivacySettingsClient";
export const metadata={robots:{index:false,follow:false}};
export default async function PrivacySettings({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <article className="container legal"><p className="eyebrow">MIYU ACADEMY</p><h1>{locale==="ru"?"Настройки приватности":"Privacy settings"}</h1><PrivacySettingsClient locale={locale}/></article>}
