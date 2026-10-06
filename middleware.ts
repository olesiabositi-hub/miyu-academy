import { NextRequest, NextResponse } from "next/server";

export function middleware(request:NextRequest){
 const canonical=process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/,"");
 if(!canonical)return NextResponse.next();

 const canonicalUrl=new URL(canonical);
 const host=request.headers.get("host");
 const qaPreview=/^\/(ru|en)\/courses\/greek-mythology\/module-01-preview\/?$/.test(request.nextUrl.pathname);
 if(host && host!==canonicalUrl.host){
  if(qaPreview)return NextResponse.next();
  const target=new URL(request.nextUrl.pathname+request.nextUrl.search,canonicalUrl);
  return NextResponse.redirect(target);
 }
 return NextResponse.next();
}

export const config={
 matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]
};
