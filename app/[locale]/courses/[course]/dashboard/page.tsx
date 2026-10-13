export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { requireUser } from "@/lib/auth";
import { courseBasePath } from "@/lib/courses";
import { loadCourse } from "@/lib/course-access";
import { CourseDashboard } from "@/components/CourseDashboard";
import { CourseTheme } from "@/components/CourseTheme";
import type { ModRow } from "@/components/CourseDashboard";

export default async function Dashboard({params}:{params:Promise<{locale:string;course:string}>}){
 const {locale,course:slug}=await params;if(!isLocale(locale))notFound();
 const {course,preview}=await loadCourse(slug);
 let mods:ModRow[]=[];
 if(preview){
  // Deploy preview: sample data so the page can be reviewed without signing in.
  mods=course.moduleIds.slice(0,2).map((id,i)=>({module_id:id,status:i===0?"completed":"in_progress",last_active_at:i===0?null:new Date().toISOString()}));
 }else{
  const {user,supabase}=await requireUser(locale,`${courseBasePath(locale,course)}/dashboard`);
  const {data}=await supabase.from("module_progress").select("module_id,status,last_active_at").eq("user_id",user.id).eq("course_id",course.id);
  mods=(data??[]) as ModRow[];
 }
 return <><CourseTheme course={course}/><CourseDashboard locale={locale} course={course} mods={mods} preview={preview}/></>;
}
