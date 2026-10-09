import type { MetadataRoute } from "next";
export default function sitemap():MetadataRoute.Sitemap{
  const base=(process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000").replace(/\/$/,"");
  const pages:[string,number][]=[["",.8],["/courses/greek-mythology",1],["/privacy",.3],["/terms",.3],["/cookies",.3],["/accessibility",.3],["/credits",.3]];
  return["en","ru"].flatMap(l=>pages.map(([p,priority])=>({url:`${base}/${l}${p}`,changeFrequency:"monthly" as const,priority,alternates:{languages:{en:`${base}/en${p}`,ru:`${base}/ru${p}`}}})));
}
