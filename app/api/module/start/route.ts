import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { COURSE_ID } from "@/lib/course";

export async function POST(req:Request){
  const {moduleId}=await req.json();
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const {data:existing}=await supabase.from("module_progress").select("status,started_at").eq("user_id",user.id).eq("course_id",COURSE_ID).eq("module_id",moduleId).maybeSingle();
  if(existing?.status==="completed") return NextResponse.json({ok:true,status:"completed"});
  const now=new Date().toISOString();
  const {error}=await supabase.from("module_progress").upsert({
    user_id:user.id,course_id:COURSE_ID,module_id:moduleId,status:"in_progress",
    started_at:existing?.started_at??now,last_active_at:now
  },{onConflict:"user_id,course_id,module_id"});
  if(error) return new NextResponse(error.message,{status:400});
  const {data:course}=await supabase.from("course_progress").select("started_at").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle();
  await supabase.from("course_progress").upsert({user_id:user.id,course_id:COURSE_ID,started_at:course?.started_at??now,last_active_at:now},{onConflict:"user_id,course_id"});
  return NextResponse.json({ok:true});
}
