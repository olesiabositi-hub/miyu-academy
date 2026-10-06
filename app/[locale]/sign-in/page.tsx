import { notFound } from "next/navigation";import { isLocale } from "@/lib/course";import { SignInClient } from "@/components/SignInClient";
export const metadata={robots:{index:false,follow:false}};
export default async function SignIn({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{returnTo?:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();const q=await searchParams;const raw=q.returnTo??`/${locale}/courses/greek-mythology/dashboard`;const safe=raw.startsWith("/")&&!raw.startsWith("//")?raw:`/${locale}/courses/greek-mythology/dashboard`;
 return <section className="legal"><SignInClient locale={locale} returnTo={safe}/></section>
}
