import type { ReactNode } from "react";
import type { LessonBlock } from "@/lib/content/types";
import type { Locale } from "@/lib/course";
import { Markdown } from "@/components/Markdown";
import { parseVisualStop, type StopNode } from "@/lib/content/visualStop";
import { stopArt } from "@/lib/visuals";
import { t } from "@/lib/i18n";

type VS=Extract<LessonBlock,{type:"visual-stop"}>;
type CardNode=Extract<StopNode,{kind:"card"}>;

function renderNodes(nodes:StopNode[]):ReactNode[]{
  const out:ReactNode[]=[];
  let i=0;
  while(i<nodes.length){
    const n=nodes[i];
    if(n.kind==="card"&&!n.list){
      // Neighbouring plain cards with no arrow between them are parallel items: show them as a grid.
      const run:CardNode[]=[];
      let j=i;
      while(j<nodes.length){
        const m=nodes[j];
        if(m.kind==="card"&&!m.list) { run.push(m); j++; } else break;
      }
      if(run.length>1){
        out.push(<div className="vsGrid" key={i}>{run.map((c,k)=><div className="vsCard" key={k}><Markdown>{c.md}</Markdown></div>)}</div>);
      }else{
        out.push(<div className="vsCard" key={i}><Markdown>{n.md}</Markdown></div>);
      }
      i=j;
      continue;
    }
    switch(n.kind){
      case "title": out.push(<h3 className="vsTitle" key={i}>{n.text}</h3>); break;
      case "subtitle": out.push(<h4 className="vsSub" key={i}>{n.text}</h4>); break;
      case "statement": out.push(<div className="vsStatement" key={i}>{n.text}</div>); break;
      case "label": out.push(<div className="vsLabel" key={i}>{n.text}</div>); break;
      case "arrow": out.push(<div className="vsArrow" aria-hidden="true" key={i}>{n.glyph}</div>); break;
      case "rule": out.push(<hr className="vsRule" key={i}/>); break;
      case "quote": out.push(n.caption
        ? <div className="vsCaption" key={i}><Markdown>{n.md}</Markdown></div>
        : <blockquote className="vsQuote" key={i}><Markdown>{n.md}</Markdown></blockquote>); break;
      case "card": out.push(<div className="vsCard vsChecks" key={i}><Markdown>{n.md}</Markdown></div>); break;
    }
    i++;
  }
  return out;
}

/**
 * Visual Stop for modules 5–8: a designed storyboard built from the module's own Markdown,
 * with an approved illustration when one is mapped in lib/visuals.ts.
 */
export function VisualStop({block,locale}:{block:VS;locale:Locale}){
  const nodes=parseVisualStop(block.markdown);
  const art=stopArt(block.asset.id);
  const portrait=art!==null&&art.height>art.width;
  return <div className={"vs"+(portrait?" vsPortrait":"")}>
    {art&&<figure className="vsArt">
      <picture>
        <source media="(max-width: 640px)" srcSet={art.srcSmall}/>
        <img src={art.src} width={art.width} height={art.height} alt={art.alt[locale]} loading="lazy" decoding="async" style={{objectPosition:art.pos}}/>
      </picture>
    </figure>}
    <div className="vsBody">
      <div className="eyebrow">{t(locale,"visual.stop",{n:String(block.number).padStart(2,"0")})}</div>
      {renderNodes(nodes)}
    </div>
  </div>;
}
