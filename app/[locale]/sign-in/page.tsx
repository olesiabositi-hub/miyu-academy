import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { courseDashboardPath } from "@/lib/courses";
import { SignInClient } from "@/components/SignInClient";
export const metadata={robots:{index:false,follow:false}};
export default async function SignIn({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{returnTo?:string;error?:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const q=await searchParams;
 const fallback=courseDashboardPath(locale);
 const raw=q.returnTo??fallback;
 const safe=raw.startsWith("/")&&!raw.startsWith("//")?raw:fallback;
 return <section className="signPage"><SignInClient locale={locale} returnTo={safe} authError={q.error==="auth"}/></section>
}
