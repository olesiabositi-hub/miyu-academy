import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { COURSE_ID } from "@/lib/course";

export async function POST(req:Request){
  const {attemptId}=await req.json();
  const supabase=await createServerSupabase(); const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const admin=createAdminSupabase();
  const {data:attempt}=await admin.from("final_decoder_attempts").select("*").eq("id",attemptId).eq("user_id",user.id).single();
  if(!attempt||attempt.status!=="in_progress") return new NextResponse("Attempt unavailable",{status:409});
  const fmd=JSON.parse(fs.readFileSync(path.join(process.cwd(),"content","greek-mythology","final-myth-decoder.ru-en.json"),"utf8"));
  const answers=attempt.selected_answers??{};
  if(fmd.questions.some((q:any)=>!Number.isInteger(answers[q.id]))) return new NextResponse("All 15 answers are required",{status:400});
  let score=0; const categories:{[k:string]:number}={recognition:0,meaning:0,connection:0};
  for(const q of fmd.questions){
    if(answers[q.id]===q.en.answer){score++;categories[q.category]++}
  }
  const percent=Math.round(score/fmd.questions_total*100); const passedThisAttempt=score>=fmd.pass_score; const now=new Date().toISOString();
  await admin.from("final_decoder_attempts").update({status:"submitted",score,percent,category_scores:categories,submitted_at:now,updated_at:now}).eq("id",attemptId);
  const {data:prog}=await admin.from("final_decoder_progress").select("*").eq("user_id",user.id).eq("course_id",COURSE_ID).maybeSingle();
  const everPassed=Boolean(prog?.passed)||passedThisAttempt;
  const firstPassedAt=prog?.first_passed_at ?? (passedThisAttempt?now:null);
  await admin.from("final_decoder_progress").upsert({
    user_id:user.id,course_id:COURSE_ID,latest_score:score,best_score:Math.max(prog?.best_score??0,score),
    latest_percent:percent,passed:everPassed,first_passed_at:firstPassedAt,active_attempt_id:null,updated_at:now
  },{onConflict:"user_id,course_id"});
  return NextResponse.json({score,percent,categories,passed:everPassed,passedThisAttempt});
}
