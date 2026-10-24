export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { loadCourse } from "@/lib/course-access";
import { CourseDashboard } from "@/components/CourseDashboard";
import { CourseTheme } from "@/components/CourseTheme";
import { courseDashboardParams } from "@/lib/static-params";

export const generateStaticParams=courseDashboardParams;
export const dynamicParams=false;

export default async function Dashboard({params}:{params:Promise<{locale:string;course:string}>}){
 const {locale,course:slug}=await params;if(!isLocale(locale))notFound();
 const {course,preview}=await loadCourse(slug);
 return <><CourseTheme course={course}/><CourseDashboard locale={locale} course={course} preview={preview}/></>;
}
