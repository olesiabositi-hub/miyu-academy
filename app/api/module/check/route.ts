import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { COURSE_ID } from "@/lib/course";

export async function POST(req:Request){
  const {moduleId,checkId,sourceIndex}=await req.json();
  if(!Number.isInteger(sourceIndex)) return new NextResponse("Invalid answer",{status:400});
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const {data}=await supabase.from("module_progress").select("check_state").eq("user_id",user.id).eq("course_id",COURSE_ID).eq("module_id",moduleId).maybeSingle();
  const checkState={...(data?.check_state??{}),[checkId]:{selectedSourceIndex:sourceIndex,updatedAt:new Date().toISOString()}};
  const {error}=await supabase.from("module_progress").upsert({user_id:user.id,course_id:COURSE_ID,module_id:moduleId,check_state:checkState,last_active_at:new Date().toISOString()},{onConflict:"user_id,course_id,module_id"});
  if(error) return new NextResponse(error.message,{status:400});
  return NextResponse.json({ok:true});
}
