export const metadata={robots:{index:false,follow:false}};
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/course";
import { isPreviewRequest } from "@/lib/preview";
import { parseLesson } from "@/lib/content/parser";
import { LessonClient } from "@/components/LessonClient";
import { PreviewBadge } from "@/components/PreviewBadge";
import type { CourseDefinition } from "@/lib/courses";
import { StyleguideThemes } from "@/components/StyleguideThemes";

/**
 * Style showcase: every element of the Academy base in one lesson (content/styleguide/master/module-01.*.md),
 * in the theme chosen with ?theme=. Only on deploy previews (or in a local build made with MIYU_STYLEGUIDE=1); 404 on the site.
 * Use it to pick a new course's colours and to check that a change to the base broke nothing.
 */
const THEMES=["greek","norse","egypt"] as const;

const SAMPLE:CourseDefinition={
  id:"styleguide",slug:"styleguide",status:"soon",title:{ru:"Витрина стиля",en:"Style showcase"},blurb:null,card:null,hero:null,
  modules:[{id:"module-01",order:1,duration:[5,5],title:{ru:"Витрина стиля Академии",en:"Academy style showcase"},teaser:{ru:"",en:""}}],
  moduleCount:1,moduleIds:["module-01"],hasFinal:false,contentDir:"styleguide",assetPrefix:"sg",contentVersion:"sg-v1",strictVisuals:false,
};

export default async function Styleguide({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;if(!isLocale(locale))notFound();
  const preview=await isPreviewRequest();
  if(!preview&&process.env.MIYU_STYLEGUIDE!=="1")notFound();
  const model=parseLesson("module-01",locale,SAMPLE);
  return <>
    {preview&&<PreviewBadge locale={locale}/>}
    <StyleguideThemes themes={THEMES}/>
    <LessonClient model={model}/>
  </>;
}
