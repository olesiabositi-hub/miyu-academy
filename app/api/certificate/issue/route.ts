import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req:Request){
  const {studentName,language}=await req.json();
  if(typeof studentName!=="string"||!studentName.trim()) return new NextResponse("Name required",{status:400});
  if(!["en","ru"].includes(language)) return new NextResponse("Invalid language",{status:400});
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const {data,error}=await supabase.rpc("issue_greek_mythology_certificate",{p_student_name:studentName.trim(),p_language:language});
  if(error) return new NextResponse(error.message,{status:400});
  return NextResponse.json(data);
}
