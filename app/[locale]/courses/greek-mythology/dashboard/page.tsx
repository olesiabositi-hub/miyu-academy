export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { isPreviewRequest } from "@/lib/preview";
import { GreekDashboard } from "@/components/GreekDashboard";

export default async function Dashboard({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const preview=await isPreviewRequest();
 return <GreekDashboard locale={locale} preview={preview}/>;
}
