import { NextResponse } from "next/server";import { createServerSupabase } from "@/lib/supabase/server";
export async function GET(request:Request){
 const url=new URL(request.url);const code=url.searchParams.get("code");const nextRaw=url.searchParams.get("next")??"/en/courses/greek-mythology/dashboard";const next=nextRaw.startsWith("/")&&!nextRaw.startsWith("//")?nextRaw:"/en/courses/greek-mythology/dashboard";
 if(code){const supabase=await createServerSupabase();const {error}=await supabase.auth.exchangeCodeForSession(code);if(!error){const {data:{user}}=await supabase.auth.getUser();if(user){await supabase.from("profiles").upsert({id:user.id,preferred_locale:user.user_metadata?.preferred_locale??"en",age_16_plus_confirmed_at:user.user_metadata?.age16?new Date().toISOString():null},{onConflict:"id"})}return NextResponse.redirect(new URL(next,url.origin))}}
 return NextResponse.redirect(new URL("/en/sign-in?error=auth",url.origin))
}
