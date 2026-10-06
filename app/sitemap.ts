import type { MetadataRoute } from "next";
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";return["en","ru"].flatMap(locale=>[{url:`${base}/${locale}`,changeFrequency:"monthly" as const,priority:.8},{url:`${base}/${locale}/courses/greek-mythology`,changeFrequency:"monthly" as const,priority:1}])}
