import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { COURSE_ID, MODULE_IDS } from "@/lib/course";

export async function POST(req:Request){
  const body=await req.json().catch(()=>null);
  const moduleId=body?.moduleId;
  if(typeof moduleId!=="string"||!MODULE_IDS.includes(moduleId)) return new NextResponse("Invalid",{status:400});
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const now=new Date().toISOString();
  const {data:existing}=await supabase.from("module_progress").select("started_at,completed_at").eq("user_id",user.id).eq("course_id",COURSE_ID).eq("module_id",moduleId).maybeSingle();
  const {error}=await supabase.from("module_progress").upsert({
    user_id:user.id,course_id:COURSE_ID,module_id:moduleId,status:"completed",
    started_at:existing?.started_at??now,completed_at:existing?.completed_at??now,last_active_at:now
  },{onConflict:"user_id,course_id,module_id"});
  if(error) return new NextResponse("Could not save",{status:400});
  return NextResponse.json({ok:true});
}
