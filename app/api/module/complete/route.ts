import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { MODULE_IDS } from "@/lib/course";

export async function POST(req:Request){
  const body=await req.json().catch(()=>null);
  const moduleId=body?.moduleId;
  if(typeof moduleId!=="string"||!MODULE_IDS.includes(moduleId)) return new NextResponse("Invalid",{status:400});
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const {error}=await supabase.rpc("complete_greek_mythology_module",{p_module_id:moduleId});
  if(error) return new NextResponse("Could not save",{status:400});
  return NextResponse.json({ok:true});
}
