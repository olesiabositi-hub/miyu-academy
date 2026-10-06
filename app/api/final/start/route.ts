import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { COURSE_ID, CONTENT_VERSION } from "@/lib/course";

function shuffle3(){
  const a=[0,1,2];
  for(let i=a.length-1;i>0;i--){const j=crypto.randomInt(i+1);[a[i],a[j]]=[a[j],a[i]]}
  return a;
}
export async function POST(){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const admin=createAdminSupabase();
  const {count}=await admin.from("module_progress").select("*",{count:"exact",head:true}).eq("user_id",user.id).eq("course_id",COURSE_ID).eq("status","completed");
  if(count!==8) return new NextResponse("Complete all 8 modules first",{status:403});
  const {data:progress}=await admin.from("final_decoder_progress").select("*").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle();
  if(progress?.active_attempt_id){
    const {data:attempt}=await admin.from("final_decoder_attempts").select("*").eq("id",progress.active_attempt_id).eq("user_id",user.id).maybeSingle();
    if(attempt?.status==="in_progress") return NextResponse.json(attempt);
  }
  const attemptNumber=(progress?.attempts_count??0)+1;
  const {data:attempt,error}=await admin.from("final_decoder_attempts").insert({
    user_id:user.id,course_id:COURSE_ID,content_version:CONTENT_VERSION,attempt_number:attemptNumber,status:"in_progress",
    question_order:Array.from({length:15},(_,i)=>i),option_order:Array.from({length:15},()=>shuffle3()),
    selected_answers:{},current_question_index:0
  }).select("*").single();
  if(error) return new NextResponse(error.message,{status:400});
  await admin.from("final_decoder_progress").upsert({
    user_id:user.id,course_id:COURSE_ID,attempts_count:attemptNumber,active_attempt_id:attempt.id,updated_at:new Date().toISOString()
  },{onConflict:"user_id,course_id"});
  return NextResponse.json(attempt);
}
