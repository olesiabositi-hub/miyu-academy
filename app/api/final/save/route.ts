import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export async function POST(req:Request){
  const {attemptId,questionId,sourceIndex,currentQuestionIndex}=await req.json();
  const hasAnswer=sourceIndex!==null&&sourceIndex!==undefined;
  if(hasAnswer&&(!Number.isInteger(sourceIndex)||sourceIndex<0||sourceIndex>2)) return new NextResponse("Invalid answer",{status:400});
  const supabase=await createServerSupabase(); const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const admin=createAdminSupabase();
  const {data:attempt}=await admin.from("final_decoder_attempts").select("selected_answers,status").eq("id",attemptId).eq("user_id",user.id).single();
  if(!attempt||attempt.status!=="in_progress") return new NextResponse("Attempt unavailable",{status:409});
  const selected={...(attempt.selected_answers??{})};
  if(hasAnswer) selected[questionId]=sourceIndex;
  const {error}=await admin.from("final_decoder_attempts").update({selected_answers:selected,current_question_index:currentQuestionIndex,updated_at:new Date().toISOString()}).eq("id",attemptId).eq("user_id",user.id);
  if(error) return new NextResponse(error.message,{status:400});
  return NextResponse.json({ok:true});
}
