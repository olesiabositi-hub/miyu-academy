import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { COURSE_ID } from "@/lib/course";

export async function POST(req:Request){
  const {moduleId}=await req.json();
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const now=new Date().toISOString();
  const {data:existing}=await supabase.from("module_progress").select("started_at,completed_at").eq("user_id",user.id).eq("course_id",COURSE_ID).eq("module_id",moduleId).maybeSingle();
  const {error}=await supabase.from("module_progress").upsert({
    user_id:user.id,course_id:COURSE_ID,module_id:moduleId,status:"completed",
    started_at:existing?.started_at??now,completed_at:existing?.completed_at??now,last_active_at:now
  },{onConflict:"user_id,course_id,module_id"});
  if(error) return new NextResponse(error.message,{status:400});
  return NextResponse.json({ok:true});
}
