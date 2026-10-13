import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { resolveCourseModule } from "@/lib/course-api";

/** Remembers how far the learner has read, so "Continue" can return to that spot. */
export async function POST(req:Request){
  const body=await req.json().catch(()=>null);
  const target=resolveCourseModule(body);
  const ratio=Number(body?.ratio);
  if(!target||!Number.isFinite(ratio)) return new NextResponse("Invalid",{status:400});
  const {course,moduleId}=target;
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const clamped=Math.min(1,Math.max(0,Math.round(ratio*1000)/1000));
  const {error}=await supabase.from("module_progress")
    .update({scroll_ratio:clamped,last_active_at:new Date().toISOString()})
    .eq("user_id",user.id).eq("course_id",course.id).eq("module_id",moduleId);
  if(error) return new NextResponse("Could not save",{status:400});
  return NextResponse.json({ok:true});
}
