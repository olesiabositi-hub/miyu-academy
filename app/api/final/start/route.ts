import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});

  const {data,error}=await supabase.rpc("start_greek_mythology_final_decoder");
  if(error){
    const status=error.message.includes("Complete all 8 modules")?403:400;
    return new NextResponse(error.message,{status});
  }
  return NextResponse.json(data);
}
