import { createClient } from "@supabase/supabase-js";

/**
 * Server-only client with the service-role key. Bypasses RLS: use only in API routes,
 * only after the caller has been authenticated, and never import it from client components.
 */
export function createAdminSupabase(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
}
