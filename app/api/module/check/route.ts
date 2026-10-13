import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { resolveCourseModule } from "@/lib/course-api";

export async function POST(req:Request){
  const body=await req.json().catch(()=>null);
  const {checkId,sourceIndex}=body??{};
  const target=resolveCourseModule(body);
  if(!target||typeof checkId!=="string"||!/^[A-Za-z0-9_.:-]{1,80}$/.test(checkId)||!Number.isInteger(sourceIndex)||sourceIndex<0||sourceIndex>9) return new NextResponse("Invalid answer",{status:400});
  const {course,moduleId}=target;
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const {data}=await supabase.from("module_progress").select("check_state").eq("user_id",user.id).eq("course_id",course.id).eq("module_id",moduleId).maybeSingle();
  const checkState={...(data?.check_state??{}),[checkId]:{selectedSourceIndex:sourceIndex,updatedAt:new Date().toISOString()}};
  const {error}=await supabase.from("module_progress").upsert({user_id:user.id,course_id:course.id,module_id:moduleId,check_state:checkState,last_active_at:new Date().toISOString()},{onConflict:"user_id,course_id,module_id"});
  if(error) return new NextResponse("Could not save",{status:400});
  return NextResponse.json({ok:true});
}
