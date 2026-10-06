import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Locale } from "@/lib/course";

export async function requireUser(locale:Locale,returnTo:string){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect(`/${locale}/sign-in?returnTo=${encodeURIComponent(returnTo)}`);
  return {user,supabase};
}
