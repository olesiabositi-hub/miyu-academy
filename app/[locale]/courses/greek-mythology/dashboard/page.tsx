export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { isPreviewRequest } from "@/lib/preview";
import { GreekDashboard } from "@/components/GreekDashboard";

export default async function Dashboard({params,searchParams}:{params:Promise<{locale:string}>;searchParams?:Promise<{demo?:string}>}){
 const {locale}=await params;const sp=(await searchParams)??{};if(!isLocale(locale))notFound();
 const preview=await isPreviewRequest();
 return <GreekDashboard locale={locale} preview={preview} demo={sp.demo}/>;
}
