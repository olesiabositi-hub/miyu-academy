import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { runeById } from "@/lib/runes";

export async function POST(req:Request){
  const body=await req.json().catch(()=>null);
  const source=body?.source;
  if(body?.courseId!=="norse-mythology"||typeof source!=="string"||!/^(module-0[1-9]|game-yggdrasil)$/.test(source)) return new NextResponse("Invalid",{status:400});
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});
  const {data,error}=await supabase.rpc("draw_rune",{p_course_id:"norse-mythology",p_source:source});
  if(error||typeof data!=="string"||!runeById(data as any)) return new NextResponse("Could not draw",{status:400});
  return NextResponse.json({ok:true,rune:data});
}
