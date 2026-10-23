export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { loadCourse } from "@/lib/course-access";
import { CourseDashboard } from "@/components/CourseDashboard";
import { CourseTheme } from "@/components/CourseTheme";

export default async function Dashboard({params,searchParams}:{params:Promise<{locale:string;course:string}>;searchParams?:Promise<{demo?:string}>}){
 const {locale,course:slug}=await params;const sp=(await searchParams)??{};if(!isLocale(locale))notFound();
 const {course,preview}=await loadCourse(slug);
 return <><CourseTheme course={course}/><CourseDashboard locale={locale} course={course} preview={preview} demo={sp.demo}/></>;
}
