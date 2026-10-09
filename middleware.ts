import { NextRequest, NextResponse } from "next/server";
import { isPreviewHost } from "@/lib/previewHost";

export function middleware(request:NextRequest){
 const host0=request.headers.get("host");
 if(isPreviewHost(host0)){
  // Deploy preview: progress calls are accepted and ignored (nothing is stored); stay on the preview host.
  if(request.method==="POST"&&request.nextUrl.pathname.startsWith("/api/module/")) return NextResponse.json({ok:true,preview:true});
  return NextResponse.next();
 }
 const canonical=process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/,"");
 if(!canonical)return NextResponse.next();

 const canonicalUrl=new URL(canonical);
 const host=request.headers.get("host");
 if(host && host!==canonicalUrl.host){
  const target=new URL(request.nextUrl.pathname+request.nextUrl.search,canonicalUrl);
  return NextResponse.redirect(target);
 }
 return NextResponse.next();
}

export const config={
 matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]
};
