export const metadata={robots:{index:false,follow:false}};
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { isPreviewRequest } from "@/lib/preview";
import { parseLesson } from "@/lib/content/parser";
import { LessonClient } from "@/components/LessonClient";
import { PreviewBadge } from "@/components/PreviewBadge";
import type { CourseDefinition } from "@/lib/courses";

/**
 * Style showcase: every element of the Academy base in one lesson (content/styleguide/master/module-01.*.md),
 * in the theme chosen with ?theme=. Only on deploy previews (or locally with MIYU_STYLEGUIDE=1); 404 on the site.
 * Use it to pick a new course's colours and to check that a change to the base broke nothing.
 */
const THEMES=["greek","norse","egypt"] as const;

const SAMPLE:CourseDefinition={
  id:"styleguide",slug:"styleguide",status:"soon",title:{ru:"Витрина стиля",en:"Style showcase"},blurb:null,card:null,hero:null,
  modules:[{id:"module-01",order:1,duration:[5,5],title:{ru:"Витрина стиля Академии",en:"Academy style showcase"},teaser:{ru:"",en:""}}],
  moduleCount:1,moduleIds:["module-01"],hasFinal:false,contentDir:"styleguide",assetPrefix:"sg",contentVersion:"sg-v1",strictVisuals:false,
};

export default async function Styleguide({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{theme?:string}>}){
  const {locale}=await params;if(!isLocale(locale))notFound();
  const preview=await isPreviewRequest();
  if(!preview&&process.env.MIYU_STYLEGUIDE!=="1")notFound();
  const {theme:raw}=await searchParams;
  const theme=THEMES.find(x=>x===raw)??"greek";
  const model=parseLesson("module-01",locale,SAMPLE);
  return <>
    {theme!=="greek"&&<span className={`themeMark theme-${theme}`} hidden aria-hidden="true"/>}
    {preview&&<PreviewBadge locale={locale}/>}
    <nav className="sgThemes" aria-label="Theme">
      {THEMES.map(x=><Link key={x} href={`?theme=${x}`} aria-current={x===theme?"page":undefined}>{x}</Link>)}
    </nav>
    <LessonClient model={model}/>
  </>;
}
