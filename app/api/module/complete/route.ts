import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { resolveCourseModule } from "@/lib/course-api";

export async function POST(req:Request){
  const body=await req.json().catch(()=>null);
  const target=resolveCourseModule(body);
  if(!target) return new NextResponse("Invalid",{status:400});
  const {course,moduleId}=target;
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const {error}=course.id==="greek-mythology"
    ? await supabase.rpc("complete_greek_mythology_module",{p_module_id:moduleId})
    : await supabase.rpc("complete_course_module",{p_course_id:course.id,p_module_id:moduleId});
  if(error) return new NextResponse("Could not save",{status:400});
  return NextResponse.json({ok:true});
}
