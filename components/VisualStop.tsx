import type { LessonBlock } from "@/lib/content/types";

type VS=Extract<LessonBlock,{type:"visual-stop"}>;

export function VisualStop({block}:{block:VS}){
  const placeholder=process.env.NEXT_PUBLIC_VISUAL_PLACEHOLDERS==="1";
  if(!placeholder){
    // Production must replace this development renderer with an approved asset/component
    // while preserving the semantic block ID and alt text. This prevents production
    // instructions from leaking as learner prose.
    throw new Error(`Visual asset not production-wired: ${block.asset.id}`);
  }
  return <figure className="visualAssetPlaceholder" aria-label={block.asset.alt}>
    <div className="eyebrow">VISUAL STOP {String(block.number).padStart(2,"0")}</div>
    <div className="visualAssetTitle">{block.asset.title}</div>
    <figcaption>{block.asset.alt}</figcaption>
    <small>DEV PLACEHOLDER · {block.asset.id} · {block.asset.production}</small>
  </figure>;
}
