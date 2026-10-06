import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req:Request){
  const {attemptId}=await req.json();
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});

  const {data,error}=await supabase.rpc("submit_greek_mythology_final_decoder",{
    p_attempt_id:attemptId
  });
  if(error){
    const status=error.message.includes("Attempt unavailable")?409:400;
    return new NextResponse(error.message,{status});
  }
  return NextResponse.json(data);
}
