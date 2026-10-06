import type { MetadataRoute } from "next";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/",disallow:["/*/courses/*/dashboard","/*/courses/*/module-*","/*/courses/*/final-myth-decoder","/*/courses/*/certificate","/*/certificate/"]},sitemap:`${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`}}
