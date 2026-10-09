import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request:Request){
 const url=new URL(request.url);
 const base=(process.env.NEXT_PUBLIC_SITE_URL??url.origin).replace(/\/$/,"");
 const code=url.searchParams.get("code");
 const locale=url.searchParams.get("locale")==="ru"?"ru":"en";
 const fallback=`/${locale}/courses/greek-mythology/dashboard`;
 const nextRaw=url.searchParams.get("next")??fallback;
 const next=nextRaw.startsWith("/")&&!nextRaw.startsWith("//")?nextRaw:fallback;

 if(code){
  const supabase=await createServerSupabase();
  const {error}=await supabase.auth.exchangeCodeForSession(code);
  if(!error){
   const {data:{user}}=await supabase.auth.getUser();
   if(user){
    // Keep what the profile already has; only fill gaps (never reset a confirmed age to null).
    const {data:existing}=await supabase.from("profiles").select("preferred_locale,age_16_plus_confirmed_at").eq("id",user.id).maybeSingle();
    const age16=url.searchParams.get("age16")==="1"||!!user.user_metadata?.age16;
    await supabase.from("profiles").upsert({
     id:user.id,
     preferred_locale:existing?.preferred_locale??user.user_metadata?.preferred_locale??locale,
     age_16_plus_confirmed_at:existing?.age_16_plus_confirmed_at??(age16?new Date().toISOString():null)
    },{onConflict:"id"});
   }
   return NextResponse.redirect(new URL(next,base));
  }
 }
 return NextResponse.redirect(new URL(`/${locale}/sign-in?error=auth`,base));
}
