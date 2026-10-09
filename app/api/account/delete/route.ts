import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

/**
 * Deletes the signed-in user. All course data (progress, Final Myth Decoder attempts,
 * certificate, profile) is removed by `on delete cascade` from auth.users.
 */
export async function POST(req:Request){
  const {confirm}=await req.json().catch(()=>({confirm:""}));
  if(confirm!=="DELETE") return new NextResponse("Confirmation required",{status:400});

  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return new NextResponse("Unauthorized",{status:401});

  let admin;
  try{ admin=createAdminSupabase(); }
  catch{ return new NextResponse("Account deletion is not configured",{status:503}); }

  const {error}=await admin.auth.admin.deleteUser(user.id);
  if(error) return new NextResponse("Could not delete account",{status:500});

  await supabase.auth.signOut().catch(()=>{});
  return NextResponse.json({ok:true});
}
