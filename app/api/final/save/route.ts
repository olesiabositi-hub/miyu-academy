import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req:Request){
  const body=await req.json().catch(()=>null);
  const {attemptId,questionId,sourceIndex,currentQuestionIndex}=body??{};
  if(typeof attemptId!=="string"||typeof questionId!=="string") return new NextResponse("Invalid",{status:400});
  const hasAnswer=sourceIndex!==null&&sourceIndex!==undefined;
  if(hasAnswer&&(!Number.isInteger(sourceIndex)||sourceIndex<0||sourceIndex>2)) return new NextResponse("Invalid answer",{status:400});
  if(!Number.isInteger(currentQuestionIndex)||currentQuestionIndex<0||currentQuestionIndex>14) return new NextResponse("Invalid question index",{status:400});

  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});

  const {error}=await supabase.rpc("save_greek_mythology_final_answer",{
    p_attempt_id:attemptId,
    p_question_id:questionId,
    p_source_index:hasAnswer?sourceIndex:null,
    p_current_question_index:currentQuestionIndex
  });
  if(error){
    const status=error.message.includes("Attempt unavailable")?409:400;
    return new NextResponse(status===409?"Attempt unavailable":"Could not save",{status});
  }
  return NextResponse.json({ok:true});
}
