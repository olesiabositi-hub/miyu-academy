export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { requireUser } from "@/lib/auth";
import { courseBasePath } from "@/lib/courses";
import { loadCourse } from "@/lib/course-access";
import { CourseDashboard } from "@/components/CourseDashboard";
import { CourseTheme } from "@/components/CourseTheme";
import type { ModRow } from "@/components/CourseDashboard";
import type { RuneDraw } from "@/components/RunePouch";
import { RUNE_IDS } from "@/lib/runes";

export default async function Dashboard({params,searchParams}:{params:Promise<{locale:string;course:string}>;searchParams?:Promise<{demo?:string}>}){
 const {locale,course:slug}=await params;const sp=(await searchParams)??{};if(!isLocale(locale))notFound();
 const {course,preview}=await loadCourse(slug);
 let mods:ModRow[]=[];
 let draws:RuneDraw[]=[];
 if(preview){
  // Deploy preview: sample data so the page can be reviewed without signing in.
  mods=course.moduleIds.slice(0,2).map((id,i)=>({module_id:id,status:i===0?"completed":"in_progress",last_active_at:i===0?null:new Date().toISOString()}));
  draws=mods.map((m,i)=>({rune:RUNE_IDS[(i+1)*7%RUNE_IDS.length],source:m.module_id,drawn_at:`2026-01-0${i+1}`}));
  if(sp.demo==="prophecy"){
   mods=course.moduleIds.map(id=>({module_id:id,status:"completed",last_active_at:null}));
   draws=course.moduleIds.map((id,i)=>({rune:RUNE_IDS[(i+1)*5%RUNE_IDS.length],source:id,drawn_at:`2026-01-0${i+1}`}));
  }
 }else{
  const {user,supabase}=await requireUser(locale,`${courseBasePath(locale,course)}/dashboard`);
  const {data}=await supabase.from("module_progress").select("module_id,status,last_active_at").eq("user_id",user.id).eq("course_id",course.id);
  mods=(data??[]) as ModRow[];
  if(course.runes){
   const {data:rd}=await supabase.from("rune_draws").select("rune,source,drawn_at").eq("user_id",user.id).eq("course_id",course.id);
   draws=(rd??[]) as RuneDraw[];
  }
 }
 return <><CourseTheme course={course}/><CourseDashboard locale={locale} course={course} mods={mods} preview={preview} draws={draws}/></>;
}
