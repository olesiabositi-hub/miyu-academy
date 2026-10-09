import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { requireUser } from "@/lib/auth";
import { isPreviewRequest } from "@/lib/preview";
import { PreviewBadge } from "@/components/PreviewBadge";
import { AccountClient } from "@/components/AccountClient";

export const metadata={robots:{index:false,follow:false}};

export default async function AccountPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 if(await isPreviewRequest()){
  return <><PreviewBadge locale={locale}/><AccountClient locale={locale} email="demo@miyu.academy" provider="google" preferredLocale={locale} demo/></>;
 }
 const {user,supabase}=await requireUser(locale,`/${locale}/account`);
 const {data:profile}=await supabase.from("profiles").select("preferred_locale").eq("id",user.id).maybeSingle();
 const provider=user.app_metadata?.provider==="google"?"google":"email";
 const pref=profile?.preferred_locale==="ru"?"ru":profile?.preferred_locale==="en"?"en":locale;
 return <AccountClient locale={locale} email={user.email??""} provider={provider} preferredLocale={pref}/>;
}
